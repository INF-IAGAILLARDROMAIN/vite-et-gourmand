# Manuel d'Utilisation - Vite & Gourmand

## 1. Accès à l'application

- **Site public** : `http://localhost:3001` (développement)
- **Back-office** : `http://localhost:3001/admin`

---

## 2. Partie publique (visiteur)

### 2.1 Page d'accueil

La page d'accueil présente :
- Une bannière d'accroche avec les chiffres clés (500+ événements, 98% satisfaction, 5 étoiles)
- Les points forts du service (6 cartes : menus, livraison, allergènes, fraîcheur, service, prix)
- Les témoignages de clients satisfaits
- Un appel à l'action vers le catalogue

### 2.2 Consulter les menus

1. Cliquer sur **« Découvrir nos menus »** ou **« Nos menus »** dans la navigation
2. Utiliser les filtres disponibles :
   - **Recherche** : saisir un mot-clé dans le champ de recherche
   - **Thème** : sélectionner un thème (Noël, Pâques, Classique, Événement)
   - **Régime** : sélectionner un régime alimentaire
   - **Budget** : définir un prix maximum par personne
3. Cliquer sur **« Voir le détail »** pour accéder à la fiche complète d'un menu

### 2.3 Détail d'un menu

La fiche menu affiche :
- Photo du menu
- Titre, description et conditions
- Prix par personne et minimum de personnes requis
- Tags (thème et régime)
- Composition complète : entrées, plats, desserts avec les allergènes de chaque plat
- Bouton de commande (nécessite d'être connecté)

### 2.4 Formulaire de contact

1. Aller sur la page **« Contact »**
2. Remplir le formulaire : nom, email, sujet, message
3. Cliquer sur **« Envoyer »**
4. Un email est envoyé à l'équipe Vite & Gourmand

---

## 3. Espace client

### 3.1 Inscription

1. Cliquer sur **« Inscription »** dans la navigation
2. Remplir le formulaire :
   - Nom et prénom
   - Email
   - Téléphone
   - Adresse postale
   - Mot de passe (min. 8 caractères, avec majuscule, minuscule, chiffre et caractère spécial)
3. Cliquer sur **« S'inscrire »**

### 3.2 Connexion

1. Cliquer sur **« Connexion »** dans la navigation
2. Saisir email et mot de passe
3. Cliquer sur **« Se connecter »**

### 3.3 Mot de passe oublié

1. Sur la page de connexion, cliquer sur **« Mot de passe oublié ? »**
2. Saisir l'adresse email du compte
3. Cliquer sur **« Envoyer »**
4. Suivre le lien reçu par email pour réinitialiser le mot de passe

### 3.4 Commander un menu

1. Depuis la fiche d'un menu, cliquer sur **« Commander »**
2. Remplir le formulaire de commande :
   - **Date de prestation** : choisir la date de l'événement
   - **Heure** : choisir l'heure de livraison
   - **Adresse** : indiquer l'adresse de livraison
   - **Nombre de personnes** : indiquer le nombre de convives (minimum affiché)
3. Le prix est calculé automatiquement :
   - Prix du menu = prix/personne x nombre de personnes
   - Frais de livraison (0€ à 20€ selon la distance)
   - Réduction de 5% à partir de 50 personnes
4. Cliquer sur **« Confirmer la commande »**

### 3.5 Suivre ses commandes

1. Cliquer sur l'icône utilisateur puis **« Mon compte »**
2. Cliquer sur **« Voir toutes mes commandes »**
3. Chaque commande affiche :
   - Numéro de commande
   - Menu commandé
   - Date et heure de prestation
   - Statut actuel (avec badge coloré)
   - Montant total
4. Cliquer sur une commande pour voir le détail et l'historique des statuts

### 3.6 Annuler une commande

1. Ouvrir le détail de la commande
2. Si le statut le permet (Reçue, Acceptée, ou En préparation), le bouton **« Annuler »** est affiché
3. Cliquer sur **« Annuler la commande »** et confirmer

### 3.7 Laisser un avis

1. Ouvrir le détail d'une commande livrée
2. Si aucun avis n'a été déposé, le formulaire d'avis apparaît
3. Attribuer une note (1 à 5 étoiles)
4. Rédiger un commentaire
5. Cliquer sur **« Envoyer l'avis »**
6. L'avis sera visible après validation par l'équipe

---

## 4. Back-office (employé)

### 4.1 Accès

1. Se connecter avec un compte employé ou administrateur
2. Le menu de navigation affiche un lien **« Admin »**
3. Le back-office est organisé avec un menu latéral

### 4.2 Dashboard

La page d'accueil du back-office affiche :
- **Commandes totales** : nombre total de commandes
- **Chiffre d'affaires** : total cumulé
- **Menus actifs** : nombre de menus en catalogue
- **Statistiques par menu** : tableau détaillé (commandes et CA par menu)

### 4.3 Gestion des commandes

1. Aller dans **« Commandes »**
2. Utiliser la recherche ou le filtre par statut pour trouver une commande
3. Chaque commande affiche :
   - Numéro, statut, menu, client, date, montant
   - Bouton pour avancer au statut suivant
4. Cliquer sur le bouton de statut pour faire progresser la commande :
   - Reçue → Acceptée → En préparation → En livraison → Livrée → Retour matériel → Terminée

### 4.4 Modération des avis

1. Aller dans **« Avis »**
2. Les avis en attente de modération sont listés avec :
   - Nom du client et date
   - Menu concerné
   - Note (étoiles) et commentaire
3. Pour chaque avis :
   - Cliquer sur ✓ (vert) pour **valider** l'avis
   - Cliquer sur ✗ (rouge) pour **refuser** l'avis

### 4.5 Gestion des menus

1. Aller dans **« Menus »**
2. La liste affiche tous les menus avec prix, minimum personnes, stock et thèmes
3. Possibilité de supprimer un menu via l'icône poubelle

---

## 5. Back-office (administrateur)

L'administrateur a accès à toutes les fonctionnalités employé, plus :

### 5.1 Gestion des horaires

1. Aller dans **« Horaires »**
2. Modifier les heures d'ouverture et fermeture pour chaque jour
3. Les modifications sont enregistrées en temps réel

### 5.2 Création d'employés

1. Aller dans **« Employés »**
2. Remplir le formulaire : nom, prénom, email, téléphone, adresse
3. Un mot de passe temporaire est généré automatiquement
4. Cliquer sur **« Créer l'employé »**

---

## 6. Comptes de démonstration

| Role | Email | Mot de passe |
|------|-------|-------------|
| Administrateur | admin@viteetgourmand.fr | Admin@2026! |
| Employe | employe@viteetgourmand.fr | Employe@2026! |
| Utilisateur | user@viteetgourmand.fr | User@2026! |

Pour tester le parcours complet :
1. Se connecter avec le compte **utilisateur** pour tester la commande et les avis
2. Se connecter avec le compte **employé** pour tester la gestion des commandes
3. Se connecter avec le compte **administrateur** pour tester la gestion complète
