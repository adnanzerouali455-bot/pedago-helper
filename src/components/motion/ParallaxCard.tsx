"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export interface ParallaxCardProps {
  children: ReactNode;
  className?: string;
}

export default function ParallaxCard({ children, className }: ParallaxCardProps) {
  const { scrollYProgress } = useScroll({ trackContentSize: true });
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const reducedMotion = useReducedMotion();

  return <motion.div className={className} style={{ y: reducedMotion ? 0 : y }}>{children}</motion.div>;
}
