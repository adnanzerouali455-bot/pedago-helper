"use client";

import { useMemo, useState } from "react";
import { BookOpen, ExternalLink, Play, Search } from "lucide-react";
import { svtCurriculumWithVideos } from "../data/svtCurriculumWithVideos";
import NeuroTermExtractor from "./student/NeuroTermExtractor";

type Language = "fr" | "ar" | "en";
type Semester = "all" | 1 | 2;

const copy = {
  fr: {
    eyebrow: "BIBLIOTHÈQUE SVT",
    title: "Mes cours et vidéos",
    intro: "Retrouvez les chapitres par niveau, explorez leurs notions clés et ouvrez les vidéos proposées.",
    grade: "Niveau et filière",
    semester: "Semestre",
    all: "Toute l’année",
    first: "Semestre 1",
    second: "Semestre 2",
    search: "Rechercher un chapitre",
    searchHint: "Titre ou mot-clé",
    chapter: "chapitres",
    videos: "vidéos",
    minutes: "min",
    keywords: "Mots-clés",
    video: "Voir la vidéo",
    noResults: "Aucun chapitre ne correspond à cette recherche.",
    note: "Les vidéos s’ouvrent sur YouTube. Leur disponibilité dépend de leur auteur.",
  },
  ar: {
    eyebrow: "مكتبة علوم الحياة والأرض",
    title: "دروسي وفيديوهاتي",
    intro: "تصفح الدروس حسب المستوى، وتعرف على مفاهيمها الأساسية، وافتح الفيديوهات المقترحة.",
    grade: "المستوى والمسلك",
    semester: "الدورة",
    all: "السنة كاملة",
    first: "الدورة الأولى",
    second: "الدورة الثانية",
    search: "ابحث عن درس",
    searchHint: "عنوان الدرس أو مصطلح",
    chapter: "دروس",
    videos: "فيديوهات",
    minutes: "دقيقة",
    keywords: "مصطلحات علمية بالفرنسية",
    video: "شاهد الفيديو",
    noResults: "لا توجد دروس مطابقة لهذا البحث.",
    note: "تفتح الفيديوهات على يوتيوب، ويتوقف توفرها على ناشريها.",
  },
  en: {
    eyebrow: "LIFE AND EARTH SCIENCES LIBRARY",
    title: "My lessons and videos",
    intro: "Browse chapters by grade, explore their key concepts and open the suggested videos.",
    grade: "Grade and track",
    semester: "Semester",
    all: "Full year",
    first: "Semester 1",
    second: "Semester 2",
    search: "Find a chapter",
    searchHint: "Title or keyword",
    chapter: "chapters",
    videos: "videos",
    minutes: "min",
    keywords: "French key terms",
    video: "Watch video",
    noResults: "No chapters match your search.",
    note: "Videos open on YouTube. Availability depends on their publishers.",
  },
} as const;

