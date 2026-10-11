"use client";
import { localizeText, translateMatching, languageIndex, languageName } from "./localization";
import { englishModels } from "./english-models";
import { lessonEnglishCopy } from "./english-copy";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CurriculumPicker from "./CurriculumPicker";
import CurriculumNavigation from "./CurriculumNavigation";
import { findCurriculumLesson, curriculumCompetency } from "./curriculum";
import { getChapterById, getGradeByChapterId } from "../lib/curriculumUtils";
import { readAccountDocument, writeAccountDocument } from "../utils/supabase/documents";

export type Language = "fr" | "ar" | "en";
export type Subject = "svt" | "pc" | "math" | "arabic" | "french";
export type SchoolLevel = "primary" | "middle" | "high";
export type ReadingLevel = 1 | 2 | 3;
export interface LessonInput {
  language: Language;
  subject: Subject;
  schoolLevel: SchoolLevel;
  title: string;
  competency: string;
  duration: number;
  sourceText: string;
  curriculumLessonId?: string;
  svtChapterId?: string;
  className?: string;
  room?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
}
export interface DidacticPhase {
  minutes: number;
  situation: string;
  learner: string;
  teacher: string;
  evidence: string;
}
export interface ReadingMaterial {
  text: string;
  glossary: { term: string; definition: string }[];
  questions: [string, string, string];
}
export interface LessonDocument {
  id: string;
  input: LessonInput;
  phases: [DidacticPhase, DidacticPhase, DidacticPhase, DidacticPhase];
  obstacles: { obstacle: string; remediation: string }[];
  readings: Record<ReadingLevel, ReadingMaterial>;
  savedAt?: string;
}
export interface LessonPlanStudioProps {
  embedded?: boolean;
  active?: boolean;
  uiLanguage?: Language;
  onLanguageChange?: (language: Language) => void;
  initialLanguage?: Language;
  initialLesson?: Partial<Omit<LessonInput, "language">>;
  initialDocument?: LessonDocument;
  storageKey?: string;
  accountId?: string;
  /** Optional server-side generation adapter. Keep provider credentials on your server. */
  generateLesson?: (input: LessonInput, signal: AbortSignal) => Promise<LessonDocument>;
}

