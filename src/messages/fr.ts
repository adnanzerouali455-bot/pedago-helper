import type { Messages } from "./types";

export const fr: Messages = {
  nav: { home: "Accueil", spaces: "Les deux espaces", how: "Comment ça marche", open: "Ouvrir l’application", language: "Langue", theme: "Thème", light: "Mode clair", dark: "Mode sombre" },
  hero: {
    badges: ["Neurosciences", "IA", "Éducation"], before: "Plus de temps pour ", accent: "enseigner", after: ", des outils pour mieux apprendre.",
    body: "Un espace enseignant pour préparer des fiches pédagogiques et organiser les séances. Un espace élève pour explorer les notions de SVT à son rythme.",
    open: "Créer mon compte", discover: "Découvrir les deux espaces", demo: "Explorer la démo", available: "Disponible en",
  },
  analysis: {
    label: "FICHE D’ANALYSE PÉDAGOGIQUE", title: "Avant de construire la séance", rows: ["Connaissances préalables", "Notions de départ", "Passages à approfondir", "À aborder plus tard"],
    stamp: "FR · AR · EN", note: "Un exemple de préparation pour une séance de 55 min",
  },
  constat: {
    eyebrow: "LE CONSTAT", title: "Le travail d’un enseignant dépasse largement les heures passées devant ses élèves.",
    subtitle: "Au Maroc, les enseignants du collège décrivent du temps de préparation et de correction ainsi qu’une pression liée à la gestion de classe.",
    metrics: [
      { label: "Préparation des cours", detail: "heures par semaine, enseignants à temps plein" },
      { label: "Corrections", detail: "heures par semaine, enseignants à temps plein" },
      { label: "Discipline en classe", detail: "y voient une source de stress assez ou très importante" },
    ],
    source: "Enquête TALIS 2024, OCDE (Maroc, collège). Données déclaratives.",
    qualification: "Ces chiffres décrivent le travail des enseignants interrogés ; ils ne mesurent pas l’effet de Pedago Helper.",
  },
  spaces: {
    eyebrow: "DEUX ESPACES COMPLÉMENTAIRES", title: "Chacun avance avec les outils dont il a besoin.",
    intro: "Créez votre espace personnel ou explorez la démonstration sans compte.", preview: "Explorer la démo", schoolAction: "Inscrire un établissement",
    teacher: { label: "01 · ENSEIGNANT", title: "Préparer sans perdre la main", body: "Créez des fiches pédagogiques, répartissez les 55 minutes et organisez vos classes et ressources.", features: ["Fiches pédagogiques", "Séances de 55 min", "Documents pour l’établissement et les directions provinciales"], note: "L’enseignant garde l’entière maîtrise de son cours et des documents produits.", action: "Créer mon compte enseignant", photoAlt: "Enseignante préparant une activité de sciences avec des documents, une plante et un microscope" },
    student: { label: "02 · ÉLÈVE / ÉTUDIANT", title: "Comprendre à son rythme", body: "Parcourez les cours de SVT, lisez des textes adaptés et entraînez votre compréhension.", features: ["Parcours par chapitre", "Explications et illustrations", "Révisions actives"], note: "Import automatique de leçon et rapport structuré : fonctions envisagées, non disponibles dans cette démonstration.", action: "Créer mon compte élève", photoAlt: "Élèves étudiant un échantillon végétal au microscope en cours de sciences" },
  },
  how: {
    eyebrow: "LA MÉTHODE", title: "Du cours à une séance claire, étape par étape.",
    steps: [
      { title: "Importer le cours", body: "Un chapitre ou un document sert de point de départ à la préparation." },
      { title: "Analyser le chapitre", body: "Distinguer les acquis, le point de départ et les passages qui demandent plus de temps." },
      { title: "Idées d’illustrations et d’animations", body: "Choisir un schéma, une animation ou une activité qui aide vraiment à comprendre." },
      { title: "Valider la fiche Joudada", body: "Réviser la fiche, le minutage et les ressources avant de les utiliser en classe." },
    ],
    badges: ["Prérequis", "Par où commencer", "À approfondir", "Ce qui peut attendre"],
    note: "L’import et l’analyse automatiques de documents ne sont pas encore disponibles dans cette version de démonstration.",
  },
  science: {
    eyebrow: "SCIENCES DE L’APPRENTISSAGE", title: "Transformer la recherche en décisions pédagogiques utiles.",
    intro: "Les neurosciences, la psychologie cognitive et la didactique inspirent des conseils pour chaque chapitre, sans recettes universelles.",
    cards: [
      { title: "Attention", body: "Commencer par une situation-problème claire et limiter les distractions inutiles." },
      { title: "Mémoire", body: "Faire retrouver les idées importantes grâce à des rappels espacés." },
      { title: "Effort", body: "Ajuster la difficulté et laisser une place à la recherche de l’élève." },
    ],
    ethics: "Sans prétendre analyser directement le cerveau de l’utilisateur. Les gains de temps et les progrès d’apprentissage seront évalués lors des essais auprès des utilisateurs.",
  },
  cta: { eyebrow: "PEDAGO HELPER", title: "Préparer plus sereinement, enseigner avec méthode, apprendre avec confiance.", body: "Créez votre compte pour retrouver votre espace personnel et vos ressources.", action: "Créer mon compte" },
  footer: { legal: "© 2026 Pedago Helper · المساعد البيداغوجي", source: "Source des chiffres : OCDE, TALIS 2024 — Maroc", photoNote: "Photos d’illustration générées par IA." },
};
