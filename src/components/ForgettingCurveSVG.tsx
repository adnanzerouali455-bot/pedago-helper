"use client";

import { useEffect, useId, useState } from "react";

type Language = "fr" | "ar" | "en";

export interface ForgettingCurveSVGProps {
  language?: Language;
  className?: string;
}

const naturalCurve = "M 56 62 C 112 116, 170 181, 250 211 S 411 246, 520 254";
const revisedCurve = "M 56 62 C 98 99, 129 139, 150 168 L 150 80 C 190 104, 228 142, 250 173 L 250 80 C 292 96, 339 128, 365 152 L 365 80 C 416 93, 475 117, 520 138";
const recalls = [
  { label: "R1", x: 150, text: { fr: "Réactivation 24 h après le cours", ar: "استرجاع بعد 24 ساعة من الدرس", en: "Recall 24 hours after the lesson" } },
  { label: "R2", x: 250, text: { fr: "Deuxième rappel vers le troisième jour", ar: "استرجاع ثانٍ في اليوم الثالث تقريبًا", en: "Second recall around day three" } },
  { label: "R3", x: 365, text: { fr: "Troisième rappel autour du septième jour", ar: "استرجاع ثالث في اليوم السابع تقريبًا", en: "Third recall around day seven" } },
] as const;

const copy = {
  fr: {
    title: "La mémoire se consolide avec des rappels espacés",
    description: "Courbe illustrative de rétention : en gris, la rétention diminue sans révision ; en orange, trois rappels la relèvent successivement.",
    retention: "Rétention mémorielle",
    time: "Temps (jours)",
    natural: "Sans révision",
    revised: "Avec trois rappels",
    replay: "↺ Rejouer l’animation",
    scroll: "Faire défiler le graphique horizontalement pour voir tous les jours",
    reduced: "Animation désactivée selon votre préférence de mouvement réduit",
    note: "Courbe illustrative inspirée des travaux expérimentaux d’Hermann Ebbinghaus sur l’apprentissage distribué.",
  },
  ar: {
    title: "تترسخ الذاكرة بالمراجعة المتباعدة",
    description: "منحنى توضيحي للتذكر: ينخفض الخط الرمادي دون مراجعة، وترفعه ثلاث مراجعات متتالية باللون البرتقالي.",
    retention: "نسبة التذكر",
    time: "الزمن (بالأيام)",
    natural: "دون مراجعة",
    revised: "مع ثلاث مراجعات",
    replay: "↺ إعادة عرض الحركة",
    scroll: "مرر الرسم أفقيا لرؤية جميع الأيام",
    reduced: "الحركة متوقفة وفق تفضيلك لتقليل الحركة",
    note: "منحنى توضيحي مستوحى من أبحاث هيرمان إبنغهاوس التجريبية حول التعلم الموزع.",
  },
  en: {
    title: "Spaced recall helps memories last",
    description: "Illustrative retention curves: grey declines without revision, while three recalls raise the orange curve.",
    retention: "Memory retention",
    time: "Time (days)",
    natural: "Without revision",
    revised: "With three recalls",
    replay: "↺ Replay animation",
    scroll: "Scroll the chart horizontally to see all days",
    reduced: "Animation disabled by your reduced-motion preference",
    note: "Illustrative curve inspired by Hermann Ebbinghaus’s experimental work on distributed learning.",
  },
} as const;