type Pair = readonly [string, string, string?];
type Unit = {
  title: Pair;
  competency: Pair;
  situations: [Pair, Pair, Pair, Pair];
  evidence: Pair;
  texts: [Pair, Pair, Pair];
  glossary: { term: Pair; definition: Pair }[];
  questions: [Pair, Pair, Pair];
  obstacle: Pair;
  remediation: Pair;
};
const pick = (pair: Pair, language: Language) => pair[languageIndex(language)] ?? pair[0];
const SUBJECTS: Record<Subject, Pair> = {
  svt: ["SVT · Sciences de la vie et de la Terre", "علوم الحياة والأرض", "Life and Earth Sciences"],
  pc: ["Physique-Chimie", "الفيزياء والكيمياء", "Physics and Chemistry"],
  math: ["Mathématiques", "الرياضيات", "Mathematics"],
  arabic: ["Langue arabe", "اللغة العربية", "Arabic"],
  french: ["Langue française", "اللغة الفرنسية", "French"],
};
const SCHOOLS: Record<SchoolLevel, Pair> = {
  primary: ["Primaire", "الابتدائي", "Primary school"], middle: ["Collège", "الإعدادي", "Middle school"], high: ["Lycée", "الثانوي التأهيلي", "High school"],
};
const PHASE_NAMES: Pair[] = [
  ["Action / Dévolution", "وضعية الفعل والانطلاق", "Action / Devolution"],
  ["Formulation", "وضعية الصياغة", "Formulation"],
  ["Validation", "وضعية التحقق والتقاسم", "Validation"],
  ["Institutionnalisation", "وضعية المأسسة والتركيب", "Institutionalization"],
];
const COLORS = ["var(--color-terracotta)", "var(--color-cypress)", "var(--color-amber-alert)", "var(--color-ink-charcoal)"];
function planningUnit(title: Pair, competency: Pair): Unit {
  return {
    title, competency,
    situations: [
      [`Préparer un document ou une observation portant sur « ${title[0]} ». Formuler une question-problème et recueillir les premières hypothèses individuelles. Préciser la consigne avant la séance.`, `إعداد وثيقة أو ملاحظة حول «${title[1]}». صياغة سؤال إشكالي وجمع الفرضيات الفردية الأولية. تدقيق التعليمة قبل الحصة.`, `Prepare a document or observation about “${title[2]}”. Pose a problem question and collect individual hypotheses. Clarify the task before the lesson.`],
      ["Faire confronter les hypothèses en groupes. Demander une formulation écrite commune et les indices à rechercher dans les supports choisis.", "مقارنة الفرضيات داخل المجموعات وصياغة مقترح مكتوب مشترك وتحديد الشواهد المراد البحث عنها في الوسائل المختارة.", "Compare hypotheses in groups. Ask for a shared written explanation and identify evidence to look for in the chosen materials."],
      ["Comparer les propositions aux données d'un document ou d'une expérience adaptée et sûre. Définir les critères de validation et faire justifier les corrections.", "مقارنة المقترحات بمعطيات وثيقة أو تجربة ملائمة وآمنة. تحديد معايير التحقق وتعليل التصحيحات.", "Compare proposals with evidence from a suitable, safe document or experiment. Define validation criteria and ask students to justify revisions."],
      ["Rédiger avec les élèves la synthèse disciplinaire, puis préciser les définitions et leurs limites. Préparer une tâche de transfert ciblée avant la séance.", "بناء خلاصة مع المتعلمين وتدقيق التعاريف وحدود استعمالها. إعداد مهمة تطبيقية ملائمة قبل الحصة.", "Build a subject-specific summary with students, clarify definitions and their limits, and prepare a focused transfer task."],
    ],
    evidence: ["Une synthèse et une justification fondées sur les supports effectivement étudiés.", "خلاصة وتعليل يستندان إلى الوثائق المدروسة فعليا.", "A summary and justification based on the materials actually studied."],
    texts: [["", ""], ["", ""], ["", ""]], glossary: [],
    questions: [
      [`Quelle idée du document aide à comprendre « ${title[0]} » ?`, `ما الفكرة التي تساعد على فهم «${title[1]}» في الوثيقة؟`, `Which idea in the document helps explain “${title[2]}”?`],
      ["Quels indices soutiennent votre explication ?", "ما الشواهد التي تدعم تفسيرك؟", "What evidence supports your explanation?"],
      ["Quelle observation supplémentaire permettrait de vérifier votre réponse ?", "ما الملاحظة الإضافية التي تسمح بالتحقق من جوابك؟", "What further observation could help test your answer?"],
    ],
    obstacle: ["Piste à confirmer : confondre une observation avec l'explication que l'on en propose. Recueillir les conceptions des élèves pour identifier l'obstacle propre à ce cours.", "مسار للتحقق: الخلط بين الملاحظة وتفسيرها. جمع تصورات المتعلمين لتحديد العائق الخاص بهذا الدرس.", "Possible obstacle to confirm: confusing an observation with its explanation. Collect students’ ideas to identify the obstacle relevant to this lesson."],
    remediation: ["Faire distinguer, sur le support choisi, les observations, les hypothèses et les preuves ; demander une nouvelle justification après confrontation.", "تمييز الملاحظات والفرضيات والأدلة على الوثيقة المختارة، ثم طلب تعليل جديد بعد المناقشة.", "On the chosen material, distinguish observations, hypotheses and evidence, then ask for a revised justification after discussion."],
  };
}
function unitForInput(input: LessonInput): Unit {
  const chapter = getChapterById(input.svtChapterId ?? "");
  if (chapter) return planningUnit(
    [chapter.titleFr, chapter.titleAr, chapter.titleFr],
    [`Analyser des documents relatifs à « ${chapter.titleFr} » et justifier une explication scientifique.`, `تحليل وثائق حول «${chapter.titleAr}» وتعليل تفسير علمي.`, `Analyze evidence about “${chapter.titleFr}” and justify a scientific explanation.`],
  );
  const entry = findCurriculumLesson(input.curriculumLessonId);
  return entry ? planningUnit([entry.title_fr, entry.title_ar, entry.title_en], [curriculumCompetency(entry, "fr"), curriculumCompetency(entry, "ar"), curriculumCompetency(entry, "en")]) : UNITS[input.subject];
}
const BASE_UNITS: Record<Subject, Unit> = {
  pc: planningUnit(["Les trois états de la matière", "الحالات الثلاث للمادة"], ["Distinguer les états solide, liquide et gazeux à partir d'observations.", "تمييز الحالات الصلبة والسائلة والغازية انطلاقا من ملاحظات."]),
  svt: {
    title: ["La photosynthèse : comment les plantes se nourrissent", "التركيب الضوئي: كيف تتغذى النباتات؟"],
    competency: ["Expliquer, à partir de données expérimentales, le rôle de la lumière dans la production de matière organique par une plante verte.", "تفسير دور الضوء في إنتاج المادة العضوية لدى النبات الأخضر انطلاقا من معطيات تجريبية."],
    situations: [
      ["Deux feuilles comparables d'une même plante sont étudiées : l'une a reçu de la lumière, l'autre a été masquée. Prévoir laquelle contiendra de l'amidon et proposer une explication.", "نقارن ورقتين متماثلتين من نبتة واحدة: تعرضت الأولى للضوء وحُجبت الثانية عنه. توقع أيهما تحتوي على النشا واقترح تفسيرا."],
      ["Par groupes, représenter les besoins supposés de la plante par un schéma légendé. Distinguer ce qui est observé de ce qui est supposé.", "في مجموعات، نمثل حاجيات النبات المفترضة برسم معنون. نميز بين الملاحظة والفرضية."],
      ["Examiner un tableau de résultats fourni : après une période initiale à l'obscurité et une exposition contrôlée, seule la zone éclairée se colore au test à l'iode. Discuter les variables contrôlées et les limites de cette preuve.", "نفحص جدولا للنتائج: بعد فترة أولية في الظلام وتعريض مضبوط للضوء، تتلون المنطقة المضاءة فقط باختبار اليود. نناقش المتغيرات المضبوطة وحدود هذا الدليل."],
      ["Construire la trace écrite : à la lumière, les organes chlorophylliens utilisent l'eau et le dioxyde de carbone pour produire de la matière organique et libérer du dioxygène. La plante réalise aussi la respiration.", "نبني خلاصة: تستعمل الأعضاء اليخضورية الماء وثنائي أكسيد الكربون بوجود الضوء لإنتاج المادة العضوية وتحرير ثنائي الأكسجين. ويقوم النبات أيضا بالتنفس."],
    ],
    evidence: ["Un schéma avec des flèches d'entrée et de sortie, accompagné d'une justification fondée sur les résultats.", "رسم يوضح المدخلات والمخرجات مع تعليل يستند إلى النتائج."],
    texts: [
      ["Une plante verte a besoin d'eau. Elle reçoit aussi la lumière du Soleil. Ses feuilles prennent du dioxyde de carbone dans l'air. Avec la lumière, elles fabriquent des sucres. Elles libèrent du dioxygène. Ce travail s'appelle la photosynthèse. Les racines absorbent l'eau et les sels minéraux du sol. La plante respire aussi, le jour et la nuit.", "يحتاج النبات الأخضر إلى الماء. ويتلقى ضوء الشمس. تأخذ أوراقه ثنائي أكسيد الكربون من الهواء. وبوجود الضوء تصنع السكريات. وتحرر ثنائي الأكسجين. تسمى هذه العملية التركيب الضوئي. تمتص الجذور الماء والأملاح المعدنية من التربة. ويتنفس النبات نهارا وليلا."],
      ["Les racines absorbent l'eau et les sels minéraux, tandis que les feuilles prélèvent le dioxyde de carbone de l'air. Grâce à l'énergie lumineuse, les organes verts produisent des sucres : c'est la photosynthèse. Du dioxygène est alors libéré. Une partie des sucres peut être stockée sous forme d'amidon. Ainsi, un test à l'iode peut mettre en évidence ce stockage. Toutefois, l'absence d'amidon ne suffit pas, à elle seule, à expliquer toutes les causes possibles. La plante réalise également la respiration, de jour comme de nuit.", "تمتص الجذور الماء والأملاح المعدنية، بينما تأخذ الأوراق ثنائي أكسيد الكربون من الهواء. وبفضل الطاقة الضوئية، تنتج الأعضاء الخضراء السكريات: وهذا هو التركيب الضوئي. ويتحرر ثنائي الأكسجين خلال هذه العملية. يمكن تخزين جزء من السكريات على شكل نشا. لذلك يسمح اختبار اليود بالكشف عن هذا المخزون. لكن غياب النشا وحده لا يفسر جميع الأسباب الممكنة. ويقوم النبات أيضا بالتنفس نهارا وليلا."],
      ["La photosynthèse convertit l'énergie lumineuse en énergie chimique dans les organes chlorophylliens. Dans les chloroplastes, cette activité permet la synthèse de matière organique à partir d'eau et de dioxyde de carbone, avec libération de dioxygène. Les sels minéraux sont indispensables au fonctionnement et à la croissance de la plante, mais ne constituent pas sa source de carbone organique. Une fraction des produits photosynthétiques peut être accumulée sous forme d'amidon. Sa détection par l'iode constitue donc un indicateur indirect, dont l'interprétation exige des témoins et le contrôle des variables. Photosynthèse et respiration coexistent : leurs bilans gazeux doivent être distingués.", "يحول التركيب الضوئي الطاقة الضوئية إلى طاقة كيميائية داخل الأعضاء اليخضورية. وتسمح هذه العملية داخل البلاستيدات الخضراء بتركيب المادة العضوية انطلاقا من الماء وثنائي أكسيد الكربون، مع تحرير ثنائي الأكسجين. تعد الأملاح المعدنية ضرورية لوظائف النبات ونموه، لكنها لا تمثل مصدر الكربون العضوي. وقد يتراكم جزء من نواتج التركيب الضوئي على شكل نشا. لذا يعد الكشف عنه باليود مؤشرا غير مباشر، يتطلب تفسيره وجود شواهد وضبط المتغيرات. ويتزامن التركيب الضوئي مع التنفس، لذلك يجب التمييز بين حصيلتيهما الغازيتين."],
    ],
    glossary: [
      { term: ["photosynthèse", "التركيب الضوئي"], definition: ["Production de matière organique grâce à la lumière, à partir d'eau et de dioxyde de carbone.", "إنتاج المادة العضوية بفضل الضوء انطلاقا من الماء وثنائي أكسيد الكربون."] },
      { term: ["amidon", "النشا"], definition: ["Glucide de réserve formé d'un assemblage de nombreuses unités de glucose.", "مادة سكرية ادخارية تتكون من وحدات عديدة من الغلوكوز."] },
      { term: ["chloroplastes", "البلاستيدات الخضراء"], definition: ["Structures des cellules végétales contenant la chlorophylle, où se déroule la photosynthèse.", "بنيات داخل الخلايا النباتية تحتوي على اليخضور ويحدث فيها التركيب الضوئي."] },
    ],
    questions: [
      ["Quels éléments la plante utilise-t-elle pour fabriquer des sucres ?", "ما العناصر التي يستعملها النبات لصنع السكريات؟"],
      ["Pourquoi comparer une zone éclairée à une zone masquée de la même plante ?", "لماذا نقارن منطقة مضاءة بأخرى محجوبة من النبات نفسه؟"],
      ["Un élève affirme que la plante ne respire que la nuit. Comment lui répondre à partir du texte ?", "يقول متعلم إن النبات يتنفس ليلا فقط. كيف ترد عليه انطلاقا من النص؟"],
    ],
    obstacle: ["Confondre les sels minéraux absorbés dans le sol avec la matière organique fabriquée par la plante.", "الخلط بين الأملاح المعدنية الممتصة من التربة والمادة العضوية التي يصنعها النبات."],
    remediation: ["Faire classer des cartes « prélevé dans le milieu » et « produit par la plante », puis reconstruire le schéma des échanges.", "تصنيف بطاقات ضمن «يؤخذ من الوسط» و«ينتجه النبات»، ثم إعادة بناء رسم المبادلات."],
  },
  math: {
    title: ["Comparer des fractions", "مقارنة الكسور"],
    competency: ["Comparer deux fractions positives en justifiant une représentation ou une mise au même dénominateur.", "مقارنة كسرين موجبين باستعمال تمثيل أو توحيد المقامات مع التعليل."],
    situations: [
      ["Deux élèves partagent des galettes de même taille : l'un reçoit 3/4, l'autre 2/3. Qui reçoit la plus grande part ? Chercher sans règle fournie.", "يتقاسم متعلمان فطيرتين متساويتين: يحصل الأول على 3/4 والثاني على 2/3. من يحصل على الحصة الأكبر؟ نبحث دون تقديم قاعدة جاهزة."],
      ["En binômes, dessiner les parts et expliquer la stratégie à un autre groupe. Vérifier que les unités sont de même taille.", "نرسم الحصص في ثنائيات ونشرح الاستراتيجية لمجموعة أخرى. نتحقق من تساوي الوحدات."],
      ["Confronter les représentations : 3/4 = 9/12 et 2/3 = 8/12. Tester une affirmation erronée : « un plus grand dénominateur donne toujours une plus grande fraction ».", "نقارن التمثيلات: 3/4 = 9/12 و2/3 = 8/12. نختبر العبارة الخاطئة: «كلما كبر المقام كبر الكسر»."],
      ["Formaliser : à dénominateurs égaux et positifs, comparer les numérateurs. Pour changer le dénominateur sans changer la valeur, multiplier numérateur et dénominateur par le même nombre non nul.", "نصوغ القاعدة: عند تساوي المقامات الموجبة نقارن البسوط. ولتغيير المقام دون تغيير قيمة الكسر، نضرب البسط والمقام في العدد غير المنعدم نفسه."],
    ],
    evidence: ["Une comparaison correcte de 3/4 et 2/3 avec une justification, puis un transfert à 5/6 et 3/4.", "مقارنة صحيحة بين 3/4 و2/3 مع التعليل، ثم تطبيق على 5/6 و3/4."],
    texts: [
      ["Une fraction représente une part d'une unité. Le dénominateur indique le nombre de parts égales. Le numérateur indique combien de parts on prend. Pour comparer des parts, on utilise la même unité. Trois quarts valent neuf douzièmes. Deux tiers valent huit douzièmes. Donc trois quarts sont plus grands que deux tiers.", "يمثل الكسر حصة من وحدة. يحدد المقام عدد الأجزاء المتساوية. ويحدد البسط عدد الأجزاء المأخوذة. نستعمل الوحدة نفسها عند المقارنة. ثلاثة أرباع تساوي تسعة أجزاء من اثني عشر. وثلثان يساويان ثمانية أجزاء من اثني عشر. إذن ثلاثة أرباع أكبر من ثلثين."],
      ["Pour comparer deux fractions, il faut d'abord se référer à une même unité. Lorsque les dénominateurs sont différents, on peut chercher des fractions équivalentes. Ainsi, 3/4 devient 9/12 en multipliant les deux nombres par 3, tandis que 2/3 devient 8/12 en les multipliant par 4. Les parts ont alors la même taille. On compare donc les numérateurs : 9 étant supérieur à 8, on obtient 3/4 > 2/3.", "لمقارنة كسرين، يجب أولا اعتماد الوحدة نفسها. وعندما يختلف المقامان، يمكن البحث عن كسرين متكافئين. هكذا تصبح 3/4 مساوية لـ9/12 بضرب البسط والمقام في 3، بينما تصبح 2/3 مساوية لـ8/12 بضربهما في 4. عندئذ تكون الأجزاء متساوية. لذلك نقارن البسطين: بما أن 9 أكبر من 8، فإن 3/4 أكبر من 2/3."],
      ["La comparaison de fractions positives repose sur la conservation de leur valeur lors du passage à une écriture équivalente. Multiplier le numérateur et le dénominateur par un même nombre non nul conserve le quotient. Un dénominateur commun permet alors d'exprimer les quantités à l'aide de parts de même grandeur. Par exemple, 3/4 = 9/12 et 2/3 = 8/12, d'où 3/4 > 2/3. Le plus petit commun multiple peut limiter la taille des nombres manipulés, mais tout multiple commun convient. Une représentation sur une droite graduée permet de contrôler le résultat.", "تعتمد مقارنة الكسور الموجبة على الحفاظ على القيمة عند الانتقال إلى كتابة مكافئة. فضرب البسط والمقام في العدد غير المنعدم نفسه يحافظ على خارج القسمة. ويسمح المقام المشترك بالتعبير عن الكميات بأجزاء متساوية المقدار. مثلا، 3/4 = 9/12 و2/3 = 8/12، ومنه 3/4 أكبر من 2/3. ويمكن للمضاعف المشترك الأصغر أن يبسط الأعداد المستعملة، لكن أي مضاعف مشترك مناسب. ويسمح التمثيل على مستقيم مدرج بالتحقق من النتيجة."],
    ],
    glossary: [
      { term: ["dénominateur", "المقام"], definition: ["Nombre sous la barre de fraction ; dans un partage, il indique le nombre de parts égales.", "العدد أسفل خط الكسر، ويحدد في وضعية التقسيم عدد الأجزاء المتساوية."] },
      { term: ["numérateur", "البسط"], definition: ["Nombre au-dessus de la barre de fraction indiquant le nombre de parts considérées.", "العدد فوق خط الكسر ويحدد عدد الأجزاء المأخوذة."] },
      { term: ["fractions équivalentes", "كسرين متكافئين"], definition: ["Fractions qui désignent le même nombre malgré des écritures différentes.", "كسران يمثلان العدد نفسه رغم اختلاف كتابتيهما."] },
    ],
    questions: [["Pourquoi faut-il des unités de même taille ?", "لماذا يجب أن تكون الوحدات متساوية؟"], ["Comment justifier que 3/4 est supérieur à 2/3 ?", "كيف تبرر أن 3/4 أكبر من 2/3؟"], ["Est-il vrai qu'un dénominateur plus grand signifie toujours une fraction plus grande ? Donner un contre-exemple.", "هل يعني المقام الأكبر دائما كسرا أكبر؟ قدم مثالا مضادا."]],
    obstacle: ["Comparer les dénominateurs comme des nombres entiers en oubliant la taille des parts.", "مقارنة المقامات كأعداد صحيحة مع إغفال حجم الأجزاء."],
    remediation: ["Superposer des bandes de même longueur partagées en deux puis en quatre ; verbaliser la différence entre nombre et taille des parts.", "مطابقة شريطين متساويين مقسمين إلى نصفين وإلى أرباع، ثم شرح الفرق بين عدد الأجزاء وحجمها."],
  },
  arabic: {
    title: ["Lire un texte informatif sur l'économie de l'eau", "قراءة نص إخباري حول ترشيد الماء"],
    competency: ["Identifier l'idée principale, distinguer fait et recommandation, puis justifier une proposition avec un indice du texte.", "تحديد الفكرة الأساسية والتمييز بين المعلومة والتوصية وتعليل اقتراح بشاهد من النص."],
    situations: [
      ["Présenter deux titres pour un texte sur l'eau. Lire individuellement et choisir celui qui traduit le mieux son idée principale.", "نعرض عنوانين لنص عن الماء. نقرأ فرديا ونختار العنوان الأقرب إلى فكرته الأساسية."],
      ["Comparer les titres choisis en groupes ; relever les mots qui expriment un fait ou un conseil.", "نقارن العناوين المختارة في مجموعات ونستخرج الكلمات التي تعبر عن معلومة أو نصيحة."],
      ["Débattre des choix en citant une phrase précise. Vérifier si chaque proposition découle vraiment des informations données.", "نناقش الاختيارات بالاستشهاد بجملة محددة، ونتحقق من استناد كل اقتراح إلى المعطيات الواردة."],
      ["Formaliser une méthode : repérer le sujet, relier les informations, formuler l'idée principale, puis justifier son interprétation par un indice textuel.", "نصوغ منهجية: تحديد الموضوع وربط المعلومات وصياغة الفكرة الأساسية ثم تعليل الفهم بشاهد نصي."],
    ],
    evidence: ["Un titre pertinent, un fait identifié et une recommandation justifiée par le texte.", "عنوان مناسب ومعلومة محددة وتوصية معللة انطلاقا من النص."],
    texts: [
      ["L'eau est nécessaire à la vie. Nous utilisons l'eau pour boire et nous laver. Un robinet qui fuit gaspille de l'eau. Il faut signaler la fuite à un adulte. Fermer le robinet pendant le brossage des dents réduit le gaspillage. Chacun peut agir à la maison et à l'école.", "الماء ضروري للحياة. نستعمل الماء للشرب والنظافة. يهدر الصنبور المتسرب الماء. يجب إخبار شخص راشد بالتسرب. يقلل إغلاق الصنبور أثناء تنظيف الأسنان من الهدر. يستطيع كل فرد المساهمة في البيت والمدرسة."],
      ["L'eau est indispensable à la vie et à l'hygiène. Pourtant, certaines habitudes entraînent un gaspillage évitable. Par exemple, un robinet qui fuit laisse partir de l'eau sans usage utile. Il faut donc signaler la fuite afin qu'elle soit réparée. De même, fermer le robinet pendant le brossage des dents limite les pertes. Ces gestes ne remplacent pas la gestion collective des ressources, mais ils y contribuent.", "الماء ضروري للحياة والنظافة. لكن بعض العادات تؤدي إلى هدر يمكن تجنبه. فمثلا، يسمح الصنبور المتسرب بضياع الماء دون استعمال مفيد. لذلك يجب الإبلاغ عن التسرب لإصلاحه. كما أن إغلاق الصنبور أثناء تنظيف الأسنان يحد من الضياع. ولا تعوض هذه السلوكات التدبير الجماعي للموارد، لكنها تسهم فيه."],
      ["La préservation des ressources en eau associe des comportements individuels et une gestion collective des réseaux. Une fuite constitue une perte matérielle mesurable ; recommander sa réparation relève d'une proposition d'action fondée sur ce constat. Le lecteur d'un texte informatif doit distinguer les faits observables des recommandations. Ainsi, réduire le gaspillage domestique est utile, mais l'évaluation d'une politique de l'eau exige aussi des données sur les usages, les infrastructures et la disponibilité de la ressource.", "يجمع الحفاظ على الموارد المائية بين السلوكات الفردية والتدبير الجماعي للشبكات. ويمثل التسرب ضياعا ماديا قابلا للقياس، بينما تعد الدعوة إلى إصلاحه توصية عملية تستند إلى هذه الملاحظة. وعلى قارئ النص الإخباري أن يميز بين الوقائع القابلة للملاحظة والتوصيات. لذلك فإن الحد من الهدر المنزلي مفيد، لكن تقييم سياسة مائية يتطلب أيضا معطيات حول الاستعمالات والبنيات المتاحة ووفرة المورد."],
    ],
    glossary: [
      { term: ["gaspillage", "الهدر"], definition: ["Utilisation ou perte d'une ressource sans bénéfice utile.", "استعمال مورد أو ضياعه دون فائدة مفيدة."] },
      { term: ["recommandations", "التوصيات"], definition: ["Propositions de comportements ou d'actions jugés utiles.", "اقتراحات لسلوكات أو أعمال تعد مفيدة."] },
      { term: ["ressources", "الموارد"], definition: ["Moyens disponibles pour répondre à des besoins.", "إمكانات متاحة لتلبية الحاجات."] },
    ],
    questions: [["Quel est le sujet principal du texte ?", "ما الموضوع الأساسي للنص؟"], ["Quelle différence y a-t-il entre constater une fuite et conseiller sa réparation ?", "ما الفرق بين ملاحظة تسرب والدعوة إلى إصلاحه؟"], ["Quelle action proposer à l'école, et quel indice du texte la justifie ?", "ما الإجراء الذي تقترحه في المدرسة، وما الشاهد الذي يبرره من النص؟"]],
    obstacle: ["Confondre une information vérifiable et un conseil donné par l'auteur.", "الخلط بين معلومة قابلة للتحقق ونصيحة يقدمها الكاتب."],
    remediation: ["Surligner avec deux couleurs les constats et les conseils ; demander comment vérifier chaque constat.", "تلوين الوقائع والنصائح بلونين مختلفين، وطلب طريقة للتحقق من كل واقعة."],
  },
  french: {
    title: ["Expliquer le cycle de l'eau", "تفسير دورة الماء"],
    competency: ["Organiser une explication en utilisant les connecteurs de succession et de cause.", "تنظيم تفسير باستعمال روابط التتابع والسببية."],
    situations: [
      ["Présenter quatre images du cycle de l'eau dans le désordre. Proposer individuellement un ordre et une explication.", "نعرض أربع صور لدورة الماء بترتيب مبعثر. نقترح فرديا ترتيبا وتفسيرا."],
      ["En groupes, rédiger une courte explication avec « d'abord », « puis », « parce que » et « enfin ».", "نكتب في مجموعات تفسيرا قصيرا باستعمال «أولا» و«ثم» و«لأن» و«أخيرا»."],
      ["Échanger les productions et vérifier si chaque connecteur exprime une succession ou une cause. Justifier les corrections à l'aide des images.", "نتبادل الإنتاجات ونتحقق مما إذا كان كل رابط يفيد التتابع أو السبب. نعلل التصحيحات بالاستناد إلى الصور."],
      ["Distinguer les connecteurs temporels des connecteurs causaux. Construire un paragraphe modèle dont les liens sont explicites.", "نميز روابط الزمن من روابط السبب ونبني فقرة نموذجية ذات علاقات واضحة."],
    ],
    evidence: ["Un paragraphe cohérent qui emploie correctement deux connecteurs de succession et un connecteur de cause.", "فقرة منسجمة تستعمل رابطين للتتابع ورابطا للسبب استعمالا صحيحا."],
    texts: [
      ["Le Soleil chauffe l'eau. Une partie de l'eau devient de la vapeur. C'est l'évaporation. La vapeur monte et peut se refroidir. Elle forme alors de petites gouttes. C'est la condensation. Ces gouttes participent à la formation des nuages. L'eau retombe sous forme de pluie. Elle rejoint le sol et les cours d'eau.", "تسخن الشمس الماء. يتحول جزء من الماء إلى بخار. هذا هو التبخر. يصعد البخار وقد يبرد. عندئذ يشكل قطرات صغيرة. هذا هو التكاثف. تسهم القطرات في تكون السحب. يعود الماء على شكل مطر. ويصل إلى التربة والمجاري المائية."],
      ["D'abord, l'énergie du Soleil favorise l'évaporation de l'eau. La vapeur se mélange à l'air. Puis, lorsque l'air humide se refroidit suffisamment, une partie de la vapeur se condense en fines gouttelettes. Des nuages peuvent ainsi se former. Lorsque les gouttes deviennent assez grosses, elles tombent sous forme de précipitations. Enfin, l'eau s'infiltre dans le sol ou ruisselle vers les cours d'eau. Le cycle se poursuit parce que l'énergie solaire et la gravité mettent l'eau en mouvement.", "أولا، تساعد الطاقة الشمسية على تبخر الماء. يمتزج البخار بالهواء. ثم عندما يبرد الهواء الرطب بما يكفي، يتكاثف جزء من البخار إلى قطيرات دقيقة. وهكذا يمكن أن تتكون السحب. وعندما تكبر القطرات بما يكفي، تسقط على شكل تساقطات. أخيرا، يتسرب الماء إلى التربة أو يجري نحو المجاري المائية. وتستمر الدورة لأن الطاقة الشمسية والجاذبية تحركان الماء."],
      ["Le cycle hydrologique relie plusieurs réservoirs : océans, atmosphère, sols et eaux continentales. L'évaporation et la transpiration végétale transfèrent de l'eau vers l'atmosphère. Lorsque les conditions de refroidissement le permettent, la condensation contribue à la formation des nuages. Les précipitations alimentent ensuite le ruissellement et l'infiltration. Dans une explication, « ensuite » marque une succession, tandis que « parce que » introduit une cause. Un texte rigoureux ne confond donc pas l'ordre de présentation des étapes avec les mécanismes qui les provoquent.", "تربط الدورة الهيدرولوجية بين خزانات متعددة: المحيطات والغلاف الجوي والتربة والمياه القارية. وينقل التبخر ونتح النباتات الماء إلى الغلاف الجوي. وعندما تسمح ظروف التبريد بذلك، يسهم التكاثف في تكون السحب. وتغذي التساقطات بعد ذلك الجريان والتسرب. في النص التفسيري، تدل «بعد ذلك» على التتابع، بينما تقدم «لأن» سببا. لذلك لا يخلط النص الدقيق بين ترتيب عرض المراحل والآليات التي تحدثها."],
    ],
    glossary: [
      { term: ["évaporation", "التبخر"], definition: ["Passage de l'eau liquide à l'état de vapeur.", "انتقال الماء من الحالة السائلة إلى بخار."] },
      { term: ["condensation", "التكاثف"], definition: ["Passage de la vapeur d'eau à l'état liquide.", "انتقال بخار الماء إلى الحالة السائلة."] },
      { term: ["connecteurs", "روابط"], definition: ["Mots ou expressions qui rendent explicites les relations entre les idées.", "كلمات أو عبارات توضح العلاقات بين الأفكار."] },
    ],
    questions: [["Que devient une partie de l'eau chauffée par le Soleil ?", "إلى ماذا يتحول جزء من الماء الذي تسخنه الشمس؟"], ["Quel lien exprime « puis » ? Quel lien exprime « parce que » ?", "ما العلاقة التي تفيدها «ثم»؟ وما العلاقة التي تفيدها «لأن»؟"], ["Peut-on remplacer tous les connecteurs de succession par « parce que » ? Justifier.", "هل يمكن تعويض جميع روابط التتابع بكلمة «لأن»؟ علل جوابك."]],
    obstacle: ["Employer un connecteur de cause pour exprimer une simple succession.", "استعمال رابط سببي للتعبير عن مجرد تتابع."],
    remediation: ["Comparer deux phrases identiques avec « puis » et « parce que » ; faire expliciter ce qui change dans le sens.", "مقارنة جملتين باستعمال «ثم» و«لأن»، وتوضيح أثر التغيير في المعنى."],
  },
};

