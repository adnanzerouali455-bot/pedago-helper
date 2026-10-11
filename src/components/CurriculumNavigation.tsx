"use client";

import React, { useId, useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { svtMoroccoCurriculum } from "../data/svtMoroccoCurriculum";
import { getGradesByCycle, getUnitsByGrade, searchChapters } from "../lib/curriculumUtils";
import type { Chapter, Grade } from "../types/curriculum";

type Language = "fr" | "ar" | "en";

export default function CurriculumNavigation({ language = "en", onSelectChapter }: {
  language?: Language;
  onSelectChapter?: (chapter: Chapter, grade: Grade) => void;
}) {
  const [cycleId, setCycleId] = useState("college");
  const [gradeId, setGradeId] = useState("1ac");
  const [query, setQuery] = useState("");
  const id = useId();
  const ar = language === "ar";
  const en = language === "en";
  const grades = getGradesByCycle(cycleId);
  const grade = grades.find(item => item.id === gradeId) ?? grades[0];
  const units = getUnitsByGrade(grade.id);
  const matches = useMemo(() => new Set(searchChapters(query).map(chapter => chapter.id)), [query]);
  const filteredUnits = units.map(unit => ({ ...unit, chapters: unit.chapters.filter(chapter => matches.has(chapter.id)) })).filter(unit => unit.chapters.length);
  const title = (fr: string, arabic: string) => ar ? arabic : fr;
  const secondary = (fr: string, arabic: string) => ar ? fr : arabic;
  const chapterCount = units.reduce((total, unit) => total + unit.chapters.length, 0);

  return <section dir={ar ? "rtl" : "ltr"} lang={language} className="rounded-lg border border-sand bg-white p-5 text-ink md:p-7">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-terracotta"><BookOpen size={17} aria-hidden="true" />{ar ? "دليل علوم الحياة والأرض" : en ? "LIFE AND EARTH SCIENCES CURRICULUM" : "PROGRAMME DE SCIENCES DE LA VIE ET DE LA TERRE"}</p>
        <h2 className="mt-2 text-xl font-bold text-cypress md:text-2xl">{ar ? "تصفح الوحدات والدروس" : en ? "Browse units and chapters" : "Explorer les unités et les chapitres"}</h2>
      </div>
      <span className="rounded-lg border border-sand bg-cypress-soft px-3 py-2 text-xs font-bold text-cypress">{chapterCount} {ar ? "درسا" : en ? "chapters" : "chapitres"}</span>
    </div>
    <div className="mt-5 grid gap-3 md:grid-cols-3">
      <label className="text-sm font-bold" htmlFor={`${id}-cycle`}>{ar ? "١. السلك" : en ? "1. Stage" : "1. Cycle"}
        <select id={`${id}-cycle`} className="mt-2 block min-h-11 w-full rounded-lg border border-sand bg-white px-3 text-sm" value={cycleId} onChange={event => { const next = event.target.value; setCycleId(next); setGradeId(getGradesByCycle(next)[0].id); setQuery(""); }}>
          {svtMoroccoCurriculum.map(cycle => <option key={cycle.id} value={cycle.id}>{title(cycle.titleFr, cycle.titleAr)}</option>)}
        </select>
      </label>
      <label className="text-sm font-bold" htmlFor={`${id}-grade`}>{ar ? "٢. المستوى والمسلك" : en ? "2. Grade and track" : "2. Niveau et filière"}
        <select id={`${id}-grade`} className="mt-2 block min-h-11 w-full rounded-lg border border-sand bg-white px-3 text-sm" value={grade.id} onChange={event => { setGradeId(event.target.value); setQuery(""); }}>
          {grades.map(item => <option key={item.id} value={item.id}>{title(item.titleFr, item.titleAr)}</option>)}
        </select>
      </label>
      <label className="text-sm font-bold" htmlFor={`${id}-search`}>{ar ? "٣. ابحث عن درس" : en ? "3. Find a chapter" : "3. Rechercher un chapitre"}
        <span className="relative mt-2 block"><Search size={17} aria-hidden="true" className="pointer-events-none absolute start-3 top-3.5 text-cypress" /><input id={`${id}-search`} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={ar ? "العنوان أو المصطلح" : en ? "Title or keyword" : "Titre ou mot-clé"} className="min-h-11 w-full rounded-lg border border-sand bg-white pe-3 ps-10 text-sm font-normal" /></span>
      </label>
    </div>
    <div className="mt-6 space-y-4">{filteredUnits.map(unit => <section key={unit.id} className="rounded-lg border border-sand bg-parchment p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2 border-b border-sand pb-3"><div><h3 className="font-bold text-cypress">{title(unit.titleFr, unit.titleAr)}</h3><p className="mt-1 text-xs text-ink" lang={ar ? "fr" : "ar"} dir={ar ? "ltr" : "rtl"}>{secondary(unit.titleFr, unit.titleAr)}</p></div><span className="text-xs font-semibold text-terracotta">{unit.semester ? (ar ? `الدورة ${unit.semester}` : en ? `Semester ${unit.semester}` : `Semestre ${unit.semester}`) : (ar ? `الوحدة ${unit.unitNumber}` : en ? `Unit ${unit.unitNumber}` : `Unité ${unit.unitNumber}`)}</span></div>
      <ul className="grid gap-2 lg:grid-cols-2">{unit.chapters.map(chapter => <li key={chapter.id} className="flex flex-col justify-between gap-3 rounded-lg border border-sand bg-white p-4">
        <div><div className="flex items-start justify-between gap-3"><h4 className="text-sm font-bold leading-6">{chapter.chapterNumber}. {title(chapter.titleFr, chapter.titleAr)}</h4><span className="shrink-0 rounded-lg bg-terracotta-soft px-2 py-1 text-xs font-bold text-terracotta">{chapter.estimatedDurationMin} {ar ? "د" : "min"}</span></div><p className="mt-2 text-xs leading-5 text-ink" lang={ar ? "fr" : "ar"} dir={ar ? "ltr" : "rtl"}>{secondary(chapter.titleFr, chapter.titleAr)}</p></div>
        {onSelectChapter && <button type="button" onClick={() => onSelectChapter(chapter, grade)} className="min-h-10 self-start rounded-lg border border-cypress bg-cypress px-3 py-2 text-xs font-bold text-white hover:bg-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta">{ar ? "تحضير هذا الدرس" : en ? "Prepare this chapter" : "Préparer ce chapitre"}</button>}
      </li>)}</ul>
    </section>)}
      {!filteredUnits.length && <p role="status" className="rounded-lg border border-sand p-5 text-sm">{ar ? "لا توجد دروس مطابقة في هذا المستوى." : en ? "No matching chapters in this grade." : "Aucun chapitre correspondant dans ce niveau."}</p>}
    </div>
    <p className="mt-5 text-xs leading-6 text-ink">{ar ? "العناوين والمدد مستمدة من المعطيات المقدمة؛ المدة تقديرية ولا تتضمن هذه القائمة نص الدرس الكامل." : en ? "Titles come from the supplied curriculum outline. Durations are estimates; this catalogue does not contain full lesson texts." : "Titres issus du programme fourni. Les durées sont indicatives ; ce catalogue ne contient pas les textes complets des leçons."}</p>
  </section>;
}
