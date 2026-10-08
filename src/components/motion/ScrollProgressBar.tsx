"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export interface ScrollProgressBarProps {
  direction?: "ltr" | "rtl";
}

export default function ScrollProgressBar({ direction = "ltr" }: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll({ trackContentSize: true });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
    skipInitialAnimation: true,
  });
  const reducedMotion = useReducedMotion();

  return <motion.div
    aria-hidden="true"
    className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-[#B5651D]"
    style={{ scaleX: reducedMotion ? 1 : smoothProgress, transformOrigin: direction === "rtl" ? "right center" : "left center" }}
  />;
}
