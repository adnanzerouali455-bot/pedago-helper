import { curriculumLessons, curriculumCompetency } from "./curriculum";
import { englishCycleNames, englishSubjectNames } from "./curriculum-english";
import { curriculum } from "./curriculum";
export type Language = "fr" | "ar" | "en";
export type Translation = readonly [string, string, string];
export const languageIndex = (language: Language) => language === "fr" ? 0 : language === "ar" ? 1 : 2;
export const languageName = (option: Language, language: Language) => ({
  fr: ["Français", "الفرنسية", "French"],
  ar: ["Arabe", "العربية", "Arabic"],
  en: ["Anglais", "الإنجليزية", "English"],
})[option][languageIndex(language)];
const pairs: Translation[] = [
  ["3ème AC · Groupe 1", "الثالثة إعدادي · المجموعة 1", "3rd year Middle School · Group 1"],
  ["3ème AC · Groupe 2", "الثالثة إعدادي · المجموعة 2", "3rd year Middle School · Group 2"],
  ["Tronc Commun Scientifique", "الجذع المشترك العلمي", "Common Scientific Core"],
  ["1ère Bac · Sciences expérimentales", "الأولى بكالوريا · العلوم التجريبية", "1st year Baccalaureate · Experimental Sciences"],
  ["2ème Bac · SVT", "الثانية بكالوريا · علوم الحياة والأرض", "2nd year Baccalaureate · Life and Earth Sciences"],
  ["Labo SVT", "مختبر علوم الحياة والأرض", "Life and Earth Sciences Lab"],
  ["La digestion et l'absorption", "الهضم والامتصاص", "Digestion and absorption"],
  ["La circulation sanguine", "الدورة الدموية", "Blood circulation"],
  ["Les facteurs écologiques", "العوامل البيئية", "Ecological factors"],
  ["La production de matière organique", "إنتاج المادة العضوية", "Organic matter production"],
  ["L'expression de l'information génétique", "تعبير الخبر الوراثي", "Gene expression"],
  ["Exploiter des documents et argumenter une explication scientifique.", "استثمار وثائق وتعليل تفسير علمي.", "Use documents and evidence to support a scientific explanation."],
  ["Prévoir un schéma muet et une version de lecture simplifiée pour le travail en binômes.", "توفير رسم صامت ونسخة قراءة مبسطة للعمل في ثنائيات.", "Provide an unlabeled diagram and a simplified reading text for pair work."],
  ["La photosynthèse : comment les plantes se nourrissent", "التركيب الضوئي: كيف تتغذى النباتات؟", "Photosynthesis: how plants make food"],
  ["Comparer des fractions", "مقارنة الكسور", "Comparing fractions"],
  ["Lire un texte informatif sur l'économie de l'eau", "قراءة نص إخباري حول ترشيد الماء", "Reading an informational text about saving water"],
  ["Expliquer le cycle de l'eau", "تفسير دورة الماء", "Explaining the water cycle"],
  ["Les trois états de la matière", "الحالات الثلاث للمادة", "The three states of matter"],
  ...curriculum.cycles.flatMap(cycle => [
    [cycle.name_fr, cycle.name_ar, englishCycleNames[cycle.id]] as Translation,
    ...cycle.levels.flatMap(level => [
      [level.name_fr, level.name_ar, curriculumLessons.find(entry => entry.levelId === level.id)?.level_en ?? ""] as Translation,
      ...level.subjects.map(subject => [subject.name_fr, subject.name_ar, englishSubjectNames[subject.id.startsWith('pc_') ? 'pc' : 'svt']] as Translation),
      ...level.subjects.flatMap(subject => subject.semesters.map(semester => [semester.unit_title_fr, semester.unit_title_ar, curriculumLessons.find(entry => entry.levelId === level.id && entry.subjectId === subject.id && entry.semester === semester.semester)?.unit_en ?? ""] as Translation)),
    ]),
  ]),
  ...curriculumLessons.flatMap(entry => [
    [entry.title_fr, entry.title_ar, entry.title_en] as Translation,
    [curriculumCompetency(entry, "fr"), curriculumCompetency(entry, "ar"), curriculumCompetency(entry, "en")] as Translation,
  ]),
];
export function localizeText(value: string, language: Language): string {
  const pair = pairs.find(pair => pair.includes(value));
  if (pair) return pair[languageIndex(language)];
  const room = /^(?:Salle|القاعة|Room) (\d+)$/.exec(value);
  return room ? `${language === "ar" ? "القاعة" : language === "en" ? "Room" : "Salle"} ${room[1]}` : value;
}
/** Translate only an unchanged built-in field; teacher-authored text stays intact. */
export function translateMatching<T>(value: T, from: unknown, to: unknown): T {
  if (typeof value === "string") return (value === from && typeof to === "string" ? to : value) as T;
  if (Array.isArray(value)) return value.map((item, i) => translateMatching(item, Array.isArray(from) ? from[i] : undefined, Array.isArray(to) ? to[i] : undefined)) as T;
  if (value && typeof value === "object") {
    const a = from && typeof from === "object" ? from as Record<string, unknown> : {};
    const b = to && typeof to === "object" ? to as Record<string, unknown> : {};
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateMatching(item, a[key], b[key])])) as T;
  }
  return value;
}
