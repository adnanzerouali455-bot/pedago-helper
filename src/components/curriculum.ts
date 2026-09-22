import data from "./curriculum-data.json";
import { englishLessonTitle, englishLevelName, englishUnitName } from "./curriculum-english";

export type CurriculumLanguage = "fr" | "ar" | "en";
export interface CurriculumLesson {
  id: string;
  cycleId: string;
  levelId: string;
  subjectId: string;
  subject: "svt" | "pc";
  schoolLevel: "middle" | "high";
  semester: number;
  title_fr: string;
  title_ar: string;
  title_en: string;
  level_fr: string;
  level_ar: string;
  level_en: string;
  unit_fr: string;
  unit_ar: string;
  unit_en: string;
}

export const curriculum = data;
export const curriculumLessons: CurriculumLesson[] = data.cycles.flatMap(cycle =>
  cycle.levels.flatMap(level => level.subjects.flatMap(subject =>
    subject.semesters.flatMap(semester => semester.lessons.map(lesson => ({
      ...lesson,
      title_en: englishLessonTitle(lesson.id),
      cycleId: cycle.id,
      levelId: level.id,
      subjectId: subject.id,
      subject: subject.id.startsWith("pc_") ? "pc" as const : "svt" as const,
      schoolLevel: cycle.id === "college" ? "middle" as const : "high" as const,
      semester: semester.semester,
      level_fr: level.name_fr,
      level_ar: level.name_ar,
      level_en: englishLevelName(level.id),
      unit_fr: semester.unit_title_fr,
      unit_ar: semester.unit_title_ar,
      unit_en: englishUnitName(semester.unit_title_fr),
    }))),
  )),
);

export function findCurriculumLesson(id?: string): CurriculumLesson | undefined {
  return curriculumLessons.find(lesson => lesson.id === id);
}

export function curriculumCompetency(lesson: CurriculumLesson, language: CurriculumLanguage): string {
  return language === "en"
    ? `Use concepts from “${lesson.title_en}” to analyze a document and justify an answer with relevant evidence.`
    : language === "ar"
    ? `توظيف مفاهيم درس «${lesson.title_ar}» لتحليل وثيقة وتعليل جواب باستعمال شواهد مناسبة.`
    : `Mobiliser les notions du cours « ${lesson.title_fr} » pour analyser un document et justifier une réponse à l'aide d'indices pertinents.`;
}
