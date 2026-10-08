"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

export interface TimelineStep {
  title: string;
  body: string;
}

export interface ScrollStepsTimelineProps {
  steps: readonly [TimelineStep, TimelineStep, TimelineStep, TimelineStep];
  badges?: readonly string[];
  direction?: "ltr" | "rtl";
  className?: string;
}

export default function ScrollStepsTimeline({ steps, badges, direction = "ltr", className }: ScrollStepsTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const lineProgress = useTransform(scrollYProgress, [0.08, 0.85], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", value => {
    if (reducedMotion) return;
    const next = Math.min(3, Math.max(0, Math.floor(value * steps.length)));
    setActiveStep(current => current === next ? current : next);
  });

  const currentStep = reducedMotion ? 3 : activeStep;
  const horizontalDashes = "repeating-linear-gradient(to right, var(--acc2) 0 7px, transparent 7px 14px)";
  const verticalDashes = "repeating-linear-gradient(to bottom, var(--acc2) 0 7px, transparent 7px 14px)";
  const activeDashes = "repeating-linear-gradient(to right, var(--acc) 0 7px, transparent 7px 14px)";
  const activeVerticalDashes = "repeating-linear-gradient(to bottom, var(--acc) 0 7px, transparent 7px 14px)";

  return <div ref={containerRef} dir={direction} className={`relative ${className ?? ""}`}>
    <div aria-hidden="true" className="pointer-events-none absolute bottom-[42px] start-[42px] top-[42px] w-[2px] md:hidden" style={{ backgroundImage: verticalDashes }} />
    <motion.div aria-hidden="true" className="pointer-events-none absolute bottom-[42px] start-[42px] top-[42px] w-[2px] origin-top md:hidden" style={{ backgroundImage: activeVerticalDashes, scaleY: reducedMotion ? 1 : lineProgress }} />
    <div aria-hidden="true" className="pointer-events-none absolute end-[42px] start-[42px] top-[42px] hidden h-[2px] md:block" style={{ backgroundImage: horizontalDashes }} />
    <motion.div aria-hidden="true" className="pointer-events-none absolute end-[42px] start-[42px] top-[42px] hidden h-[2px] md:block" style={{ backgroundImage: activeDashes, scaleX: reducedMotion ? 1 : lineProgress, transformOrigin: direction === "rtl" ? "right center" : "left center" }} />
    <ol className="relative grid gap-5 md:grid-cols-4">{steps.map((step, index) => {
      const highlighted = index <= currentStep;
      return <li key={`${index}-${step.title}`} aria-current={index === currentStep ? "step" : undefined} className="relative z-10 rounded-[20px] border-[1.5px] border-[var(--line)] bg-[var(--bg)] p-5">
        <span aria-hidden="true" className={`flex h-11 w-11 items-center justify-center rounded-[12px] border-[1.5px] text-sm font-extrabold ${highlighted ? "border-[var(--acc2)] bg-[var(--acc2)] text-[var(--bg)]" : "border-[var(--line)] bg-[var(--card)] text-[var(--mut)]"}`}>{String(index + 1).padStart(2, "0")}</span>
        <h3 className="mt-5 text-lg font-bold leading-snug">{step.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--mut)]">{step.body}</p>
        {index === 1 && badges && <div className="mt-4 flex flex-wrap gap-1.5">{badges.map(badge => <span key={badge} className="rounded-full border border-[var(--line)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold">{badge}</span>)}</div>}
      </li>;
    })}</ol>
  </div>;
}
