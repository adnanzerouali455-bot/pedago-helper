# Pedago Helper — Vercel

Application Next.js réunissant le calendrier, le studio pédagogique, la route serveur `POST /api/ai/generate-joudada` et des espaces de compte Supabase optionnels.

Site publié : https://pedago-helper.vercel.app  
Dépôt GitHub : https://github.com/adnanzerouali455-bot/pedago-helper

Déploiement vérifié le 21 septembre 2026 : `dpl_2E89gGXWZzrmqALq7YJCnntvQmsz` (production). La première publication a été affectée automatiquement à la production par Vercel.

## Catalogue des cours

Le programme SVT détaillé fourni est aussi disponible dans `src/data/svtMoroccoCurriculum.ts` : 2 cycles, 10 niveaux/filières, 28 unités et 86 chapitres. Les types stricts sont dans `src/types/curriculum.ts`, les fonctions de recherche dans `src/lib/curriculumUtils.ts`, et la navigation bilingue dans `src/components/CurriculumNavigation.tsx`. L’enseignant peut choisir un chapitre dans le studio pour préremplir une fiche de 55 minutes ; son identifiant est conservé avec la fiche. L’étudiant peut parcourir le même programme depuis son espace. Les durées de chapitre sont indicatives et peuvent couvrir plusieurs séances. Cette nouvelle arborescence coexiste avec le catalogue historique de 97 choix.

Les fichiers `src/components/curriculum-data.json` et `src/components/svt-chapters.json` réunissent les données fournies : 2 cycles, 6 niveaux et 97 choix de cours, dont 9 de Physique-Chimie en 1AC. Le second fichier apporte 47 chapitres de SVT avec durée indicative et notions clés. Huit chapitres de même titre et de même semestre enrichissent un cours existant au lieu de créer un doublon ; 39 nouveaux choix s’ajoutent au sélecteur. Le formulaire filtre successivement cycle, niveau/filière, matière et semestre, puis préremplit le titre et une compétence modifiable. L’identifiant de la leçon et le niveau précis restent associés à la fiche enregistrée et imprimée. Les libellés sont disponibles en français, en arabe et en anglais.

Ce catalogue fournit des intitulés ; il ne contient pas les textes scientifiques. Pour ses leçons, la génération locale produit une trame didactique à compléter et permet d’ajouter un texte fourni par l’enseignant, sans présenter un autre cours comme s’il correspondait au titre choisi. Les anciennes fiches restent lisibles.

Vérification : `npm test` couvre les 97 choix dans les trois langues, les 47 chapitres et la compatibilité des données sauvegardées.

## Comptes Supabase

Les pages `/connexion` et `/inscription` proposent trois rôles : enseignant, élève et établissement. Leurs espaces `/espace-enseignant`, `/espace-eleve` et `/espace-etablissement` sont protégés par session et par rôle. Suivre [le guide d’activation](supabase/README.md) et exécuter [le schéma SQL](supabase/schema.sql) puis [la migration des documents personnels](supabase/user-documents.sql). La route `/app` conserve les profils de démonstration sans compte.

Ce dépôt utilise Next.js 16 : son `src/proxy.ts` remplit le rôle du `middleware.ts` demandé dans les versions précédentes. Pour les comptes authentifiés, le calendrier, les classes, les fiches, les réponses d’exercices et les préférences sont liés à l’utilisateur Supabase avec RLS. Le catalogue et les exemples restent partagés ; les profils de démonstration conservent leur stockage local.

## Développement

Utiliser Node.js 22.

```sh
npm ci
npm run dev
```

Le serveur démarre sur le port 5000. Pour compiler et exécuter la version de production :

```sh
npm run build
npm start
```

## Vercel

Le projet est nommé `pedago-helper`, dans l'espace `adnan-082b`. Depuis ce dossier :

```sh
npx vercel login
npx vercel link --project pedago-helper --scope adnan-082b
npx vercel deploy
```

