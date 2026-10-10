import Image from "next/image";
import Link from "next/link";
import teacherPhoto from "../../../public/teacher-svt-classroom.jpg";
import studentPhoto from "../../../public/students-svt-lab.jpg";
import type { Messages } from "../../messages/types";
import ScrollReveal from "../motion/ScrollReveal";

interface SpacesProps { messages: Messages; onSelect: (role: "teacher" | "student") => void }

export default function SpacesSection({ messages, onSelect }: SpacesProps) {
  const { spaces } = messages;
  return <section id="spaces" className="landing-section relative mx-auto max-w-[1120px] scroll-mt-24 px-5 py-20 sm:px-8" aria-labelledby="landing-spaces-title">
    <p className="landing-eyebrow">{spaces.eyebrow}</p>
    <div className="mt-3 flex flex-wrap items-end justify-between gap-4"><h2 id="landing-spaces-title" className="landing-display max-w-[720px] text-[clamp(2rem,4vw,3.4rem)] leading-[1.12] font-bold tracking-[-.04em]">{spaces.title}</h2><p className="max-w-xs text-sm leading-6 text-[var(--mut)]">{spaces.intro}</p></div>
    <ScrollReveal className="mt-10 grid gap-5 md:grid-cols-2" staggerChildren={0.14}>{(["teacher", "student"] as const).map(role => {
      const item = spaces[role];
      return <article key={role} className="landing-space-card flex h-full min-h-[390px] flex-col rounded-[20px] border-[1.5px] border-[var(--line)] bg-[var(--card)] p-6 sm:p-8">
        <div className="relative mb-6 h-44 w-full overflow-hidden rounded-[14px] border-[1.5px] border-[var(--line)] bg-[var(--bg)] sm:h-52">
          <Image src={role === "teacher" ? teacherPhoto : studentPhoto} alt={item.photoAlt} fill sizes="(max-width: 767px) calc(100vw - 88px), (max-width: 1120px) calc(50vw - 88px), 460px" placeholder="blur" quality={75} className="object-cover object-center" />
        </div>
        <div className="flex items-center gap-2 text-xs font-extrabold tracking-[.14em] text-[var(--acc2)]"><span className="landing-pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--acc2)]" aria-hidden="true" />{item.label}</div>
        <h3 className="landing-display mt-5 text-3xl font-bold leading-tight">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[var(--mut)]">{item.body}</p>
        <ul className="mt-6 space-y-2">{item.features.map(feature => <li key={feature} className="flex items-start gap-2 text-sm font-semibold"><span aria-hidden="true" className="mt-[.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--acc)]" />{feature}</li>)}</ul>
        <p className="mt-5 text-xs leading-5 text-[var(--mut)]">{item.note}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-7"><Link href={`/inscription?role=${role}`} className="btn-stamp inline-flex min-h-12 items-center justify-center rounded-[12px] px-5 py-3 text-sm font-bold">{item.action}</Link><a href="/app" onClick={event => { event.preventDefault(); onSelect(role); }} className="inline-flex min-h-11 items-center text-sm font-bold text-[var(--ink)] underline decoration-[var(--acc)] underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]">{spaces.preview}</a></div>
      </article>;
    })}</ScrollReveal>
    <Link href="/inscription?role=school" className="mt-7 inline-flex min-h-11 items-center text-sm font-bold text-[var(--ink)] underline decoration-[var(--acc)] underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]">{spaces.schoolAction}<span aria-hidden="true" className="ms-2">↗</span></Link>
  </section>;
}
