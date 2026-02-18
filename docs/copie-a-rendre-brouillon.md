# Copie a rendre — TP Developpeur Web et Web Mobile

## En-tete

- **NOM** : GAILLARD
- **Prenom** : Romain
- **Date de naissance** : 12/06/1998
- **Lieu de naissance** : Auray (56 - Morbihan)

---

## Liens obligatoires (SANS CES ELEMENTS, COPIE REJETEE)

- **Lien du Git** : https://github.com/INF-IAGAILLARDROMAIN/vite-et-gourmand
- **Lien de l'outil de gestion de projet** : https://github.com/INF-IAGAILLARDROMAIN/vite-et-gourmand/issues (GitHub Issues avec labels Kanban : status: done, status: to do, status: in progress)
- **Lien du deploiement** : https://vite-et-gourmand-rust.vercel.app
- **Login et mot de passe administrateur** : admin@viteetgourmand.fr / Admin@2026!

---

## Partie 1 : Analyse des besoins

### 1.1 Resume du projet (200-250 mots)

Vite & Gourmand est une application web developpee pour un traiteur evenementiel base a Bordeaux. L'entreprise, dirigee par Jose, propose des menus gastronomiques livres a domicile pour tous types d'evenements : mariages, anniversaires, seminaires d'entreprise, et fetes de famille.

L'application a pour objectif de digitaliser l'ensemble du processus metier du traiteur : de la presentation du catalogue de menus a la gestion complete des commandes, en passant par le suivi de livraison et la collecte d'avis clients.

Le systeme s'articule autour de trois profils d'utilisateurs. Les visiteurs et clients peuvent consulter les menus, filtrer par theme (Noel, Paques, Classique, Evenement) ou regime alimentaire (vegetarien, vegan, sans gluten), passer commande avec calcul automatique du prix (incluant frais de livraison et reductions eventuelles), et suivre l'avancement de leur commande en temps reel.

Les employes disposent d'un back-office pour gerer les commandes selon un workflow precis (de "Recue" a "Terminee"), moderer les avis clients, et administrer les menus et horaires.

L'administrateur beneficie de fonctionnalites supplementaires : creation et desactivation de comptes employes, et consultation de statistiques de performance (commandes par menu, chiffre d'affaires) via des graphiques alimentes par une base de donnees NoSQL (MongoDB).

L'application integre egalement un systeme complet d'emails automatiques (confirmation de commande, relance retour materiel, invitation a laisser un avis) et respecte les normes de securite (RGPD, accessibilite RGAA).

### 1.2 Cahier des charges / Specifications fonctionnelles

**Contexte** : Le traiteur Vite & Gourmand souhaite moderniser sa presence en ligne et automatiser la gestion de ses commandes evenementielles.

**Objectifs** :
1. Permettre aux clients de consulter et commander des menus en ligne
2. Automatiser le calcul de prix (menu + livraison + reductions)
3. Fournir un outil de gestion des commandes pour l'equipe
4. Offrir un tableau de bord statistique a l'administrateur
5. Garantir la securite des donnees et la conformite RGPD

**Fonctionnalites principales** :

| Module | Fonctionnalites |
|--------|----------------|
| Catalogue | Affichage des menus avec filtres (theme, regime, budget), detail avec composition et allergenes |
| Commande | Creation avec calcul prix dynamique, suivi par statut, annulation, historique complet |
| Authentification | Inscription securisee, connexion JWT, reinitialisation mot de passe |
| Avis | Depot d'avis (note + commentaire) sur commandes terminees, moderation par l'equipe |
| Back-office | Gestion commandes (workflow 7 statuts), menus, horaires, avis |
| Administration | Creation/desactivation employes, statistiques MongoDB (graphiques Recharts) |
| Emails | 7 templates automatiques (bienvenue, confirmation, retour materiel, etc.) |
| Contact | Formulaire public avec envoi d'email a l'entreprise |

**Contraintes techniques** :
- Utilisation obligatoire de deux types de BDD (SQL + NoSQL)
- Application deployee en ligne et fonctionnelle
- Board Kanban accessible publiquement
- Documentation technique complete (MCD, diagrammes UML)

