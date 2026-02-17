# Vite & Gourmand

**Traiteur événementiel basé à Bordeaux** - Application web complète de gestion de menus, commandes et livraisons pour un service traiteur.

> Projet réalisé dans le cadre de l'ECF - TP Développeur Web et Web Mobile (Studi, 2026)

---

## Stack technique

| Couche | Technologie | Version |
|--------|------------|---------|
| **Frontend** | Next.js (App Router) | 16.1.6 |
| **UI** | React, TypeScript, Tailwind CSS v4 | React 19.2, TS 5.x |
| **Animations** | Framer Motion | 12.x |
| **Icones** | Lucide React | 0.574 |
| **Backend** | NestJS, TypeScript | 11.x |
| **ORM** | Prisma | 7.4 |
| **BDD SQL** | PostgreSQL (Neon) | 16 |
| **Auth** | JWT (bcrypt + passport) | - |
| **Emails** | Nodemailer | 8.x |
| **Validation** | class-validator, class-transformer | - |

## Architecture du projet

```
vite-et-gourmand/
├── apps/
│   ├── api/                          # Backend NestJS
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Schéma de données (12 modèles)
│   │   │   └── seed.ts               # Données de démonstration
│   │   └── src/
│   │       ├── admin/                # Module administration (stats, employés)
│   │       ├── auth/                 # Authentification JWT
│   │       │   ├── decorators/       # @CurrentUser, @Roles
│   │       │   ├── guards/           # JwtAuthGuard, RolesGuard
│   │       │   └── strategies/       # JWT strategy
│   │       ├── avis/                 # Gestion des avis clients
│   │       ├── commande/             # Gestion des commandes
│   │       ├── contact/              # Formulaire de contact
│   │       ├── horaire/              # Gestion des horaires
│   │       ├── mail/                 # Service d'envoi d'emails
│   │       ├── menu/                 # Gestion des menus
│   │       ├── plat/                 # Gestion des plats et allergènes
│   │       └── prisma/               # Service Prisma (connexion BDD)
│   │
│   └── web/                          # Frontend Next.js
│       ├── public/images/menus/      # Photos des menus
│       └── src/
│           ├── app/
│           │   ├── admin/            # Back-office (6 pages)
│           │   ├── menus/            # Catalogue + détail menu
│           │   ├── commander/        # Formulaire de commande
│           │   ├── contact/          # Page contact
│           │   ├── connexion/        # Connexion
│           │   ├── inscription/      # Inscription
│           │   ├── mon-compte/       # Espace client
│           │   ├── mentions-legales/ # Mentions légales (RGPD)
│           │   ├── cgv/              # CGV
│           │   └── page.tsx          # Page d'accueil
│           ├── components/
│           │   ├── home/             # Sections accueil
│           │   ├── layout/           # Header, Footer
│           │   └── ui/               # Composants réutilisables
│           └── lib/
│               ├── api.ts            # Client API centralisé
│               ├── auth.tsx          # Contexte d'authentification
│               ├── types.ts          # Types TypeScript
│               └── utils.ts          # Fonctions utilitaires
│
├── database/
│   ├── create_tables.sql             # Script SQL de création des tables
│   └── seed_data.sql                 # Données de test SQL
│
└── docs/                             # Documentation technique
```

## Fonctionnalites

### Partie publique (visiteur)
- Consultation du catalogue de menus avec filtres (thème, régime, budget)
- Recherche de menus par mot-clé
- Détail d'un menu avec composition (entrées, plats, desserts) et allergènes
- Consultation des avis clients validés
- Formulaire de contact avec envoi d'email
- Pages légales (mentions légales, CGV)
- Inscription et connexion sécurisées

### Espace client (utilisateur connecté)
- Commander un menu (choix date, heure, adresse, nombre de personnes)
- Calcul automatique du prix (menu + livraison selon distance)
- Réduction de 10% si le nombre de personnes dépasse le minimum du menu de 5 ou plus
- Suivi des commandes avec historique des statuts
- Annulation de commande (si statut le permet)
- Dépôt d'avis après livraison
- Gestion du profil personnel

