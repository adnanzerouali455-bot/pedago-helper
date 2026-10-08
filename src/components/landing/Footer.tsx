import type { Messages } from "../../messages/types";

export default function Footer({ messages }: { messages: Messages }) {
  return <footer className="relative border-t-[1.5px] border-[var(--line)] bg-[var(--bg)] py-8 text-sm text-[var(--mut)]"><div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-5 sm:px-8"><div><p>{messages.footer.legal}</p><p className="mt-1 text-xs">{messages.footer.photoNote}</p></div><a href="https://www.oecd.org/en/publications/results-from-talis-2024-country-notes_e127f9e2-en/morocco_ee9859e2-en.html" target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--acc2)] underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--acc)]">{messages.footer.source}</a></div></footer>;
}
