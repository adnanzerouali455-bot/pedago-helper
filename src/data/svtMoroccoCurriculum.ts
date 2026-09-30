import type { Chapter, Cycle, Grade, Unit } from "../types/curriculum";

type ChapterSource = readonly [titleFr: string, titleAr: string, keywords: string, sessions?: number];
type UnitSource = readonly [titleFr: string, titleAr: string, semester: 1 | 2 | undefined, chapters: readonly ChapterSource[]];

function slugify(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function grade(id: string, cycleId: string, titleFr: string, titleAr: string, source: readonly UnitSource[]): Grade {
  return { id, cycleId, titleFr, titleAr, units: source.map(([unitFr, unitAr, semester, entries], index): Unit => {
    const unitNumber = index + 1;
    const unitId = `${id}-${semester ? `s${semester}` : `u${unitNumber}`}`;
    return { id: unitId, titleFr: unitFr, titleAr: unitAr, unitNumber, ...(semester ? { semester } : {}),
      chapters: entries.map(([titleFr, titleAr, words, sessions = 1], chapterIndex): Chapter => ({
        id: `${unitId}-c${chapterIndex + 1}`, slug: slugify(titleFr), titleFr, titleAr,
        chapterNumber: chapterIndex + 1, estimatedDurationMin: 55 * sessions,
        keywords: words.split("|"),
      })) };
  }) };
}

export const svtMoroccoCurriculum: Cycle[] = [
  { id: "college", titleFr: "Enseignement secondaire collégial", titleAr: "التعليم الثانوي الإعدادي", grades: [
    grade("1ac", "college", "1ère Année Collégiale (1AC / 6e)", "السنة الأولى إعدادي", [
      ["Relations trophiques dans les milieux naturels", "العلاقات الغذائية في الأوساط الطبيعية", 1, [
        ["Exploration d'un milieu naturel et notion de cellule", "استكشاف وسط طبيعي ومفهوم الخلية", "milieu naturel|cellule|observation", 2],
        ["La respiration dans différents milieux de vie (aérien et aquatique)", "التنفس في أوساط العيش المختلفة (الهوائية والمائية)", "respiration|milieu aérien|milieu aquatique", 2],
        ["L'alimentation des êtres vivants et comparaison des régimes alimentaires", "تغذية الكائنات الحية ومقارنة الأنظمة الغذائية", "alimentation|régime alimentaire|nutriments", 2],
        ["Relations trophiques, réseaux alimentaires et flux de matière/énergie", "العلاقات الغذائية والشبكات الغذائية وتدفق المادة والطاقة", "chaîne alimentaire|réseau trophique|énergie", 2],
        ["Classification des êtres vivants et préservation de la biodiversité", "تصنيف الكائنات الحية والحفاظ على التنوع البيولوجي", "classification|biodiversité|espèce", 2],
      ]],
      ["Phénomènes géologiques externes", "الظواهر الجيولوجية الخارجية", 2, [
        ["La sortie géologique et observation des paysages", "الخرجة الجيولوجية وملاحظة المناظر الطبيعية", "sortie géologique|paysage|affleurement"],
        ["L'altération des roches et l'érosion sédimentaire", "تجوية الصخور والتعرية الرسوبية", "altération|érosion|roche", 2],
        ["Le transport des sédiments par l'eau et le vent", "نقل الرواسب بواسطة الماء والرياح", "sédiment|transport|eau|vent"],
        ["La sédimentation et les milieux de dépôt", "الترسب وأوساط الترسيب", "sédimentation|dépôt|bassin", 2],
        ["La diagénèse et la formation des roches sédimentaires", "التصخر وتكوّن الصخور الرسوبية", "diagénèse|compaction|cimentation", 2],
        ["L'échelle des temps géologiques et les fossiles stratigraphiques", "السلم الزمني الجيولوجي والمستحاثات الطباقية", "fossile|stratigraphie|temps géologique", 2],
        ["Les ressources hydriques et leur gestion durable", "الموارد المائية وتدبيرها المستدام", "eau|nappe|gestion durable"],
      ]],
    ]),
    grade("2ac", "college", "2ème Année Collégiale (2AC / 5e-4e)", "السنة الثانية إعدادي", [
      ["Phénomènes géologiques internes", "الظواهر الجيولوجية الباطنية", 1, [
        ["La théorie de la tectonique des plaques", "نظرية تكتونية الصفائح", "plaque tectonique|lithosphère|mouvement", 2],
        ["Les séismes et leur relation avec la dynamique des plaques", "الزلازل وعلاقتها بدينامية الصفائح", "séisme|faille|épicentre", 2],
        ["Le volcanisme et ses types (effusif et explosif)", "البركانية وأنواعها (انسكابية وانفجارية)", "volcanisme|magma|éruption", 2],
        ["La formation des roches magmatiques plutoniques et volcaniques", "تكوّن الصخور الصهارية الجوفية والبركانية", "roche magmatique|plutonique|volcanique", 2],
        ["Les déformations tectoniques : failles et plis", "التشوهات التكتونية: الفوالق والطيات", "faille|pli|contrainte", 2],
        ["La formation des chaînes de montagnes récentes", "تكوّن السلاسل الجبلية الحديثة", "orogenèse|collision|chaîne de montagnes", 2],
      ]],
      ["Reproduction et transmission de la vie", "التوالد وانتقال الحياة", 2, [
        ["La reproduction sexuée chez les animaux (fécondation, viviparité, oviparité)", "التوالد الجنسي عند الحيوانات (الإخصاب والولودية والبيوضية)", "fécondation|viviparité|oviparité", 2],
        ["La reproduction sexuée chez les végétaux (fleurs, pollinisation, graines)", "التوالد الجنسي عند النباتات (الأزهار والتلقيح والبذور)", "fleur|pollinisation|graine", 2],
        ["La reproduction chez l'Homme, cycle reproducteur et contraception", "التوالد عند الإنسان والدورة التناسلية ومنع الحمل", "reproduction humaine|cycle reproducteur|contraception", 2],
        ["Les principes fondamentaux de l'hérédité humaine et des chromosomes", "المبادئ الأساسية للوراثة البشرية والصبغيات", "hérédité|chromosome|caractère", 2],
      ]],
    ]),
    grade("3ac", "college", "3ème Année Collégiale (3AC / Examen régional)", "السنة الثالثة إعدادي (الامتحان الجهوي)", [
      ["Fonctions de nutrition et éducation sanitaire", "وظائف التغذية والتربية الصحية", 1, [
        ["La digestion des aliments et l'absorption intestinale", "هضم الأغذية والامتصاص المعوي", "digestion|enzyme|absorption", 2],
        ["L'éducation nutritionnelle, carences et rations alimentaires", "التربية الغذائية وحالات النقص والحصص الغذائية", "ration alimentaire|carence|équilibre", 2],
        ["La respiration cellulaire et les échanges gazeux tissulaires", "التنفس الخلوي والتبادلات الغازية النسيجية", "respiration cellulaire|dioxygène|échange gazeux", 2],
        ["Le sang et l'appareil circulatoire cardiovasculaire", "الدم والجهاز الدوري القلبي الوعائي", "sang|cœur|circulation", 2],
        ["L'excrétion urinaire et l'anatomie fonctionnelle du rein", "الإطراح البولي والبنية الوظيفية للكلية", "rein|néphron|urine", 2],
      ]],
      ["Fonctions de communication et immunologie", "وظائف التواصل وعلم المناعة", 2, [
        ["Le système nerveux : motricité volontaire et motricité réflexe", "الجهاز العصبي: الحركة الإرادية والحركة الانعكاسية", "système nerveux|réflexe|motricité", 2],
        ["Le système musculaire et contraction du muscle strié", "الجهاز العضلي وتقلص العضلة المخططة", "muscle strié|contraction|tendon", 2],
        ["Les microorganismes (pathogènes, saprophytes, virus et bactéries)", "الكائنات المجهرية (الممرضة والرمية والفيروسات والبكتيريا)", "microorganisme|virus|bactérie", 2],
        ["Le système immunitaire : défenses innées (phagocytose) et acquises (humorale/cellulaire)", "الجهاز المناعي: الدفاعات الفطرية (البلعمة) والمكتسبة (الخلطية والخلوية)", "phagocytose|lymphocyte|anticorps", 3],
        ["Les dysfonctionnements du système immunitaire (allergies, VIH/SIDA)", "اضطرابات الجهاز المناعي (الحساسية وفيروس نقص المناعة/السيدا)", "allergie|VIH|immunodéficience", 2],
        ["Les groupes sanguins et la transfusion sanguine", "الزمر الدموية ونقل الدم", "groupe sanguin|ABO|transfusion", 2],
      ]],
    ]),
  ] },
  { id: "lycee", titleFr: "Enseignement secondaire qualifiant", titleAr: "التعليم الثانوي التأهيلي", grades: [
    grade("tcs", "lycee", "Tronc Commun Scientifique (TCS)", "الجذع المشترك العلمي", [
      ["Écologie fondamentale", "علم البيئة الأساسي", undefined, [
        ["Techniques de terrain et étude écologique d'un écosystème", "التقنيات الميدانية والدراسة البيئية لنظام بيئي", "terrain|écosystème|relevé", 2],
        ["Les facteurs édaphiques (sol) et distribution des êtres vivants", "العوامل التربوية (التربة) وتوزع الكائنات الحية", "sol|facteur édaphique|distribution", 2],
        ["Les facteurs climatiques et répartition des espèces (climagrammes)", "العوامل المناخية وتوزع الأنواع (المخططات المناخية)", "climat|climagramme|espèce", 2],
        ["Flux de matière et flux d'énergie dans l'écosystème", "تدفق المادة والطاقة في النظام البيئي", "biomasse|énergie|réseau trophique", 2],
        ["Dynamisme des écosystèmes et notion de climax", "دينامية الأنظمة البيئية ومفهوم الذروة", "succession écologique|climax|écosystème", 2],
      ]],
      ["Reproduction chez les végétaux", "التوالد عند النباتات", undefined, [
        ["Reproduction sexuée chez les Angiospermes (double fécondation)", "التوالد الجنسي عند كاسيات البذور (الإخصاب المزدوج)", "Angiospermes|fleur|double fécondation", 2],
        ["Reproduction sexuée chez les Gymnospermes (conifères)", "التوالد الجنسي عند عاريات البذور (الصنوبريات)", "Gymnospermes|cône|pollen", 2],
        ["Reproduction sexuée chez les plantes sans fleurs (Ptéridophytes, Bryophytes)", "التوالد الجنسي عند النباتات اللازهرية (السرخسيات والحزازيات)", "Ptéridophytes|Bryophytes|spore", 2],
        ["Les cycles de développement et alternance des phases chromosomiques", "دورات النمو وتعاقب الأطوار الصبغية", "cycle de développement|haploïde|diploïde", 2],
        ["Reproduction asexuée, multiplication végétative et biotechnologies", "التوالد اللاجنسي والتكاثر الخضري والتقانات الحيوية", "reproduction asexuée|bouturage|biotechnologie", 2],
      ]],
    ]),
    grade("tcl", "lycee", "Tronc Commun Lettres et Sciences Humaines (TCL)", "الجذع المشترك آداب وعلوم إنسانية", [
      ["L'Homme et l'environnement", "الإنسان والبيئة", undefined, [
        ["Impacts environnementaux, pollutions et ressources", "الآثار البيئية والتلوث والموارد", "pollution|environnement|ressource", 2],
      ]],
      ["Santé et alimentation humaine", "الصحة والتغذية البشرية", undefined, [
        ["Besoins nutritionnels et hygiène", "الاحتياجات الغذائية والنظافة الصحية", "nutrition|hygiène|santé", 2],
      ]],
    ]),
    grade("1bac-se", "lycee", "1ère Bac Sciences Expérimentales (1BAC SE)", "الأولى باك علوم تجريبية", [
      ["Phénomènes géologiques externes", "الظواهر الجيولوجية الخارجية", undefined, [
        ["Réalisation de la carte paléogéographique d'un bassin sédimentaire", "إنجاز خريطة الجغرافيا القديمة لحوض رسوبي", "paléogéographie|bassin sédimentaire|carte", 2],
        ["Reconstitution de l'histoire géologique d'une région sédimentaire (stratigraphie)", "إعادة بناء التاريخ الجيولوجي لمنطقة رسوبية (الطباقية)", "stratigraphie|fossile|histoire géologique", 2],
      ]],
      ["Production de matière organique et flux d'énergie (Autotrophie)", "إنتاج المادة العضوية وتدفق الطاقة (التغذية الذاتية)", undefined, [
        ["Mécanismes d'absorption de l'eau et des sels minéraux (osmose, turgescence)", "آليات امتصاص الماء والأملاح المعدنية (التنافذ والانتفاخ)", "osmose|turgescence|absorption", 2],
        ["Échanges gazeux chlorophylliens et structure stomatique", "التبادلات الغازية اليخضورية وبنية الثغور", "stomate|échange gazeux|chlorophylle", 2],
        ["Captation de la lumière et réactions photochimiques (phase claire)", "التقاط الضوء والتفاعلات الضوئية (المرحلة المضيئة)", "photosynthèse|lumière|réaction photochimique", 2],
        ["Synthèse et devenir de la matière organique (phase sombre, cycle de Calvin)", "تركيب المادة العضوية ومصيرها (المرحلة المظلمة ودورة كالفن)", "cycle de Calvin|matière organique|fixation du carbone", 2],
      ]],
      ["La communication hormonale", "التواصل الهرموني", undefined, [
        ["Régulation de la glycémie et notion d'hormone", "تنظيم سكر الدم ومفهوم الهرمون", "glycémie|hormone|régulation", 2],
        ["Rôle du pancréas endocrine (sécrétion de l'insuline et du glucagon)", "دور البنكرياس الصم (إفراز الأنسولين والغلوكاغون)", "pancréas|insuline|glucagon", 2],
      ]],
      ["La communication nerveuse", "التواصل العصبي", undefined, [
        ["Structure du neurone et potentiels membranaires (repos et action)", "بنية العصبون والجهود الغشائية (الراحة والعمل)", "neurone|potentiel de repos|potentiel d'action", 2],
        ["Mécanismes de la transmission synaptique du message nerveux", "آليات انتقال السيالة العصبية عبر المشبك", "synapse|neurotransmetteur|message nerveux", 2],
      ]],
    ]),
    grade("1bac-sm", "lycee", "1ère Bac Sciences Mathématiques (1BAC SM)", "الأولى باك علوم رياضية", [
      ["Phénomènes géologiques externes", "الظواهر الجيولوجية الخارجية", undefined, [
        ["Sédimentologie et paléogéographie", "الرسوبيات والجغرافيا القديمة", "sédimentologie|paléogéographie|bassin", 2],
      ]],
      ["Matériel génétique et génie génétique", "المادة الوراثية والهندسة الوراثية", undefined, [
        ["Nature chimique et localisation de l'information génétique (ADN)", "الطبيعة الكيميائية للخبر الوراثي وموقعه (الحمض النووي ADN)", "ADN|chromosome|information génétique", 2],
        ["Mécanismes d'expression de l'information génétique (transcription, traduction)", "آليات التعبير عن الخبر الوراثي (النسخ والترجمة)", "transcription|traduction|protéine", 2],
        ["Principes, enzymes et applications du génie génétique", "مبادئ الهندسة الوراثية وإنزيماتها وتطبيقاتها", "enzyme de restriction|plasmide|génie génétique", 2],
      ]],
    ]),
    grade("2bac-svt", "lycee", "2ème Bac Sciences de la Vie et de la Terre (2BAC SVT / Examen national)", "الثانية باك علوم الحياة والأرض (الامتحان الوطني)", [
      ["Consommation de matière organique et flux d'énergie", "استهلاك المادة العضوية وتدفق الطاقة", undefined, [
        ["Libération de l'énergie par respiration mitochondriale et fermentations", "تحرير الطاقة بالتنفس الميتوكوندري والتخمرات", "mitochondrie|respiration|fermentation|ATP", 3],
        ["Rôle du muscle strié squelettique dans la conversion énergétique (ATP et sarcomère)", "دور العضلة الهيكلية المخططة في تحويل الطاقة (ATP والقطعة العضلية)", "muscle|sarcomère|ATP", 2],
      ]],
      ["Matériel génétique et son expression", "المادة الوراثية والتعبير عنها", undefined, [
        ["Nature et réplication de l'ADN (cycle cellulaire, mitose)", "طبيعة ADN وتضاعفه (الدورة الخلوية والانقسام غير المباشر)", "ADN|réplication|mitose", 2],
        ["Transcription, code génétique, traduction et mutations", "النسخ والشفرة الوراثية والترجمة والطفرات", "transcription|code génétique|mutation", 3],
        ["Le génie génétique et les biotechnologies modernes", "الهندسة الوراثية والتقانات الحيوية الحديثة", "génie génétique|transgénèse|biotechnologie", 2],
      ]],
      ["Transmission de l'information génétique par reproduction sexuée", "انتقال الخبر الوراثي بالتوالد الجنسي", undefined, [
        ["La méiose et les brassages chromosomiques (inter et intrachromosomiques)", "الانقسام الاختزالي والتخليط الصبغي (بين الصبغيات وداخلها)", "méiose|brassage|crossing-over", 3],
        ["La fécondation et la diversité allélique", "الإخصاب والتنوع الأليلي", "fécondation|allèle|diversité", 2],
        ["Les lois statistiques de Mendel (monohybridisme, dihybridisme, linkage, cartes factorielles)", "قوانين مندل الإحصائية (الهجونة الأحادية والثنائية والارتباط والخرائط العاملية)", "Mendel|dihybridisme|linkage|carte factorielle", 3],
      ]],
      ["Génétique humaine et génétique des populations", "الوراثة البشرية ووراثة الساكنات", undefined, [
        ["Transmission des anomalies héréditaires chez l'Homme (pedigrees)", "انتقال الأمراض الوراثية عند الإنسان (شجرات النسب)", "pedigree|hérédité|anomalie", 2],
        ["Équilibre de Hardy-Weinberg (p² + 2pq + q² = 1) et génétique des populations", "توازن هاردي-واينبرغ (p² + 2pq + q² = 1) ووراثة الساكنات", "Hardy-Weinberg|fréquence allélique|population", 2],
      ]],
      ["Immunologie", "علم المناعة", undefined, [
        ["Marqueurs du soi (CMH) et distinction du non-soi", "واسمات الذات (CMH) والتمييز بين الذات وغير الذات", "CMH|soi|antigène", 2],
        ["Réaction inflammatoire et immunité innée non spécifique", "الاستجابة الالتهابية والمناعة الفطرية غير النوعية", "inflammation|phagocytose|immunité innée", 2],
        ["Réponses immunitaires adaptatives spécifiques (humorale et cellulaire)", "الاستجابات المناعية التكيفية النوعية (الخلطية والخلوية)", "lymphocyte|anticorps|immunité cellulaire", 3],
        ["Dysfonctionnements immunitaires (allergies, VIH) et aides médicales", "الاختلالات المناعية (الحساسية وفيروس نقص المناعة) ووسائل الدعم الطبي", "allergie|VIH|vaccination", 2],
      ]],
      ["Géodynamique interne et formation des chaînes de montagnes", "الجيودينامية الداخلية وتكوّن السلاسل الجبلية", undefined, [
        ["Chaînes de montagnes récentes (subduction, obduction, collision)", "السلاسل الجبلية الحديثة (الطمر والطفو والاصطدام)", "subduction|obduction|collision", 2],
        ["Déformations tectoniques ductiles (plis) et cassantes (failles, charriages)", "التشوهات التكتونية اللدنة (الطيات) والهشة (الفوالق والزحافات)", "pli|faille|charriage", 2],
        ["Métamorphisme régional, thermodynamique et séquences métamorphiques", "التحول الإقليمي والدينامية الحرارية والسلاسل التحولية", "métamorphisme|pression|température", 3],
        ["Granitisation et anatexie crustale", "تكوّن الغرانيت والانصهار الجزئي للقشرة", "granitisation|anatexie|croûte", 2],
      ]],
    ]),
    grade("2bac-pc", "lycee", "2ème Bac Sciences Physiques (2BAC PC)", "الثانية باك علوم فيزيائية", [
      ["Consommation de matière organique et flux d'énergie", "استهلاك المادة العضوية وتدفق الطاقة", undefined, [
        ["Bioénergétique et contraction musculaire", "الطاقة الحيوية والتقلص العضلي", "bioénergétique|ATP|muscle", 2],
      ]],
      ["Transmission de l'information génétique par reproduction sexuée", "انتقال الخبر الوراثي بالتوالد الجنسي", undefined, [
        ["Méiose, fécondation et mutations", "الانقسام الاختزالي والإخصاب والطفرات", "méiose|fécondation|mutation", 2],
      ]],
      ["Utilisation des matières organiques et inorganiques", "استعمال المواد العضوية وغير العضوية", undefined, [
        ["Gestion, tri et valorisation des ordures ménagères (compostage, méthanisation)", "تدبير النفايات المنزلية وفرزها وتثمينها (التسميد والهضم اللاهوائي)", "déchets|compostage|méthanisation", 2],
        ["Pollutions de l'air, de l'eau et du sol (SO2, NOx, effet de serre, eutrophisation)", "تلوث الهواء والماء والتربة (SO2 وNOx والاحتباس الحراري والتخثث)", "pollution|effet de serre|eutrophisation", 2],
        ["Matières radioactives, énergie nucléaire et gestion des déchets radioactifs", "المواد المشعة والطاقة النووية وتدبير النفايات المشعة", "radioactivité|énergie nucléaire|déchet", 2],
        ["Surveillance et indicateurs de la qualité des milieux (DBO5, DCO, indices biotiques)", "مراقبة جودة الأوساط ومؤشراتها (DBO5 وDCO والمؤشرات الحيوية)", "DBO5|DCO|indice biotique", 2],
      ]],
      ["Géodynamique interne et formation des chaînes de montagnes", "الجيودينامية الداخلية وتكوّن السلاسل الجبلية", undefined, [
        ["Orogenèse, métamorphisme et anatexie", "تكوّن السلاسل الجبلية والتحول والانصهار الجزئي", "orogenèse|métamorphisme|anatexie", 2],
      ]],
    ]),
    grade("2bac-sm", "lycee", "2ème Bac Sciences Mathématiques (2BAC SM)", "الثانية باك علوم رياضية", [
      ["Méiose et lois statistiques de Mendel", "الانقسام الاختزالي وقوانين مندل الإحصائية", undefined, [
        ["Formalisation probabiliste, crossing-over et test-cross", "الصياغة الاحتمالية والعبور الوراثي والتزاوج الاختباري", "probabilité|crossing-over|test-cross", 2],
      ]],
      ["Génétique des populations", "وراثة الساكنات", undefined, [
        ["Modélisation de Hardy-Weinberg, sélection, dérive et mutations", "نمذجة هاردي-واينبرغ والانتقاء والانحراف والطفرات", "Hardy-Weinberg|sélection|dérive|mutation", 2],
      ]],
    ]),
  ] },
];
