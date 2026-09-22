import { curriculumLessons, curriculumCompetency } from "./curriculum";
type Language = "fr" | "ar";
const pairs: [string, string][] = [
  ["3ème AC · Groupe 1", "الثالثة إعدادي · المجموعة 1"],
  ["3ème AC · Groupe 2", "الثالثة إعدادي · المجموعة 2"],
  ["Tronc Commun Scientifique", "الجذع المشترك العلمي"],
  ["1ère Bac · Sciences expérimentales", "الأولى بكالوريا · العلوم التجريبية"],
  ["2ème Bac · SVT", "الثانية بكالوريا · علوم الحياة والأرض"],
  ["Labo SVT", "مختبر علوم الحياة والأرض"],
  ["La digestion et l'absorption", "الهضم والامتصاص"],
  ["La circulation sanguine", "الدورة الدموية"],
  ["Les facteurs écologiques", "العوامل البيئية"],
  ["La production de matière organique", "إنتاج المادة العضوية"],
  ["L'expression de l'information génétique", "تعبير الخبر الوراثي"],
  ["Exploiter des documents et argumenter une explication scientifique.", "استثمار وثائق وتعليل تفسير علمي."],
  ["Prévoir un schéma muet et une version de lecture simplifiée pour le travail en binômes.", "توفير رسم صامت ونسخة قراءة مبسطة للعمل في ثنائيات."],
  ...curriculumLessons.flatMap(entry => [
    [entry.title_fr, entry.title_ar] as [string, string],
    [entry.level_fr, entry.level_ar] as [string, string],
    [curriculumCompetency(entry, "fr"), curriculumCompetency(entry, "ar")] as [string, string],
  ]),
];
export function localizeText(value: string, language: Language): string {
  const pair = pairs.find(pair => pair.includes(value));
  if (pair) return pair[language === "ar" ? 1 : 0];
  const room = /^(?:Salle|القاعة) (\d+)$/.exec(value);
  return room ? `${language === "ar" ? "القاعة" : "Salle"} ${room[1]}` : value;
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
