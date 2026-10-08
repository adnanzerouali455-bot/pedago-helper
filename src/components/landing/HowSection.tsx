import type { Messages } from "../../messages/types";
import ScrollStepsTimeline from "../motion/ScrollStepsTimeline";

export default function HowSection({ messages, direction }: { messages: Messages; direction: "ltr" | "rtl" }) {
  const { how } = messages;
  return <section id="how" className="landing-section relative border-y-[1.5px] border-[var(--line)] bg-[var(--card)]/80 py-20 scroll-mt-24" aria-labelledby="landing-how-title">
    <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
      <p className="landing-eyebrow">{how.eyebrow}</p><h2 id="landing-how-title" className="landing-display mt-3 max-w-[740px] text-[clamp(2rem,4vw,3.4rem)] leading-[1.12] font-bold tracking-[-.04em]">{how.title}</h2>
      <ScrollStepsTimeline className="mt-11" steps={how.steps} badges={how.badges} direction={direction} />
      <p className="mt-6 border-s-[3px] border-[var(--sun)] ps-4 text-xs leading-6 text-[var(--mut)]">{how.note}</p>
    </div>
  </section>;
}