export default function ForgettingCurveSVG({ language = "fr", className = "" }: ForgettingCurveSVGProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [replay, setReplay] = useState(0);
  const [activeRecall, setActiveRecall] = useState<number | null>(null);
  const id = useId().replaceAll(":", "");
  const t = copy[language];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return <figure className={`min-w-0 rounded-lg border border-[#E8E8E1] bg-[#FAFAF8] p-4 text-[#111111] md:p-6 ${className}`}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <figcaption className="max-w-lg"><h3 className="text-xl font-bold leading-snug text-[#111111]">{t.title}</h3><p className="mt-2 text-sm leading-6">{t.description}</p></figcaption>
      <button type="button" disabled={reducedMotion} title={reducedMotion ? t.reduced : undefined} onClick={() => { setActiveRecall(null); setReplay(value => value + 1); }} className="min-h-11 rounded-lg border border-[#111111] bg-white px-3 py-2 text-sm font-semibold text-[#111111] hover:bg-[#E8E8E1] disabled:cursor-not-allowed disabled:opacity-60">{t.replay}</button>
    </div>
    {reducedMotion && <p role="status" className="mt-2 text-xs">{t.reduced}</p>}
    <div role="region" aria-label={t.scroll} tabIndex={0} dir="ltr" className="mt-5 overflow-x-auto pt-8 focus-visible:outline-2 focus-visible:outline-[#B5651D] sm:pt-0">
      <div className="relative min-w-[520px]" dir="ltr">
      <svg key={replay} viewBox="0 0 600 320" role="img" aria-labelledby={`${id}-title ${id}-description`} className="block h-auto w-full overflow-visible">
        <title id={`${id}-title`}>{t.title}</title><desc id={`${id}-description`}>{t.description}</desc>
        <defs><mask id={`${id}-natural-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="320"><path d={naturalCurve} fill="none" stroke="white" strokeWidth="8" pathLength="1" strokeDasharray="1" strokeDashoffset={reducedMotion ? 0 : 1} className={reducedMotion ? undefined : "ph-curve-draw"} /></mask></defs>
        {[60, 160, 260].map(y => <line key={y} x1="56" x2="540" y1={y} y2={y} stroke="#E8E8E1" strokeWidth="1" />)}
        <path d="M 56 42 V 260 H 540" fill="none" stroke="#111111" strokeWidth="1.5" />
        {[{ value: "100%", y: 64 }, { value: "50%", y: 164 }, { value: "0%", y: 264 }].map(tick => <text key={tick.value} x="48" y={tick.y} textAnchor="end" fontSize="12" fill="#111111">{tick.value}</text>)}
        {[[56, "J0"], [150, "J1"], [250, "J3"], [365, "J7"], [520, "J21"]].map(([x, label]) => <g key={label}><line x1={x} x2={x} y1="260" y2="266" stroke="#111111" /><text x={x} y="284" textAnchor="middle" fontSize="12" fill="#111111">{label}</text></g>)}
        <path d={naturalCurve} fill="none" stroke="#111111" strokeOpacity=".58" strokeWidth="2.5" strokeDasharray="5 6" mask={`url(#${id}-natural-mask)`} />
        <path d={revisedCurve} fill="none" stroke="#B5651D" strokeWidth="4" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={reducedMotion ? 0 : 1} className={reducedMotion ? undefined : "ph-curve-draw"} />
        <text x="300" y="316" textAnchor="middle" fontSize="13" fill="#111111">{t.time}</text>
        <text x="15" y="151" textAnchor="middle" fontSize="12" fill="#111111" transform="rotate(-90 15 151)">{t.retention}</text>
      </svg>
      {recalls.map((recall, index) => <div key={recall.label} className="absolute" style={{ left: `${recall.x / 600 * 100}%`, top: `${80 / 320 * 100}%`, transform: "translate(-50%, -50%)" }}>
        <button type="button" aria-label={`${recall.label} : ${recall.text[language]}`} aria-expanded={activeRecall === index} aria-describedby={activeRecall === index ? `${id}-recall-${index}` : undefined} onClick={() => setActiveRecall(index)} onMouseEnter={() => setActiveRecall(index)} onMouseLeave={() => setActiveRecall(null)} onFocus={() => setActiveRecall(index)} onBlur={() => setActiveRecall(null)} onKeyDown={event => { if (event.key === "Escape") setActiveRecall(null); }} className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[#B5651D] bg-white text-xs font-bold text-[#111111] outline-offset-2 focus-visible:outline-4 focus-visible:outline-[#B5651D]">{recall.label}</button>
        {activeRecall === index && <span id={`${id}-recall-${index}`} role="tooltip" dir={language === "ar" ? "rtl" : "ltr"} className="absolute bottom-[calc(100%+8px)] left-1/2 z-10 w-40 -translate-x-1/2 rounded-lg border border-[#111111] bg-white p-2 text-center text-xs leading-5 text-[#111111]">{recall.label} · {recall.text[language]}</span>}
      </div>)}
      </div>
    </div>
    <p className="mt-2 text-xs sm:hidden">{t.scroll}</p>
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold"><span className="inline-flex items-center gap-2"><span className="w-7 border-t-2 border-dashed border-[#666666]" />{t.natural}</span><span className="inline-flex items-center gap-2"><span className="w-7 border-t-[3px] border-[#B5651D]" />{t.revised}</span></div>
    <p className="mt-4 border-t border-[#E8E8E1] pt-3 text-xs leading-5">{t.note}</p>
    <style>{`@keyframes ph-curve-trace { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } } .ph-curve-draw { animation: ph-curve-trace 2.5s ease-out forwards; } @media (prefers-reduced-motion: reduce) { .ph-curve-draw { animation: none; stroke-dashoffset: 0; } }`}</style>
  </figure>;
}
