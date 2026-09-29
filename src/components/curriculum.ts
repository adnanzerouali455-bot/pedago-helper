import data from "./curriculum-data.json";
import { englishLessonTitle, englishLevelName, englishUnitName } from "./curriculum-english";
import chapters from "./svt-chapters.json";
import { englishChapterTitle, englishChapterUnit } from "./svt-chapters-english";

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
  unitId?: string;
  chapterId?: string;
  estimatedHours?: number;
  keyConcepts?: string[];
}

export const curriculum = data;
export const curriculumChapters = chapters;
const originalLessons: CurriculumLesson[] = data.cycles.flatMap(cycle =>
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
const originalByTitle = new Map(originalLessons.map(lesson => [`${lesson.levelId}:${lesson.semester}:${lesson.title_fr}`, lesson]));
const gradeIds: Record<string, string> = { "1AC": "1ac", "2AC": "2ac", "3AC": "3ac", TCS: "tcs", "2BAC_SVT": "2bac_svt" };
const additionalLessons: CurriculumLesson[] = chapters.flatMap(grade => {
  const levelId = gradeIds[grade.gradeId];
  const level = data.cycles.flatMap(cycle => cycle.levels).find(item => item.id === levelId);
  if (!level) throw new Error(`Unknown curriculum grade: ${grade.gradeId}`);
  const subjectId = `svt_${levelId === "2bac_svt" ? "2bac" : levelId}`;
  return grade.units.flatMap(unit => unit.chapters.flatMap(chapter => {
    const metadata = { unitId: unit.unitId, chapterId: chapter.id, estimatedHours: chapter.estimatedHours, keyConcepts: chapter.keyConcepts };
    const existing = originalByTitle.get(`${levelId}:${unit.semester}:${chapter.titleFr}`);
    if (existing && existing.subjectId === subjectId) {
      Object.assign(existing, metadata);
      return [];
    }
    return [{
      ...metadata,
      id: `svt_chapter_${chapter.id.toLowerCase().replaceAll("-", "_")}`,
      cycleId: grade.cycle,
      levelId,
      subjectId,
      subject: "svt" as const,
      schoolLevel: grade.cycle === "college" ? "middle" as const : "high" as const,
      semester: unit.semester,
      title_fr: chapter.titleFr,
      title_ar: chapter.titleAr,
      title_en: englishChapterTitle(chapter.id),
      level_fr: level.name_fr,
      level_ar: level.name_ar,
      level_en: englishLevelName(levelId),
      unit_fr: unit.titleFr,
      unit_ar: unit.titleAr,
      unit_en: englishChapterUnit(unit.unitId),
    }];
  }));
});
export const curriculumLessons: CurriculumLesson[] = [...originalLessons, ...additionalLessons];

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