---

## Partie 2 : Specifications techniques

### 2.1 Technologies utilisees et justification

| Technologie | Role | Justification |
|-------------|------|---------------|
| **Next.js 16** | Frontend | Framework React avec SSR natif pour le SEO, App Router pour le routing simplifie, optimisations de performance automatiques (code splitting, lazy loading images) |
| **React 19** | UI | Derniere version stable, hooks pour la gestion d'etat, large ecosysteme de composants |
| **TypeScript 5** | Typage | Typage statique pour reduire les bugs, autocompletion IDE, refactoring facilite |
| **Tailwind CSS v4** | Styles | Approche utility-first pour un developpement rapide, bundle CSS minimal grace au purge automatique, responsive natif |
| **Framer Motion** | Animations | Animations GPU-accelerees, API declarative simple, integration React native |
| **NestJS 11** | Backend | Architecture modulaire avec injection de dependances, support TypeScript natif, validation integree via pipes |
| **Prisma 7** | ORM SQL | Generation automatique des types TypeScript, migrations simplifiees, syntaxe declarative |
| **PostgreSQL 16** | BDD SQL | Base relationnelle robuste, conforme ACID, herbergement cloud gratuit (Neon) |
| **MongoDB Atlas** | BDD NoSQL | Stockage flexible pour les statistiques agregees, pipelines d'aggregation performants, cluster gratuit |
| **Mongoose** | ODM NoSQL | Integration NestJS native (@nestjs/mongoose), schemas TypeScript, validation |
| **JWT + Passport** | Authentification | Tokens stateless (pas de session serveur), strategie eprouvee, integration NestJS native |
| **Bcrypt** | Securite | Hachage de mots de passe avec salt, 10 rounds, standard de l'industrie |
| **Nodemailer** | Emails | Envoi SMTP universel, templates HTML, compatible Gmail et Ethereal (dev) |
| **Recharts** | Graphiques | Bibliothèque React native pour les graphiques, composants declaratifs, responsive |

### 2.2 Mise en place de l'environnement de travail

L'environnement de travail est documente dans le fichier `README.md` du repository GitHub. Les etapes principales sont :

1. **Prerequis** : Node.js >= 20, npm >= 10, PostgreSQL (ou Neon), MongoDB (ou Atlas)
2. **Clone du repo** : `git clone https://github.com/INF-IAGAILLARDROMAIN/vite-et-gourmand.git`
3. **Installation** :
   - Backend : `cd apps/api && npm install`
   - Frontend : `cd apps/web && npm install`
4. **Configuration** : fichiers `.env` (API) et `.env.local` (Web) avec les variables d'environnement
5. **Initialisation BDD** : `npx prisma generate && npx prisma migrate dev && npx prisma db seed`
6. **Demarrage** :
   - API : `npm run start:dev` (port 3000)
   - Web : `npm run dev` (port 3001)

**Justification de la structure monorepo** : le code frontend et backend sont dans le meme repository (`apps/web` et `apps/api`) pour faciliter le partage de types TypeScript, simplifier la CI/CD et maintenir une coherence entre les deux couches.

**Workflow Git** : branches `main` (production) -> `develop` (integration) -> `feature/*` (developpement). Convention de commits semantiques (feat, fix, docs, chore, test).

### 2.3 Mecanismes de securite

#### Securite des formulaires
- **Validation cote client** : verification des champs avant soumission (formats email, longueur mot de passe, champs obligatoires)
- **Validation cote serveur** : tous les DTOs NestJS utilisent `class-validator` avec des decorateurs (`@IsEmail()`, `@MinLength()`, `@Matches()`)
- **Politique de mot de passe** : minimum 10 caracteres, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractere special (regex validee cote front ET back)
- **Protection CSRF** : utilisation de tokens JWT dans les headers (pas de cookies de session)

