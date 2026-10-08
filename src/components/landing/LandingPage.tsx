"use client";

import { ar } from "../../messages/ar";
import { en } from "../../messages/en";
import { fr } from "../../messages/fr";
import type { LandingLanguage } from "../../messages/types";
import ScrollProgressBar from "../motion/ScrollProgressBar";
import CallToAction from "./CallToAction";
import CognitiveScienceSection from "./CognitiveScienceSection";
import ConstatSection from "./ConstatSection";
import Footer from "./Footer";
import Hero from "./Hero";
import HowSection from "./HowSection";
import Navbar from "./Navbar";
import NeuralBackground from "./NeuralBackground";
import SpacesSection from "./SpacesSection";

export interface LandingPageProps {
  language: LandingLanguage;
  theme: "light" | "dark";
  onLanguageChange: (language: LandingLanguage) => void;
  onThemeToggle: () => void;
  onSelect: (role: "teacher" | "student") => void;
}

export default function LandingPage({ language, theme, onLanguageChange, onThemeToggle, onSelect }: LandingPageProps) {
  const messages = language === "ar" ? ar : language === "en" ? en : fr;
  const openApp = () => onSelect("teacher");
  return <div className="landing relative min-h-screen overflow-x-clip bg-[var(--bg)] text-[var(--ink)]" dir={language === "ar" ? "rtl" : "ltr"} lang={language}>
    <ScrollProgressBar direction={language === "ar" ? "rtl" : "ltr"} />
    <NeuralBackground />
    <div className="relative z-10">
      <Navbar language={language} messages={messages} theme={theme} onLanguageChange={onLanguageChange} onThemeToggle={onThemeToggle} onOpenApp={openApp} />
      <main><Hero messages={messages} onOpenApp={openApp} /><ConstatSection language={language} messages={messages} /><SpacesSection messages={messages} onSelect={onSelect} /><HowSection messages={messages} direction={language === "ar" ? "rtl" : "ltr"} /><CognitiveScienceSection messages={messages} /><CallToAction messages={messages} onOpenApp={openApp} /></main>
      <Footer messages={messages} />
    </div>
  </div>;
}
