"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { neuroExtractionSchema, type NeuroExtractionResponse } from "../../lib/neuro-extraction";

type Language = "fr" | "ar" | "en";

export interface NeuroTermExtractorProps {
  courseTitle: string;
  displayTitle?: string;
  grade: string;
  displayGrade?: string;
  courseSummaryOrText?: string;
  language?: Language;
  accountId?: string;
}

const copy = {
  fr: {
    badge: "NEURO-IA · SVT",
    trigger: "⚡ Extraire les mots complexes & mémoriser (Neuro-IA)",
    signIn: "Connectez-vous comme élève pour utiliser Neuro-IA.",
    signInLink: "Se connecter",
    title: "Mémoriser les mots du cours",
    source: "Analyse du titre et du contenu disponible pour ce cours.",
    loading: "Gemini repère les termes difficiles et prépare leurs exercices de mémorisation…",
    diagnosis: "Diagnostic du chapitre",
    terms: "Mots à mémoriser",
    morphology: "Découper le mot",
    analogy: "Une analogie concrète",
    darija: "En darija marocaine",
    visual: "Image mentale à construire",
    recall: "Ancrage actif : répondez avant de vérifier",
    reveal: "Vérifier ma réponse",
    hide: "Masquer la réponse",
    answer: "Réponse attendue",
    spaced: "Rappels espacés",
    close: "Fermer l'analyse",
    retry: "Réessayer l'analyse",
    dayTwo: "J+2",
    daySeven: "J+7",
    error: "Impossible d'analyser ce cours pour le moment.",
    notConfigured: "La clé Gemini manque sur le serveur. Demandez à l'administrateur d'ajouter GEMINI_API_KEY.",
    unauthorized: "Votre session a expiré. Reconnectez-vous pour utiliser Neuro-IA.",
    limited: "Le service IA est momentanément limité. Réessayez dans quelques instants.",
    timeout: "L'analyse prend trop de temps. Réessayez.",
  },
  ar: {
    badge: "الذكاء العصبي · علوم الحياة والأرض",
    trigger: "⚡ استخراج المصطلحات الصعبة وتذكرها (الذكاء العصبي)",
    signIn: "سجّل الدخول كتلميذ لاستعمال التحليل الذكي.",
    signInLink: "تسجيل الدخول",
    title: "تذكر مصطلحات الدرس",
    source: "يعتمد التحليل على عنوان الدرس والمحتوى المتاح له.",
    loading: "يحدد Gemini المصطلحات الصعبة ويعد تمارين لتذكرها…",
    diagnosis: "صعوبة الدرس المفاهيمية",
    terms: "مصطلحات للحفظ",
    morphology: "تفكيك المصطلح",
    analogy: "تشبيه من الحياة اليومية",
    darija: "بالدارجة المغربية",
    visual: "صورة ذهنية تساعد على الفهم",
    recall: "استرجاع نشط: أجب قبل التحقق",
    reveal: "تحقق من إجابتي",
    hide: "إخفاء الإجابة",
    answer: "الإجابة المنتظرة",
    spaced: "مراجعة متباعدة",
    close: "إغلاق التحليل",
    retry: "إعادة المحاولة",
    dayTwo: "بعد يومين",
    daySeven: "بعد 7 أيام",
    error: "تعذر تحليل هذا الدرس الآن.",
    notConfigured: "مفتاح Gemini غير مهيأ على الخادم. اطلب من المسؤول إضافة GEMINI_API_KEY.",
    unauthorized: "انتهت جلستك. سجّل الدخول مجددا لاستعمال التحليل الذكي.",
    limited: "خدمة الذكاء الاصطناعي مشغولة حاليا. حاول بعد قليل.",
    timeout: "استغرق التحليل وقتا طويلا. حاول مجددا.",
  },
  en: {
    badge: "NEURO-AI · LIFE SCIENCES",
    trigger: "⚡ Extract complex terms & memorize (Neuro-AI)",
    signIn: "Sign in as a student to use Neuro-AI.",
    signInLink: "Sign in",
    title: "Remember the lesson's key terms",
    source: "Analysis uses the lesson title and its available content.",
    loading: "Gemini is finding difficult terms and preparing recall exercises…",
    diagnosis: "Chapter diagnosis",
    terms: "Terms to remember",
    morphology: "Break down the term",
    analogy: "An everyday analogy",
    darija: "In Moroccan Darija",
    visual: "Build a mental image",
    recall: "Active recall: answer before checking",
    reveal: "Check my answer",
    hide: "Hide the answer",
    answer: "Expected answer",
    spaced: "Spaced reviews",
    close: "Close analysis",
    retry: "Retry analysis",
    dayTwo: "Day 2",
    daySeven: "Day 7",
    error: "This lesson could not be analyzed right now.",
    notConfigured: "The Gemini key is missing on the server. Ask an administrator to add GEMINI_API_KEY.",
    unauthorized: "Your session has expired. Sign in again to use Neuro-AI.",
    limited: "The AI service is busy. Please try again shortly.",
    timeout: "The analysis timed out. Please try again.",
  },
} as const;

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1_000;