function withEnglish(base: Unit, english: (typeof englishModels)[keyof typeof englishModels]): Unit {
  const add = (pair: Pair, value: string): Pair => [pair[0], pair[1], value];
  return {
    title: add(base.title, english.title), competency: add(base.competency, english.competency),
    situations: base.situations.map((pair, i) => add(pair, english.situations[i])) as Unit["situations"],
    evidence: add(base.evidence, english.evidence),
    texts: base.texts.map((pair, i) => add(pair, english.texts[i])) as Unit["texts"],
    glossary: base.glossary.map((entry, i) => ({ term: add(entry.term, english.glossary[i].term), definition: add(entry.definition, english.glossary[i].definition) })),
    questions: base.questions.map((pair, i) => add(pair, english.questions[i])) as Unit["questions"],
    obstacle: add(base.obstacle, english.obstacle), remediation: add(base.remediation, english.remediation),
  };
}
const UNITS: Record<Subject, Unit> = {
  svt: withEnglish(BASE_UNITS.svt, englishModels.svt),
  math: withEnglish(BASE_UNITS.math, englishModels.math),
  arabic: withEnglish(BASE_UNITS.arabic, englishModels.arabic),
  french: withEnglish(BASE_UNITS.french, englishModels.french),
  pc: planningUnit(["Les trois états de la matière", "الحالات الثلاث للمادة", "The three states of matter"], ["Distinguer les états solide, liquide et gazeux à partir d'observations.", "تمييز الحالات الصلبة والسائلة والغازية انطلاقا من ملاحظات.", "Distinguish solids, liquids and gases using observations."]),
};