Après vérification du déploiement de prévisualisation :

```sh
npx vercel deploy --prod
```

Vercel utilise Next.js et `npm run build` grâce à `vercel.json`. Le déploiement CLI peut utiliser ce dossier directement. Le compte GitHub auteur du dernier commit doit être lié au compte Vercel autorisé à déployer ce projet ; une adresse Git locale non reconnue bloque la publication.

## Génération et données

Le studio conserve son fonctionnement local interactif. La route IA est hébergée à la même origine, mais le bouton de génération n'est pas encore raccordé à cette route : un adaptateur reste nécessaire pour les champs du studio et ses trois textes de lecture. La route génère uniquement la fiche pédagogique.

Pour activer les appels directs à l'API, configurer `OPENAI_API_KEY` côté serveur dans Vercel et redéployer. `OPENAI_MODEL` est facultatif (défaut : `gpt-4.1-mini`). Ne jamais mettre une clé secrète dans une variable `NEXT_PUBLIC_`. Sans clé, l'API renvoie une erreur contrôlée et le site reste utilisable en mode local. L’API de génération ne dispose pas encore de quotas applicatifs.

Pour les comptes authentifiés, les classes et les leçons sont enregistrées dans Supabase et suivent le compte entre les appareils et les domaines. Les anciennes données locales propres au compte sont migrées au premier accès depuis le navigateur et le domaine où elles se trouvent ; les données des comptes de démonstration restent propres à chaque origine. Le logo est inclus dans `public/pedago-helper-logo.jpeg`.

Les fichiers `.env*`, `.vercel`, `node_modules` et `.next` sont exclus du paquet téléchargeable. `.env.example` est fourni sans secret.

Documentation : [déploiement Vercel CLI](https://vercel.com/docs/projects/deploy-from-cli).

## Accueil et comptes de démonstration

À chaque ouverture du site, y compris depuis un ancien lien direct, la page d’entrée propose Amine (enseignant) et Salma (étudiante), deux profils fictifs sans mot de passe ni authentification. Les routes `#teacher` et `#student` ouvrent leurs tableaux de bord. L’enseignant retrouve le calendrier et le studio ; l’étudiante dispose des quatre lectures modèles, de trois niveaux de lecture, du lexique et de trois questions. Les réponses sont enregistrées uniquement dans le navigateur, sans correction automatique ni transmission à un enseignant.

Le choix français/arabe/anglais est conservé sur cet appareil. Les exemples, le catalogue, le calendrier, les fiches et l’impression suivent ce choix. Les textes personnels sont préservés ; le changement de langue ne fournit pas une traduction automatique du contenu saisi librement.

## Neuro-IA pour les élèves

Dans l'espace d'un élève authentifié, chaque chapitre SVT propose une analyse de 3 à 5 termes difficiles : composition du mot, analogie, explication en darija, image mentale, question de rappel actif et révisions à J+2/J+7. Le bouton utilise le titre et les mots-clés déjà présents dans le catalogue. Le catalogue ne contenant pas le texte complet des cours, la route accepte aussi `courseSummaryOrText` pour l'analyser lorsqu'il est disponible. Les réponses valides sont gardées sept jours dans le navigateur, séparées par compte et par contenu du cours.

La route `POST /api/extract-and-memorize` exige une session Supabase de rôle `student`, valide les entrées et la sortie JSON de Gemini, et conserve la clé uniquement sur le serveur. Ajouter `GEMINI_API_KEY` dans `.env.local` pour le développement et dans les variables **Production** de Vercel, puis redéployer. Sans cette clé, le bouton affiche une erreur de configuration explicite. Le modèle demandé initialement, `gemini-2.0-flash`, a été arrêté par Google ; la route utilise `gemini-3.8-flash` et son format JSON actuel. Les profils de démonstration peuvent voir l'accès, mais ne déclenchent pas d'appel payant.
