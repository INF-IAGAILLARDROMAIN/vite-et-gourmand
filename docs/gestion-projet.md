# Documentation Gestion de Projet - Vite & Gourmand

## 1. Methodologie

### 1.1 Approche Agile / Kanban

Le projet a été mené selon une méthodologie **Agile simplifiée** avec un board **Kanban**. Ce choix est justifié par :

- **Flexibilité** : les tâches sont repriorisées au fil de l'avancement
- **Visibilité** : le board offre une vue claire de l'état du projet à tout moment
- **Simplicité** : pas de sprints figés, le flux continu est adapté à un projet solo
- **Efficacité** : permet de se concentrer sur les tâches les plus importantes en premier

### 1.2 Colonnes du board Kanban

| Colonne | Description |
|---------|-------------|
| **Backlog** | Toutes les tâches identifiées mais pas encore démarrées |
| **A faire** | Tâches priorisées pour le sprint en cours |
| **En cours** | Tâche(s) en cours de réalisation |
| **En test** | Tâche terminée, en cours de vérification |
| **Terminé** | Tâche validée et intégrée |

### 1.3 Outil utilisé

**Trello** (accessible publiquement) — choisi pour :
- Gratuité et simplicité d'utilisation
- Partage public du board (lien dans la copie à rendre)
- Labels colorés pour catégoriser les tâches

---

## 2. Decoupage en phases

Le projet a été découpé en **10 phases** correspondant aux grands blocs fonctionnels :

| Phase | Intitulé | Durée estimée | Statut |
|-------|----------|---------------|--------|
| 0 | Setup projet (repo, branches, Kanban) | 1h | Terminé |
| 1 | Design & Charte graphique | 3h | Terminé |
| 2 | Base de données SQL (Prisma schema, migrations, seed) | 3h | Terminé |
| 3 | Base de données NoSQL (MongoDB Atlas, agrégations) | 1h | Terminé |
| 4 | Backend API NestJS (8 modules métier) | 15h | Terminé |
| 5 | Frontend Next.js (22 pages, composants, auth) | 20h | Terminé |
| 6 | Emails (7 templates Nodemailer) | 2h | Terminé |
| 7 | Déploiement (Vercel, Railway, Neon, Atlas) | 3h | Terminé |
| 7bis | **SEO & Optimisation performance** | 3h | Terminé |
| 8 | Documentation & Livrables | 7h | Terminé |
| 9 | Copie à rendre | 3h | Terminé |

**Durée totale estimée : ~61h** (sur 70h allouées)

---

## 3. User stories

### 3.1 Visiteur / Public

| ID | En tant que... | Je veux... | Afin de... |
|----|----------------|------------|------------|
| US-01 | Visiteur | Consulter la liste des menus | Découvrir l'offre traiteur |
| US-02 | Visiteur | Filtrer les menus par thème, régime et prix | Trouver un menu adapté à mon événement |
| US-03 | Visiteur | Voir le détail d'un menu avec plats et allergènes | Vérifier la composition avant de commander |
| US-04 | Visiteur | Envoyer un message via le formulaire de contact | Poser une question à l'entreprise |
| US-05 | Visiteur | Consulter les avis clients validés | Me rassurer sur la qualité du service |
| US-06 | Visiteur | M'inscrire avec un formulaire sécurisé | Créer mon compte client |
| US-07 | Visiteur | Me connecter avec email et mot de passe | Accéder à mon espace client |
| US-08 | Visiteur | Réinitialiser mon mot de passe par email | Récupérer l'accès à mon compte |

### 3.2 Client authentifié

| ID | En tant que... | Je veux... | Afin de... |
|----|----------------|------------|------------|
| US-10 | Client | Passer une commande pour un menu | Organiser mon événement |
| US-11 | Client | Voir le prix calculé dynamiquement | Connaître le coût total avant validation |
| US-12 | Client | Suivre l'avancement de ma commande | Savoir où en est ma prestation |
| US-13 | Client | Modifier ou annuler ma commande (si statut RECUE) | Corriger une erreur ou changer d'avis |
| US-14 | Client | Laisser un avis sur une commande terminée | Partager mon retour d'expérience |
| US-15 | Client | Consulter et modifier mon profil | Mettre à jour mes informations |

### 3.3 Employe

| ID | En tant que... | Je veux... | Afin de... |
|----|----------------|------------|------------|
| US-20 | Employé | Voir toutes les commandes avec filtres | Gérer les commandes quotidiennes |
| US-21 | Employé | Faire avancer le statut d'une commande | Suivre le workflow de prestation |
| US-22 | Employé | Annuler une commande avec motif et mode de contact | Informer le client en cas de problème |
| US-23 | Employé | Modérer les avis (valider/refuser) | Contrôler le contenu public |
| US-24 | Employé | Gérer les menus et plats (CRUD) | Mettre à jour l'offre traiteur |
| US-25 | Employé | Gérer les horaires d'ouverture | Mettre à jour les informations de contact |

