"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, CheckCircle2, GraduationCap, ShieldCheck, Sparkles, Users } from "lucide-react";
import { createLocalLesson, initialInput, type Language, type Subject } from "./LessonPlanStudio";
import { createDemoSchedule, isScheduleData, localizeSchedule } from "./TeacherScheduleCalendar";

export type DemoProfile = "teacher" | "student";
export function ProfilePicker({ language, onSelect }: { language: Language; onSelect: (profile: DemoProfile) => void }) {
  const ar = language === "ar"; const en = language === "en";
  const t = ar ? {
    badge: "منصة بيداغوجية وديداكتيكية", title: "فضاء واحد لتحضير الدروس والتعلم.", subtitle: "اختر حسابا تجريبيا لاكتشاف المنصة دون تسجيل أو كلمة مرور.", demo: "حساب تجريبي", teacher: "فضاء الأستاذ", teacherName: "أمين · أستاذ علوم الحياة والأرض", teacherDescription: "نظم أقسامك وجدولك، وأعد جذاذاتك وفق مراحل غي بروسو الأربع مع توزيع زمن الحصة.", student: "فضاء التلميذ", studentName: "سلمى · السنة الثالثة إعدادي", studentDescription: "اقرأ نصوصا بمستويات مختلفة، واكتشف المفردات العلمية وتدرب على الفهم.", enterTeacher: "الدخول إلى فضاء الأستاذ", enterStudent: "الدخول إلى فضاء التلميذ", disclaimer: "شخصيات وبيانات تجريبية. لا توجد حسابات مدرسية حقيقية أو مصادقة.",
  } : en ? {
    badge: "Teaching and learning platform", title: "One place to plan lessons and learn.", subtitle: "Choose a demo account to explore the app without signing up or entering a password.", demo: "DEMO ACCOUNT", teacher: "Teacher space", teacherName: "Amine · Life and Earth Sciences teacher", teacherDescription: "Organize classes and your timetable, then prepare lesson plans with Brousseau’s four phases and a clear time budget.", student: "Student space", studentName: "Salma · 3rd year of middle school", studentDescription: "Read texts at different levels, explore scientific vocabulary and practice comprehension.", enterTeacher: "Enter teacher space", enterStudent: "Enter student space", disclaimer: "Fictional profiles and sample data. No real school accounts or authentication.",
  } : {
    badge: "Plateforme pédagogique et didactique", title: "Un seul espace pour préparer vos cours et apprendre.", subtitle: "Choisissez un compte de démonstration pour explorer l’application sans inscription ni mot de passe.", demo: "COMPTE DÉMO", teacher: "Espace enseignant", teacherName: "Amine · Professeur de SVT", teacherDescription: "Organisez vos classes et votre emploi du temps, puis préparez vos fiches selon les quatre phases de Brousseau avec un temps maîtrisé.", student: "Espace étudiant", studentName: "Salma · 3ème année collégiale", studentDescription: "Lisez à votre rythme, explorez le vocabulaire scientifique et entraînez votre compréhension.", enterTeacher: "Entrer dans l’espace enseignant", enterStudent: "Entrer dans l’espace étudiant", disclaimer: "Profils fictifs et données de démonstration. Aucun compte scolaire réel ni authentification.",
  };
  return <div className="flex min-h-[calc(100dvh-140px)] flex-col justify-between bg-parchment text-ink">
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 py-12 text-center md:py-16">
      <p className="mb-5 inline-flex items-center gap-2 rounded-lg border border-terracotta/30 bg-terracotta-soft px-3 py-1.5 text-xs font-bold text-terracotta"><Sparkles size={15} aria-hidden="true" />{t.badge}</p>
      <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">{t.title}</h1>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-ink sm:text-base">{t.subtitle}</p>
      <div className="mt-10 grid w-full gap-5 text-start md:grid-cols-2 md:gap-6">{(["teacher", "student"] as DemoProfile[]).map(profile => {
        const teacher = profile === "teacher";
        return <button type="button" key={profile} onClick={() => onSelect(profile)} className="group flex min-h-[296px] flex-col justify-between rounded-lg border border-sand bg-white p-6 text-start transition-colors hover:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta md:p-7">
          <span className="block w-full"><span className="mb-5 flex items-center justify-between gap-3"><span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg border ${teacher ? "border-terracotta/20 bg-terracotta-soft text-terracotta" : "border-cypress bg-cypress text-white"}`}>{teacher ? <GraduationCap size={25} aria-hidden="true" /> : <BookOpen size={25} aria-hidden="true" />}</span><span className={`rounded-lg border px-2.5 py-1 text-[10px] font-extrabold ${teacher ? "border-terracotta/30 bg-terracotta-soft text-terracotta" : "border-cypress/20 bg-cypress-soft text-cypress"}`}>{t.demo}</span></span>
            <span className="block text-xl font-bold text-ink">{teacher ? t.teacher : t.student}</span><span className={`mt-1 block text-xs font-bold ${teacher ? "text-terracotta" : "text-cypress"}`}>{teacher ? t.teacherName : t.studentName}</span><span className="mt-4 block text-sm leading-7 text-ink">{teacher ? t.teacherDescription : t.studentDescription}</span>
          </span>
          <span className="mt-7 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-cypress px-4 py-3 text-sm font-bold text-white transition-colors group-hover:bg-terracotta">{teacher ? t.enterTeacher : t.enterStudent}{ar ? <ArrowLeft size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}</span>
        </button>;
      })}</div>
    </main>
    <footer className="border-t border-sand bg-white px-5 py-5 text-center"><p className="mx-auto flex max-w-3xl items-center justify-center gap-2 text-xs leading-6 text-ink"><ShieldCheck size={17} className="shrink-0 text-terracotta" aria-hidden="true" />{t.disclaimer}</p></footer>
  </div>;
}

export function TeacherDashboard({ language, storageKey, onNavigate }: { language: Language; storageKey: string; onNavigate: (view: "calendar" | "planner") => void }) {
  const ar = language === "ar"; const en = language === "en";
  const [schedule, setSchedule] = useState(() => createDemoSchedule());
  const [storageIssue, setStorageIssue] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(storageKey); if (raw) { const parsed: unknown = JSON.parse(raw); if (isScheduleData(parsed)) setSchedule(parsed); else setStorageIssue(true); } } catch { setStorageIssue(true); }
  }, [storageKey]);
  const data = localizeSchedule(schedule, language);
  const next = [...data.sessions].filter(s => s.status !== "completed").sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`)).slice(0, 3);
  return <main className="mx-auto max-w-6xl px-5 py-10">
    <p className="text-sm font-semibold text-terracotta">{ar ? "فضاء الأستاذ · حساب تجريبي" : en ? "TEACHER SPACE · DEMO ACCOUNT" : "ESPACE ENSEIGNANT · COMPTE DÉMO"}</p>
    <h1 className="mt-3 text-3xl font-bold">{ar ? "مرحبا أستاذ أمين" : en ? "Hello, Amine" : "Bonjour, Amine"}</h1>
    <p className="mt-3 text-sm text-ink">{ar ? "نظرة على حصصك، ومساحة لإعداد الدرس القادم." : en ? "Your sessions at a glance, with room to plan what comes next." : "Vos séances en un coup d’œil, du temps pour préparer la suite."}</p>
    {storageIssue && <p role="status" className="mt-4 text-sm">{ar ? "تعذر قراءة التخزين المحلي. تعرض الأرقام بيانات المثال." : en ? "Browser storage could not be read; the figures shown are sample data." : "Stockage local illisible : les chiffres affichés correspondent à l’exemple."}</p>}
    <div className="my-8 grid gap-4 sm:grid-cols-3">{[
      [Users, data.classes.length, ar ? "أقسام" : en ? "Classes" : "Classes"],
      [CalendarDays, data.sessions.length, ar ? "حصص في الجدول" : en ? "Scheduled sessions" : "Séances au calendrier"],
      [CheckCircle2, data.sessions.filter(s => s.status === "completed").length, ar ? "حصص منجزة" : en ? "Completed sessions" : "Séances terminées"],
    ].map(([Icon, count, label], i) => { const MetricIcon = Icon as typeof Users; return <div key={i} className="rounded-lg border border-sand bg-white p-6"><MetricIcon size={21} /><p className="mt-4 text-3xl font-bold">{String(count)}</p><p className="mt-1 text-sm text-ink">{String(label)}</p></div>; })}</div>
    <div className="grid gap-5 md:grid-cols-2"><section className="rounded-lg border border-sand bg-cypress p-7 text-white"><BookOpen size={26} /><h2 className="mt-4 text-xl font-bold">{ar ? "لنحضر درسك القادم" : en ? "Prepare your next lesson" : "Préparons votre prochaine leçon"}</h2><p className="my-4 text-sm leading-7">{ar ? "أربع مراحل ديداكتيكية، توزيع زمني ونصوص ملائمة للقراءة." : en ? "Four didactic phases, a clear time budget and reading texts for different levels." : "Quatre phases didactiques, un temps maîtrisé et des textes adaptés à la lecture."}</p><button className="rounded-lg bg-white px-5 py-3 font-bold text-cypress" onClick={() => onNavigate("planner")}>{ar ? "فتح تحضير الدروس" : en ? "Open the lesson studio" : "Ouvrir le studio pédagogique"}</button></section>
    <section className="rounded-lg border border-sand bg-white p-7"><h2 className="text-xl font-bold">{ar ? "حصص للمتابعة" : en ? "Upcoming sessions" : "Séances à suivre"}</h2><ul className="mt-4 divide-y divide-sand">{next.map(s => <li key={s.id} className="py-3"><p className="text-sm font-bold">{s.title}</p><p className="mt-1 text-xs text-ink">{data.classes.find(c => c.id === s.classId)?.name} · <bdi>{s.date} · {s.start}</bdi></p></li>)}</ul>{!next.length && <p className="my-4 text-sm">{ar ? "لا توجد حصص في الانتظار." : en ? "No sessions pending." : "Aucune séance en attente."}</p>}<button className="mt-4 rounded-lg border border-sand px-4 py-3 text-sm font-bold" onClick={() => onNavigate("calendar")}>{ar ? "عرض جدول الحصص" : en ? "View my timetable" : "Voir mon emploi du temps"}</button></section></div>
  </main>;
}

type Practice = Record<string, { answers: string[]; completed: boolean }>;
export function StudentDashboard({ language }: { language: Language }) {
  const ar = language === "ar"; const en = language === "en";
  const [subject, setSubject] = useState<Subject>("svt");
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [practice, setPractice] = useState<Practice>({});
  const [feedback, setFeedback] = useState<"saved" | "error" | "required" | null>(null);
  const [storageValid, setStorageValid] = useState(true);
  const key = `${subject}:${language}:${level}`;
  const current = practice[key] ?? { answers: ["", "", ""], completed: false };
  const lesson = createLocalLesson(initialInput(language, subject));
  const reading = lesson.readings[level];
  useEffect(() => {
    try { const raw = localStorage.getItem("pedago-helper:demo-student:v1"); if (raw) { const value: unknown = JSON.parse(raw); if (!value || typeof value !== "object" || Array.isArray(value) || !Object.entries(value).every(([k, v]) => /^(svt|math|arabic|french):(fr|ar|en):[123]$/.test(k) && v && Array.isArray(v.answers) && v.answers.length === 3 && v.answers.every((a: unknown) => typeof a === "string" && a.length <= 4000) && typeof v.completed === "boolean")) throw new Error("Invalid practice"); setPractice(value as Practice); } } catch { setFeedback("error"); setStorageValid(false); }
  }, []);
  function save(completed: boolean) {
    if (!storageValid) { setFeedback("error"); return; }
    if (completed && current.answers.some(a => !a.trim())) { setFeedback("required"); return; }
    const next = { ...practice, [key]: { ...current, completed } };
    setPractice(next);
    try { localStorage.setItem("pedago-helper:demo-student:v1", JSON.stringify(next)); setFeedback("saved"); } catch { setFeedback("error"); }
  }
  return <main className="mx-auto max-w-6xl px-5 py-10">
    <p className="text-sm font-semibold text-terracotta">{ar ? "فضاء الطالب · حساب تجريبي" : en ? "STUDENT SPACE · DEMO ACCOUNT" : "ESPACE ÉTUDIANT · COMPTE DÉMO"}</p>
    <h1 className="mt-3 text-3xl font-bold">{ar ? "مرحبا سلمى، ماذا سنتعلم اليوم؟" : en ? "Hello Salma, what will you learn today?" : "Bonjour Salma, que va-t-on apprendre aujourd’hui ?"}</h1>
    <p className="mt-3 text-sm text-ink">{ar ? "تدريبات نموذجية مستقلة. إجاباتك محفوظة على هذا المتصفح فقط ولا ترسل إلى أستاذ." : en ? "Independent sample exercises. Your answers stay in this browser and are not sent to a teacher." : "Des entraînements d’exemple en autonomie. Vos réponses restent dans ce navigateur et ne sont pas envoyées à un enseignant."}</p>
    <div className="my-7 flex flex-wrap items-end gap-5 rounded-lg border border-sand bg-white p-5"><label className="flex-1 text-sm font-bold">{ar ? "المادة" : en ? "Subject" : "Matière"}<select className="mt-2 block w-full rounded-lg border border-sand p-3" value={subject} onChange={e => { setSubject(e.target.value as Subject); setFeedback(null); }}>{[["svt", ar ? "علوم الحياة والأرض" : en ? "Life and Earth Sciences" : "SVT"], ["math", ar ? "الرياضيات" : en ? "Mathematics" : "Mathématiques"], ["arabic", ar ? "اللغة العربية" : en ? "Arabic" : "Arabe"], ["french", ar ? "اللغة الفرنسية" : en ? "French" : "Français"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><fieldset><legend className="mb-2 text-sm font-bold">{ar ? "مستوى القراءة" : en ? "Reading level" : "Niveau de lecture"}</legend><div className="flex gap-2">{([1, 2, 3] as const).map((l, i) => <button key={l} aria-pressed={level === l} className={`rounded-lg border border-sand px-3 py-3 text-sm ${level === l ? "bg-cypress text-white" : "bg-white"}`} onClick={() => { setLevel(l); setFeedback(null); }}>{(ar ? ["مبتدئ", "متوسط", "متقدم"] : en ? ["Beginner", "Intermediate", "Advanced"] : ["Débutant", "Intermédiaire", "Avancé"])[i]}</button>)}</div></fieldset></div>
    <div className="grid items-start gap-5 lg:grid-cols-[1.3fr_1fr]"><article className="rounded-lg border border-sand bg-white p-6 md:p-8"><span className="text-xs font-bold text-terracotta">{ar ? "أقرأ وأفهم" : en ? "READ AND UNDERSTAND" : "JE LIS ET JE COMPRENDS"}</span><h2 className="mb-6 mt-3 text-2xl font-bold leading-relaxed">{lesson.input.title}</h2><p className="whitespace-pre-line text-base leading-9 text-ink" dir="auto">{reading.text}</p><h3 className="mb-3 mt-8 font-bold">{ar ? "مفردات تساعدني" : en ? "Helpful vocabulary" : "Les mots pour m’aider"}</h3><div className="space-y-2">{reading.glossary.map(g => <details key={g.term} className="rounded-lg border border-sand p-3"><summary className="cursor-pointer text-sm font-bold">{g.term}</summary><p className="mt-3 text-sm leading-7 text-ink">{g.definition}</p></details>)}</div></article>
    <section className="rounded-lg border border-sand bg-white p-6"><h2 className="text-xl font-bold">{ar ? "أتدرب على الفهم" : en ? "Practice comprehension" : "Je m’entraîne"}</h2><p className="mt-3 text-xs leading-6 text-ink">{ar ? "استشهد بالنص وعلل إجابتك. هذا تدريب ذاتي دون تصحيح آلي." : en ? "Support your answers with the text. This self-study activity is not graded automatically." : "Appuyez-vous sur le texte et justifiez vos réponses. Cet entraînement ne comporte pas de correction automatique."}</p><div className="mt-5 space-y-5">{reading.questions.map((question, i) => <label key={`${key}:${i}`} className="block text-sm font-semibold">{i + 1}. {question}<textarea dir="auto" rows={3} maxLength={4000} className="mt-2 block w-full rounded-lg border border-sand p-3 font-normal text-ink" value={current.answers[i]} onChange={e => { setPractice(prev => ({ ...prev, [key]: { completed: false, answers: current.answers.map((a, j) => j === i ? e.target.value : a) } })); setFeedback(null); }} /></label>)}</div><div className="mt-5 flex flex-wrap gap-2"><button className="rounded-lg border border-sand px-4 py-3 text-sm font-bold" onClick={() => save(false)}>{ar ? "حفظ إجاباتي" : en ? "Save my answers" : "Enregistrer mes réponses"}</button><button className="rounded-lg bg-cypress px-4 py-3 text-sm font-bold text-white" onClick={() => save(true)}>{ar ? "أنهيت التدريب" : en ? "I have finished" : "J’ai terminé"}</button></div>{current.completed && <p className="mt-4 flex items-center gap-2 text-sm"><CheckCircle2 size={18} />{ar ? "تم إنجاز التدريب" : en ? "Activity completed" : "Entraînement terminé"}</p>}{feedback && <p role="status" className="mt-4 rounded-lg bg-terracotta-soft p-3 text-sm">{feedback === "saved" ? (ar ? "تم حفظ إجاباتك على هذا الجهاز." : en ? "Answers saved on this device." : "Réponses enregistrées sur cet appareil.") : feedback === "required" ? (ar ? "أجب عن الأسئلة الثلاثة أولا." : en ? "Answer all three questions first." : "Répondez d’abord aux trois questions.") : (ar ? "تعذر استعمال التخزين المحلي. تبقى إجاباتك في الذاكرة خلال هذه الزيارة." : en ? "Browser storage is unavailable or invalid. Your answers remain in memory during this visit." : "Stockage local indisponible ou invalide. Vos réponses restent en mémoire pendant cette visite.")}</p>}</section></div>
  </main>;
}
