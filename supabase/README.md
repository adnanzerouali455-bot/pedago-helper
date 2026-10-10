# Activation de Supabase

1. Créer un projet sur [Supabase](https://supabase.com/dashboard). Dans **SQL Editor**, exécuter [`schema.sql`](./schema.sql) avant toute inscription, puis [`user-documents.sql`](./user-documents.sql) pour activer la sauvegarde des données personnelles.
2. Dans **Project Settings → API**, copier l’URL du projet et la clé **publishable** dans `.env.local` :

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   La clé `service_role` ou toute clé secrète ne doit jamais être placée dans une variable `NEXT_PUBLIC_`.
3. Si la confirmation d’e-mail est activée à l’avenir, dans **Authentication → URL Configuration**, autoriser les URL de retour : `http://localhost:5000/auth/callback`, `http://127.0.0.1:5004/auth/callback` pour l’aperçu local actuel, et `https://pedago-helper.vercel.app/auth/callback` pour le site publié. Définir aussi la bonne **Site URL** du projet.
4. Redémarrer Next.js après l’ajout de `.env.local`. Configurer les mêmes deux variables publiques dans les paramètres du projet Vercel si un déploiement est souhaité.

## Inscription sans confirmation de l’e-mail

L’adresse e-mail reste obligatoire et unique. Pour ouvrir une session directement après l’inscription sans envoyer de message de confirmation, désactiver **Confirm email** dans **Authentication → Providers → Email** du projet Supabase. Cette configuration permet la création de comptes avec une adresse qui n’appartient pas forcément à l’utilisateur ; elle convient uniquement si cette limite est acceptable pour la plateforme. La récupération de mot de passe dépend toujours de l’accès réel à cette adresse.

Les pages `/connexion`, `/inscription` et `/espace-*` utilisent les comptes réels. La route `/app` reste une démonstration indépendante. Après exécution de `user-documents.sql`, les calendriers, classes, fiches, réponses d’exercices et préférences des comptes réels sont enregistrés dans `public.user_documents` et accessibles sur les appareils connectés au même compte. Les règles RLS limitent la lecture et la modification au propriétaire. Les anciennes données de navigateur déjà associées au compte sont copiées une fois lors du premier accès. Les données de démonstration restent locales. Le catalogue des cours et les exemples pédagogiques sont des contenus partagés, non des données personnelles. Le profil d’établissement affiche ses informations d’inscription, sans fonctions de gestion institutionnelle supplémentaires.
