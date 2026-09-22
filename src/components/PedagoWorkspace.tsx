"use client";
import { ProfilePicker, TeacherDashboard, StudentDashboard, type DemoProfile } from "./EntryDashboard";
import { localizeText } from "./localization";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, FilePenLine, Link2 } from "lucide-react";
import TeacherScheduleCalendar, { type LessonPlanLaunchContext } from "./TeacherScheduleCalendar";
import LessonPlanStudio, { isLessonDocument, type Language, type LessonDocument, type LessonInput } from "./LessonPlanStudio";

type View = "home" | "calendar" | "planner";
type Editor = { id: string; context?: LessonPlanLaunchContext; saved?: LessonDocument };
export interface PedagoWorkspaceProps {
  logoSrc?: string;
  scheduleStorageKey?: string;
  lessonStoragePrefix?: string;
  generalLessonStorageKey?: string;
}

export default function PedagoWorkspace({ logoSrc = "/pedago-helper-logo.jpeg", scheduleStorageKey = "pedago-helper:schedule:v1", lessonStoragePrefix = "pedago-helper:session-lesson", generalLessonStorageKey = "pedago-helper:lesson-studio:v1" }: PedagoWorkspaceProps) {
  const [view, setView] = useState<View>("home");
  const [language, setLanguage] = useState<Language>(() => { try { return localStorage.getItem("pedago-helper:language") === "ar" ? "ar" : "fr"; } catch { return "fr"; } });
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = language === "ar" ? "المساعد البيداغوجي" : "Pedago Helper";
    try { localStorage.setItem("pedago-helper:language", language); } catch { /* The interface still works when browser storage is unavailable. */ }
  }, [language]);
  const [editors, setEditors] = useState<Editor[]>([{ id: "general" }]);
  const [editorId, setEditorId] = useState("general");
  const ar = language === "ar";
  const selected = editors.find(editor => editor.id === editorId)!;
  const t = ar ? {
    brand: "المساعد البيداغوجي", tagline: "فضاء واحد لتنظيم حصصك وإعداد دروسك", calendar: "جدول الحصص", planner: "تحضير الدروس", navigation: "التنقل الرئيسي", free: "تحضير مستقل", editor: "مساحة التحضير", linked: "حصة مرتبطة بجدولك", back: "عرض جدول الحصص", notes: "ملاحظات الحصة ومواردها", language: "اللغة", draft: "تبقى تعديلاتك محفوظة في الذاكرة أثناء التنقل. احفظ الدرس قبل إغلاق الموقع.",
  } : {
    brand: "Pedago Helper", tagline: "Un seul espace pour organiser et préparer vos cours", calendar: "Emploi du temps", planner: "Préparation des leçons", navigation: "Navigation principale", free: "Préparation libre", editor: "Espace de préparation", linked: "Séance liée à votre calendrier", back: "Voir l’emploi du temps", notes: "Notes et ressources de la séance", language: "Langue", draft: "Vos modifications restent en mémoire pendant la navigation. Enregistrez votre leçon avant de fermer le site.",
  };
  useEffect(() => {
    const readRoute = () => {
      const hash = window.location.hash;
      if (hash === "#planner" || hash === "#calendar") { setProfile("teacher"); setView(hash === "#planner" ? "planner" : "calendar"); }
      else { setView("home"); setProfile(hash === "#teacher" ? "teacher" : hash === "#student" ? "student" : null); }
    };
    readRoute();
    window.addEventListener("popstate", readRoute); window.addEventListener("hashchange", readRoute);
    return () => { window.removeEventListener("popstate", readRoute); window.removeEventListener("hashchange", readRoute); };
  }, []);
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
  return <div dir={ar ? "rtl" : "ltr"} lang={language} style={{ fontFamily: ar ? "var(--font-arabic)" : "var(--font-latin)" }} className="min-h-screen bg-[var(--color-parchment)] text-[var(--color-cypress)]">
    <header className="sticky top-0 z-30 border-b border-[var(--color-sand-border)] bg-white shadow-none ">
      <div className="mx-auto flex max-w-[1550px] flex-wrap items-center justify-between gap-3 px-4 py-2 md:px-9">
        <a href="#home" onClick={event => { event.preventDefault(); navigate("home"); }} className="flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-amber-alert)]">
          <span className="relative block h-[102px] w-[150px] shrink-0 overflow-hidden sm:h-[119px] sm:w-[175px]">
            <img src={logoSrc} alt={t.brand} width={1024} height={1024} decoding="async" className="absolute left-[-24px] top-[-44px] h-[192px] w-[192px] max-w-none sm:left-[-28px] sm:top-[-52px] sm:h-[224px] sm:w-[224px]" />
          </span>
          {ar && <strong className="text-lg">{t.brand}</strong>}
          <span className="hidden max-w-[240px] text-[11px] text-[var(--color-ink-muted)] md:block">{t.tagline}</span>
        </a>
        <div role="group" aria-label={t.language} className="flex rounded-lg border border-[var(--color-sand-border)] bg-[var(--color-cypress-light)] p-1">{(["fr", "ar"] as Language[]).map(lang => <button key={lang} type="button" lang={lang} aria-pressed={language === lang} onClick={() => setLanguage(lang)} className={`min-h-9 rounded-lg px-3 text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-amber-alert)] ${language === lang ? "bg-[var(--color-terracotta-light)] font-bold shadow-none" : "text-[var(--color-ink-muted)]"}`}>{lang === "fr" ? (ar ? "الفرنسية" : "Français") : "العربية"}</button>)}</div>
      </div>
      <nav aria-label={t.navigation} className="mx-auto flex max-w-[1550px] gap-2 px-4 md:px-9">{(["home", ...(profile === "teacher" ? ["calendar", "planner"] : [])] as View[]).map(tab => <a key={tab} href={`#${tab}`} aria-current={view === tab ? "page" : undefined} onClick={event => { event.preventDefault(); navigate(tab); }} className={`flex min-h-12 flex-1 items-center justify-center gap-2 border-b-[3px] px-2 text-center text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-amber-alert)] sm:flex-none sm:px-5 sm:text-sm ${view === tab ? "border-[var(--color-terracotta)] bg-[var(--color-terracotta-light)] text-[var(--color-cypress)]" : "border-transparent text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-white)]"}`}>{tab === "calendar" ? <CalendarDays size={18} /> : <FilePenLine size={18} />}{tab === "home" ? (ar ? "الرئيسية" : "Tableau de bord") : t[tab]}</a>)}{profile && <button type="button" className="ms-auto px-3 py-2 text-xs font-bold" onClick={() => selectProfile(null)}>{ar ? "تغيير الحساب التجريبي" : "Changer de compte démo"}</button>}</nav>
    </header>
    {view === "home" && (profile === "teacher" ? <TeacherDashboard language={language} storageKey={scheduleStorageKey} onNavigate={navigate} /> : profile === "student" ? <StudentDashboard language={language} /> : <ProfilePicker language={language} onSelect={selectProfile} />)}
    <div hidden={view !== "calendar"}>
      <TeacherScheduleCalendar embedded active={view === "calendar"} uiLanguage={language} storageKey={scheduleStorageKey} onOpenLessonPlan={openLesson} />
    </div>
    <div hidden={view !== "planner"}>
      <section className="border-b border-[var(--color-sand-border)] bg-[var(--color-cypress-light)] px-4 py-4 md:px-9" aria-label={t.editor}>
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-3">
          <label className="min-w-0 flex-1 sm:max-w-lg"><span className="mb-1 block text-[11px] font-semibold text-[var(--color-ink-muted)]">{t.editor}</span><select className="min-h-11 w-full rounded-lg border border-[var(--color-sand-border)] bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-[var(--color-terracotta)]" value={editorId} onChange={event => setEditorId(event.target.value)}>{editors.map(editor => <option key={editor.id} value={editor.id}>{editor.context ? `${localizeText(editor.context.className, language)} · ${editor.context.date} · ${localizeText(editor.context.title, language)}` : t.free}</option>)}</select></label>
          <button type="button" className="flex min-h-11 items-center gap-2 rounded-lg border border-[var(--color-sand-border)] bg-white px-3 py-2 text-xs font-semibold hover:bg-[var(--color-surface-white)]" onClick={() => navigate("calendar")}>{ar ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}{t.back}</button>
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
