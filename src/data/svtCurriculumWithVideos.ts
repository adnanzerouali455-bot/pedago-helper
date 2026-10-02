export interface VideoResource {
  title: string;
  channel: string;
  youtubeId: string;
  url: string;
}

export interface SVTChapter {
  id: string;
  titleFr: string;
  titleAr: string;
  chapterNumber: number;
  durationMin: number;
  keywords: string[];
  video?: VideoResource;
}

export interface SVTUnit {
  unitId: string;
  titleFr: string;
  titleAr: string;
  semester: 1 | 2;
  chapters: SVTChapter[];
}

export interface SVTGrade {
  gradeId: '1AC' | '2AC' | '3AC' | 'TCS' | 'TCL' | '1BAC_SE' | '1BAC_SM' | '2BAC_SVT' | '2BAC_PC' | '2BAC_SM';
  cycle: 'college' | 'lycee';
  labelFr: string;
  labelAr: string;
  units: SVTUnit[];
}

export const svtCurriculumWithVideos: SVTGrade[] = [
  // ==========================================
  // I. CYCLE COLLÉGIAL
  // ==========================================
  {
    gradeId: '1AC',
    cycle: 'college',
    labelFr: '1ère Année Collège (1AC)',
    labelAr: 'الأولى إعدادي',
    units: [
      {
        unitId: '1ac-s1',
        titleFr: 'Relations trophiques dans les milieux naturels',
        titleAr: 'العلاقات الغذائية في الأوساط الطبيعية',
        semester: 1,
        chapters: [
          {
            id: '1ac-s1-c1',
            chapterNumber: 1,
            titleFr: "Exploration d'un milieu naturel et notion de cellule",
            titleAr: 'استكشاف وسط طبيعي ومفهوم الخلية',
            durationMin: 55,
            keywords: ['Milieu naturel', 'Cellule', 'Microscope', 'Unité du vivant'],
            video: {
              title: "La division cellulaire et la cellule",
              channel: "LinExplain",
              youtubeId: "oH-lOJFex7I",
              url: "https://www.youtube.com/watch?v=oH-lOJFex7I"
            }
          },
          {
            id: '1ac-s1-c2',
            chapterNumber: 2,
            titleFr: 'La respiration dans différents milieux de vie',
            titleAr: 'التنفس في أوساط عيش مختلفة',
            durationMin: 55,
            keywords: ['Respiration branchiale', 'Trachéenne', 'Pulmonaire', 'Échanges gazeux'],
            video: {
              title: "Au coeur des organes : La respiration",
              channel: "Inserm",
              youtubeId: "inddRD24G3w",
              url: "https://www.youtube.com/watch?v=inddRD24G3w"
            }
          },
          {
            id: '1ac-s1-c3',
            chapterNumber: 3,
            titleFr: "L'alimentation des êtres vivants et régimes alimentaires",
            titleAr: 'التغذية عند الكائنات الحية والأنظمة الغذائية',
            durationMin: 55,
            keywords: ['Herbivore', 'Carnivore', 'Dentition', 'Tube digestif']
          },
          {
            id: '1ac-s1-c4',
            chapterNumber: 4,
            titleFr: 'Relations trophiques et flux de matière/énergie',
            titleAr: 'العلاقات الغذائية وتدفق المادة والطاقة',
            durationMin: 55,
            keywords: ['Chaîne alimentaire', 'Réseau trophique', 'Biomasse', 'Producteurs']
          },
          {
            id: '1ac-s1-c5',
            chapterNumber: 5,
            titleFr: 'Classification des êtres vivants et biodiversité',
            titleAr: 'تصنيف الكائنات الحية وحماية التنوع البيولوجي',
            durationMin: 55,
            keywords: ['Clé de détermination', 'Biodiversité', 'Espèce']
          }
        ]
      },
      {
        unitId: '1ac-s2',
        titleFr: 'Phénomènes géologiques externes',
        titleAr: 'الظواهر الجيولوجية الخارجية',
        semester: 2,
        chapters: [
          {
            id: '1ac-s2-c1',
            chapterNumber: 1,
            titleFr: 'La sortie géologique et observation des paysages',
            titleAr: 'الخرجة الجيولوجية وملاحظة المناظر الطبيعية',
            durationMin: 55,
            keywords: ['Stratigraphie', 'Affleurement', 'Relief']
          },
          {
            id: '1ac-s2-c2',
            chapterNumber: 2,
            titleFr: "L'altération des roches et l'érosion sédimentaire",
            titleAr: 'تجوية وحت الصخور والتعرية',
            durationMin: 55,
            keywords: ['Érosion mécanique', 'Altération chimique', 'Sédiments']
          },
          {
            id: '1ac-s2-c3',
            chapterNumber: 3,
            titleFr: "Le transport des sédiments par l'eau et le vent",
            titleAr: 'نقل الرواسب بواسطة الماء والرياح',
            durationMin: 55,
            keywords: ['Courant', 'Diagramme de Hjulström', 'Granulométrie']
          },
          {
            id: '1ac-s2-c4',
            chapterNumber: 4,
            titleFr: 'La sédimentation et les milieux de dépôt',
            titleAr: 'الترسب وأوساط الترسب',
            durationMin: 55,
            keywords: ['Milieu marin', 'Milieu lagunaire', 'Sédimentation fluviatile']
          },
          {
            id: '1ac-s2-c5',
            chapterNumber: 5,
            titleFr: 'La diagénèse et la formation des roches sédimentaires',
            titleAr: 'التصخر وتشكل الصخور الرسوبية',
            durationMin: 55,
            keywords: ['Compaction', 'Cimentation', 'Calcaire', 'Grès']
          },
          {
            id: '1ac-s2-c6',
            chapterNumber: 6,
            titleFr: "L'échelle des temps géologiques et les fossiles",
            titleAr: 'السلم الاستراتيغرافي والمستحاثات',
            durationMin: 55,
            keywords: ['Fossile stratigraphique', 'Ères géologiques', 'Datation relative']
          },
          {
            id: '1ac-s2-c7',
            chapterNumber: 7,
            titleFr: 'Les ressources hydriques et leur gestion durable',
            titleAr: 'الموارد المائية وتدبيرها المستدام',
            durationMin: 55,
            keywords: ['Nappe phréatique', 'Cycle de l’eau', 'Pollution aquatique']
          }
        ]
      }
    ]
  },

  {
    gradeId: '2AC',
    cycle: 'college',
    labelFr: '2ème Année Collège (2AC)',
    labelAr: 'الثانية إعدادي',
    units: [
      {
        unitId: '2ac-s1',
        titleFr: 'Phénomènes géologiques internes',
        titleAr: 'الظواهر الجيولوجية الباطنية',
        semester: 1,
        chapters: [
          {
            id: '2ac-s1-c1',
            chapterNumber: 1,
            titleFr: 'La théorie de la tectonique des plaques',
            titleAr: 'نظرية تكتونية الصفائح',
            durationMin: 55,
            keywords: ['Dérive des continents', 'Dorsale océanique', 'Convection mantellique'],
            video: {
              title: "LA TECTONIQUE DES PLAQUES",
              channel: "bright blue",
              youtubeId: "Iojl8H-kJCU",
              url: "https://www.youtube.com/watch?v=Iojl8H-kJCU"
            }
          },
          {
            id: '2ac-s1-c2',
            chapterNumber: 2,
            titleFr: 'Les séismes et la dynamique des plaques',
            titleAr: 'الزلازل وعلاقتها بحركية الصفائح',
            durationMin: 55,
            keywords: ['Ondes P et S', 'Épicentre', 'Foyer sismique', 'Sismographe'],
            video: {
              title: "[Comment ça marche ?] L’origine des séismes",
              channel: "CEA",
              youtubeId: "eMotO_iyo-I",
              url: "https://www.youtube.com/watch?v=eMotO_iyo-I"
            }
          },
          {
            id: '2ac-s1-c3',
            chapterNumber: 3,
            titleFr: 'Le volcanisme et ses types (effusif et explosif)',
            titleAr: 'البركانية وأنواع البراكين (طفحي وانفجاري)',
            durationMin: 55,
            keywords: ['Magma', 'Lave', 'Nuée ardente', 'Dôme volcanique']
          },
          {
            id: '2ac-s1-c4',
            chapterNumber: 4,
            titleFr: 'La formation des roches magmatiques plutoniques et volcaniques',
            titleAr: 'تشكل الصخور الصهارية البلوتونية والبركانية',
            durationMin: 55,
            keywords: ['Basalte', 'Granite', 'Structure microlitique', 'Structure grenue']
          },
          {
            id: '2ac-s1-c5',
            chapterNumber: 5,
            titleFr: 'Les déformations tectoniques : failles et plis',
            titleAr: 'التشوهات التكتونية : الفوالق والطيات',
            durationMin: 55,
            keywords: ['Pli anticlinal', 'Synclinal', 'Faille normale', 'Faille inverse']
          },
          {
            id: '2ac-s1-c6',
            chapterNumber: 6,
            titleFr: 'La formation des chaînes de montagnes récentes',
            titleAr: 'تشكل السلاسل الجبلية الحديثة',
            durationMin: 55,
            keywords: ['Subduction', 'Collision', 'Orogenèse'],
            video: {
              title: "Subduction et formation des montagnes",
              channel: "Editions Larousse",
              youtubeId: "bOE75MsLVos",
              url: "https://www.youtube.com/watch?v=bOE75MsLVos"
            }
          }
        ]
      },
      {
        unitId: '2ac-s2',
        titleFr: 'Reproduction et transmission de la vie',
        titleAr: 'التوالد وانتقال الحياة',
        semester: 2,
        chapters: [
          {
            id: '2ac-s2-c1',
            chapterNumber: 1,
            titleFr: 'La reproduction sexuée chez les animaux',
            titleAr: 'التوالد الجنسي عند الحيوانات',
            durationMin: 55,
            keywords: ['Gamètes', 'Fécondation', 'Oviparité', 'Viviparité']
          },
          {
            id: '2ac-s2-c2',
            chapterNumber: 2,
            titleFr: 'La reproduction sexuée chez les végétaux',
            titleAr: 'التوالد الجنسي عند النباتات',
            durationMin: 55,
            keywords: ['Pollen', 'Pistil', 'Fécondation', 'Graine']
          },
          {
            id: '2ac-s2-c3',
            chapterNumber: 3,
            titleFr: "La reproduction chez l'Homme et contraception",
            titleAr: 'التوالد عند الإنسان ومنع الحمل',
            durationMin: 55,
            keywords: ['Cycle ovarien', 'Nidation', 'Grossesse', 'Contraception']
          },
          {
            id: '2ac-s2-c4',
            chapterNumber: 4,
            titleFr: "L'hérédité humaine et les chromosomes",
            titleAr: 'الوراثة عند الإنسان والصبغيات',
            durationMin: 55,
            keywords: ['Caryotype', 'Allèles', 'Maladie héréditaire', 'Trisomie']
          }
        ]
      }
    ]
  },

  {
    gradeId: '3AC',
    cycle: 'college',
    labelFr: '3ème Année Collège (3AC)',
    labelAr: 'الثالثة إعدادي (الامتحان الجهوي)',
    units: [
      {
        unitId: '3ac-s1',
        titleFr: 'Fonctions de nutrition et éducation sanitaire',
        titleAr: 'وظائف الاقتيات والتربية الصحية',
        semester: 1,
        chapters: [
          {
            id: '3ac-s1-c1',
            chapterNumber: 1,
            titleFr: 'La digestion des aliments et absorption intestinale',
            titleAr: 'هضم الأغذية والامتصاص المعوي',
            durationMin: 55,
            keywords: ['Enzymes', 'Nutriments', 'Villosités intestinales'],
            video: {
              title: "Comment fonctionne le système digestif humain ? (Animation)",
              channel: "Thomas Schwenke FR",
              youtubeId: "EL8VZC7Tx48",
              url: "https://www.youtube.com/watch?v=EL8VZC7Tx48"
            }
          },
          {
            id: '3ac-s1-c2',
            chapterNumber: 2,
            titleFr: 'Éducation nutritionnelle et rations alimentaires',
            titleAr: 'التربية الغذائية والكلتات الغذائية',
            durationMin: 55,
            keywords: ['Carences', 'Rachitisme', 'Score énergétique']
          },
          {
            id: '3ac-s1-c3',
            chapterNumber: 3,
            titleFr: 'La respiration cellulaire et échanges gazeux',
            titleAr: 'التنفس الخلوي والتبادلات الغازية اليخضورية',
            durationMin: 55,
            keywords: ['Alvéoles', 'Hémoglobine', 'Oxygénation tissulaire']
          },
          {
            id: '3ac-s1-c4',
            chapterNumber: 4,
            titleFr: 'Le sang et appareil circulatoire cardiovasculaire',
            titleAr: 'الدم والجهاز الدوراني القلبي',
            durationMin: 55,
            keywords: ['Révolution cardiaque', 'Artères', 'Veines', 'Capillaires']
          },
          {
            id: '3ac-s1-c5',
            chapterNumber: 5,
            titleFr: "L'excrétion urinaire et anatomie fonctionnelle du rein",
            titleAr: 'الإبراز البولي والتنظيم الوظيفي للكلية',
            durationMin: 55,
            keywords: ['Néphron', 'Filtration', 'Réabsorption', 'Urine']
          }
        ]
      },
      {
        unitId: '3ac-s2',
        titleFr: 'Fonctions de communication et immunologie',
        titleAr: 'وظائف الربط وعلم المناعة',
        semester: 2,
        chapters: [
          {
            id: '3ac-s2-c1',
            chapterNumber: 1,
            titleFr: 'Le système nerveux : motricité volontaire et réflexe',
            titleAr: 'الجهاز العصبي : التحركية الإرادية والانعكاسية',
            durationMin: 55,
            keywords: ['Moelle épinière', 'Neurone', 'Arc réflexe', 'Synapse'],
            video: {
              title: "Fonctionnement de la synapse neuromusculaire",
              channel: "Animation Biologie",
              youtubeId: "hhsdtZMy1l8",
              url: "https://www.youtube.com/watch?v=hhsdtZMy1l8"
            }
          },
          {
            id: '3ac-s2-c2',
            chapterNumber: 2,
            titleFr: 'Le système musculaire et contraction du muscle strié',
            titleAr: 'الجهاز العضلي وتقلص العضلة المخططة',
            durationMin: 55,
            keywords: ['Élasticité', 'Fibre musculaire', 'Plaque motrice'],
            video: {
              title: "Au coeur des organes : Le muscle, moteur du mouvement",
              channel: "Inserm",
              youtubeId: "REWwSmnYuM0",
              url: "https://www.youtube.com/watch?v=REWwSmnYuM0"
            }
          },
          {
            id: '3ac-s2-c3',
            chapterNumber: 3,
            titleFr: 'Les microorganismes pathogènes et bactéries',
            titleAr: 'المتعضيات المجهرية الممرضة والبكتيريا',
            durationMin: 55,
            keywords: ['Bactéries', 'Virus', 'Toxines', 'Multiplication']
          },
          {
            id: '3ac-s2-c4',
            chapterNumber: 4,
            titleFr: 'Le système immunitaire : défenses innées et acquises',
            titleAr: 'الجهاز المناعي : المناعة الفطرية والمكتسبة',
            durationMin: 55,
            keywords: ['Phagocytose', 'Lymphocyte B', 'Lymphocyte T', 'Anticorps'],
            video: {
              title: "Les étapes de la phagocytose",
              channel: "Animation Biologie",
              youtubeId: "kt7RsW4IQ9s",
              url: "https://www.youtube.com/watch?v=kt7RsW4IQ9s"
            }
          },
          {
            id: '3ac-s2-c5',
            chapterNumber: 5,
            titleFr: 'Dysfonctionnements immunitaires (allergies, VIH/SIDA)',
            titleAr: 'اضطرابات الجهاز المناعي (الأرجيات، السيدا)',
            durationMin: 55,
            keywords: ['Allergène', 'Histamine', 'VIH', 'Immunodéficience']
          },
          {
            id: '3ac-s2-c6',
            chapterNumber: 6,
            titleFr: 'Les groupes sanguins et transfusion sanguine',
            titleAr: 'الفصائل الدموية والتحاقن الدموي',
            durationMin: 55,
            keywords: ['Système ABO', 'Facteur Rhésus', 'Agglutination']
          }
        ]
      }
    ]
  },

  // ==========================================
  // II. CYCLE SECONDAIRE QUALIFIANT (LYCÉE)
  // ==========================================
  {
    gradeId: 'TCS',
    cycle: 'lycee',
    labelFr: 'Tronc Commun Scientifique (TCS)',
    labelAr: 'الجذع المشترك العلمي',
    units: [
      {
        unitId: 'tcs-u1',
        titleFr: 'Écologie fondamentale',
        titleAr: 'علم البيئة الأساسي',
        semester: 1,
        chapters: [
          {
            id: 'tcs-u1-c1',
            chapterNumber: 1,
            titleFr: "Techniques de terrain et étude d'un écosystème",
            titleAr: 'تقنيات الميدان ودراسة حميلة بيئية',
            durationMin: 55,
            keywords: ['Relevé floristique', 'Quadrat', 'Strates végétales']
          },
          {
            id: 'tcs-u1-c2',
            chapterNumber: 2,
            titleFr: 'Facteurs édaphiques (sol) et distribution des êtres vivants',
            titleAr: 'العوامل التربوية وتوزيع الكائنات الحية',
            durationMin: 55,
            keywords: ['Texture', 'Structure', 'Capacité de rétention en eau']
          },
          {
            id: 'tcs-u1-c3',
            chapterNumber: 3,
            titleFr: 'Facteurs climatiques et répartition des espèces',
            titleAr: 'العوامل المناخية وتوزيع الأنواع',
            durationMin: 55,
            keywords: ['Climagramme d’Emberger', 'Diagramme Gaussen', 'Facteur limitant']
          },
          {
            id: 'tcs-u1-c4',
            chapterNumber: 4,
            titleFr: "Flux de matière et flux d'énergie dans l'écosystème",
            titleAr: 'تدفق المادة وتدفق الطاقة داخل الحميلة البيئية',
            durationMin: 55,
            keywords: ['Pyramide des biomasses', 'Rendement écologique', 'Réseau trophique']
          },
          {
            id: 'tcs-u1-c5',
            chapterNumber: 5,
            titleFr: 'Dynamisme des écosystèmes et notion de climax',
            titleAr: 'دينامية الحمائل البيئية ومفهوم الذروة',
            durationMin: 55,
            keywords: ['Succession écologique', 'Climax', 'Régénération']
          }
        ]
      },
      {
        unitId: 'tcs-u2',
        titleFr: 'Reproduction chez les végétaux',
        titleAr: 'التوالد عند النباتات',
        semester: 2,
        chapters: [
          {
            id: 'tcs-u2-c1',
            chapterNumber: 1,
            titleFr: 'Reproduction sexuée chez les Angiospermes',
            titleAr: 'التوالد الجنسي عند كاسيات البذور',
            durationMin: 55,
            keywords: ['Fleur', 'Double fécondation', 'Graine', 'Fruit'],
            video: {
              title: "Les étapes de la méiose (Animation)",
              channel: "Le coin des biologistes",
              youtubeId: "NyVsr_lO_qE",
              url: "https://www.youtube.com/watch?v=NyVsr_lO_qE"
            }
          },
          {
            id: 'tcs-u2-c2',
            chapterNumber: 2,
            titleFr: 'Reproduction sexuée chez les Gymnospermes',
            titleAr: 'التوالد الجنسي عند عاريات البذور',
            durationMin: 55,
            keywords: ['Cône', 'Ovule nu', 'Pollen ailé']
          },
          {
            id: 'tcs-u2-c3',
            chapterNumber: 3,
            titleFr: 'Reproduction sexuée chez les plantes sans fleurs',
            titleAr: 'التوالد الجنسي عند النباتات اللازهرية',
            durationMin: 55,
            keywords: ['Fougère', 'Mousse', 'Prothalle', 'Spores']
          },
          {
            id: 'tcs-u2-c4',
            chapterNumber: 4,
            titleFr: 'Cycles de développement et alternance chromosomique',
            titleAr: 'دورات النمو وتناوب الأطوار الصبغية',
            durationMin: 55,
            keywords: ['Haplophasique', 'Diplophasique', 'Cycle haplodiplophasique']
          },
          {
            id: 'tcs-u2-c5',
            chapterNumber: 5,
            titleFr: 'Reproduction asexuée et biotechnologies',
            titleAr: 'التكاثر اللاجنسي والبيوتكنولوجيا',
            durationMin: 55,
            keywords: ['Bouturage', 'Greffage', 'Micropropagation in vitro']
          }
        ]
      }
    ]
  },

  {
    gradeId: '1BAC_SE',
    cycle: 'lycee',
    labelFr: '1ère Année Bac Sciences Expérimentales (1BAC SE)',
    labelAr: 'الأولى باك علوم تجريبية',
    units: [
      {
        unitId: '1bac-u2',
        titleFr: 'Production de matière organique et flux d’énergie',
        titleAr: 'إنتاج المادة العضوية وتدفق الطاقة (الذاتية التغذية)',
        semester: 1,
        chapters: [
          {
            id: '1bac-u2-c1',
            chapterNumber: 1,
            titleFr: "Absorption de l'eau et des sels minéraux",
            titleAr: 'آليات امتصاص الماء والأملاح المعدنية',
            durationMin: 55,
            keywords: ['Osmose', 'Turgescence', 'Plasmolyse', 'Poils absorbants']
          },
          {
            id: '1bac-u2-c2',
            chapterNumber: 2,
            titleFr: 'Échanges gazeux chlorophylliens et stomates',
            titleAr: 'التبادلات الغازية اليخضورية وبنية الثغور',
            durationMin: 55,
            keywords: ['Stomate', 'Transpiration foliaire', 'Ostiole']
          },
          {
            id: '1bac-u2-c3',
            chapterNumber: 3,
            titleFr: 'Captation de la lumière et réactions photochimiques',
            titleAr: 'التقاط الضوء والتفاعلات الكيميائية الضوئية (المرحلة المضاءة)',
            durationMin: 55,
            keywords: ['Chloroplaste', 'Thylakoïde', 'Photosystèmes', 'Photolyse de l’eau'],
            video: {
              title: "La photosynthèse dans le chloroplaste",
              channel: "Joyez SVT",
              youtubeId: "v8w97Rk36ys",
              url: "https://www.youtube.com/watch?v=v8w97Rk36ys"
            }
          },
          {
            id: '1bac-u2-c4',
            chapterNumber: 4,
            titleFr: 'Synthèse de matière organique et cycle de Calvin',
            titleAr: 'تركيب المادة العضوية ودورة كالفن (المرحلة المظلمة)',
            durationMin: 55,
            keywords: ['Cycle de Calvin', 'Fixation du CO2', 'Rubisco', 'Amidon']
          }
        ]
      },
      {
        unitId: '1bac-u3',
        titleFr: 'La communication hormonale (Régulation de la glycémie)',
        titleAr: 'التواصل الهرموني (تنظيم تحلون الدم)',
        semester: 2,
        chapters: [
          {
            id: '1bac-u3-c1',
            chapterNumber: 1,
            titleFr: 'Régulation de la glycémie et notion d’hormone',
            titleAr: 'تنظيم نسبة السكر في الدم ومفهوم الهرمون',
            durationMin: 55,
            keywords: ['Glycémie normale (1g/L)', 'Homéostasie glucidique'],
            video: {
              title: "Au coeur des organes : La glycémie",
              channel: "Inserm",
              youtubeId: "UoGPhPQPKy8",
              url: "https://www.youtube.com/watch?v=UoGPhPQPKy8"
            }
          },
          {
            id: '1bac-u3-c2',
            chapterNumber: 2,
            titleFr: 'Rôle du pancréas endocrine (Insuline et glucagon)',
            titleAr: 'دور البنكرياس الصماوي (إفراز الأنسولين والغلوكاغون)',
            durationMin: 55,
            keywords: ['Îlots de Langerhans', 'Cellules alpha et bêta', 'Action hypoglycémiante', 'Action hyperglycémiante']
          }
        ]
      },
      {
        unitId: '1bac-u4',
        titleFr: 'La communication nerveuse',
        titleAr: 'التواصل العصبي',
        semester: 2,
        chapters: [
          {
            id: '1bac-u4-c1',
            chapterNumber: 1,
            titleFr: 'Structure du neurone et potentiels membranaires',
            titleAr: 'بنية العصبون والكمونات الغشائية (الراحة والعمل)',
            durationMin: 55,
            keywords: ['Potentiel de repos (-70mV)', 'Potentiel d’action', 'Canaux Na+/K+']
          },
          {
            id: '1bac-u4-c2',
            chapterNumber: 2,
            titleFr: 'Mécanismes de la transmission synaptique',
            titleAr: 'آليات التبليغ المشبكي للرسالة العصبية',
            durationMin: 55,
            keywords: ['Neurotransmetteur', 'Fente synaptique', 'Acétylcholine'],
            video: {
              title: "NEURONES : Comment les synapses transmettent les messages ?",
              channel: "La Science En Schémas",
              youtubeId: "Y9b9jfnMXps",
              url: "https://www.youtube.com/watch?v=Y9b9jfnMXps"
            }
          }
        ]
      }
    ]
  },

  {
    gradeId: '2BAC_SVT',
    cycle: 'lycee',
    labelFr: '2ème Année Bac SVT (2BAC SVT)',
    labelAr: 'الثانية باك علوم الحياة والأرض (الامتحان الوطني)',
    units: [
      {
        unitId: '2bac-svt-u1',
        titleFr: 'Consommation de matière organique et flux d’énergie',
        titleAr: 'استهلاك المادة العضوية وتدفق الطاقة',
        semester: 1,
        chapters: [
          {
            id: '2bac-svt-u1-c1',
            chapterNumber: 1,
            titleFr: 'Respiration cellulaire, cycle de Krebs et fermentations',
            titleAr: 'تحرير الطاقة عبر التنفس الميتوكندري والتخمرات',
            durationMin: 55,
            keywords: ['Glycolyse', 'Cycle de Krebs', 'Phosphorylation oxydative', 'ATP synthase', 'Rendement (38 ATP)'],
            video: {
              title: "Respiration cellulaire : glycolyse, cycle de Krebs et chaîne respiratoire",
              channel: "Joyez SVT",
              youtubeId: "p-Js0e0n02s",
              url: "https://www.youtube.com/watch?v=p-Js0e0n02s"
            }
          },
          {
            id: '2bac-svt-u1-c2',
            chapterNumber: 2,
            titleFr: 'Conversion de l’énergie au niveau du muscle strié squelettique',
            titleAr: 'تحويل الطاقة على مستوى العضلة الهيكلية المخططة',
            durationMin: 55,
            keywords: ['Sarcomère', 'Actine', 'Myosine', 'Calcium Ca2+', 'Hydrolyse de l’ATP'],
            video: {
              title: "Les molécules impliquées dans la contraction musculaire",
              channel: "Nathalie Fabien",
              youtubeId: "HPcoot65QG4",
              url: "https://www.youtube.com/watch?v=HPcoot65QG4"
            }
          }
        ]
      },
      {
        unitId: '2bac-svt-u2',
        titleFr: 'Matériel génétique et son expression',
        titleAr: 'الخبر الوراثي وآلية تعبيره',
        semester: 1,
        chapters: [
          {
            id: '2bac-svt-u2-c1',
            chapterNumber: 1,
            titleFr: 'Nature et réplication semi-conservative de l’ADN',
            titleAr: 'طبيعة ومضاعفة ADN نصف المحافظة',
            durationMin: 55,
            keywords: ['ADN polymérase', 'Cycle cellulaire', 'Mitose', 'Fourche de réplication']
          },
          {
            id: '2bac-svt-u2-c2',
            chapterNumber: 2,
            titleFr: 'Transcription, code génétique, traduction et mutations',
            titleAr: 'النسخ، الرمز الوراثي، الترجمة والطفرات',
            durationMin: 55,
            keywords: ['ARN messager', 'Ribosome', 'Codon', 'Mutation faux-sens'],
            video: {
              title: "La transcription de l'ADN en ARN messager",
              channel: "Le coin des biologistes",
              youtubeId: "jfpzZ88emSE",
              url: "https://www.youtube.com/watch?v=jfpzZ88emSE"
            }
          },
          {
            id: '2bac-svt-u2-c3',
            chapterNumber: 3,
            titleFr: 'Le génie génétique et les biotechnologies',
            titleAr: 'الهندسة الوراثية وتطبيقاتها الحديثة',
            durationMin: 55,
            keywords: ['Enzyme de restriction', 'Plasmide', 'Transgénèse', 'OGM']
          }
        ]
      },
      {
        unitId: '2bac-svt-u3',
        titleFr: 'Transmission de l’information génétique par reproduction sexuée',
        titleAr: 'انتقال الخبر الوراثي عبر التوالد الجنسي والقوانين الإحصائية',
        semester: 2,
        chapters: [
          {
            id: '2bac-svt-u3-c1',
            chapterNumber: 1,
            titleFr: 'La méiose et les brassages chromosomiques',
            titleAr: 'الانقسام الاختزالي والتخليط الصبغي (الضمصبغي والبيصبغي)',
            durationMin: 55,
            keywords: ['Méiose I et II', 'Crossing-over', 'Chiasma', 'Diversité gamétique'],
            video: {
              title: "Les étapes de la méiose (Animation)",
              channel: "Le coin des biologistes",
              youtubeId: "NyVsr_lO_qE",
              url: "https://www.youtube.com/watch?v=NyVsr_lO_qE"
            }
          },
          {
            id: '2bac-svt-u3-c2',
            chapterNumber: 2,
            titleFr: 'La fécondation et la diversité allélique',
            titleAr: 'الإخصاب والتنوع الأليلي',
            durationMin: 55,
            keywords: ['Caryogamie', 'Zygote diploïde', 'Échiquier de croisement']
          },
          {
            id: '2bac-svt-u3-c3',
            chapterNumber: 3,
            titleFr: 'Les lois statistiques de Mendel',
            titleAr: 'القوانين الإحصائية لمندل',
            durationMin: 55,
            keywords: ['Monohybridisme', 'Dihybridisme', 'Gènes liés', 'Test-cross'],
            video: {
              title: "La Génétique mendélienne : Les lois de Mendel",
              channel: "Ma Biologie",
              youtubeId: "_KxF7_WSaVE",
              url: "https://www.youtube.com/watch?v=_KxF7_WSaVE"
            }
          }
        ]
      },
      {
        unitId: '2bac-svt-u4',
        titleFr: 'Génétique humaine et génétique des populations',
        titleAr: 'الوراثة البشرية ووراثة الساكنة',
        semester: 2,
        chapters: [
          {
            id: '2bac-svt-u4-c1',
            chapterNumber: 1,
            titleFr: 'Transmission des anomalies héréditaires chez l’Homme',
            titleAr: 'انتقال الشذوذات والأمراض الوراثية عند الإنسان',
            durationMin: 55,
            keywords: ['Arbre généalogique (pedigree)', 'Autosomique', 'Liée à l’X']
          },
          {
            id: '2bac-svt-u4-c2',
            chapterNumber: 2,
            titleFr: 'Équilibre de Hardy-Weinberg et génétique des populations',
            titleAr: 'قانون هاردي-واينبرغ وعوامل التغير في الساكنة',
            durationMin: 55,
            keywords: ['Fréquences alléliques p et q', 'Dérive génétique', 'Sélection naturelle']
          }
        ]
      },
      {
        unitId: '2bac-svt-u5',
        titleFr: 'Immunologie',
        titleAr: 'علم المناعة',
        semester: 2,
        chapters: [
          {
            id: '2bac-svt-u5-c1',
            chapterNumber: 1,
            titleFr: 'Marqueurs du soi (CMH) et distinction du non-soi',
            titleAr: 'واسمات الذاتي (CMH) والتمييز بين الذاتي وغير الذاتي',
            durationMin: 55,
            keywords: ['Complexe Majeur d’Histocompatibilité', 'Antigène', 'HLA']
          },
          {
            id: '2bac-svt-u5-c2',
            chapterNumber: 2,
            titleFr: 'Réaction inflammatoire et immunité innée',
            titleAr: 'الاستجابة الالتهابية والمناعة الطبيعية الفطرية',
            durationMin: 55,
            keywords: ['Diapédèse', 'Phagocyte', 'Chimiotactisme'],
            video: {
              title: "L'immunité innée: la réaction inflammatoire",
              channel: "Nathalie Fabien",
              youtubeId: "LwaxRva5J68",
              url: "https://www.youtube.com/watch?v=LwaxRva5J68"
            }
          },
          {
            id: '2bac-svt-u5-c3',
            chapterNumber: 3,
            titleFr: 'Réponses immunitaires adaptatives (humorale et cellulaire)',
            titleAr: 'الاستجابات المناعية المسلك الخلطي والخلوي',
            durationMin: 55,
            keywords: ['Plasmocyte', 'Anticorps', 'Lymphocyte T cytotoxique (LTC)', 'Perforine'],
            video: {
              title: "Au coeur des organes : L'immunité adaptative",
              channel: "Inserm",
              youtubeId: "TVoqiqwtbsA",
              url: "https://www.youtube.com/watch?v=TVoqiqwtbsA"
            }
          },
          {
            id: '2bac-svt-u5-c4',
            chapterNumber: 4,
            titleFr: 'Dysfonctionnements immunitaires (VIH, Allergies) et aides',
            titleAr: 'قصور المناعة (السيدا، الأرجيات) وتدعيم الجهاز المناعي',
            durationMin: 55,
            keywords: ['Sérothérapie', 'Vaccination', 'Séropositivité']
          }
        ]
      },
      {
        unitId: '2bac-svt-u6',
        titleFr: 'Géodynamique interne et formation des chaînes de montagnes',
        titleAr: 'الجيولوجيا الباطنية وتشكل السلاسل الجبلية الحديثة والتحول',
        semester: 2,
        chapters: [
          {
            id: '2bac-svt-u6-c1',
            chapterNumber: 1,
            titleFr: 'Chaînes de subduction, d’obduction et de collision',
            titleAr: 'سلاسل الطمر والطفو والاصطدام',
            durationMin: 55,
            keywords: ['Ophiolite', 'Prisme d’accrétion', 'Fosse océanique', 'Collision continentale'],
            video: {
              title: "Animation TS : Histoire d'une chaine de collision",
              channel: "SVT Lycée",
              youtubeId: "JKnqOeEfnas",
              url: "https://www.youtube.com/watch?v=JKnqOeEfnas"
            }
          },
          {
            id: '2bac-svt-u6-c2',
            chapterNumber: 2,
            titleFr: 'Déformations tectoniques : plis, failles et charriages',
            titleAr: 'التشوهات التكتونية : الطيات، الفوالق والراكبات',
            durationMin: 55,
            keywords: ['Nappe de charriage', 'Miroir de faille', 'Contraintes compressives']
          },
          {
            id: '2bac-svt-u6-c3',
            chapterNumber: 3,
            titleFr: 'Métamorphisme régional, thermodynamique et séquences',
            titleAr: 'التحول الحراري الدينامي والمتتاليات التحولية',
            durationMin: 55,
            keywords: ['Foliation', 'Schistosité', 'Minéral index', 'Faciès métamorphique']
          },
          {
            id: '2bac-svt-u6-c4',
            chapterNumber: 4,
            titleFr: 'Granitisation et anatexie crustale',
            titleAr: 'تكون الغرانيت والأناكتية القارية',
            durationMin: 55,
            keywords: ['Migmatite', 'Granite d’anatexie', 'Fusion partielle']
          }
        ]
      }
    ]
  },

  {
    gradeId: '2BAC_PC',
    cycle: 'lycee',
    labelFr: '2ème Année Bac Sciences Physiques (2BAC PC)',
    labelAr: 'الثانية باك علوم فيزيائية',
    units: [
      {
        unitId: '2bac-pc-u3',
        titleFr: 'Utilisation des matières organiques et inorganiques',
        titleAr: 'استعمال المواد العضوية وغير العضوية (خاص بالعلوم الفيزيائية)',
        semester: 2,
        chapters: [
          {
            id: '2bac-pc-u3-c1',
            chapterNumber: 1,
            titleFr: 'Gestion, tri et valorisation des ordures ménagères',
            titleAr: 'تدبير وفرز وتثمين النفايات المنزلية',
            durationMin: 55,
            keywords: ['Compostage', 'Méthanisation (Biogaz)', 'Recyclage', 'Lixiviat']
          },
          {
            id: '2bac-pc-u3-c2',
            chapterNumber: 2,
            titleFr: 'Pollutions de l’air, de l’eau et du sol',
            titleAr: 'تلوث الهواء، الماء والتربة والمشاكل البيئية',
            durationMin: 55,
            keywords: ['Effet de serre', 'Pluies acides', 'Eutrophisation', 'Trou d’ozone']
          },
          {
            id: '2bac-pc-u3-c3',
            chapterNumber: 3,
            titleFr: 'Matières radioactives et déchets nucléaires',
            titleAr: 'المواد الإشعاعية النشاط والنفايات النووية',
            durationMin: 55,
            keywords: ['Demi-vie', 'Rayonnements Alpha/Bêta/Gamma', 'Stockage géologique']
          },
          {
            id: '2bac-pc-u3-c4',
            chapterNumber: 4,
            titleFr: 'Indicateurs de la qualité des milieux',
            titleAr: 'مؤشرات جودة الأوساط البيئية',
            durationMin: 55,
            keywords: ['DBO5 (Demande Biochimique en Oxygène)', 'DCO', 'Indice Biotique (IBGN)']
          }
        ]
      }
    ]
  }
];