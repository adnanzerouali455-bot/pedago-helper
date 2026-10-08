"use client";
import { TeacherDashboard, StudentDashboard, type DemoProfile } from "./EntryDashboard";
import LandingPage from "./landing/LandingPage";
import { localizeText, languageName } from "./localization";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, FilePenLine, Link2, LogOut, Moon, Sun } from "lucide-react";
import BrandMark from "./BrandMark";
import StudioButton from "./StudioButton";
import TeacherScheduleCalendar, { type LessonPlanLaunchContext } from "./TeacherScheduleCalendar";
import LessonPlanStudio, { isLessonDocument, type Language, type LessonDocument, type LessonInput } from "./LessonPlanStudio";

type View = "home" | "calendar" | "planner";
type Editor = { id: string; context?: LessonPlanLaunchContext; saved?: LessonDocument };
export interface PedagoWorkspaceProps {
  initialProfile?: DemoProfile;
  logoSrc?: string;
  scheduleStorageKey?: string;
  lessonStoragePrefix?: string;
  generalLessonStorageKey?: string;
}

export default function PedagoWorkspace({ initialProfile, logoSrc, scheduleStorageKey = "pedago-helper:schedule:v1", lessonStoragePrefix = "pedago-helper:session-lesson", generalLessonStorageKey = "pedago-helper:lesson-studio:v1" }: PedagoWorkspaceProps) {
  const [view, setView] = useState<View>("home");
  const [language, setLanguage] = useState<Language>(() => { try { return (["fr", "ar", "en"] as Language[]).includes(localStorage.getItem("pedago-helper:language") as Language) ? localStorage.getItem("pedago-helper:language") as Language : "fr"; } catch { return "fr"; } });
  const [theme, setTheme] = useState<"light" | "dark">(() => { try { const saved = localStorage.getItem("pedago-helper:theme"); return saved === "dark" ? "dark" : saved === "light" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch { return "light"; } });
  const [manualTheme, setManualTheme] = useState(() => { try { return localStorage.getItem("pedago-helper:theme") !== null; } catch { return false; } });
  const [profile, setProfile] = useState<DemoProfile | null>(initialProfile ?? null);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = language === "ar" ? "المساعد البيداغوجي" : "Pedago Helper";
    try { localStorage.setItem("pedago-helper:language", language); } catch { /* The interface still works when browser storage is unavailable. */ }
  }, [language]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (manualTheme) try { localStorage.setItem("pedago-helper:theme", theme); } catch { /* The selected theme remains available during this visit. */ }
  }, [theme, manualTheme]);
  useEffect(() => {
    if (manualTheme) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [manualTheme]);
  const [editors, setEditors] = useState<Editor[]>([{ id: "general" }]);
  const [editorId, setEditorId] = useState("general");
  const ar = language === "ar"; const en = language === "en";
  const selected = editors.find(editor => editor.id === editorId)!;
  const t = en ? {
    brand: "Pedago Helper", tagline: "One workspace to organize and prepare your lessons", calendar: "Timetable", planner: "Lesson planning", navigation: "Main navigation", free: "Independent planning", editor: "Planning workspace", linked: "Session linked to your timetable", back: "View timetable", notes: "Session notes and resources", language: "Language", draft: "Your changes stay in memory while you navigate. Save your lesson before closing the site.",
  } : ar ? {
    brand: "المساعد البيداغوجي", tagline: "فضاء واحد لتنظيم حصصك وإعداد دروسك", calendar: "جدول الحصص", planner: "تحضير الدروس", navigation: "التنقل الرئيسي", free: "تحضير مستقل", editor: "مساحة التحضير", linked: "حصة مرتبطة بجدولك", back: "عرض جدول الحصص", notes: "ملاحظات الحصة ومواردها", language: "اللغة", draft: "تبقى تعديلاتك محفوظة في الذاكرة أثناء التنقل. احفظ الدرس قبل إغلاق الموقع.",
  } : {
    brand: "Pedago Helper", tagline: "Un seul espace pour organiser et préparer vos cours", calendar: "Emploi du temps", planner: "Préparation des leçons", navigation: "Navigation principale", free: "Préparation libre", editor: "Espace de préparation", linked: "Séance liée à votre calendrier", back: "Voir l’emploi du temps", notes: "Notes et ressources de la séance", language: "Langue", draft: "Vos modifications restent en mémoire pendant la navigation. Enregistrez votre leçon avant de fermer le site.",
  };
  useEffect(() => {
    // Every visit starts with the role choice, including old links to a dashboard.
    if (!initialProfile && window.location.hash && window.location.hash !== "#home") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#home`);
    }
    const readRoute = () => {
      const hash = window.location.hash;
      if (hash === "#planner" || hash === "#calendar") { setProfile("teacher"); setView(hash === "#planner" ? "planner" : "calendar"); }
      else { setView("home"); setProfile(hash === "#teacher" ? "teacher" : hash === "#student" ? "student" : initialProfile ?? null); }
    };
    readRoute();
    window.addEventListener("popstate", readRoute); window.addEventListener("hashchange", readRoute);
    return () => { window.removeEventListener("popstate", readRoute); window.removeEventListener("hashchange", readRoute); };
  }, [initialProfile]);
  function toggleTheme() { setManualTheme(true); setTheme(current => current === "dark" ? "light" : "dark"); }
  function selectProfile(next: DemoProfile | null) {
    setProfile(next); setView("home");
    window.history.pushState(null, "", next ? `#${next}` : "#home");
    window.scrollTo({ top: 0 });
  }
  function navigate(next: View) {
    setView(next);
    const hash = next === "home" ? `#${profile ?? "home"}` : `#${next}`;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    window.scrollTo({ top: 0 });
  }
  function openLesson(context: LessonPlanLaunchContext) {
    const id = `session:${context.sessionId}`;
    if (!editors.some(editor => editor.id === id)) {
      let saved: LessonDocument | undefined;
      try {
        const raw = localStorage.getItem(`${lessonStoragePrefix}:${context.sessionId}:v1`);
        const parsed: unknown = raw ? JSON.parse(raw) : null;
        if (typeof parsed === "object" && parsed !== null && "lessons" in parsed && Array.isArray(parsed.lessons)) saved = parsed.lessons.find(isLessonDocument);
      } catch { saved = undefined; }
      if (saved) saved = { ...saved, input: { ...saved.input, className: context.className, room: context.room, scheduledDate: context.date, startTime: context.start, endTime: context.end, duration: context.duration } };
      setEditors(current => [...current, { id, context, saved }]);
    }
    setLanguage(context.language); setEditorId(id); navigate("planner");
  }
  if (view === "home" && profile === null) return <LandingPage language={language} theme={theme} onLanguageChange={setLanguage} onThemeToggle={toggleTheme} onSelect={selectProfile} />;
  return <div dir={ar ? "rtl" : "ltr"} lang={language} style={{ fontFamily: ar ? "var(--font-arabic)" : "var(--font-latin)" }} className="ph-shell min-h-screen">
    <header className="ph-app-header sticky top-0 z-30">
      <div className="ph-header-inner">
        <a href="#home" onClick={event => { event.preventDefault(); navigate("home"); }} aria-label={t.brand} className="ph-brand-link"><BrandMark src={logoSrc} subtitle={t.tagline} /></a>
        <div className="ph-header-actions"><div role="group" aria-label={t.language} className="ph-language-switch">{(["fr", "ar", "en"] as Language[]).map(lang => <button key={lang} type="button" lang={lang} aria-label={languageName(lang, language)} aria-pressed={language === lang} onClick={() => setLanguage(lang)}>{lang.toUpperCase()}</button>)}</div><StudioButton variant="ghost" size="icon" aria-label={theme === "dark" ? (ar ? "تفعيل الوضع الفاتح" : en ? "Switch to light mode" : "Activer le mode clair") : (ar ? "تفعيل الوضع الداكن" : en ? "Switch to dark mode" : "Activer le mode sombre")} aria-pressed={theme === "dark"} onClick={toggleTheme}>{theme === "dark" ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}</StudioButton></div>
      </div>
      {profile && <nav aria-label={t.navigation} className="ph-main-nav mx-auto flex max-w-[1550px] flex-nowrap items-center gap-1 overflow-x-auto px-4 md:gap-2 md:px-9">{(["home", ...(profile === "teacher" ? ["calendar", "planner"] : [])] as View[]).map(tab => <a key={tab} href={`#${tab}`} aria-current={view === tab ? "page" : undefined} onClick={event => { event.preventDefault(); navigate(tab); }} className={`flex min-h-12 shrink-0 items-center justify-center gap-2 border-b-[3px] px-3 text-center text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-amber-alert)] sm:px-5 sm:text-sm ${view === tab ? "border-[var(--color-terracotta)] bg-[var(--color-terracotta-light)] text-[var(--color-cypress)]" : "border-transparent text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-white)]"}`}>{tab === "calendar" ? <CalendarDays size={18} /> : <FilePenLine size={18} />}{tab === "home" ? (ar ? "الرئيسية" : en ? "Dashboard" : "Tableau de bord") : t[tab]}</a>)}<button type="button" aria-label={ar ? "تغيير الحساب التجريبي" : en ? "Change demo account" : "Changer de compte démo"} className="ms-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs font-bold hover:bg-[var(--color-cypress-light)] sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2" onClick={() => selectProfile(null)}><LogOut size={17} aria-hidden="true" /><span className="hidden sm:inline">{ar ? "تغيير الحساب التجريبي" : en ? "Change demo account" : "Changer de compte démo"}</span></button></nav>}
    </header>
    {view === "home" && (profile === "teacher" ? <TeacherDashboard language={language} storageKey={scheduleStorageKey} onNavigate={navigate} /> : <StudentDashboard language={language} />)}
    <div hidden={view !== "calendar"}>
      <TeacherScheduleCalendar embedded active={view === "calendar"} uiLanguage={language} storageKey={scheduleStorageKey} onOpenLessonPlan={openLesson} />
    </div>
    <div hidden={view !== "planner"}>
      <section className="border-b border-[var(--color-sand-border)] bg-[var(--color-cypress-light)] px-4 py-4 md:px-9" aria-label={t.editor}>
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-3">
          <label className="min-w-0 flex-1 sm:max-w-lg"><span className="mb-1 block text-[11px] font-semibold text-[var(--color-ink-muted)]">{t.editor}</span><select className="min-h-11 w-full rounded-lg border border-[var(--color-sand-border)] bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-[var(--color-terracotta)]" value={editorId} onChange={event => setEditorId(event.target.value)}>{editors.map(editor => <option key={editor.id} value={editor.id}>{editor.context ? `${localizeText(editor.context.className, language)} · ${editor.context.date} · ${localizeText(editor.context.title, language)}` : t.free}</option>)}</select></label>
          <button type="button" className="ph-workspace-back flex min-h-11 items-center gap-2 rounded-lg border border-[var(--color-sand-border)] bg-white px-3 py-2 text-xs font-semibold hover:bg-[var(--color-surface-white)]" onClick={() => navigate("calendar")}>{ar ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}{t.back}</button>
        </div>
        {selected.context && <div className="mx-auto mt-3 flex max-w-[1480px] flex-wrap items-center gap-2 text-xs text-[var(--color-ink-muted)]"><Link2 size={14} /><span>{t.linked} · {localizeText(selected.context.className, language)} · {localizeText(selected.context.room, language)} · {selected.context.date}</span><bdi>{selected.context.start} – {selected.context.end}</bdi></div>}
        <p className="mx-auto mt-2 max-w-[1480px] text-[10px] text-[var(--color-ink-muted)]">{t.draft}</p>
      </section>
      {editors.map(editor => {
        const context = editor.context;
        const isActive = view === "planner" && editor.id === editorId;
        const initialLesson: Partial<LessonInput> | undefined = context ? { subject: context.subject, schoolLevel: context.schoolLevel, title: context.title, duration: context.duration, className: context.className, room: context.room, scheduledDate: context.date, startTime: context.start, endTime: context.end, ...(context.competency ? { competency: context.competency } : {}) } : undefined;
        return <div key={editor.id} hidden={editor.id !== editorId}>
          {context && (context.notes || context.resources.length > 0) && <details className="border-b border-[var(--color-sand-border)] bg-[var(--color-terracotta-light)] px-8 py-3 text-sm text-[var(--color-ink-muted)]"><summary className="cursor-pointer font-semibold">{t.notes}</summary><p className="my-3 whitespace-pre-wrap">{localizeText(context.notes, language)}</p><ul className="space-y-2">{context.resources.map(resource => <li key={resource.id}><a className="underline" href={resource.url} target="_blank" rel="noopener noreferrer">{localizeText(resource.title, language)}</a></li>)}</ul></details>}
          <LessonPlanStudio embedded active={isActive} uiLanguage={language} onLanguageChange={setLanguage} initialLanguage={editor.saved?.input.language ?? context?.language ?? "fr"} initialLesson={initialLesson} initialDocument={editor.saved} storageKey={context ? `${lessonStoragePrefix}:${context.sessionId}:v1` : generalLessonStorageKey} />
        </div>;
      })}
    </div>
  </div>;
}
