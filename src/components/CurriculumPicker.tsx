"use client";

import React, { useEffect, useId, useState } from "react";
import { curriculum, curriculumLessons, findCurriculumLesson, type CurriculumLanguage, type CurriculumLesson } from "./curriculum";
import { localizeText } from "./localization";

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
  const label = (fr: string, arText: string, en: string) => language === "ar" ? arText : language === "en" ? en : fr;
  const cycle = curriculum.cycles.find(item => item.id === cycleId)!;
  const level = cycle.levels.find(item => item.id === levelId)!;
  const subject = level.subjects.find(item => item.id === subjectId)!;
  const lessons = curriculumLessons.filter(item => item.levelId === levelId && item.subjectId === subjectId && item.semester === semester);
  const units = [...new Set(lessons.map(item => item.unit_fr))].map(unit => ({ label: lessons.find(item => item.unit_fr === unit)!, lessons: lessons.filter(item => item.unit_fr === unit) }));
  const chosen = findCurriculumLesson(lessonId);
  const title = (lesson: CurriculumLesson) => language === "ar" ? lesson.title_ar : language === "en" ? lesson.title_en : lesson.title_fr;
  const unitTitle = (lesson: CurriculumLesson) => language === "ar" ? lesson.unit_ar : language === "en" ? lesson.unit_en : lesson.unit_fr;
  useEffect(() => {
    const item = findCurriculumLesson(selectedId);
    if (item) {
      setCycleId(item.cycleId); setLevelId(item.levelId); setSubjectId(item.subjectId);
      setSemester(item.semester); setLessonId(item.id);
    } else setLessonId("");
  }, [selectedId]);

  return <details open className="rounded-lg border border-[var(--color-sand-border)] bg-[var(--color-parchment)] p-3">
    <summary className="cursor-pointer text-sm font-bold text-[var(--color-cypress)]">
      {label("Choisir dans le catalogue", "اختيار من دليل الدروس", "Choose from the curriculum")} · {curriculumLessons.length}
    </summary>
    <div className="mt-4 space-y-3">
      <div><label className="ph-label" htmlFor={`${id}-cycle`}>{label("Cycle", "السلك", "School stage")}</label>
        <select className="ph-input" id={`${id}-cycle`} value={cycleId} onChange={event => {
          const next = curriculum.cycles.find(item => item.id === event.target.value)!;
          const nextLevel = next.levels[0]; const nextSubject = nextLevel.subjects[0];
          setCycleId(next.id); setLevelId(nextLevel.id); setSubjectId(nextSubject.id);
          setSemester(nextSubject.semesters[0].semester); setLessonId("");
        }}>{curriculum.cycles.map(item => <option key={item.id} value={item.id}>{localizeText(item.name_fr, language)}</option>)}</select>
      </div>
      <div><label className="ph-label" htmlFor={`${id}-level`}>{label("Niveau et filière", "المستوى والمسلك", "Grade and track")}</label>
        <select className="ph-input" id={`${id}-level`} value={levelId} onChange={event => {
          const next = cycle.levels.find(item => item.id === event.target.value)!;
          setLevelId(next.id); setSubjectId(next.subjects[0].id);
          setSemester(next.subjects[0].semesters[0].semester); setLessonId("");
        }}>{cycle.levels.map(item => <option key={item.id} value={item.id}>{localizeText(item.name_fr, language)}</option>)}</select>
      </div>
      <div><label className="ph-label" htmlFor={`${id}-subject`}>{label("Matière du catalogue", "مادة الدليل", "Curriculum subject")}</label>
        <select className="ph-input" id={`${id}-subject`} value={subjectId} onChange={event => {
          const next = level.subjects.find(item => item.id === event.target.value)!;
          setSubjectId(next.id); setSemester(next.semesters[0].semester); setLessonId("");
        }}>{level.subjects.map(item => <option key={item.id} value={item.id}>{localizeText(item.name_fr, language)}</option>)}</select>
      </div>
      <div><label className="ph-label" htmlFor={`${id}-semester`}>{label("Semestre", "الدورة", "Semester")}</label>
        <select className="ph-input" id={`${id}-semester`} value={semester} onChange={event => { setSemester(Number(event.target.value)); setLessonId(""); }}>
          {subject.semesters.map(item => <option key={item.semester} value={item.semester}>{label("Semestre", "الدورة", "Semester")} {item.semester}</option>)}
        </select>
      </div>
      <div><label className="ph-label" htmlFor={`${id}-lesson`}>{label("Leçon du catalogue", "الدرس", "Curriculum lesson")}</label>
        <select className="ph-input" id={`${id}-lesson`} value={lessonId} onChange={event => setLessonId(event.target.value)}>
          <option value="">{label("Sélectionner une leçon", "اختر درسا", "Select a lesson")}</option>
          {units.map(unit => <optgroup key={unit.label.unit_fr} label={unitTitle(unit.label)}>{unit.lessons.map(item => <option key={item.id} value={item.id}>{title(item)}</option>)}</optgroup>)}
        </select>
      </div>
      {chosen && <p role="status" className="text-xs font-semibold leading-relaxed">{label("Unité", "الوحدة", "Unit")} : {unitTitle(chosen)}{chosen.estimatedHours ? <> · {chosen.estimatedHours} {label("heures prévues", "ساعات مقررة", "planned hours")}</> : null}</p>}
      <button type="button" className="ph-btn w-full !text-sm" disabled={!chosen} onClick={() => { if (chosen) onSelect(chosen); }}>{label("Utiliser ce cours", "استعمال هذا الدرس", "Use this lesson")}</button>
      <p className="ph-muted text-[11px] leading-relaxed">{label("Catalogue issu des données fournies. Seules les matières et les leçons présentes dans le fichier sont proposées.", "دليل مبني على المعطيات المقدمة. لا تتوفر إلا المواد والدروس الواردة في الملف.", "This curriculum uses the supplied data. Only subjects and lessons in that data are listed.")}</p>
    </div>
  </details>;
}
