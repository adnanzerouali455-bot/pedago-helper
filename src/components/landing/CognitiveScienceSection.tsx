import type { Messages } from "../../messages/types";

const glyphs = [
  <svg key="attention" aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="24" cy="24" r="15" /><circle cx="24" cy="24" r="7" /><circle cx="24" cy="24" r="2" fill="currentColor" /></svg>,
  <svg key="memory" aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 10h24a5 5 0 0 1 5 5v23H13a5 5 0 0 0-5 5V10Zm5 28V15" /><path d="M19 22h12M19 28h9" /></svg>,
  <svg key="effort" aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m10 35 11-12 7 6 11-17" /><path d="M33 12h6v6" /><circle cx="10" cy="35" r="2" fill="currentColor" /></svg>,
];

export default function CognitiveScienceSection({ messages }: { messages: Messages }) {
  const { science } = messages;
  return <section className="landing-section relative mx-auto max-w-[1120px] px-5 py-20 sm:px-8" aria-labelledby="landing-science-title">
    <p className="landing-eyebrow">{science.eyebrow}</p><h2 id="landing-science-title" className="landing-display mt-3 max-w-[780px] text-[clamp(2rem,4vw,3.4rem)] leading-[1.12] font-bold tracking-[-.04em]">{science.title}</h2>
    <p className="mt-4 max-w-[760px] text-base leading-7 text-[var(--mut)]">{science.intro}</p>
    <div className="mt-9 grid gap-4 md:grid-cols-3">{science.cards.map((card, index) => <article key={card.title} className="rounded-[20px] border-[1.5px] border-[var(--line)] bg-[var(--card)] p-6">
      <span className="block h-12 w-12 text-[var(--acc2)]">{glyphs[index]}</span><h3 className="landing-display mt-5 text-2xl font-bold">{card.title}</h3><p className="mt-3 text-sm leading-7 text-[var(--mut)]">{card.body}</p>
    </article>)}</div>
    <p className="mt-7 rounded-[20px] border-[1.5px] border-dashed border-[var(--acc2)] bg-[var(--card)] p-5 text-sm leading-7 text-[var(--mut)]">{science.ethics}</p>
  </section>;
}
