# Vite & Gourmand

Application web de gestion de menus et commandes pour traiteur/événementiel, basée à Bordeaux.

## Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript, Prisma |
| BDD SQL | PostgreSQL (Neon) |
| BDD NoSQL | MongoDB Atlas |
| Auth | JWT (bcrypt + tokens) |
| Emails | Nodemailer |
| Déploiement | Vercel (front) + Railway (back) |

## Prérequis

- Node.js >= 20
- npm >= 10
- PostgreSQL (ou compte Neon)
- MongoDB (ou compte Atlas)

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
DATABASE_URL="postgresql://user:password@localhost:5432/vite_et_gourmand"
MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/vite_et_gourmand"
JWT_SECRET="votre-secret-jwt"
JWT_EXPIRATION="24h"
MAIL_HOST="smtp.example.com"
MAIL_PORT=587
MAIL_USER="votre-email"
MAIL_PASS="votre-mot-de-passe"
```

Lancer les migrations et le seed :

```bash
npx prisma migrate dev
npx prisma db seed
```

Démarrer le serveur :

```bash
npm run start:dev
```

Le backend est accessible sur `http://localhost:3001`.

### 3. Frontend (Web)

```bash
cd apps/web
npm install
```

Créer un fichier `.env.local` dans `apps/web/` :

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Démarrer le serveur :

```bash
npm run dev
```

Le frontend est accessible sur `http://localhost:3000`.

## Structure du projet

```
vite-et-gourmand/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend NestJS
├── database/
│   ├── create_tables.sql
│   └── seed_data.sql
├── docs/             # Documentation (charte graphique, manuel, etc.)
└── README.md
```

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Administrateur | admin@viteetgourmand.fr | Admin@2026! |
| Employé | employe@viteetgourmand.fr | Employe@2026! |
| Utilisateur | user@viteetgourmand.fr | User@2026! |

## Liens

- **Application déployée** : [à venir]
- **Gestion de projet** : [à venir]

## Auteur

Romain GAILLARD - Formation TP Développeur Web et Web Mobile (Studi)
