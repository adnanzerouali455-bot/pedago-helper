import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "./utils/supabase/config";
import { rolePath, type Database, type UserRole } from "./utils/supabase/types";

const requiredRole: Record<string, UserRole> = {
  "/espace-enseignant": "teacher",
  "/espace-eleve": "student",
  "/espace-etablissement": "school",
};

function redirectWithCookies(request: NextRequest, response: NextResponse, pathname: string): NextResponse {
  const destination = request.nextUrl.clone();
  destination.pathname = pathname;
  destination.search = "";
  if (pathname === "/connexion") {
    destination.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  }
  const redirect = NextResponse.redirect(destination);
  response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie));
  for (const header of ["Cache-Control", "Expires", "Pragma"]) {
    const value = response.headers.get(header);
    if (value) redirect.headers.set(header, value);
  }
  redirect.headers.set("Cache-Control", "private, no-store");
  return redirect;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const config = getSupabaseConfig();
  const root = Object.keys(requiredRole).find(path => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`));
  if (!root) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  if (!config) return redirectWithCookies(request, response, "/connexion");

  const supabase = createServerClient<Database>(config.url, config.key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet, cacheHeaders) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(cacheHeaders).forEach(([name, value]) => response.headers.set(name, value));
        response.headers.set("Cache-Control", "private, no-store");
      },
    },
  });

  const { data: claims, error: authError } = await supabase.auth.getClaims();
  if (authError || !claims?.claims.sub) return redirectWithCookies(request, response, "/connexion");

  const { data: profile, error: profileError } = await supabase.from("profiles")
    .select("role")
    .eq("id", claims.claims.sub)
    .single();
  if (profileError || !profile) return redirectWithCookies(request, response, "/compte-incomplet");
  if (profile.role !== requiredRole[root]) return redirectWithCookies(request, response, rolePath[profile.role]);
  return response;
}

export const config = {
  matcher: [
    "/espace-enseignant/:path*",
    "/espace-eleve/:path*",
    "/espace-etablissement/:path*",
  ],
};
