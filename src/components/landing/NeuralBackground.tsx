"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; litAt: number };
type Edge = { from: number; to: number };
type Pulse = { from: number; to: number; startedAt: number };

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];
    let frame = 0;
    let lastPulse = performance.now();
    let reduced = false;
    let pointer = { x: -1000, y: -1000 };
    let accent = "#1f6b4f";
    let line = "rgba(20,40,31,.13)";
    let muted = "#5b6a60";
    let width = 0;
    let height = 0;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function readColors() {
      const style = getComputedStyle(document.documentElement);
      accent = style.getPropertyValue("--acc2").trim() || accent;
      line = style.getPropertyValue("--line").trim() || line;
      muted = style.getPropertyValue("--mut").trim() || muted;
    }

    function draw(now: number) {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.strokeStyle = line;
      for (const edge of edges) {
        const a = nodes[edge.from]; const b = nodes[edge.to];
        context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
      }
      for (const pulse of pulses) {
        const fraction = Math.min(1, (now - pulse.startedAt) / 640);
        const a = nodes[pulse.from]; const b = nodes[pulse.to];
        context.fillStyle = accent;
        context.beginPath(); context.arc(a.x + (b.x - a.x) * fraction, a.y + (b.y - a.y) * fraction, 3.4, 0, Math.PI * 2); context.fill();
      }
      for (const node of nodes) {
        context.fillStyle = !reduced && now - node.litAt < 620 ? accent : muted;
        context.globalAlpha = !reduced && now - node.litAt < 620 ? .82 : .25;
        context.beginPath(); context.arc(node.x, node.y, 2.2, 0, Math.PI * 2); context.fill();
      }
      context.globalAlpha = 1;
      if (!reduced && pointer.x >= 0) {
        context.strokeStyle = accent;
        context.globalAlpha = .27;
        for (const node of nodes) {
          const distance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
          if (distance < 110) { context.beginPath(); context.moveTo(node.x, node.y); context.lineTo(pointer.x, pointer.y); context.stroke(); }
        }
        context.globalAlpha = 1;
      }
    }

    function tick(now: number) {
      if (now - lastPulse >= 500 && edges.length) {
        const origin = Math.floor(Math.random() * nodes.length);
        const connected = edges.filter(edge => edge.from === origin || edge.to === origin).slice(0, 3);
        nodes[origin].litAt = now;
        pulses.push(...connected.map(edge => ({ from: origin, to: edge.from === origin ? edge.to : edge.from, startedAt: now })));
        lastPulse = now;
      }
      pulses = pulses.filter(pulse => now - pulse.startedAt < 640);
      for (const pulse of pulses) if (now - pulse.startedAt > 530) nodes[pulse.to].litAt = now;
      draw(now);
      frame = window.requestAnimationFrame(tick);
    }

    function resize() {
      if (!canvas || !context) return;
      width = window.innerWidth; height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(70, Math.max(14, Math.floor(width / 16)));
      nodes = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, litAt: -1000 }));
      edges = [];
      for (let from = 0; from < count; from++) for (let to = from + 1; to < count; to++) {
        if (Math.hypot(nodes[from].x - nodes[to].x, nodes[from].y - nodes[to].y) < 150) edges.push({ from, to });
      }
      pulses = [];
      draw(performance.now());
    }

    function onPointerMove(event: PointerEvent) { pointer = { x: event.clientX, y: event.clientY }; }
    function onMotionChange() {
      reduced = motion.matches;
      window.cancelAnimationFrame(frame); frame = 0;
      pulses = [];
      draw(performance.now());
      if (!reduced) frame = window.requestAnimationFrame(tick);
    }

    reduced = motion.matches;
    readColors(); resize();
    if (!reduced) frame = window.requestAnimationFrame(tick);
    const themeObserver = new MutationObserver(() => { readColors(); if (reduced) draw(performance.now()); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    motion.addEventListener("change", onMotionChange);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      motion.removeEventListener("change", onMotionChange);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-45" />;
}