#### Securite front-end
- **Stockage du token** : `localStorage` (acceptable pour une SPA, pas de donnees sensibles dans le token)
- **Validation du token** : a chaque chargement, appel a `GET /auth/profile` pour verifier la validite du JWT
- **Routes protegees** : middleware Next.js redirigeant les utilisateurs non authentifies
- **Sanitisation** : React echappe automatiquement le HTML dans les rendus JSX

#### Securite back-end
- **JWT** : tokens signes avec un secret configurable, expiration parametrable (7 jours par defaut)
- **Bcrypt** : hachage des mots de passe avec salt (10 rounds), mots de passe jamais stockes en clair
- **RBAC** : controle d'acces par roles via `@Roles()` decorator et `RolesGuard`
- **CORS** : origines autorisees limitees au domaine frontend
- **Rate limiting** : possible via NestJS throttle (non implemente dans cette version ECF)
- **Anti-enumeration** : la route `forgot-password` retourne toujours un message de succes, meme si l'email n'existe pas
- **Validation stricte** : `forbidNonWhitelisted: true` sur le ValidationPipe global (proprietes inconnues rejetees)

#### Conformite RGPD
- Page de mentions legales informant sur la collecte et le traitement des donnees
- Droit d'acces et de suppression mentionne
- Mots de passe hashes (jamais stockes en clair)
- Pas de cookies de tracking

### 2.4 Veille technologique — Vulnerabilites de securite

**Sujet : Les attaques par injection dans les applications web modernes (OWASP Top 10 - 2021)**

L'OWASP (Open Web Application Security Project) publie regulierement un classement des vulnerabilites web les plus critiques. En 2021, les injections (SQL, NoSQL, OS, LDAP) sont classees en 3e position (A03:2021 - Injection).

**Mesures implementees dans Vite & Gourmand :**

1. **Injection SQL** : Prisma ORM utilise des requetes parametrees par defaut. Aucune requete SQL brute n'est ecrite dans le code, eliminant le risque d'injection SQL.

2. **Injection NoSQL** : Mongoose valide les schemas avant insertion. Les pipelines d'aggregation utilisent des operateurs MongoDB natifs, pas de concatenation de chaines.

3. **Cross-Site Scripting (XSS)** : React echappe automatiquement les variables dans le JSX. L'utilisation de `dangerouslySetInnerHTML` est evitee.

4. **Cross-Site Request Forgery (CSRF)** : L'utilisation de JWT dans les headers `Authorization` (au lieu de cookies) protege contre les attaques CSRF.

5. **Broken Authentication** : politique de mot de passe forte (10 chars, complexite), hachage bcrypt, tokens JWT avec expiration.

**Source** : OWASP Top 10 - 2021, https://owasp.org/Top10/

---

## Partie 3 : Recherche

### 3.1 Situation de recherche a partir d'un site anglophone

Lors de l'integration de **Prisma 7** avec le driver adapter pattern, j'ai rencontre une erreur : `Error: 'url' is not allowed in 'datasource' block when using Prisma 7 with driver adapters`. Le block `datasource` de Prisma ne pouvait plus contenir l'attribut `url` directement.

J'ai recherche la solution sur la documentation officielle de Prisma en anglais et sur GitHub Issues :

**Source** : https://www.prisma.io/docs/orm/overview/databases/neon#how-to-connect-using-prisma-client-and-a-driver-adapter

### 3.2 Extrait du site anglophone et traduction

**Extrait en anglais** :

> "When using Prisma ORM with a driver adapter, the connection to the database is not handled by Prisma's built-in engine. Instead, it is handled by the driver adapter. This means you should not include the url field in the datasource block of your Prisma schema. Instead, you should configure the connection in your application code using the driver adapter."
>
> "To use Prisma with Neon's serverless driver, install the @prisma/adapter-pg package and configure it as follows:
> ```
> import { PrismaPg } from '@prisma/adapter-pg'
> const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
> const prisma = new PrismaClient({ adapter })
> ```"

**Traduction en francais** :