const COPY = {
  fr: {
    brand: "Pedago Helper", subtitle: "L'espace des enseignants", studio: "Studio pédagogique", heading: "Moins de préparation.\nPlus de transmission.", intro: "Une séance structurée, des textes accessibles et du temps pour vos élèves.",
    local: "Bibliothèque locale", connected: "Génération connectée", settings: "Préparer ma séance", settingsHint: "Définissez le cadre de votre prochain cours.", subject: "Matière", school: "Niveau scolaire", title: "Titre de la leçon", competency: "Compétence visée", duration: "Durée totale", language: "Langue du document", generate: "Générer la séance", generating: "Préparation…", source: "Votre texte à adapter", sourceHint: "Facultatif · 12 000 caractères maximum", sourceInfo: "Adaptation locale limitée : aération des phrases et aide lexicale, sans réécriture sémantique. Les nuances et la difficulté doivent être vérifiées. Pour réécrire un sujet libre, connectez votre service avec generateLesson.", library: "Charger l'exemple de cette matière", demo: "Mode local : 4 leçons modèles, une par matière. Un titre personnalisé ne change pas le contenu scientifique du modèle. Relisez et adaptez la proposition avant usage.",
    plan: "Ma fiche pédagogique", phases: "Les 4 phases didactiques", phaseHint: "Cadre inspiré de Guy Brousseau · contenu modifiable", minutes: "min", allocated: "minutes réparties", remaining: "à répartir", over: "en trop", balanced: "Temps équilibré", rebalance: "Rééquilibrer", situation: "Situation / tâche", learner: "Activité des apprenants", teacher: "Rôle de l'enseignant", evidence: "Trace / indicateur de réussite", obstacles: "Anticiper les difficultés", obstacle: "Obstacle attendu", remediation: "Piste de remédiation", textStudio: "Le même sujet, à leur rythme.", textHint: "Choisissez un niveau de lecture, indépendamment du niveau scolaire.", reading: "Studio de lecture", levels: ["Débutant", "Intermédiaire", "Avancé"], levelHints: ["Phrases courtes · vocabulaire accessible", "Connecteurs explicites · progression claire", "Vocabulaire disciplinaire · concepts approfondis"], glossary: "Les mots pour comprendre", glossaryHint: "Touchez un terme pour afficher sa définition.", questions: "Comprendre & prendre du recul", edit: "Modifier le texte", done: "Terminer", words: "mots", save: "Enregistrer", print: "Imprimer / PDF", saved: "Séances enregistrées", empty: "Vos séances enregistrées apparaîtront ici.", load: "Ouvrir", remove: "Supprimer", restore: "Annuler la suppression", saveOk: "Séance enregistrée sur cet appareil.", storageError: "Sauvegarde indisponible : le stockage du navigateur est bloqué ou plein. Exportez votre fiche en PDF.", damaged: "Des données locales invalides ont été ignorées. Les séances valides restent disponibles.", generateError: "Impossible de générer la séance. Votre document précédent est conservé. Réessayez.", invalid: "Renseignez un titre, une compétence et une durée entière de 20 à 240 minutes.", timeError: "Chaque phase doit durer au moins une minute, et leur somme doit correspondre à la durée totale.", stale: "Les paramètres ont changé. Générez la séance pour les appliquer avant l'enregistrement ou l'export.", savedHint: "Stockage local à ce navigateur · sans synchronisation", review: "Proposition pédagogique à relire · aucune homologation institutionnelle revendiquée", sheet: "Fiche pédagogique", date: "Enregistrée le", close: "Fermer", untitled: "Sans titre", teacherName: "Enseignant(e) :", className: "Classe :", sessionDate: "Date :", deleteOk: "Séance supprimée.", loadOk: "Séance chargée.", limit: "La bibliothèque contient 30 séances. Supprimez-en une avant d'en ajouter une nouvelle.", dirty: "Modifications non enregistrées", ready: "Prête à personnaliser", printError: "L'impression n'a pas pu démarrer. Utilisez la commande d'impression de votre navigateur.",
  },
  en: lessonEnglishCopy,
  ar: {
    brand: "المساعد البيداغوجي", subtitle: "فضاء الأستاذات والأساتذة", studio: "الاستوديو البيداغوجي", heading: "وقت أقل للتحضير.\nمساحة أكبر للتعليم.", intro: "حصة منظمة ونصوص ملائمة ووقت أكثر لمواكبة المتعلمين.",
    local: "مكتبة محلية", connected: "توليد متصل", settings: "إعداد حصتي", settingsHint: "حدد إطار الدرس القادم.", subject: "المادة", school: "المستوى الدراسي", title: "عنوان الدرس", competency: "الكفاية المستهدفة", duration: "المدة الإجمالية", language: "لغة الوثيقة", generate: "توليد الحصة", generating: "جار الإعداد…", source: "نصك المراد تكييفه", sourceHint: "اختياري · 12000 حرف كحد أقصى", sourceInfo: "تكييف محلي محدود: فصل الجمل ودعم المفردات، دون إعادة صياغة دلالية. يجب مراجعة المعنى ومستوى الصعوبة. إعادة صياغة نص حر تتطلب خدمة توليد متصلة.", library: "تحميل نموذج هذه المادة", demo: "الوضع المحلي: أربعة دروس نموذجية، درس لكل مادة. لا يغير العنوان المخصص المحتوى العلمي للنموذج. راجع المقترح وعدله قبل استعماله.",
    plan: "جذاذتي البيداغوجية", phases: "المراحل الديداكتيكية الأربع", phaseHint: "إطار مستلهم من غي بروسو · محتوى قابل للتعديل", minutes: "د", allocated: "دقيقة موزعة", remaining: "دقيقة متبقية", over: "دقيقة زائدة", balanced: "توزيع زمني متوازن", rebalance: "إعادة التوزيع", situation: "الوضعية / المهمة", learner: "نشاط المتعلمين", teacher: "دور الأستاذ", evidence: "الأثر / مؤشر النجاح", obstacles: "استباق صعوبات التعلم", obstacle: "العائق المتوقع", remediation: "خطة المعالجة", textStudio: "الموضوع نفسه، بإيقاعهم.", textHint: "اختر مستوى القراءة بشكل مستقل عن المستوى الدراسي.", reading: "استوديو القراءة", levels: ["مبتدئ", "متوسط", "متقدم"], levelHints: ["جمل قصيرة · مفردات ميسرة", "روابط واضحة · تدرج منطقي", "معجم تخصصي · مفاهيم معمقة"], glossary: "مفردات للفهم", glossaryHint: "اضغط على المصطلح لعرض تعريفه.", questions: "الفهم والتفكير النقدي", edit: "تعديل النص", done: "تم", words: "كلمة", save: "حفظ الدرس", print: "طباعة / PDF", saved: "الدروس المحفوظة", empty: "ستظهر دروسك المحفوظة هنا.", load: "فتح", remove: "حذف", restore: "تراجع عن الحذف", saveOk: "تم حفظ الدرس على هذا الجهاز.", storageError: "تعذر الحفظ: تخزين المتصفح محظور أو ممتلئ. صدّر الجذاذة بصيغة PDF.", damaged: "تم تجاهل بيانات محلية غير صالحة. ما تزال الدروس السليمة متاحة.", generateError: "تعذر توليد الحصة. تم الاحتفاظ بالوثيقة السابقة. حاول مجددا.", invalid: "أدخل عنوانا وكفاية ومدة صحيحة بين 20 و240 دقيقة.", timeError: "يجب أن تدوم كل مرحلة دقيقة على الأقل وأن يساوي مجموع المدد الزمن الإجمالي.", stale: "تغيرت الإعدادات. ولّد الحصة لتطبيقها قبل الحفظ أو التصدير.", savedHint: "حفظ محلي في هذا المتصفح · دون مزامنة", review: "مقترح بيداغوجي للمراجعة · لا يمثل اعتمادا مؤسساتيا", sheet: "جذاذة بيداغوجية", date: "تاريخ الحفظ", close: "إغلاق", untitled: "دون عنوان", teacherName: "الأستاذ(ة):", className: "القسم:", sessionDate: "التاريخ:", deleteOk: "تم حذف الدرس.", loadOk: "تم تحميل الدرس.", limit: "تحتوي المكتبة على 30 درسا. احذف درسا قبل إضافة درس جديد.", dirty: "تعديلات غير محفوظة", ready: "جاهزة للتخصيص", printError: "تعذر بدء الطباعة. استعمل أمر الطباعة في المتصفح.",
  },
};

