"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function ScrollReveal({ children, className, delay = 0, staggerChildren = 0 }: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();
  const staggered = staggerChildren > 0;
  const containerVariants: Variants = {
    hidden: staggered ? {} : { opacity: 0, y: 24 },
    visible: staggered
      ? { transition: { delayChildren: delay, staggerChildren } }
      : { opacity: 1, y: 0, transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return <motion.div
    className={className}
    variants={containerVariants}
    initial={reducedMotion ? false : "hidden"}
    animate={reducedMotion ? "visible" : undefined}
    whileInView={reducedMotion ? undefined : "visible"}
    viewport={{ once: true, margin: "-100px" }}
  >
    {staggered ? Children.toArray(children).map((child, index) => <motion.div key={index} className="h-full motion-reveal-item" variants={itemVariants} style={reducedMotion ? { opacity: 1, transform: "none" } : undefined}>{child}</motion.div>) : children}
  </motion.div>;
}
