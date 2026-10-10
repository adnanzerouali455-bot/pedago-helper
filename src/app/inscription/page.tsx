"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthFrame, { authButtonClass, authInputClass, useAuthLanguage } from "../../components/auth/AuthFrame";
import { createClient } from "../../utils/supabase/client";
import { isSupabaseConfigured } from "../../utils/supabase/config";
import { rolePath, type UserRole } from "../../utils/supabase/types";

export default function SignupPage() {
  const router = useRouter();
  const { language, changeLanguage } = useAuthLanguage();
  const [role, setRole] = useState<UserRole>("teacher");
  useEffect(() => {
    const requestedRole = new URLSearchParams(window.location.search).get("role");
    if (requestedRole === "teacher" || requestedRole === "student" || requestedRole === "school") setRole(requestedRole);
  }, []);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", city: "", school_name: "", teaching_cycle: "Collège", grade: "1AC", branch: "SVT", institution_type: "Public", teacher_count: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [schemaReady, setSchemaReady] = useState<boolean | null>(null);
  const configured = isSupabaseConfigured();
  useEffect(() => {
    if (!configured) return;
    let mounted = true;
    void (async () => {
      try {
        const { error: schemaError } = await createClient().from("profiles").select("id").limit(0);
        if (mounted) setSchemaReady(!schemaError || schemaError.code === "42501");
      } catch { if (mounted) setSchemaReady(false); }
    })();
    return () => { mounted = false; };
  }, [configured]);
  const ar = language === "ar", en = language === "en";
  const t = ar ? { title: "أنشئ فضاءك", description: "حساب واحد مخصص لدورك: أستاذ، تلميذ أو مؤسسة.", name: "الاسم الكامل", email: "البريد الإلكتروني", password: "كلمة المرور (8 أحرف على الأقل)", city: "المدينة", school: "اسم المؤسسة", cycle: "السلك التعليمي", grade: "المستوى الدراسي", branch: "الشعبة", type: "نوع المؤسسة", count: "عدد الأساتذة (اختياري)", submit: "إنشاء حساب", login: "لديك حساب؟ سجل الدخول", missing: "الاتصال بـ Supabase غير مُفعّل بعد.", schema: "التسجيل معطل مؤقتاً حتى يتم تثبيت جدول الملفات الشخصية في Supabase.", success: "تم إنشاء حسابك. تحقق من بريدك الإلكتروني لتأكيد التسجيل، ثم سجل الدخول.", failure: "تعذر إنشاء الحساب. تحقق من البيانات أو جرّب بريداً آخر." } : en ? { title: "Create your space", description: "One account tailored to your role: teacher, student or school.", name: "Full name", email: "Email", password: "Password (at least 8 characters)", city: "City", school: "School name", cycle: "Teaching cycle", grade: "Grade", branch: "Branch", type: "Institution type", count: "Number of teachers (optional)", submit: "Create account", login: "Have an account? Sign in", missing: "Supabase has not been configured yet.", schema: "Sign-up is paused until the profiles table has been installed in Supabase.", success: "Account created. Check your email to confirm it, then sign in.", failure: "Could not create the account. Check your details or try another email." } : { title: "Créez votre espace", description: "Un compte adapté à votre profil : enseignant, élève ou établissement.", name: "Nom complet", email: "Adresse e-mail", password: "Mot de passe (8 caractères minimum)", city: "Ville", school: "Nom de l’établissement", cycle: "Cycle d’enseignement", grade: "Niveau scolaire", branch: "Filière", type: "Type d’établissement", count: "Nombre d’enseignants (facultatif)", submit: "Créer un compte", login: "Déjà inscrit ? Se connecter", missing: "La connexion Supabase n’est pas encore configurée.", schema: "L’inscription est suspendue jusqu’à l’installation de la table des profils dans Supabase.", success: "Compte créé. Vérifiez votre e-mail pour confirmer votre inscription, puis connectez-vous.", failure: "Inscription impossible. Vérifiez vos données ou essayez une autre adresse e-mail." };
  const labels = ar ? { teacher: "أستاذ", student: "تلميذ", school: "مؤسسة" } : en ? { teacher: "Teacher", student: "Student", school: "School" } : { teacher: "Enseignant", student: "Élève", school: "Établissement" };
  function field(key: keyof typeof form, label: string, options?: { type?: string; required?: boolean; values?: [string, string][] }) {
    return <label className="block text-sm font-bold" key={key}>{label}{options?.values ? <select className={authInputClass} value={form[key]} onChange={event => setForm(previous => ({ ...previous, [key]: event.target.value }))}>{options.values.map(([value, name]) => <option value={value} key={value}>{name}</option>)}</select> : <input className={authInputClass} type={options?.type ?? "text"} value={form[key]} onChange={event => setForm(previous => ({ ...previous, [key]: event.target.value }))} required={options?.required ?? false} minLength={key === "password" ? 8 : undefined} maxLength={key === "email" ? 320 : 160} autoComplete={key === "password" ? "new-password" : key === "email" ? "email" : key === "full_name" ? "name" : key === "city" ? "address-level2" : undefined} min={key === "teacher_count" ? 0 : undefined} />}</label>;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!configured || schemaReady !== true || busy) return;
    setBusy(true); setError(""); setSuccess(false);
    try {
      const supabase = createClient();
      const metadata = { role, full_name: form.full_name.trim(), city: form.city.trim(), school_name: role === "student" ? null : form.school_name.trim(), teaching_cycle: role === "teacher" ? form.teaching_cycle : null, grade: role === "student" ? form.grade : null, branch: role === "student" ? form.branch : null, institution_type: role === "school" ? form.institution_type : null, teacher_count: role === "school" && form.teacher_count ? Number(form.teacher_count) : null };
      const { data, error: signUpError } = await supabase.auth.signUp({ email: form.email.trim(), password: form.password, options: { data: metadata, emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (signUpError || !data.user) throw signUpError ?? new Error("sign-up");
      if (!data.session) { setSuccess(true); return; }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
      router.replace(profile ? rolePath[profile.role] : "/compte-incomplet"); router.refresh();
    } catch { setError(t.failure); } finally { setBusy(false); }
  }
  return <AuthFrame language={language} onLanguageChange={changeLanguage} title={t.title} description={t.description}>
    {!configured && <p role="status" className="mb-5 rounded-lg border border-[#B5651D] bg-[#FBE9E2] p-4 text-sm">{t.missing} <Link href="/app" className="font-bold underline">{ar ? "استكشف النسخة التجريبية" : en ? "Explore demo" : "Explorer la démo"}</Link></p>}
    {configured && schemaReady === false && <p role="status" className="mb-5 rounded-lg border border-[#B5651D] bg-[#FBE9E2] p-4 text-sm">{t.schema}</p>}
    <form onSubmit={submit} className="space-y-5"><fieldset><legend className="mb-3 text-sm font-bold">{ar ? "نوع الحساب" : en ? "Account type" : "Type de compte"}</legend><div className="grid grid-cols-3 gap-2">{(["teacher", "student", "school"] as const).map(item => <button key={item} type="button" aria-pressed={role === item} onClick={() => setRole(item)} className={`min-h-14 rounded-lg border p-2 text-xs font-bold focus-visible:outline-2 focus-visible:outline-[#B5651D] sm:text-sm ${role === item ? "border-[#B5651D] bg-[#FBE9E2] text-[#8C4A16]" : "border-[#E7E5E4]"}`}>{({ teacher: "👨‍🏫", student: "🎓", school: "🏫" })[item]} {labels[item]}</button>)}</div></fieldset>
      <div className="grid gap-5 sm:grid-cols-2">{field("full_name", t.name, { required: true })}{field("city", t.city, { required: true })}</div>{field("email", t.email, { type: "email", required: true })}{field("password", t.password, { type: "password", required: true })}
      {role === "teacher" && <div className="grid gap-5 sm:grid-cols-2">{field("school_name", t.school, { required: true })}{field("teaching_cycle", t.cycle, { values: [["Collège", ar ? "الإعدادي" : en ? "Middle school" : "Collège"], ["Lycée", ar ? "الثانوي" : en ? "High school" : "Lycée"]] })}</div>}
      {role === "student" && <div className="grid gap-5 sm:grid-cols-2">{field("grade", t.grade, { values: ["1AC", "2AC", "3AC", "TCS", "1BAC", "2BAC"].map(value => [value, value]) })}{field("branch", t.branch, { values: ["SVT", "PC", "SM"].map(value => [value, value]) })}</div>}
      {role === "school" && <div className="grid gap-5 sm:grid-cols-2">{field("school_name", t.school, { required: true })}{field("institution_type", t.type, { values: [["Public", ar ? "عمومي" : en ? "Public" : "Public"], ["Privé", ar ? "خاص" : en ? "Private" : "Privé"]] })}{field("teacher_count", t.count, { type: "number" })}</div>}
      {error && <p role="alert" className="rounded-lg bg-[#FBE9E2] p-3 text-sm">{error}</p>}{success && <p role="status" className="rounded-lg border border-[#B5651D] bg-[#FBE9E2] p-3 text-sm">{t.success}</p>}<button type="submit" disabled={!configured || schemaReady !== true || busy} className={`${authButtonClass} w-full`}>{busy ? "…" : t.submit}</button>
    </form><p className="mt-6 text-center text-sm"><Link href="/connexion" className="font-bold text-[#8C4A16] underline underline-offset-4">{t.login}</Link></p>
  </AuthFrame>;
}