export default function StudentSvtLibrary({ language, initialGradeId, accountId }: { language: Language; initialGradeId?: string; accountId?: string }) {
  const [gradeId, setGradeId] = useState(initialGradeId ?? "3AC");
  const [semester, setSemester] = useState<Semester>("all");
  const [query, setQuery] = useState("");
  const grade = svtCurriculumWithVideos.find(item => item.gradeId === gradeId) ?? svtCurriculumWithVideos[0];
  const ar = language === "ar";
  const t = copy[language];
  const units = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return grade.units
      .filter(unit => semester === "all" || unit.semester === semester)
      .map(unit => ({
        ...unit,
        chapters: unit.chapters.filter(chapter => !term || [chapter.titleFr, chapter.titleAr, ...chapter.keywords].some(value => value.toLocaleLowerCase().includes(term))),
      }))
      .filter(unit => unit.chapters.length > 0);
  }, [grade, semester, query]);
  const chapters = units.flatMap(unit => unit.chapters);
  const videoCount = chapters.filter(chapter => chapter.video).length;

  return <section aria-labelledby="student-svt-title" className="student-svt-library mt-8 rounded-lg border-2 border-black bg-white p-5 md:p-7">
    <div data-tour="student-library" className="flex flex-wrap items-start justify-between gap-4 border-b border-black pb-5">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2 text-xs font-bold text-[#B9552F]"><BookOpen size={18} aria-hidden="true" />{t.eyebrow}</p>
        <h2 id="student-svt-title" className="mt-2 text-2xl font-bold md:text-3xl">{t.title}</h2>
        <p className="mt-2 text-sm leading-7">{t.intro}</p>
      </div>
      <p className="student-svt-count rounded-lg border border-black bg-[#FBE9E2] px-3 py-2 text-xs font-bold" role="status">{t.chapter} : {chapters.length} · {t.videos} : {videoCount}</p>
    </div>

    <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <label className="block text-sm font-bold">{t.grade}
        <select className="mt-2 block min-h-12 w-full rounded-lg border border-black bg-white px-3 py-2 text-base" value={grade.gradeId} onChange={event => { setGradeId(event.target.value); setSemester("all"); setQuery(""); }}>
          {svtCurriculumWithVideos.map(item => <option key={item.gradeId} value={item.gradeId}>{ar ? item.labelAr : item.labelFr}</option>)}
        </select>
      </label>
      <label className="block text-sm font-bold">{t.search}
        <span className="relative mt-2 block"><Search size={18} aria-hidden="true" className="pointer-events-none absolute start-3 top-4" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.searchHint} className="min-h-12 w-full rounded-lg border border-black bg-white pe-3 ps-10 text-base font-normal" /></span>
      </label>
    </div>
    <div className="mt-5"><p className="mb-2 text-sm font-bold">{t.semester}</p><div className="flex flex-wrap gap-2" role="group" aria-label={t.semester}>{(["all", 1, 2] as Semester[]).map(value => <button key={value} type="button" aria-pressed={semester === value} onClick={() => setSemester(value)} className={`min-h-11 rounded-lg border border-black px-4 py-2 text-sm font-bold transition-colors ${semester === value ? "bg-black text-white" : "bg-white text-black hover:bg-[#FBE9E2]"}`}>{value === "all" ? t.all : value === 1 ? t.first : t.second}</button>)}</div></div>

    <div className="mt-6 space-y-5">{units.map(unit => <section key={unit.unitId} aria-labelledby={`${unit.unitId}-title`} className="student-svt-unit rounded-lg border border-black bg-[#F5F5F5] p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><h3 id={`${unit.unitId}-title`} className="text-lg font-bold" lang={ar ? "ar" : "fr"}>{ar ? unit.titleAr : unit.titleFr}</h3><p className="mt-1 text-sm" lang={ar ? "fr" : "ar"} dir={ar ? "ltr" : "rtl"}>{ar ? unit.titleFr : unit.titleAr}</p></div><span className="rounded-lg border border-black bg-white px-2 py-1 text-xs font-bold">{unit.semester === 1 ? t.first : t.second}</span></div>
      <ul className="grid gap-3 lg:grid-cols-2">{unit.chapters.map(chapter => {
        const videoId = chapter.video?.youtubeId;
        const videoUrl = videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? `https://www.youtube.com/watch?v=${videoId}` : null;
        return <li key={chapter.id} className="student-svt-card flex min-w-0 flex-col rounded-lg border border-black bg-white p-4">
          <div className="flex items-start justify-between gap-3"><span className="student-svt-number flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FBE9E2] text-sm font-bold">{chapter.chapterNumber}</span><span className="text-xs font-semibold" dir="ltr">{chapter.durationMin} {t.minutes}</span></div>
          <h4 className="mt-3 text-base font-bold leading-7" lang={ar ? "ar" : "fr"}>{ar ? chapter.titleAr : chapter.titleFr}</h4>
          <p className="mt-1 text-sm leading-6" lang={ar ? "fr" : "ar"} dir={ar ? "ltr" : "rtl"}>{ar ? chapter.titleFr : chapter.titleAr}</p>
          <div className="mt-4"><p className="text-xs font-bold">{t.keywords}</p><ul className="mt-2 flex flex-wrap gap-1.5" lang="fr">{chapter.keywords.map(keyword => <li key={keyword} className="rounded border border-black px-2 py-1 text-xs">{keyword}</li>)}</ul></div>
          <NeuroTermExtractor courseTitle={chapter.titleFr} grade={grade.labelFr} courseSummaryOrText={`Notions clés du cours : ${chapter.keywords.join(", ")}.`} language={language} accountId={accountId} />
          {videoUrl && chapter.video && <div className="mt-auto border-t border-black pt-4"><p className="mt-4 flex items-center gap-2 text-xs"><Play size={16} aria-hidden="true" /><span lang="fr">{chapter.video.title} · {chapter.video.channel}</span></p><a href={videoUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#B9552F] bg-[#B9552F] px-4 py-2 text-sm font-bold text-white hover:bg-[#D9704F] hover:text-black">{t.video}<ExternalLink size={16} aria-hidden="true" /></a></div>}
        </li>;
      })}</ul>
    </section>)}
      {!units.length && <p role="status" className="rounded-lg border border-black p-5 text-sm">{t.noResults}</p>}
    </div>
    <p className="mt-5 text-xs leading-6">{t.note}</p>
  </section>;
}
