"use client";

import BrandMark from "../BrandMark";
import type { Messages, LandingLanguage } from "../../messages/types";

interface NavbarProps {
  language: LandingLanguage;
  messages: Messages;
  theme: "light" | "dark";
  onLanguageChange: (language: LandingLanguage) => void;
  onThemeToggle: () => void;
  onOpenApp: () => void;
}

export default function Navbar({ language, messages, theme, onLanguageChange, onThemeToggle, onOpenApp }: NavbarProps) {
  return <header className="landing-nav sticky top-0 z-50 border-b-[1.5px] border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-sm">
    <div className="mx-auto flex min-h-[76px] max-w-[1120px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3 sm:px-8">
      <a href="#top" className="landing-brand inline-flex min-h-11 items-center text-[var(--ink)] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]" aria-label="Pedago Helper">
        <BrandMark src="/pedago-helper-logo.jpeg" />
      </a>
      <nav aria-label={messages.nav.home} className="landing-nav-links order-3 flex w-full items-center gap-1 overflow-x-auto lg:order-2 lg:w-auto">
        <a href="#spaces" className="landing-nav-link">{messages.nav.spaces}</a>
        <a href="#how" className="landing-nav-link">{messages.nav.how}</a>
      </nav>
      <div className="order-2 flex items-center gap-2 lg:order-3">
        <div role="group" aria-label={messages.nav.language} className="flex items-center rounded-[12px] border-[1.5px] border-[var(--line)] bg-[var(--card)] p-1">
          {(["fr", "ar", "en"] as const).map(next => <button key={next} type="button" lang={next} aria-label={next === "ar" ? "العربية" : next === "en" ? "English" : "Français"} aria-pressed={language === next} onClick={() => onLanguageChange(next)} className={`landing-language min-h-11 min-w-11 rounded-[8px] px-2 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] ${language === next ? "bg-[var(--acc2)] text-[var(--bg)]" : "text-[var(--ink)] hover:bg-[var(--line)]"}`}>{next === "ar" ? "ع" : next.toUpperCase()}</button>)}
        </div>
        <button type="button" onClick={onThemeToggle} aria-label={`${messages.nav.theme} · ${theme === "dark" ? messages.nav.light : messages.nav.dark}`} aria-pressed={theme === "dark"} className="flex h-11 w-11 items-center justify-center rounded-[12px] border-[1.5px] border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--acc)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]">
          {theme === "dark" ? <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z" /></svg>}
        </button>
        <a href="/app" onClick={event => { event.preventDefault(); onOpenApp(); }} className="btn-stamp landing-nav-open hidden min-h-11 items-center rounded-[12px] px-4 text-sm font-bold lg:inline-flex">{messages.nav.open}</a>
      </div>
    </div>
  </header>;
}
