# Guide de Déploiement - Vite & Gourmand

## 1. Architecture de déploiement

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel     │────>│   Railway    │────>│   Neon       │
│   Frontend   │     │   Backend    │     │   PostgreSQL │
│   Next.js    │     │   NestJS     │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

| Service | Plateforme | Plan gratuit |
|---------|-----------|-------------|
| Frontend | [Vercel](https://vercel.com) | Oui |
| Backend | [Railway](https://railway.app) | 5$/mois (essai gratuit) |
| Base de données | [Neon](https://neon.tech) | Oui (0.5 GB) |

---

## 2. Étape 1 : Base de données (Neon)

### 2.1 Créer un projet Neon

1. Aller sur [neon.tech](https://neon.tech) et créer un compte
2. Créer un nouveau projet : **vite-et-gourmand**
3. Région : **Europe West (eu-west-1)**
4. Copier le **Connection string** qui ressemble à :
   ```
   postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/neondb?sslmode=require
   ```

### 2.2 Initialiser la base

Depuis le dossier `apps/api/` en local :

```bash
# Configurer la variable d'environnement avec l'URL Neon
export DATABASE_URL="postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/neondb?sslmode=require"

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Peupler avec les données de démonstration
npx prisma db seed
```

---

## 3. Étape 2 : Backend (Railway)

### 3.1 Déployer sur Railway

1. Aller sur [railway.app](https://railway.app) et se connecter avec GitHub
2. Cliquer sur **New Project** > **Deploy from GitHub Repo**
3. Sélectionner le repo **vite-et-gourmand**
4. Railway va détecter automatiquement le projet

### 3.2 Configurer Railway

Dans les paramètres du service :

**Build settings :**
- Root directory : `apps/api`
- Build command : `npm install && npx prisma generate && npm run build`
- Start command : `npm run start:prod`

**Variables d'environnement :**
```
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
JWT_SECRET=votre-secret-jwt-production-32-chars-min
JWT_EXPIRATION=24h
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=votre-email@gmail.com
MAIL_PASS=votre-app-password
PORT=3000
```

### 3.3 Vérifier le déploiement

Railway génère une URL publique, par exemple :
```
https://vite-et-gourmand-api-production.up.railway.app
```

Tester : `GET https://votre-url.railway.app/api`

---

## 4. Étape 3 : Frontend (Vercel)

### 4.1 Déployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com) et se connecter avec GitHub
2. Cliquer sur **Add New** > **Project**
3. Importer le repo **vite-et-gourmand**

### 4.2 Configurer Vercel

**Build settings :**
- Framework Preset : **Next.js**
- Root Directory : `apps/web`

**Variables d'environnement :**
```
NEXT_PUBLIC_API_URL=https://votre-url.railway.app/api
```

### 4.3 Vérifier le déploiement

Vercel génère une URL publique, par exemple :
```
https://vite-et-gourmand.vercel.app
```

---

## 5. Configuration CORS

Mettre à jour le backend pour autoriser le domaine Vercel.

Dans `apps/api/src/main.ts`, ajouter l'origine de production :

```typescript
app.enableCors({
  origin: [
    'http://localhost:3001',
    'https://vite-et-gourmand.vercel.app',
  ],
  credentials: true,
});
```

---

## 6. Configuration email (Gmail)

Pour utiliser Gmail comme serveur SMTP :

1. Activer la vérification en 2 étapes sur le compte Google
2. Générer un **mot de passe d'application** :
   - Google Account > Sécurité > Mots de passe des applications
   - Sélectionner « Autre » et nommer « Vite & Gourmand »
   - Copier le mot de passe généré (16 caractères)
3. Utiliser ce mot de passe comme `MAIL_PASS`

---

## 7. Checklist de déploiement

- [ ] Base de données Neon créée et migrée
- [ ] Seed exécuté sur la base de production
- [ ] Backend déployé sur Railway avec variables d'environnement
- [ ] API accessible et fonctionnelle (test GET /api)
- [ ] Frontend déployé sur Vercel avec NEXT_PUBLIC_API_URL configuré
- [ ] CORS configuré pour autoriser le domaine Vercel
- [ ] Email SMTP configuré et fonctionnel
- [ ] Test complet du parcours utilisateur en production
- [ ] Test du back-office en production