function fingerprint(value: string): string {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return (hash >>> 0).toString(36);
}

function readCache(key: string): NeuroExtractionResponse | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const record = value as { savedAt?: unknown; data?: unknown };
    if (typeof record.savedAt !== "number" || Date.now() - record.savedAt > CACHE_TTL_MS || record.savedAt > Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    const parsed = neuroExtractionSchema.safeParse(record.data);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function saveCache(key: string, data: NeuroExtractionResponse): void {
  try { localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data })); } catch { /* The result still stays available until this card closes. */ }
}

function errorFor(code: unknown, language: Language): string {
  const t = copy[language];
  if (code === "GEMINI_NOT_CONFIGURED") return t.notConfigured;
  if (code === "UNAUTHORIZED" || code === "FORBIDDEN") return t.unauthorized;
  if (code === "RATE_LIMITED") return t.limited;
  if (code === "TIMEOUT") return t.timeout;
  return t.error;
}

export default function NeuroTermExtractor({ courseTitle, displayTitle, grade, displayGrade, courseSummaryOrText, language = "fr", accountId }: NeuroTermExtractorProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NeuroExtractionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const t = copy[language];
  const cacheKey = useMemo(() => `pedago-helper:neuro:v2:${accountId ?? "demo"}:${fingerprint(JSON.stringify([courseTitle, grade, courseSummaryOrText ?? "", language]))}`, [accountId, courseTitle, grade, courseSummaryOrText, language]);

  useEffect(() => {
    setData(null);
    setError(null);
    setActiveIndex(0);
    setRevealed(false);
    abortRef.current?.abort();
  }, [cacheKey]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; triggerRef.current?.focus(); };
  }, [open]);

  function close() {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setOpen(false);
  }

  async function analyze() {
    if (!accountId) return;
    const cached = readCache(cacheKey);
    if (cached) {
      setData(cached);
      setError(null);
      setLoading(false);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch("/api/extract-and-memorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseTitle, grade, language, ...(courseSummaryOrText ? { courseSummaryOrText } : {}) }),
        cache: "no-store",
        signal: controller.signal,
      });
      const body: unknown = await response.json();
      if (!body || typeof body !== "object") throw new Error(t.error);
      const envelope = body as { success?: unknown; data?: unknown; error?: { code?: unknown } };
      if (!response.ok || envelope.success !== true) throw new Error(errorFor(envelope.error?.code, language));
      const parsed = neuroExtractionSchema.safeParse(envelope.data);
      if (!parsed.success) throw new Error(t.error);
      saveCache(cacheKey, parsed.data);
      setData(parsed.data);
      setActiveIndex(0);
      setRevealed(false);
    } catch (caught) {
      if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : t.error);
    } finally {
      if (abortRef.current === controller) { abortRef.current = null; setLoading(false); }
    }
  }

  function openDialog() {
    setOpen(true);
    setActiveIndex(0);
    setRevealed(false);
    if (!accountId) return;
    if (data) return;
    void analyze();
  }

  function onDialogKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') ?? []);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number, count: number) {
    const direction = language === "ar" ? -1 : 1;
    let next = index;
    if (event.key === "ArrowRight") next = (index + direction + count) % count;
    else if (event.key === "ArrowLeft") next = (index - direction + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;
    event.preventDefault();
    setActiveIndex(next);
    setRevealed(false);
    const tabs = dialogRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[next]?.focus();
  }

  const activeTerm = data?.terms[activeIndex];

  return <>
    <div className="mt-4 border-t border-[#E7E5E4] pt-4"><button ref={triggerRef} type="button" onClick={openDialog} className="min-h-11 w-full rounded-lg border border-[#B5651D] bg-[#FAF3EC] px-3 py-2 text-start text-sm font-bold text-[#75400E] transition-transform hover:-translate-y-0.5 hover:bg-white focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#B5651D] motion-reduce:transform-none">{t.trigger}</button></div>
    {open && typeof document !== "undefined" && createPortal(
      <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-4" onMouseDown={event => { if (event.target === event.currentTarget) close(); }}>
        <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} aria-busy={loading} onKeyDown={onDialogKeyDown} className="max-h-[94dvh] w-full overflow-y-auto rounded-t-lg border border-[#111111] bg-white p-5 text-[#111111] sm:max-h-[88dvh] sm:max-w-3xl sm:rounded-lg sm:p-7" dir={language === "ar" ? "rtl" : "ltr"} lang={language}>
          <div className="flex items-start justify-between gap-4 border-b border-[#E7E5E4] pb-5">
            <div className="min-w-0"><p className="text-xs font-bold tracking-wide text-[#75400E]">{t.badge}</p><h2 id={titleId} className="mt-1 text-2xl font-bold">{t.title}</h2><p className="mt-2 text-sm font-semibold">{data?.localizedCourseTitle ?? displayTitle ?? courseTitle} · {displayGrade ?? grade}</p><p id={descriptionId} className="mt-1 text-xs text-[#444444]">{t.source}</p></div>
            <button ref={closeRef} type="button" onClick={close} aria-label={t.close} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#111111] bg-white text-2xl leading-none hover:bg-[#FAF3EC] focus-visible:outline-4 focus-visible:outline-[#B5651D]">×</button>
          </div>

          {!accountId && <div className="mt-6 rounded-lg border border-[#B5651D] bg-[#FAF3EC] p-4 text-sm"><p>{t.signIn}</p><a className="mt-3 inline-flex min-h-11 items-center rounded-lg border border-[#111111] bg-[#111111] px-4 py-2 font-bold text-white hover:bg-[#333333] focus-visible:outline-4 focus-visible:outline-[#B5651D]" href="/connexion">{t.signInLink}</a></div>}
          {loading && <div role="status" aria-live="polite" className="flex min-h-48 items-center gap-4 py-10 text-sm"><span aria-hidden="true" className="h-7 w-7 shrink-0 animate-spin rounded-full border-[3px] border-[#E7E5E4] border-t-[#B5651D] motion-reduce:animate-none" />{t.loading}</div>}
          {error && !loading && <div role="alert" className="mt-6 rounded-lg border border-[#B5651D] bg-[#FAF3EC] p-4"><p className="text-sm">{error}</p><button type="button" onClick={() => void analyze()} className="mt-3 min-h-11 rounded-lg border border-[#111111] bg-[#111111] px-4 py-2 text-sm font-bold text-white hover:bg-[#333333] focus-visible:outline-4 focus-visible:outline-[#B5651D]">{t.retry}</button></div>}

          {data && !loading && <div className="space-y-6 pt-6">
            <section className="rounded-lg border border-[#B5651D] bg-[#FAF3EC] p-4"><h3 className="text-sm font-bold text-[#75400E]">{t.diagnosis}</h3><p className="mt-2 text-sm leading-7">{data.cognitiveDiagnosis}</p></section>
            <section aria-label={t.terms}><h3 className="mb-3 text-sm font-bold">{t.terms}</h3><div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label={t.terms}>{data.terms.map((term, index) => <button key={`${term.term}-${index}`} type="button" role="tab" id={`${titleId}-tab-${index}`} aria-controls={`${titleId}-panel`} aria-selected={activeIndex === index} tabIndex={activeIndex === index ? 0 : -1} onClick={() => { setActiveIndex(index); setRevealed(false); }} onKeyDown={event => onTabKeyDown(event, index, data.terms.length)} className={`min-h-11 shrink-0 rounded-lg border px-3 py-2 text-sm font-bold focus-visible:outline-4 focus-visible:outline-[#B5651D] ${activeIndex === index ? "border-[#111111] bg-[#111111] text-white" : "border-[#E7E5E4] bg-white text-[#111111] hover:border-[#B5651D]"}`}>{term.term}</button>)}</div></section>
            {activeTerm && <section id={`${titleId}-panel`} role="tabpanel" aria-labelledby={`${titleId}-tab-${activeIndex}`} className="space-y-4 rounded-lg border border-[#E7E5E4] p-4 sm:p-5"><h3 className="text-xl font-bold">{activeTerm.term}</h3><div className="grid gap-4 sm:grid-cols-2"><div><h4 className="text-sm font-bold text-[#75400E]">{t.morphology}</h4><p className="mt-1 text-sm leading-7">{activeTerm.morphology}</p></div><div><h4 className="text-sm font-bold text-[#75400E]">{t.analogy}</h4><p className="mt-1 text-sm leading-7">{activeTerm.everydayAnalogy}</p></div></div><div className="rounded-lg border border-[#E7E5E4] bg-[#FAF3EC] p-4" dir="rtl" lang="ar"><h4 className="text-right text-sm font-bold text-[#75400E]">{t.darija}</h4><p className="mt-1 text-right text-sm leading-8">{activeTerm.darijaExplanation}</p></div><div><h4 className="text-sm font-bold text-[#75400E]">{t.visual}</h4><p className="mt-1 text-sm leading-7">{activeTerm.visualAnchor}</p></div><div className="rounded-lg border-2 border-[#111111] bg-white p-4"><h4 className="text-sm font-bold">{t.recall}</h4><p className="mt-2 text-sm leading-7">{activeTerm.activeRecallQuestion}</p><button type="button" aria-expanded={revealed} onClick={() => setRevealed(value => !value)} className="mt-4 min-h-11 rounded-lg border border-[#111111] bg-[#111111] px-4 py-2 text-sm font-bold text-white hover:bg-[#333333] focus-visible:outline-4 focus-visible:outline-[#B5651D]">{revealed ? t.hide : t.reveal}</button>{revealed && <p role="status" className="mt-3 border-t border-[#E7E5E4] pt-3 text-sm leading-7"><strong>{t.answer} :</strong> {activeTerm.activeRecallAnswer}</p>}</div></section>}
            <section className="rounded-lg border border-[#E7E5E4] bg-[#FAF3EC] p-4"><h3 className="text-sm font-bold">{t.spaced}</h3><div className="mt-2 flex flex-wrap gap-2"><span className="rounded border border-[#B5651D] bg-white px-2 py-1 text-xs font-bold">{t.dayTwo}</span><span className="rounded border border-[#B5651D] bg-white px-2 py-1 text-xs font-bold">{t.daySeven}</span></div><p className="mt-2 text-sm leading-7">{data.spacedReviewAdvice}</p></section>
          </div>}
        </section>
      </div>, document.body)}
  </>;
}
