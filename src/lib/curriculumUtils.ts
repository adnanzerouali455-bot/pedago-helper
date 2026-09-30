import { svtMoroccoCurriculum } from "../data/svtMoroccoCurriculum";
import type { Chapter, Grade, Unit } from "../types/curriculum";

const grades = svtMoroccoCurriculum.flatMap(cycle => cycle.grades);
const chapters = grades.flatMap(grade => grade.units.flatMap(unit => unit.chapters));
const chaptersById = new Map(chapters.map(chapter => [chapter.id, chapter]));

export function getGradesByCycle(cycleId: string): Grade[] {
  return svtMoroccoCurriculum.find(cycle => cycle.id === cycleId)?.grades ?? [];
}

export function getUnitsByGrade(gradeId: string): Unit[] {
  return grades.find(grade => grade.id === gradeId)?.units ?? [];
}

export function getChapterById(chapterId: string): Chapter | undefined {
  return chaptersById.get(chapterId);
}

export function getGradeByChapterId(chapterId: string): Grade | undefined {
  return grades.find(grade => grade.units.some(unit => unit.chapters.some(chapter => chapter.id === chapterId)));
}

function normalized(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}

export function searchChapters(query: string): Chapter[] {
  const needle = normalized(query.trim());
  if (!needle) return chapters;
  return chapters.filter(chapter => normalized([chapter.titleFr, chapter.titleAr, ...chapter.keywords].join(" ")).includes(needle));
}
