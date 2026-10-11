"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, HelpCircle, X } from "lucide-react";
import type { Language } from "./LessonPlanStudio";
import { readAccountDocument, writeAccountDocument } from "../utils/supabase/documents";

type TourRole = "teacher" | "student";
type TourView = "home" | "calendar" | "planner";
type TourStep = { view: TourView; target: string; title: string; body: string };
type TourCopy = {
  help: string; label: string; step: string; back: string; next: string; finish: string; skip: string; close: string;
  steps: TourStep[];
};

interface InAppTourProps {
  role: TourRole;
  language: Language;
  accountId?: string;
  view: TourView;
  onNavigate: (view: TourView) => void;
}

function copyFor(role: TourRole, language: Language): TourCopy {
  const common = language === "ar"
    ? { help: "المساعدة · جولة تعريفية", label: "جولة تعريفية", step: "الخطوة", back: "السابق", next: "التالي", finish: "إنهاء الجولة", skip: "تخطي الجولة", close: "إغلاق الجولة" }
    : language === "en"
      ? { help: "Help · guided tour", label: "Guided tour", step: "Step", back: "Back", next: "Next", finish: "Finish tour", skip: "Skip tour", close: "Close tour" }
      : { help: "Aide · visite guidée", label: "Visite guidée", step: "Étape", back: "Précédent", next: "Suivant", finish: "Terminer la visite", skip: "Passer la visite", close: "Fermer la visite" };
  const steps: TourStep[] = role === "teacher"
    ? language === "ar" ? [
      { view: "home", target: "teacher-welcome", title: "فضاؤك المهني", body: "هنا تجد نظرة سريعة على أقسامك وحصصك القادمة." },
      { view: "calendar", target: "teacher-calendar", title: "جدول الحصص", body: "نظّم الأقسام والحصص، وحدد القاعة والموضوع ثم افتح الحصة لتحضير جذاذتها." },
      { view: "planner", target: "teacher-planner", title: "استوديو الجذاذات", body: "اختر الدرس والمستوى، ثم أنشئ جذاذة بأربع مراحل ديداكتيكية وعدّلها قبل حفظها." },
      { view: "planner", target: "workspace-account", title: "الملف الشخصي والإعدادات", body: "غيّر اللغة أو المظهر من الشريط العلوي، وأعد هذه الجولة بزر المساعدة." },
    ] : language === "en" ? [
      { view: "home", target: "teacher-welcome", title: "Your teaching workspace", body: "See your classes and upcoming sessions at a glance." },
      { view: "calendar", target: "teacher-calendar", title: "Weekly timetable", body: "Organize classes and sessions, assign a room and topic, then open a session to prepare its lesson sheet." },
      { view: "planner", target: "teacher-planner", title: "Lesson studio", body: "Choose a lesson and grade, build a four-phase didactic plan, then review and save it." },
      { view: "planner", target: "workspace-account", title: "Profile and preferences", body: "Change language or theme in the header, and replay this tour from Help." },
    ] : [
      { view: "home", target: "teacher-welcome", title: "Votre espace enseignant", body: "Retrouvez vos classes et vos prochaines séances en un coup d’œil." },
      { view: "calendar", target: "teacher-calendar", title: "Emploi du temps", body: "Organisez vos classes et séances, indiquez salle et sujet, puis ouvrez une séance pour préparer sa fiche." },
      { view: "planner", target: "teacher-planner", title: "Studio pédagogique", body: "Choisissez le cours et le niveau, construisez une fiche en quatre phases didactiques, puis relisez-la et enregistrez-la." },
      { view: "planner", target: "workspace-account", title: "Profil et préférences", body: "Changez la langue ou le thème en haut, et relancez cette visite depuis Aide." },
    ]
    : language === "ar" ? [
      { view: "home", target: "student-welcome", title: "فضاء التعلم الخاص بك", body: "ابدأ من هنا واستكشف دروس العلوم حسب مستواك." },
      { view: "home", target: "student-library", title: "دروس علوم الحياة والأرض", body: "تصفح الدروس حسب مستواك، وابحث عن فصل ثم افتح موارده المتاحة." },
      { view: "home", target: "workspace-account", title: "الملف الشخصي والمساعدة", body: "يمكنك تغيير اللغة أو المظهر في الأعلى. زر المساعدة يعيد تشغيل هذه الجولة متى شئت." },
    ] : language === "en" ? [
      { view: "home", target: "student-welcome", title: "Your learning space", body: "Start here to explore science lessons for your grade." },
      { view: "home", target: "student-library", title: "Science lessons", body: "Browse lessons for your grade, find a chapter, and explore its available resources." },
      { view: "home", target: "workspace-account", title: "Profile and help", body: "Change language or theme in the header. Help lets you replay this tour whenever you like." },
    ] : [
      { view: "home", target: "student-welcome", title: "Votre espace d’apprentissage", body: "Commencez ici pour explorer les cours de SVT de votre niveau." },
      { view: "home", target: "student-library", title: "Cours de SVT", body: "Parcourez les cours de votre niveau, trouvez un chapitre et explorez ses ressources disponibles." },
      { view: "home", target: "workspace-account", title: "Profil et aide", body: "Changez la langue ou le thème en haut. Le bouton Aide permet de revoir cette visite à tout moment." },
    ];
  return { ...common, steps };
}

