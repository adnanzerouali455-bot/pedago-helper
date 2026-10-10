"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthFrame, { authButtonClass, authInputClass, useAuthLanguage } from "../../components/auth/AuthFrame";
import { createClient } from "../../utils/supabase/client";
import { isSupabaseConfigured } from "../../utils/supabase/config";
import { rolePath } from "../../utils/supabase/types";

export default function LoginPage() {
  const router = useRouter();
  const [confirmationError, setConfirmationError] = useState(false);
  useEffect(() => { setConfirmationError(new URLSearchParams(window.location.search).get("error") === "confirmation"); }, []);
  const { language, changeLanguage } = useAuthLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const configured = isSupabaseConfigured();
  const t = language === "ar" ? { title: "مرحباً بعودتك", description: "سجل الدخول للوصول إلى فضائك التعليمي وحسابك الشخصي.", email: "البريد الإلكتروني", password: "كلمة المرور", submit: "تسجيل الدخول", create: "ليس لديك حساب؟ أنشئ حساباً", missing: "الاتصال بـ Supabase غير مُفعّل بعد. يمكنك استكشاف النسخة التجريبية الآن.", demo: "فتح النسخة التجريبية", invalid: "تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور وتفعيل الحساب.", profile: "تعذر العثور على ملفك الشخصي. تواصل مع مسؤول المنصة." } : language === "en" ? { title: "Welcome back", description: "Sign in to open your personal learning or teaching space.", email: "Email", password: "Password", submit: "Sign in", create: "No account yet? Create one", missing: "Supabase has not been configured yet. You can explore the demo now.", demo: "Open demo", invalid: "Sign-in failed. Check your email, password and account confirmation.", profile: "Your profile could not be found. Contact the platform administrator." } : { title: "Heureux de vous revoir", description: "Connectez-vous pour retrouver votre espace personnel d’enseignement ou d’apprentissage.", email: "Adresse e-mail", password: "Mot de passe", submit: "Se connecter", create: "Pas encore de compte ? Créer un compte", missing: "La connexion Supabase n’est pas encore configurée. Vous pouvez explorer la démo dès maintenant.", demo: "Ouvrir la démo", invalid: "Connexion impossible. Vérifiez l’e-mail, le mot de passe et la confirmation du compte.", profile: "Votre profil est introuvable. Contactez l’administrateur de la plateforme." };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || busy) return;
    setBusy(true); setError("");
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError || !data.user) throw new Error("auth");
      const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
      if (profileError || !profile) { setError(t.profile); return; }
      const requested = new URLSearchParams(window.location.search).get("next");
      const own = rolePath[profile.role];
      router.replace(requested && (requested === own || requested.startsWith(`${own}/`)) ? requested : own);
      router.refresh();
    } catch { setError(t.invalid); } finally { setBusy(false); }
  }
  return <AuthFrame language={language} onLanguageChange={changeLanguage} title={t.title} description={t.description}>
    {!configured && <p role="status" className="mb-5 rounded-lg border border-[#B5651D] bg-[#FBE9E2] p-4 text-sm leading-6">{t.missing} <Link href="/app" className="font-bold underline">{t.demo}</Link></p>}
    {confirmationError && <p role="alert" className="mb-4 rounded-lg bg-[#FBE9E2] p-3 text-sm">{t.invalid}</p>}
    <form onSubmit={submit} className="space-y-5"><label className="block text-sm font-bold">{t.email}<input className={authInputClass} type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required maxLength={320} /></label><label className="block text-sm font-bold">{t.password}<input className={authInputClass} type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required minLength={6} /></label>{error && <p role="alert" className="rounded-lg bg-[#FBE9E2] p-3 text-sm">{error}</p>}<button type="submit" disabled={!configured || busy} className={`${authButtonClass} w-full`}>{busy ? "…" : t.submit}</button></form>
    <p className="mt-6 text-center text-sm"><Link href="/inscription" className="font-bold text-[#8C4A16] underline underline-offset-4">{t.create}</Link></p>
  </AuthFrame>;
}
