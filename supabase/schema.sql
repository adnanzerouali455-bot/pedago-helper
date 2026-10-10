-- Run once in the Supabase SQL Editor before enabling sign-ups.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role' and typnamespace = 'public'::regnamespace) then
    create type public.user_role as enum ('teacher', 'student', 'school');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role public.user_role not null,
  full_name text not null check (length(btrim(full_name)) between 2 and 160),
  phone text,
  city text,
  school_name text,
  subject text default 'SVT',
  teaching_cycle text check (teaching_cycle is null or teaching_cycle in ('Collège', 'Lycée')),
  grade text check (grade is null or grade in ('1AC', '2AC', '3AC', 'TCS', '1BAC', '2BAC')),
  branch text check (branch is null or branch in ('SVT', 'PC', 'SM')),
  institution_type text check (institution_type is null or institution_type in ('Privé', 'Public')),
  teacher_count integer check (teacher_count is null or teacher_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_metadata check (
    (role = 'teacher' and teaching_cycle is not null and school_name is not null)
    or (role = 'student' and grade is not null and branch is not null)
    or (role = 'school' and school_name is not null and institution_type is not null)
  )
);


create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  selected_role public.user_role;
begin
  selected_role := (metadata ->> 'role')::public.user_role;
  insert into public.profiles (
    id, email, role, full_name, phone, city, school_name, subject,
    teaching_cycle, grade, branch, institution_type, teacher_count
  ) values (
    new.id,
    new.email,
    selected_role,
    nullif(btrim(metadata ->> 'full_name'), ''),
    nullif(btrim(metadata ->> 'phone'), ''),
    nullif(btrim(metadata ->> 'city'), ''),
    nullif(btrim(metadata ->> 'school_name'), ''),
    case when selected_role = 'teacher' then coalesce(nullif(btrim(metadata ->> 'subject'), ''), 'SVT') else null end,
    case when selected_role = 'teacher' then nullif(btrim(metadata ->> 'teaching_cycle'), '') else null end,
    case when selected_role = 'student' then nullif(btrim(metadata ->> 'grade'), '') else null end,
    case when selected_role = 'student' then nullif(btrim(metadata ->> 'branch'), '') else null end,
    case when selected_role = 'school' then nullif(btrim(metadata ->> 'institution_type'), '') else null end,
    case when selected_role = 'school' and (metadata ->> 'teacher_count') ~ '^[0-9]{1,6}$'
      then (metadata ->> 'teacher_count')::integer else null end
  );
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'on_auth_user_created' and tgrelid = 'auth.users'::regclass and not tgisinternal
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  end if;
end $$;

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'on_profile_updated' and tgrelid = 'public.profiles'::regclass and not tgisinternal
  ) then
    create trigger on_profile_updated
      before update on public.profiles
      for each row execute function public.set_profile_updated_at();
  end if;
end $$;

alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_select_own'
  ) then
    create policy profiles_select_own on public.profiles
      for select to authenticated
      using ((select auth.uid()) = id);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_update_own'
  ) then
    create policy profiles_update_own on public.profiles
      for update to authenticated
      using ((select auth.uid()) = id)
      with check ((select auth.uid()) = id);
  end if;
end $$;

-- The trigger owns inserts. A signed-in user can edit personal fields, but cannot
-- change id, email or role through the Data API to cross a protected route.
revoke all on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant update (
  full_name, phone, city, school_name, subject, teaching_cycle,
  grade, branch, institution_type, teacher_count
) on public.profiles to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_profile_updated_at() from public, anon, authenticated;
