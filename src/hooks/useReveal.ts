"use client";

import { useEffect, useRef, useState } from "react";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      setReducedMotion(media.matches);
      if (media.matches) setVisible(true);
    };
    updateMotion();
    media.addEventListener("change", updateMotion);

    const element = ref.current;
    if (!element || media.matches || !("IntersectionObserver" in window)) {
      if (!("IntersectionObserver" in window)) setVisible(true);
      return () => media.removeEventListener("change", updateMotion);
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => { observer.disconnect(); media.removeEventListener("change", updateMotion); };
  }, []);

  return { ref, visible, reducedMotion };
}
