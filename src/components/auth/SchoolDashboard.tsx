"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AccountMenu from "./AccountMenu";
import type { Profile } from "../../utils/supabase/types";
import { readAccountDocument, writeAccountDocument } from "../../utils/supabase/documents";

type Language = "fr" | "ar" | "en";

export default function SchoolDashboard({ profile }: { profile: Profile }) {
  const [language, changeLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);
  const [preferenceError, setPreferenceError] = useState(false);
  const key = `pedago-helper:account:${profile.id}:preferences:v1`;
  useEffect(() => {
    let active = true;
    const isPreferences = (value: unknown): value is { version: 1; language: Language; theme: "light" | "dark" } => !!value && typeof value === "object" && !Array.isArray(value) && "version" in value && value.version === 1 && "language" in value && (value.language === "fr" || value.language === "ar" || value.language === "en") && "theme" in value && (value.theme === "light" || value.theme === "dark");
    void readAccountDocument(profile.id, key, isPreferences)
      .then(value => { if (!active) return; if (value) { changeLanguage(value.language); setTheme(value.theme); } setReady(true); })
      .catch(() => { if (active) { setPreferenceError(true); setReady(true); } });
    return () => { active = false; };
  }, [profile.id, key]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    if (ready) void writeAccountDocument(profile.id, key, { version: 1, language, theme }).catch(() => setPreferenceError(true));
  }, [profile.id, key, language, theme, ready]);
  const ar = language === "ar", en = language === "en";
  const labels = ar ? { space: "فضاء المؤسسة", welcome: "مرحبا", active: "ملف مؤسستك نشط.", school: "المؤسسة", city: "المدينة", type: "النوع", teachers: "عدد الأساتذة المسجل", none: "غير محدد", private: "خاص", public: "عمومي" } : en ? { space: "School space", welcome: "Welcome", active: "Your school profile is active.", school: "School", city: "City", type: "Type", teachers: "Declared teacher count", none: "Not specified", private: "Private", public: "Public" } : { space: "Espace établissement", welcome: "Bienvenue", active: "Votre profil d’établissement est actif.", school: "Établissement", city: "Ville", type: "Type", teachers: "Enseignants déclarés", none: "Non renseigné", private: "Privé", public: "Public" };
  const items = [
    [labels.school, profile.school_name ?? labels.none],
    [labels.city, profile.city ?? labels.none],
    [labels.type, profile.institution_type === "Privé" ? labels.private : labels.public],
    [labels.teachers, profile.teacher_count === null ? labels.none : String(profile.teacher_count)],
  ];
  return <main dir={ar ? "rtl" : "ltr"} lang={language} className="min-h-screen bg-[#FAFAF8] text-[#242220]" style={{ fontFamily: ar ? "var(--font-landing-arabic), sans-serif" : "'Plus Jakarta Sans', sans-serif" }}><header className="border-b border-[#E7E5E4] bg-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5"><Link href="/" className="text-xl font-extrabold">Pedago <span className="font-normal">Helper</span></Link><div className="flex flex-wrap items-center gap-3"><div role="group" aria-label="Language" className="flex rounded-lg border border-[#E7E5E4] p-1">{(["fr", "ar", "en"] as const).map(item => <button key={item} type="button" onClick={() => changeLanguage(item)} aria-pressed={language === item} className={`min-h-10 min-w-10 rounded-md text-xs font-bold ${language === item ? "bg-[#B5651D] text-white" : "hover:bg-[#FBE9E2]"}`}>{item.toUpperCase()}</button>)}</div><AccountMenu profile={profile} language={language} /></div></div></header>{preferenceError && <p role="alert" className="mx-auto max-w-6xl px-5 py-3 text-sm">{ar ? "تعذر مزامنة إعدادات حسابك." : en ? "Could not sync your account preferences." : "Impossible de synchroniser les préférences de votre compte."}</p>}<div className="mx-auto max-w-6xl px-5 py-12"><p className="text-sm font-bold uppercase tracking-widest text-[#8C4A16]">{labels.space}</p><h1 className="mt-4 text-4xl font-extrabold">{labels.welcome}, {profile.full_name}</h1><p className="mt-4 text-lg">{labels.active}</p><dl className="mt-9 grid gap-4 sm:grid-cols-2">{items.map(([label, value]) => <div key={label} className="rounded-lg border border-[#E7E5E4] bg-white p-6"><dt className="text-sm font-bold text-[#6B6864]">{label}</dt><dd className="mt-2 text-xl font-bold">{value}</dd></div>)}</dl></div></main>;
}
