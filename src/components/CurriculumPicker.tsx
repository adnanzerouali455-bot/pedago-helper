"use client";

import React, { useEffect, useId, useState } from "react";
import { curriculum, curriculumLessons, findCurriculumLesson, type CurriculumLanguage, type CurriculumLesson } from "./curriculum";

export default function CurriculumPicker({ language, selectedId, onSelect }: {
  language: CurriculumLanguage;
  selectedId?: string;
  onSelect: (lesson: CurriculumLesson) => void;
}) {
  const initial = findCurriculumLesson(selectedId);
  const [cycleId, setCycleId] = useState(initial?.cycleId ?? "college");
  const [levelId, setLevelId] = useState(initial?.levelId ?? "1ac");
  const [subjectId, setSubjectId] = useState(initial?.subjectId ?? "svt_1ac");
  const [semester, setSemester] = useState(initial?.semester ?? 1);
  const [lessonId, setLessonId] = useState(initial?.id ?? "");
  const id = useId();
  const ar = language === "ar";
  const name = ar ? "name_ar" : "name_fr";
  const title = ar ? "title_ar" : "title_fr";
  const cycle = curriculum.cycles.find(item => item.id === cycleId)!;
  const level = cycle.levels.find(item => item.id === levelId)!;
  const subject = level.subjects.find(item => item.id === subjectId)!;
  const term = subject.semesters.find(item => item.semester === semester)!;
  const chosen = findCurriculumLesson(lessonId);
  useEffect(() => {
    const item = findCurriculumLesson(selectedId);
    if (item) {
      setCycleId(item.cycleId); setLevelId(item.levelId); setSubjectId(item.subjectId);
      setSemester(item.semester); setLessonId(item.id);
    } else setLessonId("");
  }, [selectedId]);

  return <details open className="rounded-lg border border-[var(--color-sand-border)] bg-[var(--color-parchment)] p-3">
    <summary className="cursor-pointer text-sm font-bold text-[var(--color-cypress)]">
      {ar ? "اختيار من دليل الدروس" : "Choisir dans le catalogue"} · {curriculumLessons.length}
    </summary>
    <div className="mt-4 space-y-3">
      <div><label className="ph-label" htmlFor={`${id}-cycle`}>{ar ? "السلك" : "Cycle"}</label>
        <select className="ph-input" id={`${id}-cycle`} value={cycleId} onChange={event => {
          const next = curriculum.cycles.find(item => item.id === event.target.value)!;
          const nextLevel = next.levels[0]; const nextSubject = nextLevel.subjects[0];
          setCycleId(next.id); setLevelId(nextLevel.id); setSubjectId(nextSubject.id);
          setSemester(nextSubject.semesters[0].semester); setLessonId("");
        }}>{curriculum.cycles.map(item => <option key={item.id} value={item.id}>{item[name]}</option>)}</select>
      </div>
      <div><label className="ph-label" htmlFor={`${id}-level`}>{ar ? "المستوى والمسلك" : "Niveau et filière"}</label>
        <select className="ph-input" id={`${id}-level`} value={levelId} onChange={event => {
          const next = cycle.levels.find(item => item.id === event.target.value)!;
          setLevelId(next.id); setSubjectId(next.subjects[0].id);
          setSemester(next.subjects[0].semesters[0].semester); setLessonId("");
        }}>{cycle.levels.map(item => <option key={item.id} value={item.id}>{item[name]}</option>)}</select>
      </div>
      <div><label className="ph-label" htmlFor={`${id}-subject`}>{ar ? "مادة الدليل" : "Matière du catalogue"}</label>
        <select className="ph-input" id={`${id}-subject`} value={subjectId} onChange={event => {
          const next = level.subjects.find(item => item.id === event.target.value)!;
          setSubjectId(next.id); setSemester(next.semesters[0].semester); setLessonId("");
        }}>{level.subjects.map(item => <option key={item.id} value={item.id}>{item[name]}</option>)}</select>
      </div>
      <div><label className="ph-label" htmlFor={`${id}-semester`}>{ar ? "الدورة" : "Semestre"}</label>
        <select className="ph-input" id={`${id}-semester`} value={semester} onChange={event => { setSemester(Number(event.target.value)); setLessonId(""); }}>
          {subject.semesters.map(item => <option key={item.semester} value={item.semester}>{ar ? "الدورة" : "Semestre"} {item.semester}</option>)}
        </select>
      </div>
      <p className="text-xs font-semibold leading-relaxed">{ar ? "الوحدة" : "Unité"} : {ar ? term.unit_title_ar : term.unit_title_fr}</p>
      <div><label className="ph-label" htmlFor={`${id}-lesson`}>{ar ? "الدرس" : "Leçon du catalogue"}</label>
        <select className="ph-input" id={`${id}-lesson`} value={lessonId} onChange={event => setLessonId(event.target.value)}>
          <option value="">{ar ? "اختر درسا" : "Sélectionner une leçon"}</option>
          {term.lessons.map(item => <option key={item.id} value={item.id}>{item[title]}</option>)}
        </select>
      </div>
      <button type="button" className="ph-btn w-full !text-sm" disabled={!chosen} onClick={() => { if (chosen) onSelect(chosen); }}>{ar ? "استعمال هذا الدرس" : "Utiliser ce cours"}</button>
      <p className="ph-muted text-[11px] leading-relaxed">{ar ? "دليل مبني على المعطيات المقدمة. لا تتوفر إلا المواد والدروس الواردة في الملف." : "Catalogue issu des données fournies. Seules les matières et les leçons présentes dans le fichier sont proposées."}</p>
    </div>
  </details>;
}
