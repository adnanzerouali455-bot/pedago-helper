import type { Messages } from "../../messages/types";
import Link from "next/link";
import ParallaxCard from "../motion/ParallaxCard";

interface HeroProps { messages: Messages; onOpenApp: () => void }

const networkLines = [[24, 54, 94, 90], [94, 90, 155, 44], [155, 44, 235, 92], [235, 92, 314, 42], [314, 42, 370, 105], [24, 54, 70, 160], [70, 160, 146, 195], [146, 195, 235, 92], [235, 92, 285, 185], [285, 185, 370, 105], [70, 160, 30, 260], [146, 195, 214, 280]] as const;
const networkNodes = [[24, 54], [94, 90], [155, 44], [235, 92], [314, 42], [370, 105], [70, 160], [146, 195], [285, 185], [30, 260], [214, 280]] as const;

export default function Hero({ messages, onOpenApp }: HeroProps) {
  const { hero, analysis } = messages;
  return <section id="top" className="landing-hero relative mx-auto grid max-w-[1120px] items-center gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.07fr_.93fr] lg:gap-12 lg:pb-32 lg:pt-24">
    <div className="relative z-10">
      <ul className="flex flex-wrap gap-2" aria-label={hero.badges.join(" · ")}>{hero.badges.map(badge => <li key={badge} className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[var(--line)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"><span className="landing-pulse-dot h-2 w-2 rounded-full bg-[var(--acc2)]" aria-hidden="true" />{badge}</li>)}</ul>
      <h1 className="landing-display mt-8 max-w-[760px] text-[clamp(2.55rem,6.6vw,5.2rem)] leading-[1.05] font-bold tracking-[-.055em] text-[var(--ink)]">
        {hero.before}<span className="landing-highlight relative inline-block italic text-[var(--acc)]">{hero.accent}<svg aria-hidden="true" className="absolute -bottom-2 start-0 h-4 w-full" viewBox="0 0 280 18" preserveAspectRatio="none"><path d="M4 13 C83 3 190 5 276 10" fill="none" stroke="var(--sun)" strokeWidth="9" strokeLinecap="round" opacity=".82" /></svg></span>{hero.after}
      </h1>
      <p className="mt-8 max-w-[580px] text-base leading-8 text-[var(--mut)] sm:text-lg">{hero.body}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/inscription" className="btn-stamp inline-flex min-h-12 items-center justify-center rounded-[14px] px-6 py-3 text-sm font-bold">{hero.open}<span aria-hidden="true" className="ms-3 landing-arrow">↗</span></Link>
        <a href="#spaces" className="inline-flex min-h-12 items-center justify-center rounded-[14px] border-[1.5px] border-[var(--line)] bg-[var(--card)] px-6 py-3 text-sm font-bold text-[var(--ink)] hover:border-[var(--acc2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]">{hero.discover}</a>
      </div>
      <a href="/app" onClick={event => { event.preventDefault(); onOpenApp(); }} className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-[var(--ink)] underline decoration-[var(--acc)] underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]">{hero.demo}</a>
      <p className="mt-7 text-xs font-medium text-[var(--mut)]">{hero.available} <span className="ms-2 font-bold text-[var(--ink)]">Français <span className="mx-1" aria-hidden="true">/</span> العربية <span className="mx-1" aria-hidden="true">/</span> English</span></p>
    </div>
    <div className="landing-analysis-wrap relative mx-auto w-full max-w-[510px] lg:ms-3">
      <svg aria-hidden="true" viewBox="0 0 400 310" className="pointer-events-none absolute -inset-x-5 -top-14 h-[360px] w-[calc(100%+40px)] text-[var(--acc2)] opacity-35">
        {networkLines.map(([x1, y1, x2, y2], index) => <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 6" className="landing-synapse" style={{ animationDelay: `${index * 80}ms` }} />)}
        {networkNodes.map(([cx, cy], index) => <circle key={index} cx={cx} cy={cy} r="3.5" fill="currentColor" className="landing-network-node" style={{ animationDelay: `${index * 170}ms` }} />)}
      </svg>
      <ParallaxCard className="relative"><div className="landing-analysis-card relative rotate-[1.5deg] rounded-[20px] border-[1.5px] border-[var(--line)] bg-[var(--card)] p-6 text-[var(--ink)] shadow-[10px_10px_0px_var(--acc2)] sm:p-8">
        <div className="flex items-start justify-between gap-3 border-b-[1.5px] border-[var(--line)] pb-5">
          <div><p className="text-[11px] font-bold tracking-[.18em] text-[var(--acc2)]">{analysis.label}</p><h2 className="landing-display mt-2 text-2xl font-bold leading-tight sm:text-3xl">{analysis.title}</h2></div>
          <span className="shrink-0 rounded-full border-[1.5px] border-[var(--acc)] px-2 py-1 text-[10px] font-extrabold text-[var(--acc)] rotate-[8deg]">{analysis.stamp}</span>
        </div>
        <ol className="mt-3 space-y-1">{analysis.rows.map((row, index) => <li key={row} className="landing-analysis-row flex items-center gap-3 border-b border-[var(--line)] py-3 text-sm font-semibold sm:text-base" style={{ animationDelay: `${index * 120 + 180}ms` }}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[var(--acc2)] text-xs font-bold text-[var(--bg)]" aria-hidden="true">{index + 1}</span><span>{row}</span><span className="ms-auto h-2 w-2 shrink-0 rounded-full bg-[var(--sun)]" aria-hidden="true" /></li>)}</ol>
        <p className="mt-5 text-xs leading-5 text-[var(--mut)]">{analysis.note}</p>
      </div></ParallaxCard>
    </div>
  </section>;
}
