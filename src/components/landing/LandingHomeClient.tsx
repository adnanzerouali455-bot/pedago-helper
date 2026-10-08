"use client";

import { useEffect, useState } from "react";
import type { LandingLanguage } from "../../messages/types";
import LandingPage from "./LandingPage";

export default function LandingHomeClient() {
  const [language, setLanguage] = useState<LandingLanguage>("fr");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [manualTheme, setManualTheme] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const legacyRoute = window.location.hash;
    if (["#teacher", "#student", "#planner", "#calendar"].includes(legacyRoute)) {
      window.location.replace(`/app${legacyRoute}`);
      return;
    }
    try {
      const savedLanguage = localStorage.getItem("pedago-helper:language");
      if (savedLanguage === "fr" || savedLanguage === "ar" || savedLanguage === "en") setLanguage(savedLanguage);
      const savedTheme = localStorage.getItem("pedago-helper:theme");
      if (savedTheme === "light" || savedTheme === "dark") { setTheme(savedTheme); setManualTheme(true); }
      else setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (manualTheme) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [manualTheme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = language === "ar" ? "المساعد البيداغوجي | Pedago Helper" : "Pedago Helper | المساعد البيداغوجي";
    if (ready) try { localStorage.setItem("pedago-helper:language", language); } catch { /* The language still works for this visit. */ }
  }, [language, ready]);

  useEffect(() => { if (ready) document.documentElement.dataset.theme = theme; }, [theme, ready]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setManualTheme(true);
    setTheme(next);
    try { localStorage.setItem("pedago-helper:theme", next); } catch { /* The theme still works for this visit. */ }
  }

  function openSpace(role: "teacher" | "student") { window.location.assign(`/app#${role}`); }

  return <LandingPage language={language} theme={theme} onLanguageChange={setLanguage} onThemeToggle={toggleTheme} onSelect={openSpace} />;
}
