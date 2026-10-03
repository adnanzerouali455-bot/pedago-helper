"use client";

import { useEffect, useRef } from "react";

type Language = "fr" | "ar" | "en";

export interface NeuralNetworkHeroCanvasProps {
  language?: Language;
  className?: string;
}

interface Neuron { x: number; y: number }
interface Synapse { from: number; to: number; offset: number }

const copy = {
  fr: {
    explanation: "Chaque connexion renforcée aide une notion à se fixer. Pedago Helper aide à choisir quoi renforcer et dans quel ordre.",
    notice: "Représentation symbolique : Pedago Helper n’analyse pas directement le cerveau de l’utilisateur.",
  },
  ar: {
    explanation: "يساعد تعزيز الروابط بين المعارف على ترسيخ المفاهيم. يساعد Pedago Helper على اختيار ما يُراجع وترتيب المراجعة.",
    notice: "رسم رمزي: لا يحلل Pedago Helper دماغ المستخدم مباشرة.",
  },
  en: {
    explanation: "Strengthening connections can help ideas stick. Pedago Helper helps choose what to reinforce and in what order.",
    notice: "Symbolic illustration: Pedago Helper does not directly analyze a user’s brain.",
  },
} as const;

export default function NeuralNetworkHeroCanvas({ language = "fr", className = "" }: NeuralNetworkHeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = copy[language];

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let visible = true;
    let frame = 0;
    let lastDraw = 0;
    let width = 1;
    let height = 1;
    let neurons: Neuron[] = [];
    let synapses: Synapse[] = [];

    function rebuild() {
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const columns = Math.max(4, Math.min(9, Math.round(width / 82)));
      const rows = Math.max(3, Math.min(7, Math.round(height / 88)));
      const random = (seed: number) => {
        const value = Math.sin(seed * 78.233 + columns * 31.7 + rows * 17.3) * 43758.5453;
        return value - Math.floor(value);
      };
      neurons = [];
      synapses = [];
      for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
        const index = row * columns + column;
        neurons.push({
          x: ((column + .5) / columns) * width + (random(index + 1) - .5) * Math.min(28, width / columns / 3),
          y: ((row + .5) / rows) * height + (random(index + 201) - .5) * Math.min(28, height / rows / 3),
        });
        if (column > 0) synapses.push({ from: index - 1, to: index, offset: random(index + 500) });
        if (row > 0) synapses.push({ from: index - columns, to: index, offset: random(index + 700) });
        if (row > 0 && column > 0 && random(index + 900) > .55) synapses.push({ from: index - columns - 1, to: index, offset: random(index + 1100) });
      }
      draw(performance.now());
    }

    function draw(now: number) {
      context!.clearRect(0, 0, width, height);
      context!.lineWidth = 1.2;
      context!.strokeStyle = "#E8E8E1";
      for (const synapse of synapses) {
        const start = neurons[synapse.from];
        const end = neurons[synapse.to];
        context!.beginPath();
        context!.moveTo(start.x, start.y);
        context!.lineTo(end.x, end.y);
        context!.stroke();
      }
      for (const neuron of neurons) {
        context!.beginPath();
        context!.arc(neuron.x, neuron.y, 2.7, 0, Math.PI * 2);
        context!.fillStyle = "#B5651D";
        context!.fill();
      }
      for (let index = 0; index < synapses.length; index += 5) {
        const synapse = synapses[index];
        const start = neurons[synapse.from];
        const end = neurons[synapse.to];
        const progress = reducedMotion ? .9 : ((now / 2300 + synapse.offset) % 1);
        const x = start.x + (end.x - start.x) * progress;
        const y = start.y + (end.y - start.y) * progress;
        context!.beginPath();
        context!.arc(x, y, 3.5, 0, Math.PI * 2);
        context!.fillStyle = "#B5651D";
        context!.fill();
        context!.beginPath();
        context!.arc(x, y, 9, 0, Math.PI * 2);
        context!.fillStyle = "rgba(181, 101, 29, 0.15)";
        context!.fill();
        if (progress > .87) {
          context!.beginPath();
          context!.arc(end.x, end.y, 5.5, 0, Math.PI * 2);
          context!.fillStyle = `rgba(181, 101, 29, ${(progress - .87) / .13 * .42})`;
          context!.fill();
        }
      }
    }

    function animate(now: number) {
      if (now - lastDraw >= 32) { draw(now); lastDraw = now; }
      frame = window.requestAnimationFrame(animate);
    }

    function syncAnimation() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      draw(performance.now());
      if (!reducedMotion && visible && !document.hidden) frame = window.requestAnimationFrame(animate);
    }

    const onMotionChange = (event: MediaQueryListEvent) => { reducedMotion = event.matches; syncAnimation(); };
    const onVisibilityChange = () => syncAnimation();
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(rebuild);
    const intersectionObserver = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      syncAnimation();
    }, { threshold: .05 });
    resizeObserver?.observe(canvas);
    intersectionObserver?.observe(canvas);
    window.addEventListener("resize", rebuild);
    document.addEventListener("visibilitychange", onVisibilityChange);
    motionQuery.addEventListener("change", onMotionChange);
    rebuild();
    syncAnimation();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      window.removeEventListener("resize", rebuild);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <div className={`ph-neural-visual absolute inset-0 ${className}`}>
    <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    <div className="ph-neural-caption absolute bottom-4 start-4 z-20 max-w-[340px] rounded-lg border border-[#111111] bg-[#FAFAF8] p-3 text-[#111111]">
      <p className="text-xs font-semibold leading-5">{t.explanation}</p>
      <p className="mt-2 border-t border-[#E8E8E1] pt-2 text-[11px] leading-4">{t.notice}</p>
    </div>
  </div>;
}
