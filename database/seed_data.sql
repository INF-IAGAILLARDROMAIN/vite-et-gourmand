-- ============================================================
-- Vite & Gourmand - Données de démonstration (seed)
-- Les mots de passe sont hashés avec bcrypt (10 rounds)
-- ============================================================

-- ==================== ROLES ====================
INSERT INTO role (libelle) VALUES
('administrateur'),
('employe'),
('utilisateur');

-- ==================== UTILISATEURS ====================
-- Mot de passe Admin@2026! hashé avec bcrypt
INSERT INTO utilisateur (email, password, nom, prenom, telephone, adresse_postale, role_id) VALUES
('admin@viteetgourmand.fr', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36PqSmFSG0XXXX.placeholder', 'José', 'Admin', '0556000001', '12 Rue Sainte-Catherine, 33000 Bordeaux', 1),
('employe@viteetgourmand.fr', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36PqSmFSG0XXXX.placeholder', 'Julie', 'Employée', '0556000002', '45 Cours de l''Intendance, 33000 Bordeaux', 2),
('user@viteetgourmand.fr', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36PqSmFSG0XXXX.placeholder', 'Dupont', 'Marie', '0612345678', '78 Avenue Thiers, 33100 Bordeaux', 3);

-- ==================== THEMES ====================
INSERT INTO theme (libelle) VALUES
('Noël'),
('Pâques'),
('Classique'),
('Événement');

-- ==================== REGIMES ====================
INSERT INTO regime (libelle) VALUES
('Classique'),
('Végétarien'),
('Végan'),
('Sans gluten');

-- ==================== ALLERGENES ====================
INSERT INTO allergene (libelle) VALUES
('Gluten'),
('Crustacés'),
('Oeufs'),
('Poissons'),
('Arachides'),
('Soja'),
('Lait'),
('Fruits à coque'),
('Céleri'),
('Moutarde'),
('Sésame'),
('Sulfites'),
('Lupin'),
('Mollusques');

-- ==================== PLATS ====================
-- Entrées
INSERT INTO plat (titre_plat, photo, type) VALUES
('Foie gras maison et son chutney de figues', NULL, 'ENTREE'),
('Velouté de butternut aux éclats de noisettes', NULL, 'ENTREE'),
('Salade de chèvre chaud et noix', NULL, 'ENTREE'),
('Tartare de saumon aux agrumes', NULL, 'ENTREE'),
('Bruschetta tomates confites et basilic', NULL, 'ENTREE'),
('Soupe à l''oignon gratinée', NULL, 'ENTREE');

-- Plats
INSERT INTO plat (titre_plat, photo, type) VALUES
('Filet de boeuf en croûte, sauce périgourdine', NULL, 'PLAT'),
('Suprême de volaille farci aux morilles', NULL, 'PLAT'),
('Pavé de saumon, beurre blanc et légumes de saison', NULL, 'PLAT'),
('Risotto aux champignons et parmesan', NULL, 'PLAT'),
('Curry de légumes au lait de coco', NULL, 'PLAT'),
('Magret de canard, sauce au miel et romarin', NULL, 'PLAT');

-- Desserts
INSERT INTO plat (titre_plat, photo, type) VALUES
('Bûche de Noël chocolat-marrons', NULL, 'DESSERT'),
('Tarte Tatin tiède et crème fraîche', NULL, 'DESSERT'),
('Fondant au chocolat coeur coulant', NULL, 'DESSERT'),
('Panna cotta vanille et coulis de fruits rouges', NULL, 'DESSERT'),
('Crème brûlée à la vanille de Madagascar', NULL, 'DESSERT'),
('Assiette de fromages affinés', NULL, 'DESSERT');

-- ==================== MENUS ====================
INSERT INTO menu (titre, nombre_personne_minimale, prix_par_personne, description, quantite_restante, conditions) VALUES
('Menu Festif de Noël', 8, 65.00, 'Un menu raffiné pour célébrer Noël en famille ou entre amis. Produits frais et de saison, préparés avec passion par notre équipe.', 10, 'Commande à passer minimum 2 semaines avant la prestation. Matériel de service inclus (assiettes, couverts, verres). Stockage au réfrigérateur dès réception.'),
('Menu Printanier de Pâques', 6, 55.00, 'Célébrez Pâques avec un menu léger et savoureux, aux saveurs printanières et colorées.', 15, 'Commande à passer minimum 10 jours avant la prestation. Prévoir un espace réfrigéré pour le stockage.'),
('Menu Classique Gourmand', 4, 45.00, 'Notre menu signature, parfait pour toute occasion. Des classiques revisités avec une touche moderne.', 20, 'Commande à passer minimum 5 jours avant la prestation.'),
('Menu Végétarien Découverte', 4, 42.00, 'Un menu 100% végétarien, gourmand et équilibré, pour ravir les papilles des amateurs de cuisine verte.', 12, 'Commande à passer minimum 5 jours avant la prestation. Menu adaptable en végan sur demande.'),
('Menu Grand Événement', 20, 75.00, 'Le menu prestige pour vos grands événements : mariages, galas, anniversaires. Service complet avec personnel sur demande.', 5, 'Commande à passer minimum 3 semaines avant la prestation. Matériel de réception prêté (tables, nappes, vaisselle). Restitution sous 10 jours ouvrés, 600€ de frais en cas de non-restitution.');

-- ==================== LIAISON MENU <-> THEME ====================
INSERT INTO menu_theme (menu_id, theme_id) VALUES
(1, 1),  -- Menu Noël -> Noël
(2, 2),  -- Menu Pâques -> Pâques
(3, 3),  -- Menu Classique -> Classique
(4, 3),  -- Menu Végétarien -> Classique
(5, 4);  -- Menu Grand Événement -> Événement

-- ==================== LIAISON MENU <-> REGIME ====================
INSERT INTO menu_regime (menu_id, regime_id) VALUES
(1, 1),  -- Menu Noël -> Classique
(2, 1),  -- Menu Pâques -> Classique
(3, 1),  -- Menu Classique -> Classique
(4, 2),  -- Menu Végétarien -> Végétarien
(4, 3),  -- Menu Végétarien -> Végan
(5, 1);  -- Menu Grand Événement -> Classique

-- ==================== LIAISON MENU <-> PLAT ====================
-- Menu Noël : foie gras, filet de boeuf en croûte, bûche
INSERT INTO menu_plat (menu_id, plat_id) VALUES
(1, 1), (1, 7), (1, 13),
-- Menu Pâques : tartare saumon, suprême volaille, tarte tatin
(2, 4), (2, 8), (2, 14),
-- Menu Classique : soupe oignon, magret canard, crème brûlée
(3, 6), (3, 12), (3, 17),
-- Menu Végétarien : bruschetta, risotto, panna cotta
(4, 5), (4, 10), (4, 16),
-- Menu Grand Événement : foie gras, salade chèvre, filet boeuf, suprême volaille, fondant chocolat, fromages
(5, 1), (5, 3), (5, 7), (5, 8), (5, 15), (5, 18);

-- ==================== LIAISON PLAT <-> ALLERGENE ====================
INSERT INTO plat_allergene (plat_id, allergene_id) VALUES
(1, 3),   -- Foie gras -> Oeufs
(2, 8),   -- Velouté butternut -> Fruits à coque
(3, 7),   -- Salade chèvre -> Lait
(3, 8),   -- Salade chèvre -> Fruits à coque
(4, 4),   -- Tartare saumon -> Poissons
(6, 1),   -- Soupe oignon -> Gluten
(6, 7),   -- Soupe oignon -> Lait
(7, 1),   -- Filet boeuf croûte -> Gluten
(7, 3),   -- Filet boeuf croûte -> Oeufs
(8, 7),   -- Suprême volaille -> Lait
(9, 4),   -- Saumon -> Poissons
(9, 7),   -- Saumon -> Lait
(10, 7),  -- Risotto -> Lait
(13, 1),  -- Bûche Noël -> Gluten
(13, 3),  -- Bûche Noël -> Oeufs
(13, 7),  -- Bûche Noël -> Lait
(14, 1),  -- Tarte Tatin -> Gluten
(14, 7),  -- Tarte Tatin -> Lait
(15, 1),  -- Fondant chocolat -> Gluten
(15, 3),  -- Fondant chocolat -> Oeufs
(16, 7),  -- Panna cotta -> Lait
(17, 3),  -- Crème brûlée -> Oeufs
(17, 7),  -- Crème brûlée -> Lait
(18, 7);  -- Fromages -> Lait

-- ==================== HORAIRES ====================
INSERT INTO horaire (jour, heure_ouverture, heure_fermeture) VALUES
('Lundi', '09:00', '18:00'),
('Mardi', '09:00', '18:00'),
('Mercredi', '09:00', '18:00'),
('Jeudi', '09:00', '18:00'),
('Vendredi', '09:00', '19:00'),
('Samedi', '10:00', '17:00'),
('Dimanche', 'Fermé', 'Fermé');

-- ==================== COMMANDES DE DEMO ====================
INSERT INTO commande (numero_commande, date_prestation, heure_prestation, adresse, prix_menu, nombre_personnes, prix_livraison, statut, utilisateur_id, menu_id) VALUES
('CMD-2026-001', '2026-03-15', '19:00', '78 Avenue Thiers, 33100 Bordeaux', 360.00, 8, 0.00, 'TERMINEE', 3, 1),
('CMD-2026-002', '2026-04-20', '12:30', '15 Rue du Palais Gallien, 33000 Bordeaux', 270.00, 6, 0.00, 'ACCEPTEE', 3, 2);

-- Historique des statuts pour la commande terminée
INSERT INTO commande_historique (statut, date, commande_id) VALUES
('RECUE', '2026-02-15 10:00:00', 1),
('ACCEPTEE', '2026-02-15 14:00:00', 1),
('EN_PREPARATION', '2026-03-14 08:00:00', 1),
('EN_LIVRAISON', '2026-03-15 17:00:00', 1),
('LIVREE', '2026-03-15 19:15:00', 1),
('TERMINEE', '2026-03-15 19:30:00', 1),
('RECUE', '2026-02-16 09:00:00', 2),
('ACCEPTEE', '2026-02-16 11:00:00', 2);

-- ==================== AVIS DE DEMO ====================
INSERT INTO avis (note, description, statut, utilisateur_id, commande_id) VALUES
(5, 'Excellent menu de Noël ! Le foie gras était incroyable et la bûche un pur délice. Service impeccable, je recommande vivement.', 'VALIDE', 3, 1);
