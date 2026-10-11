"use client";

import { useEffect, useRef, useState } from "react";

type Language = "fr" | "ar" | "en";

export interface CourseToPathwayFlowProps {
  language?: Language;
  className?: string;
}

const copy = {
  fr: {
    title: "Du cours au parcours d’apprentissage",
    intro: "Une façon de visualiser le passage d’un document brut à une préparation structurée.",
    steps: ["Importer le cours", "Analyser le chapitre", "Proposer un parcours adapté"],
    details: ["Un chapitre ou un document sert de point de départ.", "Repérer ce qui est déjà connu, l’ordre d’étude et les points à éclaircir.", "Organiser les supports et le temps de la séance."],
    analysis: ["Prérequis", "Par où commencer", "À approfondir", "Schéma conseillé"],
    pathway: ["Fiche joudada", "55 min", "Capsules vidéo"],
    note: "Parcours illustratif : l’import automatique d’un document n’est pas encore disponible dans cette démonstration.",
  },
  ar: {
    title: "من الدرس إلى مسار التعلم",
    intro: "تصور توضيحي للانتقال من وثيقة أولية إلى تحضير منظم.",
    steps: ["استيراد الدرس", "تحليل المحور", "اقتراح مسار ملائم"],
    details: ["يشكل درس أو مستند نقطة البداية.", "تحديد المكتسبات السابقة وترتيب التعلم والنقاط التي تحتاج إلى توضيح.", "تنظيم الوسائل وزمن الحصة."],
    analysis: ["المكتسبات القبلية", "من أين نبدأ", "للتعمق", "رسم تخطيطي مقترح"],
    pathway: ["جذاذة بيداغوجية", "55 دقيقة", "فيديوهات قصيرة"],
    note: "مسار توضيحي: الاستيراد الآلي للوثائق غير متاح بعد في هذه النسخة التجريبية.",
  },
  en: {
    title: "From course material to learning pathway",
    intro: "A visual example of turning a source document into a structured lesson plan.",
    steps: ["Import the course", "Analyze the chapter", "Suggest an adapted pathway"],
    details: ["A chapter or document provides a starting point.", "Identify prior knowledge, a sensible order and concepts to clarify.", "Organize resources and lesson time."],
    analysis: ["Prerequisites", "Where to begin", "Go deeper", "Suggested diagram"],
    pathway: ["Lesson sheet", "55 min", "Video clips"],
    note: "Illustrative workflow: automatic document import is not yet available in this demo.",
  },
} as const;

function StepIcon({ step }: { step: number }) {
  return <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {step === 0 ? <><path d="M8 3h11l5 5v21H8z" /><path d="M19 3v6h5M12 15h8M12 20h8M12 25h5" /></>
      : step === 1 ? <><circle cx="14" cy="14" r="9" /><path d="m21 21 7 7M10 14h8M14 10v8" /></>
      : <><path d="M4 25h24M6 23l7-8 5 4 8-12" /><circle cx="6" cy="23" r="2" /><circle cx="13" cy="15" r="2" /><circle cx="18" cy="19" r="2" /><circle cx="26" cy="7" r="2" /></>}
  </svg>;
}

export default function CourseToPathwayFlow({ language = "en", className = "" }: CourseToPathwayFlowProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const t = copy[language];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReducedMotion(query.matches); setActiveStep(query.matches ? 2 : 0); };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    if (typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const observer = new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false), { threshold: .1 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !visible) return;
    const timer = window.setInterval(() => setActiveStep(step => (step + 1) % 3), 2300);
    return () => window.clearInterval(timer);
  }, [reducedMotion, visible]);

  const progress = reducedMotion ? 100 : (activeStep + 1) / 3 * 100;

  return <section ref={rootRef} aria-labelledby="ph-pathway-title" className={`min-w-0 rounded-lg border border-[#E8E8E1] bg-[#FAFAF8] p-4 text-[#111111] md:p-6 ${className}`}>
    <h3 id="ph-pathway-title" className="text-xl font-bold leading-snug text-[#111111]">{t.title}</h3>
    <p className="mt-2 text-sm leading-6">{t.intro}</p>
    <p className="sr-only">{t.steps.join(" ; ")}</p>
    <div className="relative mt-6 md:pb-5">
      <div className="absolute bottom-0 hidden h-1.5 w-full rounded bg-[#E8E8E1] md:block" aria-hidden="true"><span className="block h-full rounded bg-[#B5651D] transition-[width] duration-700" style={{ width: `${progress}%` }} /></div>
      <div className="absolute bottom-0 start-0 top-0 w-1.5 rounded bg-[#E8E8E1] md:hidden" aria-hidden="true"><span className="block w-full rounded bg-[#B5651D] transition-[height] duration-700" style={{ height: `${progress}%` }} /></div>
      <ol className="grid gap-4 ps-5 md:grid-cols-3 md:ps-0">{t.steps.map((title, index) => {
        const lit = reducedMotion || activeStep === index;
        return <li key={title} className={`relative min-w-0 rounded-lg border-2 p-4 transition-[border-color,background-color] duration-500 ${lit ? "border-[#B5651D] bg-white" : "border-[#E8E8E1] bg-white"}`}>
          <div className="flex items-center gap-3"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${lit ? "bg-[#B5651D] text-white" : "bg-[#E8E8E1] text-[#111111]"}`}><StepIcon step={index} /></span><span className="text-xs font-bold text-[#111111]">0{index + 1}</span></div>
          <h4 className="mt-3 text-base font-bold leading-6 text-[#111111]">{title}</h4>
          <p className="mt-2 text-xs leading-5">{t.details[index]}</p>
          {index === 1 && <ul className="mt-3 flex flex-wrap gap-1.5">{t.analysis.map(label => <li key={label} className="rounded border border-[#B5651D] px-2 py-1 text-[11px] font-semibold text-[#111111]">{label}</li>)}</ul>}
          {index === 2 && <ul className="mt-3 flex flex-wrap gap-1.5">{t.pathway.map(label => <li key={label} className="rounded border border-[#E8E8E1] px-2 py-1 text-[11px] font-semibold text-[#111111]">{label}</li>)}</ul>}
        </li>;
      })}</ol>
    </div>
    <p className="mt-5 border-t border-[#E8E8E1] pt-3 text-xs leading-5">{t.note}</p>
  </section>;
}
