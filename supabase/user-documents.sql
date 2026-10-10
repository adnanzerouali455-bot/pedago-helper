-- Run in the Supabase SQL Editor after schema.sql.
-- Each signed-in user owns their timetable, lesson libraries, practice and preferences.
create table if not exists public.user_documents (
  user_id uuid not null references auth.users(id) on delete cascade,
  document_key text not null check (length(document_key) between 1 and 256),
  value jsonb not null check (jsonb_typeof(value) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (user_id, document_key)
);

create or replace function public.touch_user_document()
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
    where tgname = 'on_user_document_updated'
      and tgrelid = 'public.user_documents'::regclass
      and not tgisinternal
  ) then
    create trigger on_user_document_updated
      before update on public.user_documents
      for each row execute function public.touch_user_document();
  end if;
end $$;

alter table public.user_documents enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_documents' and policyname = 'user_documents_select_own') then
    create policy user_documents_select_own on public.user_documents
      for select to authenticated using ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_documents' and policyname = 'user_documents_insert_own') then
    create policy user_documents_insert_own on public.user_documents
      for insert to authenticated with check ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_documents' and policyname = 'user_documents_update_own') then
    create policy user_documents_update_own on public.user_documents
      for update to authenticated using ((select auth.uid()) = user_id)
      with check ((select auth.uid()) = user_id);
  end if;
end $$;

revoke all on public.user_documents from public, anon, authenticated;
grant select, insert, update on public.user_documents to authenticated;
revoke execute on function public.touch_user_document() from public, anon, authenticated;
