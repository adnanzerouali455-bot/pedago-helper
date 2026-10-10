import { redirect } from "next/navigation";
import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";
import { rolePath, type Profile, type UserRole } from "./types";

export async function requireRole(role: UserRole): Promise<Profile> {
  if (!isSupabaseConfigured()) redirect("/connexion?configuration=manquante");
  const supabase = await createClient();
  const { data: claims, error: authError } = await supabase.auth.getClaims();
  if (authError || !claims?.claims.sub) redirect("/connexion");
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", claims.claims.sub).single();
  if (error || !profile) redirect("/compte-incomplet");
  if (profile.role !== role) redirect(rolePath[profile.role]);
  return profile;
}
