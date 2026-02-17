-- ============================================================
-- Vite & Gourmand - Script de création de la base de données
-- PostgreSQL
-- ============================================================

-- Types ENUM
CREATE TYPE "PlatType" AS ENUM ('ENTREE', 'PLAT', 'DESSERT');
CREATE TYPE "CommandeStatut" AS ENUM ('RECUE', 'ACCEPTEE', 'EN_PREPARATION', 'EN_LIVRAISON', 'LIVREE', 'ATTENTE_RETOUR_MATERIEL', 'TERMINEE', 'ANNULEE');
CREATE TYPE "AvisStatut" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REFUSE');

-- ==================== ROLES ====================
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
);

-- ==================== UTILISATEURS ====================
CREATE TABLE utilisateur (
    utilisateur_id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    adresse_postale VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    role_id INTEGER NOT NULL REFERENCES role(role_id)
);

-- ==================== THEMES ====================
CREATE TABLE theme (
    theme_id SERIAL PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
);

-- ==================== REGIMES ====================
CREATE TABLE regime (
    regime_id SERIAL PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
);

-- ==================== MENUS ====================
CREATE TABLE menu (
    menu_id SERIAL PRIMARY KEY,
    titre VARCHAR(100) NOT NULL,
    nombre_personne_minimale INTEGER NOT NULL,
    prix_par_personne DOUBLE PRECISION NOT NULL,
    description TEXT NOT NULL,
    quantite_restante INTEGER NOT NULL,
    conditions TEXT
);

-- ==================== IMAGES MENU ====================
CREATE TABLE menu_image (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    alt VARCHAR(255),
    menu_id INTEGER NOT NULL REFERENCES menu(menu_id) ON DELETE CASCADE
);

-- ==================== PLATS ====================
CREATE TABLE plat (
    plat_id SERIAL PRIMARY KEY,
    titre_plat VARCHAR(100) NOT NULL,
    photo VARCHAR(500),
    type "PlatType" NOT NULL
);

-- ==================== ALLERGENES ====================
CREATE TABLE allergene (
    allergene_id SERIAL PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
);

-- ==================== TABLES DE LIAISON ====================

-- Menu <-> Theme (Many-to-Many)
CREATE TABLE menu_theme (
    menu_id INTEGER NOT NULL REFERENCES menu(menu_id) ON DELETE CASCADE,
    theme_id INTEGER NOT NULL REFERENCES theme(theme_id) ON DELETE CASCADE,
    PRIMARY KEY (menu_id, theme_id)
);

-- Menu <-> Regime (Many-to-Many)
CREATE TABLE menu_regime (
    menu_id INTEGER NOT NULL REFERENCES menu(menu_id) ON DELETE CASCADE,
    regime_id INTEGER NOT NULL REFERENCES regime(regime_id) ON DELETE CASCADE,
    PRIMARY KEY (menu_id, regime_id)
);

-- Menu <-> Plat (Many-to-Many)
CREATE TABLE menu_plat (
    menu_id INTEGER NOT NULL REFERENCES menu(menu_id) ON DELETE CASCADE,
    plat_id INTEGER NOT NULL REFERENCES plat(plat_id) ON DELETE CASCADE,
    PRIMARY KEY (menu_id, plat_id)
);

-- Plat <-> Allergene (Many-to-Many)
CREATE TABLE plat_allergene (
    plat_id INTEGER NOT NULL REFERENCES plat(plat_id) ON DELETE CASCADE,
    allergene_id INTEGER NOT NULL REFERENCES allergene(allergene_id) ON DELETE CASCADE,
    PRIMARY KEY (plat_id, allergene_id)
);

-- ==================== COMMANDES ====================
CREATE TABLE commande (
    id SERIAL PRIMARY KEY,
    numero_commande VARCHAR(50) NOT NULL UNIQUE,
    date_commande TIMESTAMP NOT NULL DEFAULT NOW(),
    date_prestation TIMESTAMP NOT NULL,
    heure_prestation VARCHAR(10) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    prix_menu DOUBLE PRECISION NOT NULL,
    nombre_personnes INTEGER NOT NULL,
    prix_livraison DOUBLE PRECISION NOT NULL,
    statut "CommandeStatut" NOT NULL DEFAULT 'RECUE',
    validation_materiel BOOLEAN NOT NULL DEFAULT FALSE,
    motif_annulation TEXT,
    mode_contact VARCHAR(20),
    utilisateur_id INTEGER NOT NULL REFERENCES utilisateur(utilisateur_id),
    menu_id INTEGER NOT NULL REFERENCES menu(menu_id)
);

-- ==================== HISTORIQUE STATUTS COMMANDE ====================
CREATE TABLE commande_historique (
    id SERIAL PRIMARY KEY,
    statut "CommandeStatut" NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT NOW(),
    commande_id INTEGER NOT NULL REFERENCES commande(id) ON DELETE CASCADE
);

-- ==================== AVIS ====================
CREATE TABLE avis (
    avis_id SERIAL PRIMARY KEY,
    note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
    description TEXT NOT NULL,
    statut "AvisStatut" NOT NULL DEFAULT 'EN_ATTENTE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    utilisateur_id INTEGER NOT NULL REFERENCES utilisateur(utilisateur_id),
    commande_id INTEGER NOT NULL UNIQUE REFERENCES commande(id)
);

-- ==================== HORAIRES ====================
CREATE TABLE horaire (
    horaire_id SERIAL PRIMARY KEY,
    jour VARCHAR(20) NOT NULL UNIQUE,
    heure_ouverture VARCHAR(10) NOT NULL,
    heure_fermeture VARCHAR(10) NOT NULL
);