### 3.4 Administrateur

| ID | En tant que... | Je veux... | Afin de... |
|----|----------------|------------|------------|
| US-30 | Admin | Créer un compte employé | Intégrer un nouveau collaborateur |
| US-31 | Admin | Désactiver un compte employé | Retirer l'accès d'un ancien collaborateur |
| US-32 | Admin | Consulter les statistiques de commandes par menu | Analyser les performances commerciales |
| US-33 | Admin | Consulter le chiffre d'affaires avec filtres | Piloter l'activité financière |

---

## 4. Workflow Git

### 4.1 Stratégie de branches

```
main ─────────────────────────────────────────── Production
  └── develop ────────────────────────────────── Intégration
        ├── feature/database-schema ──────────── Phase 2 : BDD
        ├── feature/backend-api ──────────────── Phase 3-4 : API
        ├── feature/mongodb-and-fixes ────────── Phase 3 : NoSQL + corrections
        └── feature/deployment-prep ──────────── Phase 7 : Déploiement
```

### 4.2 Convention de commits

Les messages de commit suivent un format sémantique :

- `feat:` — nouvelle fonctionnalité
- `fix:` — correction de bug
- `chore:` — tâches de maintenance (config, CI, Docker)
- `docs:` — documentation
- `test:` — tests unitaires / e2e
- `refactor:` — restructuration du code sans changement fonctionnel

### 4.3 Workflow de merge

1. Développement sur `feature/*`
2. Merge dans `develop` (intégration)
3. Tests et vérification
4. Merge dans `main` (production)
5. Push sur GitHub

---

## 5. Outils utilises

| Outil | Usage |
|-------|-------|
| **VS Code** | IDE principal (TypeScript, React, NestJS) |
| **Git / GitHub** | Versioning et hébergement du code |
| **Trello** | Board Kanban pour la gestion de projet |
| **PostgreSQL (Neon)** | Base de données relationnelle |
| **MongoDB Atlas** | Base de données NoSQL (statistiques) |
| **Postman** | Tests manuels des endpoints API |
| **Chrome DevTools** | Debug frontend, réseau et audit performance (Lighthouse) |
| **Vercel** | Hébergement frontend |
| **Vercel (serverless)** | Hébergement backend API |

---

## 6. Phase 7bis — SEO & Optimisation performance

Cette phase a été ajoutée après le déploiement initial pour garantir un bon référencement sur Google et des temps de chargement optimaux. C'est un enjeu important pour un site de traiteur événementiel : les clients potentiels recherchent « traiteur Bordeaux » ou « traiteur événementiel Gironde » et le site doit apparaître dans les premiers résultats.

### 6.1 Taches realisees

| Tâche | Fichier(s) modifié(s) | Description |
|-------|----------------------|-------------|
| Métadonnées dynamiques menus | `apps/web/src/app/menus/[id]/page.tsx` | Ajout de `generateMetadata()` pour générer title, description et OpenGraph depuis l'API pour chaque fiche menu |
| Sitemap dynamique | `apps/web/src/app/sitemap.ts` | Le sitemap inclut désormais les pages menus dynamiques en interrogeant l'API (revalidation toutes les heures) |
| Preconnect API | `apps/web/src/app/layout.tsx` | Ajout de `<link rel="preconnect">` et `<link rel="dns-prefetch">` vers le domaine API pour anticiper les connexions |
| Cache headers | `apps/web/next.config.ts` | Headers HTTP `Cache-Control: immutable` (1 an) sur images et assets statiques |
| Format WebP | `apps/web/next.config.ts` | Activation du format WebP automatique pour réduire le poids des images de 30-50% |
| JSON-LD enrichi | `apps/web/src/app/page.tsx` | Schémas FoodEstablishment (étoiles, horaires, géolocalisation) + WebSite pour le Knowledge Panel Google |
| Viewport thème mobile | `apps/web/src/app/layout.tsx` | Export `viewport` avec `themeColor` pour personnaliser la barre de navigation mobile |
| Descriptions manquantes | Pages mot-de-passe-oublie, reset-password | Ajout de meta descriptions sur les pages d'authentification |

### 6.2 Resultats mesures (Chrome DevTools Performance Trace)

| Métrique | Score | Seuil Google « Bon » | Verdict |
|----------|-------|---------------------|---------|
| **LCP** (Largest Contentful Paint) | **1 026 ms** | < 2 500 ms | Excellent |
| **CLS** (Cumulative Layout Shift) | **0.00** | < 0.1 | Parfait |
| **TTFB** (Time To First Byte) | **33 ms** | < 800 ms | Excellent |