function isTourState(value: unknown): value is { version: 1; completed: true } {
  return !!value && typeof value === "object" && "version" in value && value.version === 1 && "completed" in value && value.completed === true;
}

export default function InAppTour({ role, language, accountId, view, onNavigate }: InAppTourProps) {
  const copy = copyFor(role, language);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardTop, setCardTop] = useState<number | null>(null);
  const [cardLeft, setCardLeft] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLButtonElement>(null);
  const manuallyHandled = useRef(false);
  const storageKey = accountId ? `pedago-helper:tour:${accountId}:${role}:v1` : null;
  const documentKey = accountId ? `pedago-helper:account:${accountId}:tour:${role}:v1` : null;
  const step = copy.steps[index];

  useEffect(() => {
    if (!accountId || !storageKey || !documentKey) return;
    let active = true;
    let locallyCompleted = false;
    try { locallyCompleted = localStorage.getItem(storageKey) === "done"; } catch { /* Cloud status remains available. */ }
    if (locallyCompleted) return;
    void readAccountDocument(accountId, documentKey, isTourState)
      .then(value => {
        if (!active || manuallyHandled.current) return;
        if (value) { try { localStorage.setItem(storageKey, "done"); } catch { /* Cloud status is authoritative. */ } }
        else { setIndex(0); setOpen(true); }
      })
      .catch(() => { if (active && !manuallyHandled.current) { setIndex(0); setOpen(true); } });
    return () => { active = false; };
  }, [accountId, storageKey, documentKey]);

  const dismiss = useCallback(() => {
    manuallyHandled.current = true;
    setOpen(false);
    setTargetRect(null);
    if (storageKey) try { localStorage.setItem(storageKey, "done"); } catch { /* The tour can still be replayed this session. */ }
    if (accountId && documentKey) void writeAccountDocument(accountId, documentKey, { version: 1, completed: true }).catch(() => {});
    window.requestAnimationFrame(() => helpRef.current?.focus());
  }, [accountId, documentKey, storageKey]);

  useEffect(() => {
    if (!open) return;
    if (view !== step.view) { onNavigate(step.view); return; }
    let frame = 0;
    const update = () => {
      const target = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
      if (!target || !target.getClientRects().length) { setTargetRect(null); return; }
      const rect = target.getBoundingClientRect();
      if (rect.left < 0 || rect.right > window.innerWidth) target.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
      if (rect.top < 150 || rect.bottom > window.innerHeight - 30) {
        const top = window.scrollY + rect.top - Math.min(170, window.innerHeight / 4);
        window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      }
      const current = target.getBoundingClientRect();
      setTargetRect(current);
      if (window.innerWidth >= 768) {
        const cardWidth = Math.min(380, window.innerWidth - 32);
        const cardHeight = dialogRef.current?.offsetHeight ?? 280;
        const below = current.bottom + cardHeight + 24 < window.innerHeight;
        const top = below ? current.bottom + 16 : current.top - cardHeight - 16;
        setCardTop(Math.max(16, Math.min(window.innerHeight - cardHeight - 16, top)));
        setCardLeft(Math.max(16, Math.min(window.innerWidth - cardWidth - 16, current.left)));
      } else { setCardTop(null); setCardLeft(null); }
    };
    frame = window.requestAnimationFrame(update);
    const schedule = () => { window.cancelAnimationFrame(frame); frame = window.requestAnimationFrame(update); };
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("resize", schedule); window.removeEventListener("scroll", schedule); };
  }, [open, index, view, step.view, step.target, onNavigate]);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); dismiss(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = [...dialogRef.current.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
      if (!controls.length) return;
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, index, dismiss]);

  const begin = () => { manuallyHandled.current = true; setIndex(0); setTargetRect(null); setOpen(true); };
  const advance = () => { if (index === copy.steps.length - 1) { onNavigate("home"); dismiss(); } else { setTargetRect(null); setIndex(index + 1); } };
  const retreat = () => { setTargetRect(null); setIndex(Math.max(0, index - 1)); };
  const pad = 7;
  const top = targetRect ? Math.max(0, targetRect.top - pad) : 0;
  const left = targetRect ? Math.max(0, targetRect.left - pad) : 0;
  const right = targetRect ? Math.min(window.innerWidth, targetRect.right + pad) : 0;
  const bottom = targetRect ? Math.min(window.innerHeight, targetRect.bottom + pad) : 0;
  const shade = "rgba(12, 16, 13, .72)";
  return <>
    {!open && <button ref={helpRef} type="button" onClick={begin} aria-label={copy.help} title={copy.help} className="ph-tour-help fixed bottom-5 end-5 z-[60] flex min-h-12 items-center gap-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--workspace-action)] px-4 py-3 text-sm font-bold text-white shadow-[4px_4px_0_var(--ink)] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--acc)] print:hidden"><HelpCircle size={20} aria-hidden="true" /><span>{language === "ar" ? "المساعدة" : language === "en" ? "Help" : "Aide"}</span></button>}
    {open && <div className="ph-tour-layer fixed inset-0 z-[80] print:hidden" dir={language === "ar" ? "rtl" : "ltr"}>
      {targetRect ? <>
        <div className="absolute inset-x-0 top-0" style={{ height: top, background: shade }} />
        <div className="absolute left-0" style={{ top, width: left, height: bottom - top, background: shade }} />
        <div className="absolute right-0" style={{ top, width: `calc(100% - ${right}px)`, height: bottom - top, background: shade }} />
        <div className="absolute inset-x-0 bottom-0" style={{ top: bottom, background: shade }} />
        <div aria-hidden="true" className="absolute rounded-xl border-[3px] border-[#E9784F] shadow-[0_0_0_5px_rgba(233,120,79,.25)]" style={{ top, left, width: right - left, height: bottom - top }} />
      </> : <div className="absolute inset-0" style={{ background: shade }} />}
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={`${copy.label} · ${copy.step} ${index + 1}/${copy.steps.length}`} tabIndex={-1} className="ph-tour-card absolute inset-x-4 bottom-4 max-h-[min(82dvh,520px)] overflow-y-auto rounded-xl border-2 border-[var(--ink)] bg-[var(--card)] p-5 text-[var(--ink)] shadow-[5px_5px_0_var(--acc)] outline-none md:inset-x-auto md:bottom-auto md:w-[380px] md:p-6" style={cardTop === null ? undefined : { top: cardTop, left: cardLeft ?? 16 }}>
        <div className="flex items-start justify-between gap-3"><p className="text-xs font-extrabold uppercase tracking-wide text-[var(--ink)]">{copy.label} · {copy.step} {index + 1}/{copy.steps.length}</p><button type="button" onClick={dismiss} aria-label={copy.close} className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-[var(--line)]"><X size={19} aria-hidden="true" /></button></div>
        <h2 className="mt-3 text-xl font-bold leading-snug">{step.title}</h2><p className="mt-3 text-sm leading-7 text-[var(--mut)]">{step.body}</p>
        <div className="mt-5 flex gap-1.5" aria-hidden="true">{copy.steps.map((item, position) => <span key={item.target} className={`h-1.5 flex-1 rounded-full ${position <= index ? "bg-[var(--acc)]" : "bg-[var(--line)]"}`} />)}</div>
        <div className="mt-5 flex flex-wrap items-center gap-2"><button type="button" onClick={advance} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--workspace-action)] px-4 py-2 text-sm font-bold text-white hover:brightness-90">{index === copy.steps.length - 1 ? copy.finish : copy.next}{language === "ar" ? <ArrowLeft size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}</button>{index > 0 && <button type="button" onClick={retreat} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-bold">{language === "ar" ? <ArrowRight size={16} aria-hidden="true" /> : <ArrowLeft size={16} aria-hidden="true" />}{copy.back}</button>}<button type="button" onClick={dismiss} className="ms-auto min-h-11 px-2 text-xs font-semibold underline underline-offset-4">{copy.skip}</button></div>
      </div>
    </div>}
  </>;
}
