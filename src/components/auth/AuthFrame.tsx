"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import BrandMark from "../BrandMark";

export type AuthLanguage = "fr" | "ar" | "en";

export function useAuthLanguage() {
  const [language, setLanguage] = useState<AuthLanguage>("fr");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("pedago-helper:language");
      if (saved === "fr" || saved === "ar" || saved === "en") setLanguage(saved);
    } catch { /* The language selector still works without browser storage. */ }
  }, []);
  function changeLanguage(next: AuthLanguage) {
    setLanguage(next);
    try { window.localStorage.setItem("pedago-helper:language", next); } catch { /* Keep the current language in memory. */ }
  }
  return { language, changeLanguage };
}

export default function AuthFrame({ language, onLanguageChange, title, description, children }: {
  language: AuthLanguage;
  onLanguageChange: (language: AuthLanguage) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return <div dir={language === "ar" ? "rtl" : "ltr"} lang={language} className="min-h-screen bg-[#FAFAF8] text-[#242220]" style={{ fontFamily: language === "ar" ? "var(--font-landing-arabic), 'Noto Naskh Arabic', sans-serif" : "'Plus Jakarta Sans', sans-serif" }}>
    <header className="border-b border-[#E7E5E4] bg-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
      <Link href="/" aria-label="Pedago Helper" className="inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B5651D]"><BrandMark src="/pedago-helper-logo.jpeg" /></Link>
      <div className="flex items-center gap-3"><Link href="/" className="text-sm font-semibold underline-offset-4 hover:underline">{language === "ar" ? "الرئيسية" : language === "en" ? "Home" : "Accueil"}</Link><div role="group" aria-label="Language" className="flex rounded-lg border border-[#E7E5E4] p-1">{(["fr", "ar", "en"] as const).map(item => <button key={item} type="button" lang={item} aria-pressed={language === item} onClick={() => onLanguageChange(item)} className={`min-h-10 min-w-10 rounded-md text-xs font-bold focus-visible:outline-2 focus-visible:outline-[#B5651D] ${language === item ? "bg-[#B5651D] text-white" : "hover:bg-[#FBE9E2]"}`}>{item.toUpperCase()}</button>)}</div></div>
    </div></header>
    <main className="mx-auto grid min-h-[calc(100vh-81px)] max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_1.15fr] lg:py-16">
      <section className="max-w-lg"><p className="mb-4 inline-flex rounded-lg border border-[#B5651D] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[#8C4A16]">Pedago Helper · EduSpace</p><h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">{title}</h1><p className="mt-5 text-base leading-8 text-[#4B4844]">{description}</p><div className="mt-8 h-1 w-24 rounded-full bg-[#B5651D]" /></section>
      <section className="rounded-lg border border-[#E7E5E4] bg-white p-5 sm:p-8">{children}</section>
    </main>
  </div>;
}

export const authInputClass = "mt-2 block min-h-12 w-full rounded-lg border border-[#CFCBC6] bg-white px-4 py-3 text-[#242220] outline-none focus:border-[#B5651D] focus:ring-2 focus:ring-[#B5651D]";
export const authButtonClass = "inline-flex min-h-12 items-center justify-center rounded-lg bg-[#B5651D] px-6 py-3 font-bold text-white hover:bg-[#9A5214] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5651D] disabled:cursor-not-allowed disabled:opacity-50";
