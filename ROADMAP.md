# ROADMAP ECF — "Vite & Gourmand"

**TP Développeur Web et Web Mobile**
**Deadline : 19 février 2026 — 23h59**
**Durée indicative : 70h**

---

## Stack technique choisie

| Couche | Techno | Justification |
|--------|--------|---------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 | Stack moderne SSR/CSR, routing App Router, typage strict |
| Backend | NestJS 11, TypeScript, Prisma 6 | Architecture modulaire, DI, DTO validation |
| BDD SQL | PostgreSQL (Neon) | Robuste, gratuit, hébergement cloud |
| BDD NoSQL | MongoDB Atlas | Stats admin (commandes/CA par menu) — exigence ECF |
| Auth | JWT (bcrypt + tokens) | Sécurité standard, 3 rôles |
| Emails | Nodemailer + templates HTML | Bienvenue, confirmation, relances |
| Déploiement | Vercel (front) + Railway (back) + Neon (PG) + Atlas (Mongo) | CI/CD automatique |
| Gestion projet | Notion ou Trello | Board Kanban visible publiquement |

---

## Phase 0 — Setup projet (1h)

- [ ] Créer le repo GitHub PUBLIC : `vite-et-gourmand`
- [ ] Structure monorepo ou 2 repos (front + back)
- [ ] Branches : `main` → `develop` → `feature/*`
- [ ] Initialiser le board Kanban (Notion/Trello) avec les user stories
- [ ] README.md initial avec instructions de déploiement local

---

## Phase 1 — Design & Maquettes (3h)

### Charte graphique (PDF)
- [ ] Palette de couleurs (primaire, secondaire, accent, neutres)
- [ ] Police choisie (ex: Inter ou Poppins)
- [ ] Composants UI de base (boutons, cards, inputs)

### Maquettes (wireframes + mockup)
- [ ] **3 maquettes desktop** :
  1. Page d'accueil
  2. Vue globale des menus (avec filtres)
  3. Vue détaillée d'un menu + formulaire commande
- [ ] **3 maquettes mobile** : les mêmes en responsive
- [ ] Outil : Figma (export PNG/PDF)

---

## Phase 2 — Base de données SQL (3h)

### Schéma (basé sur le MCD fourni en Annexe 1)
- [ ] Créer le schéma Prisma à partir du MCD :
  - `utilisateur` (id, email, password, nom, prenom, telephone, role, adresse_postale)
  - `role` (id, libelle) → utilisateur, employe, administrateur
  - `menu` (id, titre, nombre_personne_minimale, prix_par_personne, description, quantite_restante)
  - `theme` (id, libelle) → Noël, Pâques, classique, événement
  - `regime` (id, libelle) → végétarien, vegan, classique
  - `plat` (id, titre_plat, photo, type: entrée/plat/dessert)
  - `allergene` (id, libelle)
  - `commande` (numero, date_commande, date_prestation, adresse, prix_menu, nombre_personnes, prix_livraison, statut, validation_materiel)
  - `avis` (id, note, description, statut_validation)
  - `horaire` (id, jour, heure_ouverture, heure_fermeture)
  - Tables de liaison : menu↔theme, menu↔regime, menu↔plat, plat↔allergene
- [ ] Générer le fichier SQL de création de tables (CREATE TABLE)
- [ ] Générer le fichier SQL de seed (INSERT INTO) avec données de démo
- [ ] Migration Prisma + vérifier en local

---

## Phase 3 — Base de données NoSQL / MongoDB (1h)

- [ ] Créer un cluster MongoDB Atlas (gratuit)
- [ ] Collection `order_stats` : aggrégation des commandes par menu
- [ ] Connexion depuis NestJS via `@nestjs/mongoose` ou driver natif
- [ ] Endpoint API pour les graphiques admin (commandes par menu, CA par menu avec filtres durée)

---

## Phase 4 — Backend API NestJS (15h)

### Modules à créer