> « Lorsque vous utilisez Prisma ORM avec un adaptateur de driver, la connexion a la base de donnees n'est pas geree par le moteur integre de Prisma. Elle est geree par l'adaptateur de driver. Cela signifie que vous ne devez pas inclure le champ `url` dans le bloc `datasource` de votre schema Prisma. A la place, vous devez configurer la connexion dans votre code applicatif en utilisant l'adaptateur de driver. »
>
> « Pour utiliser Prisma avec le driver serverless de Neon, installez le paquet @prisma/adapter-pg et configurez-le comme suit :
> ```
> import { PrismaPg } from '@prisma/adapter-pg'
> const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
> const prisma = new PrismaClient({ adapter })
> ```
> »

**Application dans le projet** : Cette recherche m'a permis de configurer correctement Prisma 7 avec le driver adapter pattern pour Neon (PostgreSQL serverless). Le fichier `prisma.config.ts` gere desormais la connexion via `@prisma/adapter-pg` au lieu du champ `url` dans le schema Prisma, ce qui est la methode recommandee pour Prisma 7+.

---

## Partie 4 : Informations complementaires

### 4.1 Autres ressources utilisees

| Ressource | Usage |
|-----------|-------|
| Documentation Next.js (nextjs.org/docs) | Configuration App Router, routing, metadata API, next/image |
| Documentation NestJS (docs.nestjs.com) | Modules, guards, pipes, decorators, JWT strategy |
| Documentation Prisma (prisma.io/docs) | Schema, migrations, driver adapter pattern, seed |
| Documentation MongoDB (mongodb.com/docs) | Aggregation pipelines, Atlas setup |
| Documentation Tailwind CSS v4 (tailwindcss.com) | Configuration CSS-first, custom theme, responsive design |
| Documentation Framer Motion (motion.dev) | API d'animation, whileInView, variants |
| MDN Web Docs (developer.mozilla.org) | References HTML, CSS, JavaScript |
| Stack Overflow | Resolution de bugs specifiques (TypeScript, Prisma, NestJS) |
| OWASP (owasp.org) | Bonnes pratiques de securite web |

### 4.2 Informations complementaires

**Architecture technique double BDD** : Le projet utilise PostgreSQL pour les donnees relationnelles (utilisateurs, menus, commandes) et MongoDB Atlas pour les statistiques agregees du dashboard admin. Cette architecture repond a l'exigence ECF d'utiliser deux types de bases de donnees (SQL + NoSQL) tout en apportant une vraie valeur ajoutee : les pipelines d'aggregation MongoDB sont plus performants que les GROUP BY SQL pour les calculs statistiques en temps reel.

**Accessibilite** : L'application respecte les criteres de base du RGAA :
- Labels associes a tous les champs de formulaire
- Contraste de couleurs suffisant (palette definie dans la charte graphique)
- Navigation au clavier possible sur toutes les pages
- Textes alternatifs sur les images
- Structure semantique HTML (header, main, footer, nav, section)

**Performance et SEO** : L'application a fait l'objet d'un travail approfondi d'optimisation du referencement naturel et des performances web. Les scores Core Web Vitals mesures en production sont excellents : LCP de 1 026 ms (seuil Google : 2 500 ms), CLS de 0.00 (parfait), TTFB de 33 ms. Les optimisations incluent :
- **SEO technique** : sitemap XML dynamique (incluant les pages menus generees depuis l'API), robots.txt, URL canonique, balises meta uniques sur chaque page, metadonnees dynamiques (`generateMetadata`) sur les fiches menus
- **Donnees structurees JSON-LD** : schemas FoodEstablishment (avec note agrégée 4.8/5, horaires, geolocalisation Bordeaux) et WebSite pour le Knowledge Panel Google, permettant l'affichage d'etoiles et d'informations enrichies dans les resultats de recherche
- **SEO social** : balises OpenGraph et Twitter Cards sur toutes les pages, image OG dediee 1200x630px
- **Performance** : images servies en format WebP (reduction 30-50% du poids), cache HTTP immutable (1 an) sur images et assets statiques, polices auto-hebergees via next/font, preconnect et dns-prefetch vers l'API, code splitting automatique par route, animations GPU-accelerees (Framer Motion)
