# Charte Graphique - Vite & Gourmand

## 1. Identité visuelle

### 1.1 Nom de marque
**Vite & Gourmand** - Traiteur événementiel à Bordeaux

Le nom associe la rapidité du service (« Vite ») à la qualité gastronomique (« Gourmand »), reflétant les valeurs de l'entreprise.

### 1.2 Positionnement
Traiteur haut de gamme accessible, spécialisé dans les événements (mariages, anniversaires, séminaires). L'identité visuelle doit évoquer la chaleur, l'élégance et la gourmandise.

---

## 2. Palette de couleurs

### 2.1 Couleurs principales (Primary - Amber/Doré)

Couleur chaude évoquant la gourmandise, le miel et la cuisine raffinée.

| Token | Hex | Utilisation |
|-------|-----|------------|
| `primary-50` | #fffbeb | Fonds clairs, badges |
| `primary-100` | #fef3c7 | Fonds de sections, tags |
| `primary-200` | #fde68a | Bordures, décorations |
| `primary-300` | #fcd34d | Éléments secondaires |
| `primary-400` | #fbbf24 | Accents |
| `primary-500` | #f59e0b | Étoiles, icônes actives |
| `primary-600` | #d97706 | **Boutons principaux, liens** |
| `primary-700` | #b45309 | Textes sur fond clair |
| `primary-800` | #92400e | Textes importants |
| `primary-900` | #78350f | Titres sur fond coloré |

### 2.2 Couleurs d'accent (Accent - Emeraude)

Couleur complémentaire pour les éléments différenciants (régimes, validations).

| Token | Hex | Utilisation |
|-------|-----|------------|
| `accent-500` | #10b981 | Badges régimes alimentaires |
| `accent-600` | #059669 | Éléments de validation |
| `accent-700` | #047857 | Texte sur fond accent |

### 2.3 Couleurs neutres (Warm)

Palette chaude pour les arrière-plans, évitant le blanc froid.

| Token | Hex | Utilisation |
|-------|-----|------------|
| `warm-50` | #faf7f2 | **Fond principal du site** |
| `warm-100` | #f5f0e8 | Fond des sections alternées |

### 2.4 Couleurs sémantiques

| Couleur | Utilisation |
|---------|------------|
| `green-600` | Succès, validation avis |
| `red-600` | Erreurs, suppression, refus |
| `blue-600` | Informations, statut commande |
| `slate-900` | Texte principal |
| `slate-600` | Texte secondaire |
| `slate-400` | Texte tertiaire, placeholders |

---

## 3. Typographie

### 3.1 Polices utilisées

| Police | Usage | Style |
|--------|-------|-------|
| **Playfair Display** | Titres (h1, h2, h3) | Serif, élégante, raffinée |
| **Inter** | Corps de texte, boutons, labels | Sans-serif, lisible, moderne |

### 3.2 Hierarchie typographique

| Élément | Police | Taille | Poids | Classe Tailwind |
|---------|--------|--------|-------|----------------|
| H1 (page) | Playfair Display | 36-48px | Bold | `text-3xl sm:text-4xl lg:text-5xl font-heading font-bold` |
| H1 (hero) | Playfair Display | 48-72px | Bold | `text-4xl sm:text-5xl lg:text-6xl font-heading font-bold` |
| H2 (section) | Playfair Display | 24-30px | Bold | `text-2xl sm:text-3xl font-heading font-bold` |
| H3 (carte) | Playfair Display | 18-20px | Bold | `text-lg font-heading font-bold` |
| Corps | Inter | 14-16px | Regular | `text-sm` ou `text-base` |
| Label | Inter | 14px | Medium | `text-sm font-medium` |
| Caption | Inter | 12px | Regular | `text-xs` |

### 3.3 Interlignage

- Titres : `leading-tight` (1.25)
- Corps : `leading-relaxed` (1.625)
- Descriptions : `leading-relaxed` (1.625)

---

## 4. Composants UI

### 4.1 Boutons

**Variantes :**

| Variante | Style | Utilisation |
|----------|-------|------------|
| Primary | Fond `primary-600`, texte blanc | Action principale (Commander, Envoyer) |
| Secondary | Fond `slate-900`, texte blanc | Action secondaire |
| Outline | Bordure `primary-600`, texte `primary-700` | Action tertiaire (Nous contacter) |
| Ghost | Transparent, texte `slate-600` | Actions discrètes (Actualiser) |
| Danger | Fond `red-600`, texte blanc | Actions destructives (Supprimer) |

