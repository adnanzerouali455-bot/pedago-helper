"use client";

import { useEffect, useState } from "react";
import { useReveal } from "../../hooks/useReveal";
import type { LandingLanguage, Messages } from "../../messages/types";
import ScrollReveal from "../motion/ScrollReveal";

const values = [7.7, 6.2, 67] as const;
const sourceUrl = "https://www.oecd.org/en/publications/results-from-talis-2024-country-notes_e127f9e2-en/morocco_ee9859e2-en.html";

export default function ConstatSection({ messages, language }: { messages: Messages; language: LandingLanguage }) {
  const { ref, visible, reducedMotion } = useReveal<HTMLElement>();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!visible) return;
    if (reducedMotion) { setProgress(1); return; }
    const start = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const fraction = Math.min(1, (now - start) / 1100);
      setProgress(1 - (1 - fraction) ** 3);
      if (fraction < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible, reducedMotion]);
  const formatter = new Intl.NumberFormat(language === "ar" ? "ar-MA" : language === "en" ? "en-US" : "fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return <section ref={ref} className="relative border-y-[1.5px] border-[var(--line)] bg-[var(--card)]/85 py-20" aria-labelledby="landing-constat-title">
    <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
      <p className="landing-eyebrow">{messages.constat.eyebrow}</p>
      <h2 id="landing-constat-title" className="landing-display mt-3 max-w-3xl text-[clamp(2rem,4vw,3.35rem)] leading-[1.12] font-bold tracking-[-.04em]">{messages.constat.title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--mut)]">{messages.constat.subtitle}</p>
      <ScrollReveal className="mt-10 grid gap-4 md:grid-cols-3" staggerChildren={0.12}>{messages.constat.metrics.map((metric, index) => <div key={metric.label} className="h-full rounded-[20px] border-[1.5px] border-[var(--line)] bg-[var(--bg)] p-6">
        <p className="text-5xl font-extrabold leading-none tracking-[-.06em] text-[var(--acc2)]" aria-label={`${index === 2 ? values[index] : formatter.format(values[index])}${index === 2 ? " %" : " h"}`}><bdi dir="ltr" aria-hidden="true">{index === 2 ? Math.round(values[index] * progress).toString() : formatter.format(values[index] * progress)}{index === 2 ? " %" : " h"}</bdi></p>
        <h3 className="mt-5 text-lg font-bold">{metric.label}</h3><p className="mt-2 text-sm leading-6 text-[var(--mut)]">{metric.detail}</p>
      </div>)}</ScrollReveal>
      <div className="mt-7 space-y-1 text-xs leading-5 text-[var(--mut)]"><p><a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--acc2)] underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--acc)]">{messages.constat.source}</a></p><p>{messages.constat.qualification}</p></div>
    </div>
  </section>;
}
