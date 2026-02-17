-- CreateEnum
CREATE TYPE "PlatType" AS ENUM ('ENTREE', 'PLAT', 'DESSERT');

-- CreateEnum
CREATE TYPE "CommandeStatut" AS ENUM ('RECUE', 'ACCEPTEE', 'EN_PREPARATION', 'EN_LIVRAISON', 'LIVREE', 'ATTENTE_RETOUR_MATERIEL', 'TERMINEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "AvisStatut" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REFUSE');

-- CreateTable
CREATE TABLE "role" (
    "role_id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "utilisateur" (
    "utilisateur_id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "prenom" VARCHAR(50) NOT NULL,
    "telephone" VARCHAR(20) NOT NULL,
    "adresse_postale" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("utilisateur_id")
);

-- CreateTable
CREATE TABLE "menu" (
    "menu_id" SERIAL NOT NULL,
    "titre" VARCHAR(100) NOT NULL,
    "nombre_personne_minimale" INTEGER NOT NULL,
    "prix_par_personne" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "quantite_restante" INTEGER NOT NULL,
    "conditions" TEXT,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("menu_id")
);

-- CreateTable
CREATE TABLE "menu_image" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "alt" VARCHAR(255),
    "menu_id" INTEGER NOT NULL,

    CONSTRAINT "menu_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme" (
    "theme_id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "theme_pkey" PRIMARY KEY ("theme_id")
);

-- CreateTable
CREATE TABLE "regime" (
    "regime_id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "regime_pkey" PRIMARY KEY ("regime_id")
);

-- CreateTable
CREATE TABLE "menu_theme" (
    "menu_id" INTEGER NOT NULL,
    "theme_id" INTEGER NOT NULL,

    CONSTRAINT "menu_theme_pkey" PRIMARY KEY ("menu_id","theme_id")
);

-- CreateTable
CREATE TABLE "menu_regime" (
    "menu_id" INTEGER NOT NULL,
    "regime_id" INTEGER NOT NULL,

    CONSTRAINT "menu_regime_pkey" PRIMARY KEY ("menu_id","regime_id")
);

-- CreateTable
CREATE TABLE "plat" (
    "plat_id" SERIAL NOT NULL,
    "titre_plat" VARCHAR(100) NOT NULL,
    "photo" VARCHAR(500),
    "type" "PlatType" NOT NULL,

    CONSTRAINT "plat_pkey" PRIMARY KEY ("plat_id")
);

-- CreateTable
CREATE TABLE "allergene" (
    "allergene_id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "allergene_pkey" PRIMARY KEY ("allergene_id")
);

-- CreateTable
CREATE TABLE "menu_plat" (
    "menu_id" INTEGER NOT NULL,
    "plat_id" INTEGER NOT NULL,

    CONSTRAINT "menu_plat_pkey" PRIMARY KEY ("menu_id","plat_id")
);

-- CreateTable
CREATE TABLE "plat_allergene" (
    "plat_id" INTEGER NOT NULL,
    "allergene_id" INTEGER NOT NULL,

    CONSTRAINT "plat_allergene_pkey" PRIMARY KEY ("plat_id","allergene_id")
);

-- CreateTable
CREATE TABLE "commande" (
    "id" SERIAL NOT NULL,
    "numero_commande" VARCHAR(50) NOT NULL,
    "date_commande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_prestation" TIMESTAMP(3) NOT NULL,
    "heure_prestation" VARCHAR(10) NOT NULL,
    "adresse" VARCHAR(255) NOT NULL,
    "prix_menu" DOUBLE PRECISION NOT NULL,
    "nombre_personnes" INTEGER NOT NULL,
    "prix_livraison" DOUBLE PRECISION NOT NULL,
    "statut" "CommandeStatut" NOT NULL DEFAULT 'RECUE',
    "validation_materiel" BOOLEAN NOT NULL DEFAULT false,
    "motif_annulation" TEXT,
    "mode_contact" VARCHAR(20),
    "utilisateur_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,

    CONSTRAINT "commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commande_historique" (
    "id" SERIAL NOT NULL,
    "statut" "CommandeStatut" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commande_id" INTEGER NOT NULL,

    CONSTRAINT "commande_historique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avis" (
    "avis_id" SERIAL NOT NULL,
    "note" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "statut" "AvisStatut" NOT NULL DEFAULT 'EN_ATTENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateur_id" INTEGER NOT NULL,
    "commande_id" INTEGER NOT NULL,

    CONSTRAINT "avis_pkey" PRIMARY KEY ("avis_id")
);

-- CreateTable
CREATE TABLE "horaire" (
    "horaire_id" SERIAL NOT NULL,
    "jour" VARCHAR(20) NOT NULL,
    "heure_ouverture" VARCHAR(10) NOT NULL,
    "heure_fermeture" VARCHAR(10) NOT NULL,

    CONSTRAINT "horaire_pkey" PRIMARY KEY ("horaire_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_libelle_key" ON "role"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_email_key" ON "utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "theme_libelle_key" ON "theme"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "regime_libelle_key" ON "regime"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "allergene_libelle_key" ON "allergene"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "commande_numero_commande_key" ON "commande"("numero_commande");

-- CreateIndex
CREATE UNIQUE INDEX "avis_commande_id_key" ON "avis"("commande_id");

-- CreateIndex
CREATE UNIQUE INDEX "horaire_jour_key" ON "horaire"("jour");

-- AddForeignKey
ALTER TABLE "utilisateur" ADD CONSTRAINT "utilisateur_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_image" ADD CONSTRAINT "menu_image_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_theme" ADD CONSTRAINT "menu_theme_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_theme" ADD CONSTRAINT "menu_theme_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "theme"("theme_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_regime" ADD CONSTRAINT "menu_regime_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_regime" ADD CONSTRAINT "menu_regime_regime_id_fkey" FOREIGN KEY ("regime_id") REFERENCES "regime"("regime_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_plat" ADD CONSTRAINT "menu_plat_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_plat" ADD CONSTRAINT "menu_plat_plat_id_fkey" FOREIGN KEY ("plat_id") REFERENCES "plat"("plat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plat_allergene" ADD CONSTRAINT "plat_allergene_plat_id_fkey" FOREIGN KEY ("plat_id") REFERENCES "plat"("plat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plat_allergene" ADD CONSTRAINT "plat_allergene_allergene_id_fkey" FOREIGN KEY ("allergene_id") REFERENCES "allergene"("allergene_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande" ADD CONSTRAINT "commande_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateur"("utilisateur_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande" ADD CONSTRAINT "commande_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menu"("menu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_historique" ADD CONSTRAINT "commande_historique_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "commande"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateur"("utilisateur_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