function uid() { return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}`; }
export function allocateMinutes(total: number, weights = [25, 25, 30, 20]): number[] {
  const safe = weights.map(n => Number.isFinite(n) && n > 0 ? n : 1);
  const sum = safe.reduce((a, b) => a + b, 0);
  const raw = safe.map(n => n / sum * Math.max(0, total - 4));
  const result = raw.map(n => Math.floor(n) + 1);
  let remaining = total - result.reduce((a, b) => a + b, 0);
  const order = raw.map((n, i) => ({ i, fraction: n % 1 })).sort((a, b) => b.fraction - a.fraction);
  for (const entry of order) { if (remaining-- > 0) result[entry.i]++; }
  return result;
}
export function initialInput(language: Language, subject: Subject = "svt"): LessonInput {
  return { language, subject, schoolLevel: "middle", title: pick(UNITS[subject].title, language), competency: pick(UNITS[subject].competency, language), duration: 55, sourceText: "" };
}
function localReading(input: LessonInput, level: ReadingLevel): ReadingMaterial {
  const unit = unitForInput(input);
  const glossary = unit.glossary.map(entry => ({ term: pick(entry.term, input.language), definition: pick(entry.definition, input.language) }));
  if (!input.sourceText.trim()) return { text: pick(unit.texts[level - 1], input.language), glossary, questions: unit.questions.map(q => pick(q, input.language)) as ReadingMaterial["questions"] };
  const original = input.sourceText.trim();
  const sentences = typeof Intl.Segmenter === "function" ? Array.from(new Intl.Segmenter(input.language, { granularity: "sentence" }).segment(original), part => part.segment.trim()).filter(Boolean) : original.split(/(?<=[.!?؟。])\s+/u);
  const text = level === 1 ? sentences.join("\n\n") : level === 2 ? original : `${original}${glossary.some(g => input.sourceText.toLocaleLowerCase().includes(g.term.toLocaleLowerCase())) ? "\n\n" + glossary.filter(g => input.sourceText.toLocaleLowerCase().includes(g.term.toLocaleLowerCase())).map(g => `${g.term} : ${g.definition}`).join("\n") : ""}`;
  return { text, glossary: glossary.filter(g => input.sourceText.toLocaleLowerCase().includes(g.term.toLocaleLowerCase())), questions: input.language === "en" ? ["What is the main idea? Quote evidence from the text.", "How are two ideas in the text connected? Explain your answer.", "Which claim needs more evidence? Suggest how to check it."] : input.language === "ar" ? ["ما الفكرة الأساسية للنص؟ استشهد بعبارة منه.", "ما العلاقة بين فكرتين في النص؟ وضح جوابك.", "ما الادعاء الذي يحتاج إلى دليل إضافي؟ اقترح طريقة للتحقق منه."] : ["Quelle est l'idée principale ? Citez un indice du texte.", "Quel lien unit deux idées du texte ? Expliquez votre réponse.", "Quelle affirmation mérite une preuve supplémentaire ? Comment la vérifier ?"] };
}
export function createLocalLesson(input: LessonInput): LessonDocument {
  const unit = unitForInput(input);
  const lang = input.language;
  const durations = allocateMinutes(input.duration);
  const scaffold: Record<SchoolLevel, Pair> = {
    primary: ["Utiliser des images, du matériel concret et une restitution orale brève.", "استعمال صور ووسائل ملموسة وتقديم شفهي موجز.", "Use pictures, concrete materials and a short oral response."],
    middle: ["S'appuyer sur un document guidé et une justification écrite courte.", "الاعتماد على وثيقة موجهة وتعليل كتابي قصير.", "Use a guided document and a short written explanation."],
    high: ["Demander une justification autonome, une analyse des limites et un transfert.", "طلب تعليل مستقل وتحليل الحدود واستثمار التعلم في وضعية أخرى.", "Ask for an independent justification, discussion of limitations and transfer to a new task."],
  };
  const learners: Pair[] = [["Chercher individuellement, faire une proposition et garder une trace de l'essai.", "البحث الفردي واقتراح حل والاحتفاظ بأثر المحاولة."], ["Mettre les stratégies en mots, écouter les pairs et construire une production commune.", "التعبير عن الاستراتيجيات والإنصات للزملاء وبناء إنتاج مشترك."], ["Comparer les propositions, argumenter avec des indices et réviser une réponse si nécessaire.", "مقارنة المقترحات والتعليل بالشواهد ومراجعة الجواب عند الحاجة."], ["Reformuler la synthèse et réaliser une courte tâche de transfert.", "إعادة صياغة الخلاصة وإنجاز مهمة تطبيقية قصيرة."]];
  const teachers: Pair[] = [["Confier le problème sans livrer la procédure ; observer et relancer par des questions ouvertes.", "إسناد المشكلة دون تقديم الطريقة، والملاحظة والدعم بأسئلة مفتوحة."], ["Organiser les échanges, distribuer les rôles et demander de préciser les formulations.", "تنظيم التبادل وتوزيع الأدوار وطلب تدقيق الصياغات."], ["Faire expliciter les critères ; demander des preuves et garantir un débat respectueux.", "توضيح المعايير وطلب الأدلة وضمان نقاش يحترم الجميع."], ["Nommer le savoir, fixer sa portée et ses conditions d'emploi ; vérifier la compréhension.", "تسمية المعرفة وتحديد مجالها وشروط استعمالها والتحقق من الفهم."]];
  const englishLearners = ["Explore individually, propose an answer and keep a record of the attempt.", "Explain strategies, listen to peers and produce a shared response.", "Compare proposals, argue from evidence and revise the answer if needed.", "Restate the summary and complete a short transfer task."];
  const englishTeachers = ["Present the problem without giving the procedure; observe and prompt with open questions.", "Organize discussion, assign roles and ask for clearer formulations.", "Make criteria explicit, request evidence and ensure respectful debate.", "Name the established knowledge, clarify its scope and check understanding."];
  const englishEvidence = ["An individual hypothesis with an initial reason.", "A group product that makes the strategy clear.", "A supported argument and a revised proposal after discussion."];
  const evidence: Pair[] = [["Une hypothèse individuelle accompagnée d'une première justification.", "فرضية فردية مرفقة بتعليل أولي."], ["Une production collective qui rend la stratégie explicite.", "إنتاج جماعي يوضح الاستراتيجية."], ["Un argument étayé et une proposition corrigée après confrontation.", "حجة مدعمة ومقترح منقح بعد المناقشة."], unit.evidence];
  return { id: uid(), input: { ...input }, phases: unit.situations.map((s, i) => ({ minutes: durations[i], situation: pick(s, lang), learner: `${lang === "en" ? englishLearners[i] : pick(learners[i], lang)} ${pick(scaffold[input.schoolLevel], lang)}`, teacher: lang === "en" ? englishTeachers[i] : pick(teachers[i], lang), evidence: lang === "en" && i < 3 ? englishEvidence[i] : pick(evidence[i], lang) })) as LessonDocument["phases"], obstacles: [{ obstacle: pick(unit.obstacle, lang), remediation: pick(unit.remediation, lang) }, { obstacle: pick(["La difficulté du lexique peut masquer une compréhension du concept.", "قد تحجب صعوبة المعجم فهم المفهوم.", "Unfamiliar terms may hide an understanding of the concept."], lang), remediation: pick(["Proposer la version de lecture accessible, expliciter les mots clés et autoriser une première réponse orale.", "اقتراح نسخة القراءة الميسرة وشرح الكلمات الأساسية والسماح بجواب شفهي أولي.", "Offer an accessible reading version, explain key terms and allow an initial spoken answer."], lang) }], readings: { 1: localReading(input, 1), 2: localReading(input, 2), 3: localReading(input, 3) } };
}
export function localizeLessonInput(input: LessonInput, language: Language): LessonInput {
  const unit = unitForInput(input);
  const translated = (value: string, pair: Pair) => pair.includes(value) ? pick(pair, language) : localizeText(value, language);
  return { ...input, language, title: translated(input.title, unit.title), competency: translated(input.competency, unit.competency),
    ...(input.className !== undefined ? { className: localizeText(input.className, language) } : {}),
    ...(input.room !== undefined ? { room: localizeText(input.room, language) } : {}) };
}
export function localizeLesson(lesson: LessonDocument, language: Language): LessonDocument {
  if (lesson.input.language === language) return lesson;
  const input = localizeLessonInput(lesson.input, language);
  const before = createLocalLesson(lesson.input), after = createLocalLesson(input);
  return { ...translateMatching(lesson, before, after), id: lesson.id, input, savedAt: lesson.savedAt };
}
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown, max = 20000): v is string => typeof v === "string" && v.length <= max;
export function isLessonDocument(value: unknown): value is LessonDocument {
  if (!isRecord(value) || !isText(value.id, 200) || !value.id || !isRecord(value.input)) return false;
  const i = value.input;
  if (!(i.language === "ar" || i.language === "fr" || i.language === "en") || !["svt", "pc", "math", "arabic", "french"].includes(String(i.subject)) || !["primary", "middle", "high"].includes(String(i.schoolLevel)) || !isText(i.title, 240) || !i.title.trim() || !isText(i.competency, 2000) || !i.competency.trim() || !isText(i.sourceText, 12000) || typeof i.duration !== "number" || !Number.isInteger(i.duration) || i.duration < 20 || i.duration > 240) return false;
  if (i.curriculumLessonId !== undefined) {
    if (!isText(i.curriculumLessonId, 120)) return false;
    const entry = findCurriculumLesson(i.curriculumLessonId);
    if (!entry || entry.subject !== i.subject || entry.schoolLevel !== i.schoolLevel) return false;
  }
  if (i.svtChapterId !== undefined) {
    if (!isText(i.svtChapterId, 120) || i.subject !== "svt") return false;
    const grade = getGradeByChapterId(i.svtChapterId);
    if (!grade || i.schoolLevel !== (grade.cycleId === "college" ? "middle" : "high")) return false;
  }
  if (["className", "room", "scheduledDate", "startTime", "endTime"].some(key => i[key] !== undefined && !isText(i[key], 240))) return false;
  if (!Array.isArray(value.phases) || value.phases.length !== 4 || !value.phases.every(p => isRecord(p) && typeof p.minutes === "number" && Number.isInteger(p.minutes) && p.minutes >= 0 && p.minutes <= 240 && ["situation", "learner", "teacher", "evidence"].every(k => isText(p[k], 6000)))) return false;
  if (!Array.isArray(value.obstacles) || value.obstacles.length < 1 || value.obstacles.length > 10 || !value.obstacles.every(o => isRecord(o) && isText(o.obstacle, 6000) && isText(o.remediation, 6000))) return false;
  if (!isRecord(value.readings)) return false;
  for (const level of ["1", "2", "3"]) {
    const r = value.readings[level];
    if (!isRecord(r) || !isText(r.text, 30000) || !Array.isArray(r.glossary) || r.glossary.length > 50 || !r.glossary.every(g => isRecord(g) && isText(g.term, 200) && g.term.trim() && isText(g.definition, 2000)) || !Array.isArray(r.questions) || r.questions.length !== 3 || !r.questions.every(q => isText(q, 2000))) return false;
  }
  return value.savedAt === undefined || (isText(value.savedAt, 60) && Number.isFinite(Date.parse(value.savedAt)));
}
function sameInput(a: LessonInput, b: LessonInput) { return (Object.keys(a) as (keyof LessonInput)[]).every(key => a[key] === b[key]) && Object.keys(a).length === Object.keys(b).length; }
function inputIsValid(input: LessonInput) { return input.title.trim().length > 0 && input.competency.trim().length > 0 && Number.isInteger(input.duration) && input.duration >= 20 && input.duration <= 240; }
function Icon({ name, size = 20 }: { name: "book" | "spark" | "save" | "print" | "clock" | "arrow" | "check" | "leaf"; size?: number }) {
  const paths = { book: "M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4V4Zm16 0h-4a3 3 0 0 0-3 3m0 14a4 4 0 0 1 4-2h3V4Z", spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z", save: "M5 3h12l4 4v14H3V3h2Zm2 0v7h10V3M7 21v-7h10v7", print: "M7 8V3h10v5M7 17H3V9h18v8h-4M7 14h10v7H7v-7Z", clock: "M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z", arrow: "M4 12h16m-6-6 6 6-6 6", check: "m5 12 4 4L19 6", leaf: "M20 4C9 2 2 8 5 15s15 4 15-11ZM5 20l9-11" };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
function TextField({ label, value, onChange, rows = 3, maxLength = 6000 }: { label: string; value: string; onChange: (value: string) => void; rows?: number; maxLength?: number }) {
  const id = useId();
  return <div><label htmlFor={id} className="ph-label">{label}</label><textarea id={id} className="ph-input ph-editable" value={value} onChange={e => onChange(e.target.value)} rows={rows} maxLength={maxLength} /></div>;
}
function Glossary({ entries, language }: { entries: ReadingMaterial["glossary"]; language: Language }) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { const handler = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(null); }; document.addEventListener("pointerdown", handler); return () => document.removeEventListener("pointerdown", handler); }, []);
  return <div ref={root} className="flex flex-wrap gap-2" onKeyDown={e => { if (e.key === "Escape") { root.current?.querySelector<HTMLButtonElement>(`[aria-expanded="true"]`)?.focus(); setOpen(null); } }}>
    {entries.map((entry, i) => <div key={`${entry.term}-${i}`} className="relative"><button type="button" className="ph-term" aria-expanded={open === i} aria-controls={`${id}-${i}`} onClick={() => setOpen(open === i ? null : i)}>{entry.term}<span aria-hidden="true"> +</span></button>{open === i && <div id={`${id}-${i}`} className="ph-definition" role="region" aria-label={entry.term}><strong>{entry.term}</strong><p>{entry.definition}</p><button type="button" className="ph-link" onClick={() => { setOpen(null); root.current?.querySelectorAll<HTMLButtonElement>(".ph-term")[i]?.focus(); }}>{COPY[language].close}</button></div>}</div>)}
  </div>;
}
function PrintSheet({ lesson, level }: { lesson: LessonDocument; level: ReadingLevel }) {
  const t = COPY[lesson.input.language]; const lang = lesson.input.language; const reading = lesson.readings[level];
  const catalogEntry = findCurriculumLesson(lesson.input.curriculumLessonId);
  const svtGrade = getGradeByChapterId(lesson.input.svtChapterId ?? "");
  return <article className={`ph-print-sheet ph-font-${lang}`} lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
    <header><p>{t.brand}</p><h1>{t.sheet}</h1><h2>{lesson.input.title}</h2><p>{t.teacherName} __________________ &nbsp; {t.className} {lesson.input.className || "__________"} &nbsp; {t.sessionDate} {lesson.input.scheduledDate || "__________"}</p></header>
    <dl><dt>{t.subject}</dt><dd>{pick(SUBJECTS[lesson.input.subject], lang)}</dd><dt>{t.school}</dt><dd>{svtGrade ? (lang === "ar" ? svtGrade.titleAr : svtGrade.titleFr) : catalogEntry ? catalogEntry[lang === "ar" ? "level_ar" : lang === "en" ? "level_en" : "level_fr"] : pick(SCHOOLS[lesson.input.schoolLevel], lang)}</dd><dt>{t.duration}</dt><dd>{lesson.input.duration} {t.minutes}{lesson.input.startTime && <span dir="ltr"> · {lesson.input.startTime} – {lesson.input.endTime}</span>}{lesson.input.room && <> · {lesson.input.room}</>}</dd><dt>{t.competency}</dt><dd>{lesson.input.competency}</dd></dl>
    {catalogEntry && <p>{lang === "ar" ? "الدورة" : lang === "en" ? "Semester" : "Semestre"} {catalogEntry.semester} · {catalogEntry[lang === "ar" ? "unit_ar" : lang === "en" ? "unit_en" : "unit_fr"]}</p>}
    <h2>{t.phases}</h2><table><thead><tr><th>{t.phases}</th><th>{t.situation}</th><th>{t.learner}</th><th>{t.teacher}</th><th>{t.evidence}</th></tr></thead><tbody>{lesson.phases.map((p, i) => <tr key={i}><th>{i + 1}. {pick(PHASE_NAMES[i], lang)}<p>{p.minutes} {t.minutes}</p></th><td>{p.situation}</td><td>{p.learner}</td><td>{p.teacher}</td><td>{p.evidence}</td></tr>)}</tbody></table>
    <h2>{t.obstacles}</h2>{lesson.obstacles.map((o, i) => <div className="ph-print-block" key={i}><p><strong>{t.obstacle} : </strong>{o.obstacle}</p><p><strong>{t.remediation} : </strong>{o.remediation}</p></div>)}
    <section className="ph-reading-page"><h2>{t.reading} · {t.levels[level - 1]}</h2><h3>{lesson.input.title}</h3><p className="ph-print-text">{reading.text}</p>{reading.glossary.length > 0 && <><h3>{t.glossary}</h3><dl>{reading.glossary.map((g, i) => <React.Fragment key={i}><dt>{g.term}</dt><dd>{g.definition}</dd></React.Fragment>)}</dl></>}<h3>{t.questions}</h3><ol>{reading.questions.map((q, i) => <li key={i}>{q}<div className="ph-answer-lines" /></li>)}</ol></section><footer>{t.review}</footer>
  </article>;
}

const STYLE = `
:root {
  --color-terracotta: #D9704F;
  --color-terracotta-light: #FBE9E2;
  --color-cypress: #111111;
  --color-cypress-light: #F5F5F5;
  --color-parchment: #FFFFFF;
  --color-surface-white: #FFFFFF;
  --color-sand-border: #F5F5F5;
  --color-ink-charcoal: #111111;
  --color-amber-alert: #B9552F;
  --color-ink-muted: #111111;
  --font-latin: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-arabic: "Noto Naskh Arabic", system-ui, sans-serif;
  --radius-work-card: 8px;
}
.ph-studio,.ph-print-sheet{box-sizing:border-box;color:var(--color-ink-charcoal);font-family:var(--font-latin)}.ph-studio *,.ph-print-sheet *{box-sizing:border-box}.ph-font-ar{font-family:var(--font-arabic)}.ph-studio{overflow-wrap:anywhere;background:var(--color-parchment);min-height:100vh;font-size:14px;line-height:1.6}.ph-studio button,.ph-studio input,.ph-studio textarea,.ph-studio select{font:inherit}.ph-studio button{cursor:pointer}.ph-studio button:disabled{cursor:not-allowed;opacity:.5}.ph-studio :focus-visible{outline:3px solid var(--color-terracotta);outline-offset:3px}.ph-studio textarea{resize:vertical}.ph-label{display:block;font-size:12px;font-weight:700;color:var(--color-ink-muted);margin-bottom:7px}.ph-input{display:block;width:100%;border:1px solid var(--color-sand-border);border-radius:var(--radius-work-card);padding:10px 12px;background:white;color:var(--color-ink-charcoal);line-height:1.7;min-width:0}.ph-input:focus{border-color:var(--color-terracotta);outline:2px solid var(--color-terracotta-light)}.ph-editable{background:var(--color-surface-white);font-size:13px!important}.ph-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;border:1px solid var(--color-sand-border);border-radius:var(--radius-work-card);padding:10px 15px;background:white;color:var(--color-ink-charcoal);font-weight:600;min-height:44px}.ph-btn:hover{background:var(--color-cypress-light)}.ph-studio .ph-primary{background:var(--color-terracotta);border-color:var(--color-terracotta);color:var(--color-surface-white);font-size:19px;font-weight:700}.ph-primary:hover{background:var(--color-cypress);border-color:var(--color-cypress)}.ph-link{color:var(--color-ink-charcoal);text-decoration:underline;text-underline-offset:3px;font-size:12px;background:none;border:0;padding:4px 0}.ph-card{border:1px solid var(--color-sand-border);background:var(--color-surface-white);border-radius:var(--radius-work-card);box-shadow:none}.ph-eyebrow{text-transform:uppercase;letter-spacing:.15em;font-size:10px;font-weight:700;color:var(--color-ink-muted)}.ph-font-ar .ph-eyebrow{letter-spacing:0;font-size:12px}.ph-muted{color:var(--color-ink-muted)}.ph-term{border:1px solid var(--color-sand-border);background:var(--color-cypress-light);color:var(--color-ink-charcoal);border-radius:var(--radius-work-card);padding:6px 12px;font-size:13px;min-height:40px}.ph-definition{position:absolute;inset-inline-start:0;top:calc(100% + 8px);width:min(270px,70vw);background:var(--color-surface-white);border:1px solid var(--color-sand-border);padding:16px;border-radius:var(--radius-work-card);box-shadow:none;z-index:20;font-size:13px}.ph-definition p{margin:8px 0}.ph-studio .ph-reading{font-size:17px;line-height:2.1;white-space:pre-wrap;color:var(--color-ink-charcoal)}.ph-font-ar .ph-reading{font-size:19px;line-height:2.25}.ph-print-surface{display:none}.ph-studio .ph-notice{position:fixed;bottom:22px;inset-inline-end:22px;max-width:min(460px,calc(100vw - 44px));z-index:60;box-shadow:none;border:1px solid var(--color-sand-border);border-radius:var(--radius-work-card);padding:15px;background:var(--color-surface-white)}.ph-studio .ph-error{border-color:var(--color-amber-alert);color:var(--color-ink-charcoal)}.ph-print-sheet{font-size:10pt;line-height:1.55}.ph-print-sheet h1{font-size:22pt;margin:5px 0}.ph-print-sheet h2{font-size:14pt;margin:18px 0 8px}.ph-print-sheet h3{font-size:12pt}.ph-print-sheet header{text-align:center;border-bottom:2px solid var(--color-ink-charcoal);padding-bottom:12px}.ph-print-sheet dl{display:grid;grid-template-columns:130px 1fr;gap:5px 12px}.ph-print-sheet dt{font-weight:700}.ph-print-sheet dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}.ph-print-sheet table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:8pt}.ph-print-sheet th,.ph-print-sheet td{border:1px solid var(--color-ink-muted);padding:7px;text-align:start;vertical-align:top;white-space:pre-wrap;overflow-wrap:anywhere}.ph-print-sheet th{background:var(--color-cypress-light)}.ph-print-sheet p{margin:5px 0;overflow-wrap:anywhere}.ph-print-block{break-inside:avoid}.ph-print-text{white-space:pre-wrap;font-size:12pt;line-height:1.9}.ph-answer-lines{height:42px;border-bottom:1px solid var(--color-sand-border);margin:8px 0 18px}.ph-print-sheet footer{margin-top:24px;border-top:1px solid var(--color-ink-muted);padding-top:8px;font-size:8pt;color:var(--color-ink-charcoal)}.ph-print-sheet li{break-inside:avoid}.ph-print-sheet thead{display:table-header-group}
.ph-studio h1,.ph-studio h2,.ph-studio h3,.ph-studio h4,.ph-print-sheet h1,.ph-print-sheet h2{color:var(--color-cypress)}
@media print{@page{size:A4 landscape;margin:12mm}body:has(.ph-print-surface)>*:not(.ph-print-surface){display:none!important}body:has(.ph-print-surface){margin:0!important;background:var(--color-surface-white)!important}.ph-print-surface{display:block!important;color:var(--color-ink-charcoal)}.ph-print-sheet{print-color-adjust:exact;-webkit-print-color-adjust:exact}.ph-reading-page{break-before:page}.ph-print-sheet tr{break-inside:avoid}.ph-print-sheet h2,.ph-print-sheet h3{break-after:avoid}}
@media(prefers-reduced-motion:reduce){.ph-studio *{animation:none!important;transition:none!important}}
`;

export default function LessonPlanStudio({ embedded = false, active = true, uiLanguage, onLanguageChange, initialLanguage = "en", initialLesson, initialDocument, storageKey = "pedago-helper:lesson-studio:v1", accountId, generateLesson }: LessonPlanStudioProps) {
  const [form, setForm] = useState<LessonInput>(() => initialDocument && isLessonDocument(initialDocument) ? initialDocument.input : { ...initialInput(initialLanguage, initialLesson?.subject), ...initialLesson, language: initialLanguage });
  const [lesson, setLesson] = useState<LessonDocument>(() => initialDocument && isLessonDocument(initialDocument) ? initialDocument : createLocalLesson(form));
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>(2);
  const [saved, setSaved] = useState<LessonDocument[]>([]);
  const [mounted, setMounted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editingText, setEditingText] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [deleted, setDeleted] = useState<LessonDocument | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [cloudSaveFailed, setCloudSaveFailed] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const originalLesson = useRef(JSON.stringify(lesson));
  const cloudWrite = useRef<Promise<void>>(Promise.resolve());
  const cloudSequence = useRef(0);
  function switchLanguage(language: Language) {
    requestRef.current?.abort(); setBusy(false);
    setForm(prev => localizeLessonInput(prev, language));
    setLesson(prev => localizeLesson(prev, language));
    originalLesson.current = JSON.stringify(localizeLesson(JSON.parse(originalLesson.current), language));
    setNotice(null);
  }
  useEffect(() => { if (uiLanguage) switchLanguage(uiLanguage); }, [uiLanguage]);
  const id = useId(); const lang = form.language; const t = COPY[lang];
  const docLang = lesson.input.language; const dt = COPY[docLang];
  const accountSaveLabel = lang === "ar" ? "محفوظة في حسابك" : lang === "en" ? "Saved to your account" : "Enregistrée dans votre compte";
  const accountSavingLabel = lang === "ar" ? "جار حفظ الجذاذة في حسابك…" : lang === "en" ? "Saving the lesson to your account…" : "Enregistrement de la fiche dans votre compte…";
  const total = lesson.phases.reduce((sum, phase) => sum + phase.minutes, 0);
  const timeValid = total === lesson.input.duration && lesson.phases.every(p => p.minutes >= 1 && Number.isInteger(p.minutes));
  const stale = !sameInput(form, lesson.input);
  const dirty = !saved.some(s => JSON.stringify(localizeLesson(s, lang)) === JSON.stringify(lesson));
  const reading = lesson.readings[readingLevel];
  const dateFormatter = new Intl.DateTimeFormat(lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR", { dateStyle: "medium", timeStyle: "short" });
  useEffect(() => {
    setMounted(true); setStorageReady(false); setSaved([]);
    if (accountId) {
      let active = true;
      const validLibrary = (value: unknown): value is { version: 1; lessons: LessonDocument[] } => isRecord(value) && value.version === 1 && Array.isArray(value.lessons) && value.lessons.length <= 30 && value.lessons.every(isLessonDocument);
      void readAccountDocument(accountId, storageKey, validLibrary, storageKey)
        .then(data => {
          if (!active) return;
          const loaded = data?.lessons ?? [];
          setSaved(loaded);
          if (initialLesson?.scheduledDate && loaded[0]) {
            const restored = localizeLesson(loaded[0], uiLanguage ?? initialLanguage);
            setLesson(restored); setForm(restored.input); originalLesson.current = JSON.stringify(restored);
          }
          setStorageReady(true);
        })
        .catch(() => { if (active) { setNotice({ text: initialLanguage === "ar" ? "تعذر تحميل الجذاذات من حسابك." : initialLanguage === "en" ? "Could not load lessons from your account." : "Impossible de charger vos fiches depuis votre compte.", error: true }); setStorageReady(false); } });
      return () => { active = false; };
    }
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.lessons)) throw new Error("Invalid library");
        const valid = parsed.lessons.filter(isLessonDocument).slice(0, 30);
        setSaved(valid);
        if (valid.length !== parsed.lessons.length) setNotice({ text: COPY[initialLanguage].damaged, error: true });
      }
    } catch { setNotice({ text: COPY[initialLanguage].damaged, error: true }); }
    setStorageReady(true);
  }, [storageKey, accountId, initialLanguage]);
  useEffect(() => () => { requestRef.current?.abort(); timeouts.current.forEach(clearTimeout); }, []);
  useEffect(() => { if (!notice || notice.error) return; const timeout = setTimeout(() => setNotice(null), 6500); return () => clearTimeout(timeout); }, [notice]);
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => { if (stale || (dirty && JSON.stringify(lesson) !== originalLesson.current)) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", onBeforeUnload); return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, stale, lesson]);
  function persist(next: LessonDocument[]) {
    if (accountId) {
      const sequence = ++cloudSequence.current;
      setSaved(next);
      setCloudSaveFailed(false);
      setNotice({ text: accountSavingLabel });
      cloudWrite.current = cloudWrite.current.catch(() => {}).then(() => writeAccountDocument(accountId, storageKey, { version: 1, lessons: next }));
      void cloudWrite.current.then(() => { if (sequence === cloudSequence.current) setNotice({ text: accountSaveLabel }); }).catch(() => { if (sequence === cloudSequence.current) { setCloudSaveFailed(true); setNotice({ text: lang === "ar" ? "تعذر حفظ الجذاذة في حسابك. أعد المحاولة." : lang === "en" ? "Could not save the lesson to your account. Try again." : "Impossible d’enregistrer la fiche dans votre compte. Réessayez.", error: true }); } });
      return true;
    }
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, lessons: next })); setSaved(next); return true; }
    catch { setNotice({ text: t.storageError, error: true }); return false; }
  }
  function change<K extends keyof LessonInput>(key: K, value: LessonInput[K]) { setForm(prev => {
    const next = { ...prev, [key]: value };
    if (key === "schoolLevel" || key === "subject") { delete next.curriculumLessonId; delete next.svtChapterId; }
    return next;
  }); }
  function loadExample(subject = form.subject, language = form.language) {
    const next = { ...form, ...initialInput(language, subject), duration: form.duration, schoolLevel: form.schoolLevel };
    delete next.curriculumLessonId;
    delete next.svtChapterId;
    setForm(next);
  }
  async function generate(event: React.FormEvent) {
    event.preventDefault(); if (!inputIsValid(form)) { setNotice({ text: t.invalid, error: true }); return; }
    requestRef.current?.abort(); const controller = new AbortController(); requestRef.current = controller; setBusy(true); setNotice(null);
    try {
      const next = generateLesson ? await Promise.race([
        generateLesson({ ...form }, controller.signal),
        new Promise<never>((_, reject) => {
          const timer = setTimeout(() => { reject(new Error("Generation timeout")); }, 45000);
          timeouts.current.push(timer);
          controller.signal.addEventListener("abort", () => clearTimeout(timer), { once: true });
        }),
      ]) : createLocalLesson({ ...form });
      if (controller.signal.aborted) return;
      if (!isLessonDocument(next) || !sameInput(next.input, form)) throw new Error("Invalid generation response");
      setLesson({ ...next, id: uid(), savedAt: undefined }); setEditingText(false);
    } catch { if (!controller.signal.aborted) setNotice({ text: t.generateError, error: true }); }
    finally { controller.abort(); if (requestRef.current === controller) { setBusy(false); requestRef.current = null; } }
  }
  function updatePhase(index: number, patch: Partial<DidacticPhase>) { setLesson(prev => ({ ...prev, phases: prev.phases.map((p, i) => i === index ? { ...p, ...patch } : p) as LessonDocument["phases"] })); }
  function updateReading(patch: Partial<ReadingMaterial>) { setLesson(prev => ({ ...prev, readings: { ...prev.readings, [readingLevel]: { ...prev.readings[readingLevel], ...patch } } })); }
  function saveLesson() {
    if (!timeValid || stale) { setNotice({ text: stale ? t.stale : t.timeError, error: true }); return; }
    if (saved.length >= 30 && !saved.some(s => s.id === lesson.id)) { setNotice({ text: t.limit, error: true }); return; }
    const next = { ...lesson, savedAt: new Date().toISOString() };
    if (persist([next, ...saved.filter(s => s.id !== next.id)])) { setLesson(next); if (!accountId) setNotice({ text: t.saveOk }); }
  }
  async function printLesson() {
    if (stale || !timeValid) { setNotice({ text: stale ? t.stale : t.timeError, error: true }); return; }
    try { if (document.fonts) await Promise.race([document.fonts.ready, new Promise(resolve => { const timeout = setTimeout(resolve, 1500); timeouts.current.push(timeout); })]); window.print(); }
    catch { setNotice({ text: t.printError, error: true }); }
  }
  return <main className={`ph-studio ph-font-${lang}`} lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
    <style>{STYLE}</style>
    {!embedded && <header className="border-b border-[var(--color-sand-border)] bg-white"><div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-10"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-cypress)] text-white"><Icon name="book" size={24} /></span><div><p className="text-lg font-extrabold tracking-tight">{t.brand}</p><p className="ph-muted text-xs">{t.subtitle}</p></div></div><div className="flex items-center gap-5"><span className="hidden items-center gap-2 text-xs text-[var(--color-ink-muted)] sm:flex"><span className="h-2 w-2 rounded-lg bg-[var(--color-cypress)]" />{generateLesson ? t.connected : t.local}</span><div role="group" aria-label={t.language} className="flex rounded-lg border border-[var(--color-sand-border)] bg-[var(--color-cypress-light)] p-1">{(["fr", "ar", "en"] as Language[]).map(l => <button key={l} type="button" disabled={busy} lang={l} aria-pressed={lang === l} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${lang === l ? "bg-white shadow-none text-[var(--color-cypress)]" : "text-[var(--color-ink-muted)]"}`} onClick={() => { switchLanguage(l); onLanguageChange?.(l); }}>{languageName(l, lang)}</button>)}</div></div></div></header>}
    <div className="mx-auto max-w-[1500px] px-5 pb-14 pt-9 md:px-10">
      <div data-tour="teacher-planner" className="mb-8 flex items-end justify-between gap-5"><div><p className="ph-eyebrow mb-3">{t.studio} / 01</p><h1 className="whitespace-pre-line text-3xl font-semibold leading-[1.3] tracking-tight md:text-[38px]">{t.heading}</h1><p className="ph-muted mt-3 max-w-2xl text-sm">{t.intro}</p><p className="ph-muted mt-2 text-xs">{lang === "ar" ? "تترجم النماذج تلقائيا. تحتفظ النصوص التي كتبتها بنفسك بلغتها الأصلية." : lang === "en" ? "Model lessons change language automatically. Your own text keeps its original language." : "Les modèles changent de langue automatiquement. Vos textes personnels conservent leur langue d’origine."}</p></div><div className="hidden h-24 w-24 rotate-[-10deg] items-center justify-center rounded-lg border border-[var(--color-sand-border)] bg-[var(--color-cypress-light)] text-[var(--color-ink-muted)] lg:flex"><Icon name="leaf" size={48} /></div></div>
      <details className="mb-6 rounded-lg border border-sand bg-white p-4"><summary className="cursor-pointer text-sm font-bold text-cypress">{lang === "ar" ? "تصفح البرنامج الكامل لعلوم الحياة والأرض" : lang === "en" ? "Browse the full Life and Earth Sciences curriculum" : "Parcourir le programme complet de SVT"}</summary><div className="mt-4"><CurriculumNavigation language={lang} onSelectChapter={(chapter, grade) => {
        const next: LessonInput = { ...form, subject: "svt", schoolLevel: grade.cycleId === "college" ? "middle" : "high", svtChapterId: chapter.id, title: lang === "ar" ? chapter.titleAr : chapter.titleFr, competency: lang === "ar" ? `تحليل وثائق حول «${chapter.titleAr}» وتعليل تفسير علمي.` : lang === "en" ? `Analyze evidence about “${chapter.titleFr}” and justify a scientific explanation.` : `Analyser des documents relatifs à « ${chapter.titleFr} » et justifier une explication scientifique.`, sourceText: "" };
        delete next.curriculumLessonId;
        setForm(next);
        setNotice({ text: lang === "ar" ? "تم اختيار الفصل. راجع المعطيات ثم أنشئ الجذاذة." : lang === "en" ? "Chapter selected. Review the fields, then generate the lesson sheet." : "Chapitre sélectionné. Vérifiez les champs, puis générez la fiche." });
        document.getElementById(`${id}-title`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }} /></div></details>
      <div className="grid items-start gap-6 lg:grid-cols-[310px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <form onSubmit={generate} className="ph-card overflow-hidden"><div className="border-b border-[var(--color-sand-border)] px-6 py-5"><h2 className="text-base font-bold">{t.settings}</h2><p className="ph-muted mt-1 text-xs">{t.settingsHint}</p></div><fieldset disabled={busy} className="min-w-0 space-y-5 p-6">
            <CurriculumPicker language={lang} selectedId={form.curriculumLessonId} onSelect={entry => setForm(prev => ({ ...prev, curriculumLessonId: entry.id, svtChapterId: undefined, subject: entry.subject, schoolLevel: entry.schoolLevel, title: lang === "ar" ? entry.title_ar : lang === "en" ? entry.title_en : entry.title_fr, competency: curriculumCompetency(entry, lang) }))} />
            {form.curriculumLessonId && <p role="status" className="rounded-lg bg-[var(--color-cypress-light)] p-3 text-xs">{lang === "ar" ? "الدرس المختار" : lang === "en" ? "Selected lesson" : "Cours sélectionné"} : {findCurriculumLesson(form.curriculumLessonId)?.[lang === "ar" ? "level_ar" : lang === "en" ? "level_en" : "level_fr"]} · {form.title}</p>}
            {form.svtChapterId && <p role="status" className="rounded-lg bg-[var(--color-cypress-light)] p-3 text-xs">{lang === "ar" ? "فصل البرنامج المختار" : lang === "en" ? "Selected curriculum chapter" : "Chapitre du programme sélectionné"} : {form.svtChapterId} · {form.title}</p>}
            <div><label className="ph-label" htmlFor={`${id}-subject`}>{t.subject}</label><select className="ph-input" id={`${id}-subject`} value={form.subject} onChange={e => loadExample(e.target.value as Subject)}>{(Object.keys(SUBJECTS) as Subject[]).map(s => <option key={s} value={s}>{pick(SUBJECTS[s], lang)}</option>)}</select></div>
            <div><label className="ph-label" htmlFor={`${id}-school`}>{t.school}</label><select className="ph-input" id={`${id}-school`} value={form.schoolLevel} onChange={e => change("schoolLevel", e.target.value as SchoolLevel)}>{(Object.keys(SCHOOLS) as SchoolLevel[]).map(s => <option key={s} value={s}>{pick(SCHOOLS[s], lang)}</option>)}</select></div>
            <div><label className="ph-label" htmlFor={`${id}-title`}>{t.title}</label><input required maxLength={240} className="ph-input" id={`${id}-title`} value={form.title} onChange={e => change("title", e.target.value)} /></div>
            <TextField label={t.competency} value={form.competency} onChange={value => change("competency", value)} rows={4} maxLength={2000} />
            <div><label className="ph-label" htmlFor={`${id}-duration`}>{t.duration}</label><div className="flex items-center gap-3"><input required type="number" min={20} max={240} step={1} id={`${id}-duration`} className="ph-input" value={form.duration || ""} onChange={e => change("duration", e.target.value === "" ? 0 : Number(e.target.value))} /><span className="ph-muted text-sm">{t.minutes}</span></div></div>
            <details className="rounded-lg border border-[var(--color-sand-border)] p-3"><summary className="cursor-pointer text-xs font-semibold">{t.source}</summary><div className="mt-3"><TextField label={t.sourceHint} value={form.sourceText} onChange={value => change("sourceText", value)} maxLength={12000} rows={6} /><p className="ph-muted mt-2 text-[11px]">{t.sourceInfo}</p></div></details>
            <button type="submit" className="ph-btn ph-primary w-full" disabled={busy} aria-busy={busy}><Icon name="spark" />{busy ? t.generating : t.generate}</button>
            {!generateLesson && <p className="ph-muted text-[11px] leading-relaxed">{form.curriculumLessonId || form.svtChapterId || form.subject === "pc" ? (lang === "ar" ? "الدليل يوفر عناوين الدروس. يولد الوضع المحلي هيكلا للتحضير يجب إتمامه بالمحتوى العلمي والوسائل والنصوص المناسبة قبل استعماله." : lang === "en" ? "The curriculum provides lesson titles. Local mode creates a teaching framework that you must complete with scientific content, materials and suitable reading texts before use." : "Le catalogue fournit les titres. Le mode local crée une trame à compléter avec les contenus scientifiques, les supports et les textes adaptés avant utilisation.") : t.demo}</p>}
            <button type="button" className="ph-link" onClick={() => loadExample()}>{t.library}</button>
          </fieldset></form>
          <>{lesson.input.className && <div className="ph-card flex flex-wrap items-center gap-3 p-4 text-xs"><strong>{lesson.input.className}</strong><span>{lesson.input.room}</span><span>{lesson.input.scheduledDate}</span><span dir="ltr">{lesson.input.startTime} – {lesson.input.endTime}</span></div>}</><section className="ph-card p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-bold">{t.saved}</h2><span className="rounded-lg bg-[var(--color-cypress-light)] px-2 py-0.5 text-xs">{saved.length}</span></div><p className="ph-muted mb-4 text-[11px]">{accountId ? (lang === "ar" ? "محفوظة في حسابك ومتاحة على أجهزتك" : lang === "en" ? "Saved to your account and available across devices" : "Enregistrées dans votre compte et accessibles sur vos appareils") : t.savedHint}</p>{saved.length === 0 ? <p className="ph-muted rounded-lg border border-dashed border-[var(--color-sand-border)] p-4 text-xs">{t.empty}</p> : <ul className="max-h-80 space-y-3 overflow-auto">{saved.map(item => <li key={item.id} className="rounded-lg border border-[var(--color-sand-border)] p-3"><p dir="auto" className="text-xs font-semibold">{localizeLessonInput(item.input, lang).title}</p><p className="ph-muted my-1 text-[10px]">{item.savedAt ? dateFormatter.format(new Date(item.savedAt)) : ""}</p><div className="flex gap-4"><button type="button" className="ph-link" disabled={busy} onClick={() => { const localized = localizeLesson(item, lang); setLesson(localized); setForm(localized.input); setEditingText(false); setNotice({ text: t.loadOk }); }}>{t.load}</button><button type="button" className="ph-link" onClick={() => { if (persist(saved.filter(s => s.id !== item.id))) { setDeleted(item); setNotice({ text: t.deleteOk }); } }} aria-label={`${t.remove} : ${localizeLessonInput(item.input, lang).title}`}>{t.remove}</button></div></li>)}</ul>}{deleted && <button type="button" className="ph-link mt-3" onClick={() => { if (saved.length >= 30) { setNotice({ text: t.limit, error: true }); return; } if (persist([deleted, ...saved.filter(s => s.id !== deleted.id)])) setDeleted(null); }}>{t.restore}</button>}</section>
        </aside>
        <fieldset disabled={busy} className="min-w-0 space-y-6" aria-busy={busy}>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">{t.plan}</h2><p className="ph-muted text-xs">{cloudSaveFailed ? (lang === "ar" ? "لم تتم مزامنة آخر تغيير" : lang === "en" ? "The latest change was not synced" : "La dernière modification n’est pas synchronisée") : dirty ? t.dirty : accountId ? accountSaveLabel : t.saveOk}</p></div><div className="flex flex-wrap gap-2"><button type="button" className="ph-btn text-xs" disabled={busy || !storageReady || stale || !timeValid} onClick={saveLesson}><Icon name="save" size={17} />{t.save}</button><button type="button" className="ph-btn text-xs" disabled={busy || stale || !timeValid} onClick={printLesson}><Icon name="print" size={17} />{t.print}</button></div></div>
          {stale && <p role="status" className="rounded-lg border border-[var(--color-amber-alert)] bg-[var(--color-terracotta-light)] p-4 text-sm text-[var(--color-ink-charcoal)]">{t.stale}</p>}
          <section className="ph-card p-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold"><Icon name="clock" size={18} /><span><b className={!timeValid ? "text-[var(--color-ink-charcoal)]" : ""}>{total}</b> / {lesson.input.duration} {t.allocated}</span></div><button type="button" className="ph-link" onClick={() => { const minutes = allocateMinutes(lesson.input.duration, lesson.phases.map(p => p.minutes)); setLesson(prev => ({ ...prev, phases: prev.phases.map((p, i) => ({ ...p, minutes: minutes[i] })) as LessonDocument["phases"] })); }}>{t.rebalance}</button></div><div role="meter" aria-label={t.allocated} aria-valuemin={0} aria-valuemax={lesson.input.duration} aria-valuenow={Math.min(total, lesson.input.duration)} aria-valuetext={`${total} / ${lesson.input.duration} ${t.minutes}`} className="flex h-3 gap-1 overflow-hidden rounded-lg bg-[var(--color-cypress-light)]">{lesson.phases.map((p, i) => <div key={i} title={`${pick(PHASE_NAMES[i], lang)}: ${p.minutes} ${t.minutes}`} style={{ width: `${p.minutes / Math.max(total, lesson.input.duration) * 100}%`, background: COLORS[i] }} />)}</div><div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px]"><span className={timeValid ? "text-[var(--color-cypress)]" : "text-[var(--color-ink-charcoal)]"} aria-live="polite">{timeValid ? `✓ ${t.balanced}` : total === lesson.input.duration ? t.timeError : `${Math.abs(lesson.input.duration - total)} ${total > lesson.input.duration ? t.over : t.remaining}`}</span><span className="ph-muted">{t.phaseHint}</span></div></section>
          <section lang={docLang} dir={docLang === "ar" ? "rtl" : "ltr"} className={`ph-card ph-font-${docLang} overflow-hidden`}><div className="border-b border-[var(--color-sand-border)] px-6 py-5"><p className="ph-eyebrow mb-1">{dt.phases}</p><h3 className="text-lg font-semibold">{lesson.input.title}</h3><p className="ph-muted mt-2 text-xs">{lesson.input.competency}</p></div><div className="divide-y divide-[var(--color-sand-border)]">{lesson.phases.map((phase, index) => <details key={`${lesson.id}-${index}`} open className="group px-5 py-5 md:px-6"><summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg text-[19px] font-bold text-white" style={{ background: COLORS[index] }}>{String(index + 1).padStart(2, "0")}</span><span className="font-semibold">{pick(PHASE_NAMES[index], docLang)}</span></span><span className="ph-muted text-xs">{phase.minutes} {dt.minutes} <span aria-hidden="true">⌄</span></span></summary><div className="mt-5 space-y-4"><div className="flex items-center justify-end gap-2"><label className="ph-muted text-xs" htmlFor={`${id}-phase-${index}`}>{dt.duration}</label><input id={`${id}-phase-${index}`} className="ph-input !w-20 !py-1 text-center" type="number" min={0} max={240} step={1} value={phase.minutes} onChange={e => updatePhase(index, { minutes: Math.max(0, Math.min(240, Math.trunc(Number(e.target.value)))) })} /><span className="ph-muted text-xs">{dt.minutes}</span></div><TextField label={dt.situation} value={phase.situation} onChange={situation => updatePhase(index, { situation })} rows={3} /><div className="grid gap-4 xl:grid-cols-2"><TextField label={dt.learner} value={phase.learner} onChange={learner => updatePhase(index, { learner })} rows={3} /><TextField label={dt.teacher} value={phase.teacher} onChange={teacher => updatePhase(index, { teacher })} rows={3} /></div><TextField label={dt.evidence} value={phase.evidence} onChange={evidence => updatePhase(index, { evidence })} rows={2} /></div></details>)}</div></section>
          <section className={`rounded-lg border border-[var(--color-amber-alert)] bg-[var(--color-terracotta-light)] p-6 ph-font-${docLang}`} lang={docLang} dir={docLang === "ar" ? "rtl" : "ltr"}><h3 className="mb-4 flex items-center gap-2 font-bold"><span className="text-[var(--color-ink-charcoal)]" aria-hidden="true">◇</span>{dt.obstacles}</h3><div className="space-y-5">{lesson.obstacles.map((o, i) => <div key={i} className="grid gap-4 xl:grid-cols-2"><TextField label={dt.obstacle} value={o.obstacle} onChange={obstacle => setLesson(prev => ({ ...prev, obstacles: prev.obstacles.map((entry, index) => index === i ? { ...entry, obstacle } : entry) }))} /><TextField label={dt.remediation} value={o.remediation} onChange={remediation => setLesson(prev => ({ ...prev, obstacles: prev.obstacles.map((entry, index) => index === i ? { ...entry, remediation } : entry) }))} /></div>)}</div></section>
          <section className={`ph-card ph-font-${docLang} overflow-hidden`} lang={docLang} dir={docLang === "ar" ? "rtl" : "ltr"}><div className="border-b border-[var(--color-sand-border)] bg-[var(--color-cypress-light)] p-6"><p className="ph-eyebrow mb-2">{dt.reading} / 02</p><h2 className="text-2xl font-semibold tracking-tight">{dt.textStudio}</h2><p className="ph-muted mt-2 text-xs">{dt.textHint}</p><div role="group" aria-label={dt.reading} className="mt-5 grid grid-cols-3 gap-2">{([1, 2, 3] as ReadingLevel[]).map(level => <button key={level} type="button" aria-pressed={readingLevel === level} onClick={() => { setReadingLevel(level); setEditingText(false); }} className={`rounded-lg border px-2 py-3 text-xs font-semibold sm:text-sm ${readingLevel === level ? "border-[var(--color-terracotta)] bg-[var(--color-terracotta-light)] text-[var(--color-cypress)] shadow-none" : "border-[var(--color-sand-border)] bg-white text-[var(--color-ink-muted)]"}`}><span className="me-2 opacity-70">0{level}</span>{dt.levels[level - 1]}</button>)}</div></div><div className="p-6 md:p-8"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="ph-muted text-xs">{dt.levelHints[readingLevel - 1]}</p><button type="button" className="ph-link" onClick={() => setEditingText(!editingText)}>{editingText ? dt.done : dt.edit}</button></div>{lesson.input.sourceText && !generateLesson && <p className="mb-4 rounded-lg bg-[var(--color-terracotta-light)] p-3 text-xs text-[var(--color-ink-charcoal)]">{dt.sourceInfo}</p>}<h3 className="mb-4 text-xl font-semibold">{lesson.input.title}</h3>{editingText ? <TextField label={dt.reading} value={reading.text} onChange={text => updateReading({ text })} rows={12} maxLength={30000} /> : <p className="ph-reading" aria-live="polite">{reading.text || (docLang === "ar" ? "أضف نصا ملائما لهذا الدرس باستعمال «تعديل النص» أو حقل النص المراد تكييفه." : docLang === "en" ? "Add a suitable text for this lesson using “Edit text” or the “Text to adapt” field." : "Ajoutez un texte adapté à ce cours avec « Modifier le texte » ou le champ « Votre texte à adapter ».")}</p>}<p className="ph-muted mt-4 text-[11px]">{reading.text.trim() ? reading.text.trim().split(/\s+/u).length : 0} {dt.words}</p>{reading.glossary.length > 0 && <div className="mt-6 border-t border-[var(--color-sand-border)] pt-5"><h4 className="text-sm font-bold">{dt.glossary}</h4><p className="ph-muted mb-3 mt-1 text-xs">{dt.glossaryHint}</p><Glossary key={`${lesson.id}-${readingLevel}`} entries={reading.glossary} language={docLang} /></div>}<div className="mt-7 rounded-lg bg-[var(--color-cypress-light)] p-5"><h4 className="mb-4 flex items-center gap-2 font-bold"><Icon name="spark" size={17} />{dt.questions}</h4><ol className="space-y-4">{reading.questions.map((question, i) => <li key={i} className="flex gap-3"><span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[var(--color-sand-border)] bg-white text-[11px] text-[var(--color-ink-muted)]">{i + 1}</span><div className="min-w-0 flex-1">{editingText ? <TextField label={`${dt.questions} ${i + 1}`} value={question} onChange={value => updateReading({ questions: reading.questions.map((q, index) => index === i ? value : q) as ReadingMaterial["questions"] })} maxLength={2000} rows={2} /> : <p className="pt-0.5 text-sm leading-relaxed">{question}</p>}</div></li>)}</ol></div></div></section>
          <p className="ph-muted text-center text-[11px]">{t.review}</p>
        </fieldset>
      </div>
    </div>
    {notice && <div className={`ph-notice ${notice.error ? "ph-error" : ""}`} role={notice.error ? "alert" : "status"}><div className="flex items-start gap-4"><p className="text-sm">{notice.text}</p><button type="button" aria-label={t.close} className="shrink-0 px-1 text-xl leading-none" onClick={() => setNotice(null)}>×</button></div></div>}
    {mounted && active && createPortal(<div className="ph-print-surface"><PrintSheet lesson={lesson} level={readingLevel} /></div>, document.body)}
  </main>;
}