### Back-office (employé / administrateur)
- **Dashboard** : statistiques (commandes, chiffre d'affaires, menus actifs)
- **Commandes** : workflow complet (Reçue -> Acceptée -> En préparation -> En livraison -> Livrée -> Retour matériel -> Terminée)
- **Menus** : consultation et suppression
- **Avis** : modération (valider / refuser)
- **Horaires** : modification des horaires d'ouverture
- **Employés** : création de comptes employés (admin uniquement)

### SEO & Performance
- Métadonnées OpenGraph et title templates
- Données structurées JSON-LD (schéma Restaurant)
- Sitemap XML et robots.txt dynamiques
- Polices optimisées avec `next/font` (Playfair Display + Inter)
- Animations GPU-accelerated avec Framer Motion

## Modele de données

Le schéma Prisma comporte **12 modèles** et **3 enums** :

- **Utilisateur** / **Role** : gestion des comptes et droits d'accès
- **Menu** / **MenuImage** : menus traiteur avec photos
- **Plat** / **Allergene** : composition des menus et allergènes réglementaires
- **Theme** / **Regime** : catégorisation des menus
- **Commande** / **CommandeHistorique** : commandes avec suivi de statut
- **Avis** : avis clients avec modération
- **Horaire** : horaires d'ouverture

### Workflow des commandes
```
RECUE -> ACCEPTEE -> EN_PREPARATION -> EN_LIVRAISON -> LIVREE -> ATTENTE_RETOUR_MATERIEL -> TERMINEE
ANNULEE (possible jusqu'à EN_PREPARATION)
```

## Prérequis

- **Node.js** >= 20
- **npm** >= 10
- **PostgreSQL** (ou compte [Neon](https://neon.tech) gratuit)

## Installation locale

### 1. Cloner le repo

```bash
git clone https://github.com/RomainGaillworworker/vite-et-gourmand.git
cd vite-et-gourmand
```

### 2. Backend (API)

```bash
cd apps/api
npm install
```

Créer un fichier `.env` dans `apps/api/` :

```env
DATABASE_URL="postgresql://user:password@host:5432/vite_et_gourmand"
JWT_SECRET="votre-secret-jwt-min-32-caracteres"
JWT_EXPIRATION="24h"
MAIL_HOST="smtp.example.com"
MAIL_PORT=587
MAIL_USER="votre-email@example.com"
MAIL_PASS="votre-mot-de-passe-email"
```

Lancer les migrations et le seed :

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

Démarrer le serveur :

```bash
npm run start:dev
```

Le backend est accessible sur `http://localhost:3000/api`.

### 3. Frontend (Web)

```bash
cd apps/web
npm install
```

Créer un fichier `.env.local` dans `apps/web/` :

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

Démarrer le serveur :

```bash
npm run dev
```

Le frontend est accessible sur `http://localhost:3001`.

## Comptes de test

| Role | Email | Mot de passe |
|------|-------|-------------|
| Administrateur | admin@viteetgourmand.fr | Admin@2026! |
| Employe | employe@viteetgourmand.fr | Employe@2026! |
| Utilisateur | user@viteetgourmand.fr | User@2026! |

## Endpoints API

### Authentification (`/api/auth`)
| Methode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/auth/register` | Inscription | Non |
| POST | `/auth/login` | Connexion | Non |
| GET | `/auth/profile` | Profil utilisateur connecté | JWT |
| POST | `/auth/forgot-password` | Demande reset mot de passe | Non |
| POST | `/auth/reset-password` | Reset mot de passe | Non |

### Menus (`/api/menus`)
| Methode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/menus` | Liste (filtres: theme, regime, prixMax) | Non |
| GET | `/menus/:id` | Détail d'un menu | Non |
| POST | `/menus` | Créer un menu | Employé/Admin |
| PUT | `/menus/:id` | Modifier un menu | Employé/Admin |
| DELETE | `/menus/:id` | Supprimer un menu | Employé/Admin |

### Commandes (`/api/commandes`)
| Methode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/commandes` | Mes commandes / toutes (admin) | JWT |
| GET | `/commandes/:id` | Détail d'une commande | JWT |
| POST | `/commandes` | Créer une commande | JWT |
| PUT | `/commandes/:id/status` | Avancer le statut | Employe+ |
| DELETE | `/commandes/:id` | Annuler une commande | JWT |

### Avis (`/api/avis`)
| Methode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/avis` | Avis validés (public) | Non |
| GET | `/avis/pending` | Avis en attente | Employe+ |
| POST | `/avis` | Créer un avis | JWT |
| PUT | `/avis/:id/validate` | Valider/refuser un avis | Employe+ |

### Autres endpoints
| Methode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/horaires` | Liste des horaires | Non |
| PUT | `/horaires/:id` | Modifier un horaire | Employé/Admin |
| POST | `/contact` | Envoyer un message | Non |
| GET | `/admin/stats/orders` | Statistiques commandes | Admin |
| POST | `/admin/employees` | Créer un employé | Admin |

## Securite

- Authentification JWT avec tokens signés et expiration configurable
- Hachage des mots de passe avec bcrypt (10 rounds)
- Contrôle d'accès par rôles (RBAC) via guards NestJS
- Validation des entrées avec class-validator sur tous les DTOs
- Protection CORS configurée
- Mot de passe fort requis (min. 10 car., majuscule, minuscule, chiffre, caractère spécial)
- Anti-énumération sur la route de mot de passe oublié

## Auteur

**Romain GAILLARD** - Formation TP Développeur Web et Web Mobile (Studi, 2026)
