import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabaseConfig } from "../../../utils/supabase/config";
import { rolePath } from "../../../utils/supabase/types";
import type { Database } from "../../../utils/supabase/types";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const config = getSupabaseConfig();
  if (!config) return NextResponse.redirect(new URL("/connexion?configuration=manquante", origin));
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/connexion?error=confirmation", origin));
  const issuedCookies: Array<{ name: string; value: string; options: CookieOptions }> = [];
  let cacheHeaders: Record<string, string> = {};
  const supabase = createServerClient<Database>(config.url, config.key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookies, headers) {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        issuedCookies.push(...cookies);
        cacheHeaders = { ...cacheHeaders, ...headers };
      },
    },
  });
  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    const { data: claims } = await supabase.auth.getClaims();
    if (!claims?.claims.sub) throw new Error("Missing session");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", claims.claims.sub).single();
    const response = NextResponse.redirect(new URL(profile ? rolePath[profile.role] : "/compte-incomplet", origin));
    issuedCookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    Object.entries(cacheHeaders).forEach(([name, value]) => response.headers.set(name, value));
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch { return NextResponse.redirect(new URL("/connexion?error=confirmation", origin)); }
}