**Tailles :**
- `sm` : padding 8px 16px, texte 13px
- `md` : padding 10px 20px, texte 14px (défaut)
- `lg` : padding 14px 28px, texte 16px

**Interactions :**
- Hover : `scale(1.02)`, changement de couleur
- Active : `scale(0.98)`
- Transition : 150ms ease

### 4.2 Cartes

- Fond blanc, bordure `slate-200`, coins arrondis `rounded-xl`
- Ombre au survol : `shadow-lg`, translation Y de -2px
- Transition : 300ms ease

### 4.3 Badges

- Coins arrondis complets (`rounded-full`)
- Padding : 4px 12px
- Texte : 12px, font-medium

### 4.4 Formulaires

- Inputs avec bordure `slate-300`
- Focus : anneau `primary-500` de 2px
- Labels au-dessus du champ, `text-sm font-medium text-slate-700`
- Messages d'erreur en `text-red-600 text-sm`

---

## 5. Espacement et grille

### 5.1 Conteneur principal
- Largeur max : `max-w-7xl` (1280px)
- Padding horizontal : `px-4 sm:px-6 lg:px-8`

### 5.2 Espacements verticaux
- Entre sections : `py-12 sm:py-16` ou `py-16 sm:py-20`
- Entre titres et contenu : `mb-8` à `mb-12`
- Entre cartes : `gap-6`
- Dans les cartes : `p-5` à `p-6`

### 5.3 Grille responsive
- 1 colonne sur mobile
- 2 colonnes sur tablette (`md:grid-cols-2`)
- 3 colonnes sur desktop (`lg:grid-cols-3`)

---

## 6. Animations

### 6.1 Animations d'entrée (Framer Motion)

| Animation | Propriété | Valeur | Durée |
|-----------|-----------|--------|-------|
| Fade in + slide up | opacity: 0->1, y: 20->0 | - | 300-500ms |
| Stagger | delay | i * 50ms | - |
| Scale in | scale: 0.9->1 | - | 300ms |

### 6.2 Interactions hover

| Élément | Effet |
|---------|-------|
| Boutons | Scale 1.02, couleur plus foncée |
| Cartes | Shadow + translate Y -2px |
| Liens | Underline, couleur primary |
| Nav | Indicateur animé (layoutId) |

### 6.3 Transitions globales

- Durée par défaut : `transition-all duration-200`
- Easing : ease (défaut Tailwind)
- Smooth scroll : `scroll-behavior: smooth`

---

## 7. Responsive design

### 7.1 Breakpoints

| Breakpoint | Largeur | Cible |
|------------|---------|-------|
| Mobile | < 640px | Smartphones |
| `sm` | >= 640px | Grands smartphones |
| `md` | >= 768px | Tablettes |
| `lg` | >= 1024px | Laptops |
| `xl` | >= 1280px | Desktops |

### 7.2 Navigation
- **Desktop** : barre de navigation horizontale avec liens
- **Mobile** : menu hamburger avec panneau latéral animé (AnimatePresence)

### 7.3 Grilles adaptatives
- Cartes menus : 1 col -> 2 cols (md) -> 3 cols (lg)
- Dashboard admin : 1 col -> 3 cols (sm)
- Footer : 1 col -> 4 cols (md)

---

## 8. Iconographie

### 8.1 Bibliothèque
**Lucide React** - icônes SVG cohérentes, trait fin (stroke-width: 2)

### 8.2 Tailles standards

| Contexte | Taille | Classe |
|----------|--------|--------|
| Dans le texte | 16px | `h-4 w-4` |
| Boutons | 16-20px | `h-4 w-4` à `h-5 w-5` |
| Illustrations | 48px | `h-12 w-12` |
| Hero | 80px+ | `h-20 w-20` |

### 8.3 Icônes principales utilisées

| Icône | Usage |
|-------|-------|
| `Utensils` | Menus, restaurant |
| `ShoppingCart` / `ShoppingBag` | Commandes |
| `Star` | Notes, avis |
| `Euro` | Prix |
| `Users` | Nombre de personnes |
| `Clock` | Horaires |
| `MapPin` | Adresse |
| `Phone` / `Mail` | Contact |
| `CheckCircle` / `XCircle` | Validation / Refus |
| `ArrowRight` / `ArrowLeft` | Navigation |
