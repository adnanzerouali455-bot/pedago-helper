"use client";

import BrandMark from "../BrandMark";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { isSupabaseConfigured } from "../../utils/supabase/config";
import { rolePath, type Profile } from "../../utils/supabase/types";
import type { Messages, LandingLanguage } from "../../messages/types";

interface NavbarProps {
  language: LandingLanguage;
  messages: Messages;
  theme: "light" | "dark";
  onLanguageChange: (language: LandingLanguage) => void;
  onThemeToggle: () => void;
  onOpenApp: () => void;
}

export default function Navbar({ language, messages, theme, onLanguageChange, onThemeToggle, onOpenApp }: NavbarProps) {
  const [account, setAccount] = useState<Pick<Profile, "full_name" | "role"> | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    let mounted = true;
    async function refreshAccount() {
      const { data: userData } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!userData.user) { setAccount(null); return; }
      const { data } = await supabase.from("profiles").select("full_name, role").eq("id", userData.user.id).single();
      if (mounted) setAccount(data ?? null);
    }
    void refreshAccount();
    const { data: listener } = supabase.auth.onAuthStateChange(() => { window.setTimeout(() => { void refreshAccount(); }, 0); });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);
  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try { await createClient().auth.signOut(); setAccount(null); window.location.assign("/"); }
    catch { setSigningOut(false); }
  }
  const roleLabel = account ? (language === "ar" ? { teacher: "أستاذ", student: "تلميذ", school: "مؤسسة" } : language === "en" ? { teacher: "Teacher", student: "Student", school: "School" } : { teacher: "Enseignant", student: "Élève", school: "Établissement" })[account.role] : "";
  return <header className="landing-nav sticky top-0 z-50 border-b-[1.5px] border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-sm">
    <div className="mx-auto flex min-h-[76px] max-w-[1120px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3 sm:px-8">
      <a href="#top" className="landing-brand inline-flex min-h-11 items-center text-[var(--ink)] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]" aria-label="Pedago Helper">
        <BrandMark src="/pedago-helper-logo.jpeg" />
      </a>
      <nav aria-label={messages.nav.home} className="landing-nav-links order-3 flex w-full items-center gap-1 overflow-x-auto lg:order-2 lg:w-auto">
        <a href="#spaces" className="landing-nav-link">{messages.nav.spaces}</a>
        <a href="#how" className="landing-nav-link">{messages.nav.how}</a>
      </nav>
      <div className="order-2 flex items-center gap-2 lg:order-3">
        <div role="group" aria-label={messages.nav.language} className="flex items-center rounded-[12px] border-[1.5px] border-[var(--line)] bg-[var(--card)] p-1">
          {(["fr", "ar", "en"] as const).map(next => <button key={next} type="button" lang={next} aria-label={next === "ar" ? "العربية" : next === "en" ? "English" : "Français"} aria-pressed={language === next} onClick={() => onLanguageChange(next)} className={`landing-language min-h-11 min-w-11 rounded-[8px] px-2 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] ${language === next ? "bg-[var(--acc2)] text-[var(--bg)]" : "text-[var(--ink)] hover:bg-[var(--line)]"}`}>{next === "ar" ? "ع" : next.toUpperCase()}</button>)}
        </div>
        <button type="button" onClick={onThemeToggle} aria-label={`${messages.nav.theme} · ${theme === "dark" ? messages.nav.light : messages.nav.dark}`} aria-pressed={theme === "dark"} className="flex h-11 w-11 items-center justify-center rounded-[12px] border-[1.5px] border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--acc)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]">
          {theme === "dark" ? <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z" /></svg>}
        </button>
        {account ? <div className="hidden items-center gap-2 lg:flex"><Link href={rolePath[account.role]} className="max-w-32 truncate text-sm font-bold text-[var(--ink)]" title={account.full_name}>{account.full_name}</Link><span className="rounded-lg border border-[var(--acc)] px-2 py-1 text-xs font-bold text-[var(--ink)]">{roleLabel}</span><button type="button" disabled={signingOut} onClick={signOut} className="min-h-11 rounded-lg border border-[var(--line)] px-3 text-xs font-bold text-[var(--ink)] hover:border-[var(--acc)] disabled:opacity-50">{language === "ar" ? "خروج" : language === "en" ? "Sign out" : "Déconnexion"}</button></div> : <div className="hidden items-center gap-2 lg:flex"><Link href="/connexion" className="min-h-11 rounded-lg border border-[var(--line)] px-3 py-3 text-xs font-bold text-[var(--ink)] hover:border-[var(--acc)]">{language === "ar" ? "تسجيل الدخول" : language === "en" ? "Sign in" : "Se connecter"}</Link><Link href="/inscription" className="min-h-11 rounded-lg bg-[var(--acc)] px-3 py-3 text-xs font-bold text-white hover:opacity-90">{language === "ar" ? "إنشاء حساب" : language === "en" ? "Create account" : "Créer un compte"}</Link></div>}
        {account ? <Link href={rolePath[account.role]} className="btn-stamp landing-nav-open hidden min-h-11 items-center rounded-[12px] px-4 text-sm font-bold lg:inline-flex">{messages.nav.open}</Link> : <a href="/app" onClick={event => { event.preventDefault(); onOpenApp(); }} className="btn-stamp landing-nav-open hidden min-h-11 items-center rounded-[12px] px-4 text-sm font-bold lg:inline-flex">{messages.nav.open}</a>}
      </div>
      <div className="order-4 flex w-full items-center justify-end gap-2 lg:hidden">{account ? <><Link href={rolePath[account.role]} className="min-h-10 rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-bold">{account.full_name} · {roleLabel}</Link><button type="button" disabled={signingOut} onClick={signOut} className="min-h-10 rounded-lg border border-[var(--line)] px-3 text-xs font-bold">{language === "ar" ? "خروج" : language === "en" ? "Sign out" : "Déconnexion"}</button></> : <><Link href="/connexion" className="min-h-10 rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-bold">{language === "ar" ? "دخول" : language === "en" ? "Sign in" : "Connexion"}</Link><Link href="/inscription" className="min-h-10 rounded-lg bg-[var(--acc)] px-3 py-2 text-xs font-bold text-white">{language === "ar" ? "حساب جديد" : language === "en" ? "Sign up" : "Inscription"}</Link></>}</div>
    </div>
  </header>;
}
