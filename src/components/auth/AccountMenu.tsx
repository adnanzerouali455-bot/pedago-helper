"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import type { Profile } from "../../utils/supabase/types";

export default function AccountMenu({ profile, language = "en" }: { profile: Profile; language?: "fr" | "ar" | "en" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const role = language === "ar" ? { teacher: "أستاذ", student: "تلميذ", school: "مؤسسة" }[profile.role] : language === "en" ? { teacher: "Teacher", student: "Student", school: "School" }[profile.role] : { teacher: "Enseignant", student: "Élève", school: "Établissement" }[profile.role];
  async function signOut() {
    setBusy(true); setError(false);
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      router.replace("/");
      router.refresh();
    } catch {
      setError(true);
      setBusy(false);
    }
  }
  return <div className="flex min-w-0 items-center gap-2 text-sm"><span className="hidden max-w-36 truncate font-semibold sm:inline" title={profile.full_name}>{profile.full_name}</span><span className="rounded-lg border border-[#B5651D] px-2 py-1 text-xs font-bold text-[#8C4A16]">{role}</span><button type="button" disabled={busy} onClick={signOut} className="min-h-10 rounded-lg border border-current px-3 text-xs font-bold hover:bg-[#FBE9E2] focus-visible:outline-2 focus-visible:outline-[#B5651D] disabled:opacity-50">{language === "ar" ? "خروج" : language === "en" ? "Sign out" : "Déconnexion"}</button>{error && <span role="alert" className="text-xs">{language === "ar" ? "تعذر الخروج" : language === "en" ? "Sign-out failed" : "Déconnexion impossible"}</span>}</div>;
}