#### 4.1 Auth Module (3h)
- [ ] `POST /auth/register` — inscription utilisateur (rôle "utilisateur" par défaut)
  - Validation : nom, prénom, GSM, email, adresse, mdp (10 chars, 1 spécial, 1 maj, 1 min, 1 chiffre)
  - Envoi email de bienvenue
- [ ] `POST /auth/login` — connexion (email + mdp → JWT)
- [ ] `POST /auth/forgot-password` — envoi lien reset par email
- [ ] `POST /auth/reset-password` — réinitialisation mdp via token
- [ ] Guard JWT + décorateur @Roles()
- [ ] Middleware : extraire le rôle du token

#### 4.2 Menu Module (3h)
- [ ] `GET /menus` — liste tous les menus (public, avec filtres)
  - Filtres : prix_max, prix_min/prix_max, theme, regime, nb_personnes_min
- [ ] `GET /menus/:id` — détail d'un menu (plats, allergènes, conditions, stock)
- [ ] `POST /menus` — créer un menu (employé/admin)
- [ ] `PUT /menus/:id` — modifier un menu (employé/admin)
- [ ] `DELETE /menus/:id` — supprimer un menu (employé/admin)

#### 4.3 Plat Module (2h)
- [ ] CRUD plats (titre, photo, type entrée/plat/dessert)
- [ ] Gestion des allergènes par plat
- [ ] Association plat ↔ menu (many-to-many)

#### 4.4 Commande Module (4h)
- [ ] `POST /commandes` — créer une commande (utilisateur authentifié)
  - Auto-remplir infos client depuis le compte
  - Calcul prix livraison : 5€ + 0.59€/km si hors Bordeaux
  - Réduction 10% si nb_personnes >= minimum + 5
  - Vérifier stock disponible → décrémenter
  - Envoi email confirmation
- [ ] `GET /commandes` — mes commandes (utilisateur) ou toutes (employé/admin)
  - Filtres : par statut, par client
- [ ] `PUT /commandes/:id` — modifier commande (si statut < "accepté")
- [ ] `DELETE /commandes/:id` — annuler commande (si statut < "accepté")
- [ ] `PUT /commandes/:id/status` — changer statut (employé/admin)
  - Workflow : reçue → acceptée → en préparation → en livraison → livrée → (attente retour matériel) → terminée
  - Email au statut "attente retour matériel" (10 jours ouvrés, 600€ frais)
  - Email au statut "terminée" (invitation à donner un avis)
  - Annulation employé : obligé de spécifier motif + mode contact (GSM/mail)

