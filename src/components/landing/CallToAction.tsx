import type { Messages } from "../../messages/types";
import Link from "next/link";

export default function CallToAction({ messages }: { messages: Messages }) {
  const { cta } = messages;
  return <section className="landing-cta relative overflow-hidden bg-[var(--acc2)] py-20 text-[var(--bg)]" aria-labelledby="landing-cta-title">
    <div className="landing-cta-glow pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-[var(--sun)] opacity-20 blur-3xl" aria-hidden="true" />
    <div className="relative mx-auto max-w-[1120px] px-5 sm:px-8"><p className="text-xs font-extrabold tracking-[.18em]">{cta.eyebrow}</p><h2 id="landing-cta-title" className="landing-display mt-4 max-w-[790px] text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.1] font-bold tracking-[-.045em]">{cta.title}</h2><p className="mt-5 max-w-2xl text-base leading-7">{cta.body}</p>
      <Link href="/inscription" className="btn-stamp mt-8 inline-flex min-h-12 items-center justify-center rounded-[14px] px-6 py-3 text-sm font-extrabold">{cta.action}<span aria-hidden="true" className="ms-3">↗</span></Link>
    </div>
  </section>;
}