#### 4.5 Avis Module (1h)
- [ ] `POST /avis` — donner un avis (note 1-5 + commentaire, lié à une commande terminée)
- [ ] `GET /avis` — avis validés (public, pour page d'accueil)
- [ ] `PUT /avis/:id/validate` — valider/refuser un avis (employé/admin)

#### 4.6 Horaire Module (0.5h)
- [ ] CRUD horaires (jour, heure ouverture, heure fermeture)

#### 4.7 Contact Module (0.5h)
- [ ] `POST /contact` — envoyer un message (titre, description, email) → email à l'entreprise

#### 4.8 Admin Module (1h)
- [ ] `POST /admin/employees` — créer un compte employé (email + mdp → email notification sans mdp)
- [ ] `PUT /admin/employees/:id/disable` — désactiver un compte employé
- [ ] `GET /admin/stats/orders` — commandes par menu (depuis MongoDB)
- [ ] `GET /admin/stats/revenue` — CA par menu avec filtres (menu, durée)
- [ ] Compte admin créé en seed (pas créable depuis l'app)

---

## Phase 5 — Frontend Next.js (20h)

### 5.1 Layout & Navigation (2h)
- [ ] Header/Navbar : Accueil, Menus, Connexion, Contact
- [ ] Footer : horaires lundi-dimanche, mentions légales, CGV
- [ ] Responsive mobile-first

### 5.2 Pages publiques (5h)
- [ ] **Page d'accueil** `/` : présentation entreprise, équipe, avis clients validés
- [ ] **Vue globale menus** `/menus` : cards menus + filtres dynamiques (sans rechargement)
  - Filtres : prix max, fourchette prix, thème, régime, nb personnes min
- [ ] **Vue détaillée menu** `/menus/[id]` : toutes les infos, allergènes, conditions bien visibles, bouton Commander
- [ ] **Page contact** `/contact` : formulaire (titre, description, email)
- [ ] **Mentions légales** `/mentions-legales`
- [ ] **CGV** `/cgv`

### 5.3 Auth (3h)
- [ ] **Inscription** `/register` : formulaire avec validation Zod (mdp 10 chars, spécial, maj, min, chiffre)
- [ ] **Connexion** `/login` : email + mdp
- [ ] **Mot de passe oublié** `/forgot-password` : saisie email → lien reset
- [ ] **Reset mdp** `/reset-password/[token]`
- [ ] Middleware Next.js : protection des routes authentifiées

### 5.4 Espace Utilisateur (3h)
- [ ] `/dashboard` : liste des commandes avec détail
- [ ] `/dashboard/profile` : modifier infos personnelles
- [ ] `/dashboard/orders/[id]` : suivi commande (timeline des statuts + date/heure)
- [ ] Modifier/annuler commande (si pas encore "acceptée")
- [ ] Formulaire avis (note 1-5 + commentaire) sur commande terminée

### 5.5 Commande (3h)
- [ ] `/order` : formulaire multi-étapes
  1. Infos client (auto-rempli depuis compte)
  2. Adresse + date + heure de livraison
  3. Choix du menu (pré-rempli si venu depuis détail)
  4. Nombre de personnes (minimum imposé) → calcul prix dynamique
  5. Récap prix (menu + livraison + éventuelle réduction 10%)
  6. Validation

### 5.6 Espace Employé (2h)
- [ ] `/admin/menus` : CRUD menus, plats, horaires
- [ ] `/admin/orders` : liste commandes avec filtres (statut, client)
- [ ] `/admin/orders/[id]` : changer statut (workflow), annuler avec motif
- [ ] `/admin/reviews` : valider/refuser les avis

### 5.7 Espace Administrateur (2h)
- [ ] Tout l'espace employé +
- [ ] `/admin/employees` : créer/désactiver comptes employés
- [ ] `/admin/stats` : graphique commandes par menu (Chart.js ou Recharts, données MongoDB)
- [ ] `/admin/revenue` : CA par menu avec filtres (menu, période)

---

## Phase 6 — Emails (2h)

- [ ] Template email bienvenue (inscription)
- [ ] Template email confirmation commande
- [ ] Template email mot de passe oublié (lien reset)
- [ ] Template email retour matériel (10 jours, 600€)
- [ ] Template email commande terminée (invitation avis)
- [ ] Template email notification création compte employé (sans mdp)
- [ ] Template email contact (forwarded à l'entreprise)

---

## Phase 7 — Déploiement (3h)

- [ ] Frontend → Vercel (connecté au repo GitHub)
- [ ] Backend → Railway (NestJS)
- [ ] PostgreSQL → Neon (déjà configuré ou nouveau projet)
- [ ] MongoDB → Atlas (cluster gratuit)
- [ ] Variables d'environnement configurées partout
- [ ] Tester l'app en prod : inscription, connexion, commande, espace admin
- [ ] Créer le compte admin en seed (José) — pas créable depuis l'UI

---

## Phase 8 — Documentation & Livrables (7h)

### Dans le repo Git :

#### 8.1 README.md (1h)
- [ ] Description du projet
- [ ] Stack technique
- [ ] Pré-requis (Node, PostgreSQL, MongoDB)
- [ ] Installation locale pas à pas (clone, npm install, env, migrations, seed, start)

#### 8.2 Fichiers SQL (0.5h)
- [ ] `database/create_tables.sql` — CREATE TABLE complet
- [ ] `database/seed_data.sql` — INSERT INTO avec données de démo (menus, plats, users, commandes)

#### 8.3 Manuel d'utilisation (PDF) (1h)
- [ ] Présentation de l'app
- [ ] Identifiants de test :
  - Admin : admin@viteetgourmand.fr / mdp
  - Employé : employe@viteetgourmand.fr / mdp
  - Utilisateur : user@viteetgourmand.fr / mdp
- [ ] Parcours visiteur (consulter menus, s'inscrire)
- [ ] Parcours utilisateur (commander, suivre, donner avis)
- [ ] Parcours employé (gérer menus, commandes, avis)
- [ ] Parcours admin (stats, créer employé)

#### 8.4 Charte graphique (PDF) (1h)
- [ ] Palette de couleurs
- [ ] Police
- [ ] 3 maquettes desktop (accueil, menus, détail menu)
- [ ] 3 maquettes mobile (idem)

#### 8.5 Documentation gestion de projet (1h)
- [ ] Méthodologie (Agile/Kanban)
- [ ] Organisation des sprints/tâches
- [ ] Capture du board Kanban

#### 8.6 Documentation technique (2.5h)
- [ ] Réflexions initiales technologiques
- [ ] Configuration environnement de travail
- [ ] MCD (Modèle Conceptuel de Données) — reproduire/adapter l'annexe
- [ ] Diagramme de cas d'utilisation (Use Case)
- [ ] Diagramme de séquence (ex: parcours commande)
- [ ] Documentation déploiement (étapes Vercel/Railway/Neon/Atlas)

---

## Phase 9 — Copie à rendre (3h)

Remplir le fichier `Copie à rendre_TP – Développeur Web et Web Mobile.doc` :

### En-tête
- [ ] NOM : GAILLARD
- [ ] Prénom : Romain
- [ ] Date de naissance : [à remplir]

### Liens obligatoires (SANS CES ÉLÉMENTS, COPIE REJETÉE)
- [ ] Lien du Git : [URL GitHub public]
- [ ] Lien outil gestion de projet : [URL Notion/Trello]
- [ ] Lien du déploiement : [URL Vercel]
- [ ] Login et mot de passe administrateur : [credentials]

### Partie 1 : Analyse des besoins
1. [ ] Résumé du projet (~200-250 mots)
2. [ ] Cahier des charges / spécifications fonctionnelles

### Partie 2 : Spécifications techniques
1. [ ] Technologies utilisées + justification de chaque choix
2. [ ] Mise en place environnement de travail (réf au README.md)
3. [ ] Mécanismes de sécurité (formulaires, front-end, back-end)
4. [ ] Veille technologique sur les vulnérabilités de sécurité

### Partie 3 : Recherche
1. [ ] Situation nécessitant une recherche sur un site anglophone (citer la source)
2. [ ] Extrait du site anglophone + traduction en français

### Partie 4 : Informations complémentaires
1. [ ] Autres ressources utilisées
2. [ ] Informations complémentaires

---

## Renommer la copie

```
ECF_TPDeveloppeurWebEtWebMobile_copiearendre_GAILLARD_Romain
```

---

## Checklist finale avant soumission

- [ ] App déployée et fonctionnelle (front + back + BDD)
- [ ] Repo GitHub PUBLIC avec branches main/develop
- [ ] Fichiers SQL dans le repo
- [ ] README.md complet
- [ ] Manuel d'utilisation PDF dans le repo
- [ ] Charte graphique PDF dans le repo
- [ ] Doc gestion de projet dans le repo
- [ ] Doc technique dans le repo
- [ ] Board Kanban accessible publiquement
- [ ] Copie à rendre remplie et renommée
- [ ] Compte admin fonctionnel avec les credentials indiqués
- [ ] Accessibilité RGAA vérifiée (labels, contraste, navigation clavier)
- [ ] RGPD respecté (consentement, données personnelles)
- [ ] Upload sur Studi + Soumettre mon évaluation
