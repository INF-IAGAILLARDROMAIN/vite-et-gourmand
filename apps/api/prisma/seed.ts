import { PrismaClient, PlatType, CommandeStatut, AvisStatut } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // ==================== ROLES ====================
  const roleAdmin = await prisma.role.create({ data: { libelle: 'administrateur' } });
  const roleEmploye = await prisma.role.create({ data: { libelle: 'employe' } });
  const roleUser = await prisma.role.create({ data: { libelle: 'utilisateur' } });

  // ==================== UTILISATEURS ====================
  const hashPassword = async (pwd: string) => bcrypt.hash(pwd, 10);

  const admin = await prisma.utilisateur.create({
    data: {
      email: 'admin@viteetgourmand.fr',
      password: await hashPassword('Admin@2026!'),
      nom: 'José',
      prenom: 'Admin',
      telephone: '0556000001',
      adressePostale: '12 Rue Sainte-Catherine, 33000 Bordeaux',
      roleId: roleAdmin.id,
    },
  });

  const employe = await prisma.utilisateur.create({
    data: {
      email: 'employe@viteetgourmand.fr',
      password: await hashPassword('Employe@2026!'),
      nom: 'Julie',
      prenom: 'Employée',
      telephone: '0556000002',
      adressePostale: "45 Cours de l'Intendance, 33000 Bordeaux",
      roleId: roleEmploye.id,
    },
  });

  const user = await prisma.utilisateur.create({
    data: {
      email: 'user@viteetgourmand.fr',
      password: await hashPassword('User@2026!'),
      nom: 'Dupont',
      prenom: 'Marie',
      telephone: '0612345678',
      adressePostale: '78 Avenue Thiers, 33100 Bordeaux',
      roleId: roleUser.id,
    },
  });

  // ==================== THEMES ====================
  const themeNoel = await prisma.theme.create({ data: { libelle: 'Noël' } });
  const themePaques = await prisma.theme.create({ data: { libelle: 'Pâques' } });
  const themeClassique = await prisma.theme.create({ data: { libelle: 'Classique' } });
  const themeEvenement = await prisma.theme.create({ data: { libelle: 'Événement' } });

  // ==================== REGIMES ====================
  const regimeClassique = await prisma.regime.create({ data: { libelle: 'Classique' } });
  const regimeVegetarien = await prisma.regime.create({ data: { libelle: 'Végétarien' } });
  const regimeVegan = await prisma.regime.create({ data: { libelle: 'Végan' } });
  const regimeSansGluten = await prisma.regime.create({ data: { libelle: 'Sans gluten' } });

  // ==================== ALLERGENES ====================
  const allergenes = await Promise.all(
    ['Gluten', 'Crustacés', 'Oeufs', 'Poissons', 'Arachides', 'Soja', 'Lait', 'Fruits à coque', 'Céleri', 'Moutarde', 'Sésame', 'Sulfites', 'Lupin', 'Mollusques']
      .map((libelle) => prisma.allergene.create({ data: { libelle } })),
  );

  // ==================== PLATS ====================
  // Entrées
  const foieGras = await prisma.plat.create({ data: { titrePlat: 'Foie gras maison et son chutney de figues', type: PlatType.ENTREE } });
  const veloute = await prisma.plat.create({ data: { titrePlat: 'Velouté de butternut aux éclats de noisettes', type: PlatType.ENTREE } });
  const saladeChevreChaud = await prisma.plat.create({ data: { titrePlat: 'Salade de chèvre chaud et noix', type: PlatType.ENTREE } });
  const tartareSaumon = await prisma.plat.create({ data: { titrePlat: 'Tartare de saumon aux agrumes', type: PlatType.ENTREE } });
  const bruschetta = await prisma.plat.create({ data: { titrePlat: 'Bruschetta tomates confites et basilic', type: PlatType.ENTREE } });
  const soupeOignon = await prisma.plat.create({ data: { titrePlat: "Soupe à l'oignon gratinée", type: PlatType.ENTREE } });

  // Plats
  const filetBoeuf = await prisma.plat.create({ data: { titrePlat: 'Filet de boeuf en croûte, sauce périgourdine', type: PlatType.PLAT } });
  const supremeVolaille = await prisma.plat.create({ data: { titrePlat: 'Suprême de volaille farci aux morilles', type: PlatType.PLAT } });
  const paveSaumon = await prisma.plat.create({ data: { titrePlat: 'Pavé de saumon, beurre blanc et légumes de saison', type: PlatType.PLAT } });
  const risotto = await prisma.plat.create({ data: { titrePlat: 'Risotto aux champignons et parmesan', type: PlatType.PLAT } });
  const curryLegumes = await prisma.plat.create({ data: { titrePlat: 'Curry de légumes au lait de coco', type: PlatType.PLAT } });
  const magretCanard = await prisma.plat.create({ data: { titrePlat: 'Magret de canard, sauce au miel et romarin', type: PlatType.PLAT } });

  // Desserts
  const bucheNoel = await prisma.plat.create({ data: { titrePlat: 'Bûche de Noël chocolat-marrons', type: PlatType.DESSERT } });
  const tarteTatin = await prisma.plat.create({ data: { titrePlat: 'Tarte Tatin tiède et crème fraîche', type: PlatType.DESSERT } });
  const fondantChocolat = await prisma.plat.create({ data: { titrePlat: 'Fondant au chocolat coeur coulant', type: PlatType.DESSERT } });
  const pannaCotta = await prisma.plat.create({ data: { titrePlat: 'Panna cotta vanille et coulis de fruits rouges', type: PlatType.DESSERT } });
  const cremeBrulee = await prisma.plat.create({ data: { titrePlat: 'Crème brûlée à la vanille de Madagascar', type: PlatType.DESSERT } });
  const fromages = await prisma.plat.create({ data: { titrePlat: 'Assiette de fromages affinés', type: PlatType.DESSERT } });

  // ==================== PLAT <-> ALLERGENE ====================
  const allergeneLiaisons = [
    { platId: foieGras.id, allergeneId: allergenes[2].id },       // Oeufs
    { platId: veloute.id, allergeneId: allergenes[7].id },        // Fruits à coque
    { platId: saladeChevreChaud.id, allergeneId: allergenes[6].id }, // Lait
    { platId: saladeChevreChaud.id, allergeneId: allergenes[7].id }, // Fruits à coque
    { platId: tartareSaumon.id, allergeneId: allergenes[3].id },  // Poissons
    { platId: soupeOignon.id, allergeneId: allergenes[0].id },    // Gluten
    { platId: soupeOignon.id, allergeneId: allergenes[6].id },    // Lait
    { platId: filetBoeuf.id, allergeneId: allergenes[0].id },     // Gluten
    { platId: filetBoeuf.id, allergeneId: allergenes[2].id },     // Oeufs
    { platId: supremeVolaille.id, allergeneId: allergenes[6].id },// Lait
    { platId: paveSaumon.id, allergeneId: allergenes[3].id },     // Poissons
    { platId: paveSaumon.id, allergeneId: allergenes[6].id },     // Lait
    { platId: risotto.id, allergeneId: allergenes[6].id },        // Lait
    { platId: bucheNoel.id, allergeneId: allergenes[0].id },      // Gluten
    { platId: bucheNoel.id, allergeneId: allergenes[2].id },      // Oeufs
    { platId: bucheNoel.id, allergeneId: allergenes[6].id },      // Lait
    { platId: tarteTatin.id, allergeneId: allergenes[0].id },     // Gluten
    { platId: tarteTatin.id, allergeneId: allergenes[6].id },     // Lait
    { platId: fondantChocolat.id, allergeneId: allergenes[0].id },// Gluten
    { platId: fondantChocolat.id, allergeneId: allergenes[2].id },// Oeufs
    { platId: pannaCotta.id, allergeneId: allergenes[6].id },     // Lait
    { platId: cremeBrulee.id, allergeneId: allergenes[2].id },    // Oeufs
    { platId: cremeBrulee.id, allergeneId: allergenes[6].id },    // Lait
    { platId: fromages.id, allergeneId: allergenes[6].id },       // Lait
  ];
  for (const l of allergeneLiaisons) {
    await prisma.platAllergene.create({ data: l });
  }

  // ==================== MENUS ====================
  const menuNoel = await prisma.menu.create({
    data: {
      titre: 'Menu Festif de Noël',
      nombrePersonneMinimale: 8,
      prixParPersonne: 65.0,
      description: 'Un menu raffiné pour célébrer Noël en famille ou entre amis. Produits frais et de saison, préparés avec passion par notre équipe.',
      quantiteRestante: 10,
      conditions: 'Commande à passer minimum 2 semaines avant la prestation. Matériel de service inclus (assiettes, couverts, verres). Stockage au réfrigérateur dès réception.',
    },
  });

  const menuPaques = await prisma.menu.create({
    data: {
      titre: 'Menu Printanier de Pâques',
      nombrePersonneMinimale: 6,
      prixParPersonne: 55.0,
      description: 'Célébrez Pâques avec un menu léger et savoureux, aux saveurs printanières et colorées.',
      quantiteRestante: 15,
      conditions: 'Commande à passer minimum 10 jours avant la prestation. Prévoir un espace réfrigéré pour le stockage.',
    },
  });

  const menuClassique = await prisma.menu.create({
    data: {
      titre: 'Menu Classique Gourmand',
      nombrePersonneMinimale: 4,
      prixParPersonne: 45.0,
      description: 'Notre menu signature, parfait pour toute occasion. Des classiques revisités avec une touche moderne.',
      quantiteRestante: 20,
      conditions: 'Commande à passer minimum 5 jours avant la prestation.',
    },
  });

  const menuVegetarien = await prisma.menu.create({
    data: {
      titre: 'Menu Végétarien Découverte',
      nombrePersonneMinimale: 4,
      prixParPersonne: 42.0,
      description: 'Un menu 100% végétarien, gourmand et équilibré, pour ravir les papilles des amateurs de cuisine verte.',
      quantiteRestante: 12,
      conditions: 'Commande à passer minimum 5 jours avant la prestation. Menu adaptable en végan sur demande.',
    },
  });

  const menuGrandEvent = await prisma.menu.create({
    data: {
      titre: 'Menu Grand Événement',
      nombrePersonneMinimale: 20,
      prixParPersonne: 75.0,
      description: 'Le menu prestige pour vos grands événements : mariages, galas, anniversaires. Service complet avec personnel sur demande.',
      quantiteRestante: 5,
      conditions: 'Commande à passer minimum 3 semaines avant la prestation. Matériel de réception prêté (tables, nappes, vaisselle). Restitution sous 10 jours ouvrés, 600€ de frais en cas de non-restitution.',
    },
  });

  // ==================== MENU <-> THEME ====================
  await prisma.menuTheme.createMany({
    data: [
      { menuId: menuNoel.id, themeId: themeNoel.id },
      { menuId: menuPaques.id, themeId: themePaques.id },
      { menuId: menuClassique.id, themeId: themeClassique.id },
      { menuId: menuVegetarien.id, themeId: themeClassique.id },
      { menuId: menuGrandEvent.id, themeId: themeEvenement.id },
    ],
  });

  // ==================== MENU <-> REGIME ====================
  await prisma.menuRegime.createMany({
    data: [
      { menuId: menuNoel.id, regimeId: regimeClassique.id },
      { menuId: menuPaques.id, regimeId: regimeClassique.id },
      { menuId: menuClassique.id, regimeId: regimeClassique.id },
      { menuId: menuVegetarien.id, regimeId: regimeVegetarien.id },
      { menuId: menuVegetarien.id, regimeId: regimeVegan.id },
      { menuId: menuGrandEvent.id, regimeId: regimeClassique.id },
    ],
  });

  // ==================== MENU <-> PLAT ====================
  await prisma.menuPlat.createMany({
    data: [
      // Menu Noël
      { menuId: menuNoel.id, platId: foieGras.id },
      { menuId: menuNoel.id, platId: filetBoeuf.id },
      { menuId: menuNoel.id, platId: bucheNoel.id },
      // Menu Pâques
      { menuId: menuPaques.id, platId: tartareSaumon.id },
      { menuId: menuPaques.id, platId: supremeVolaille.id },
      { menuId: menuPaques.id, platId: tarteTatin.id },
      // Menu Classique
      { menuId: menuClassique.id, platId: soupeOignon.id },
      { menuId: menuClassique.id, platId: magretCanard.id },
      { menuId: menuClassique.id, platId: cremeBrulee.id },
      // Menu Végétarien
      { menuId: menuVegetarien.id, platId: bruschetta.id },
      { menuId: menuVegetarien.id, platId: risotto.id },
      { menuId: menuVegetarien.id, platId: pannaCotta.id },
      // Menu Grand Événement
      { menuId: menuGrandEvent.id, platId: foieGras.id },
      { menuId: menuGrandEvent.id, platId: saladeChevreChaud.id },
      { menuId: menuGrandEvent.id, platId: filetBoeuf.id },
      { menuId: menuGrandEvent.id, platId: supremeVolaille.id },
      { menuId: menuGrandEvent.id, platId: fondantChocolat.id },
      { menuId: menuGrandEvent.id, platId: fromages.id },
    ],
  });

  // ==================== MENU IMAGES ====================
  await prisma.menuImage.createMany({
    data: [
      { menuId: menuNoel.id, url: '/images/menus/menu-noel.jpg', alt: 'Menu Festif de Noël - Foie gras, filet de boeuf en croûte, bûche' },
      { menuId: menuPaques.id, url: '/images/menus/menu-paques.jpg', alt: 'Menu Printanier de Pâques - Tartare de saumon, suprême de volaille, tarte Tatin' },
      { menuId: menuClassique.id, url: '/images/menus/menu-classique.jpg', alt: 'Menu Classique Gourmand - Soupe à l\'oignon, magret de canard, crème brûlée' },
      { menuId: menuVegetarien.id, url: '/images/menus/menu-vegetarien.jpg', alt: 'Menu Végétarien Découverte - Bruschetta, risotto, panna cotta' },
      { menuId: menuGrandEvent.id, url: '/images/menus/menu-grand-evenement.jpg', alt: 'Menu Grand Événement - Gala prestige avec 6 plats' },
    ],
  });

  // ==================== HORAIRES ====================
  await prisma.horaire.createMany({
    data: [
      { jour: 'Lundi', heureOuverture: '09:00', heureFermeture: '18:00' },
      { jour: 'Mardi', heureOuverture: '09:00', heureFermeture: '18:00' },
      { jour: 'Mercredi', heureOuverture: '09:00', heureFermeture: '18:00' },
      { jour: 'Jeudi', heureOuverture: '09:00', heureFermeture: '18:00' },
      { jour: 'Vendredi', heureOuverture: '09:00', heureFermeture: '19:00' },
      { jour: 'Samedi', heureOuverture: '10:00', heureFermeture: '17:00' },
      { jour: 'Dimanche', heureOuverture: 'Fermé', heureFermeture: 'Fermé' },
    ],
  });

  // ==================== COMMANDES DEMO ====================
  const commande1 = await prisma.commande.create({
    data: {
      numeroCommande: 'CMD-2026-001',
      datePrestation: new Date('2026-03-15'),
      heurePrestation: '19:00',
      adresse: '78 Avenue Thiers, 33100 Bordeaux',
      prixMenu: 520.0,
      nombrePersonnes: 8,
      prixLivraison: 0,
      statut: CommandeStatut.TERMINEE,
      utilisateurId: user.id,
      menuId: menuNoel.id,
    },
  });

  const commande2 = await prisma.commande.create({
    data: {
      numeroCommande: 'CMD-2026-002',
      datePrestation: new Date('2026-04-20'),
      heurePrestation: '12:30',
      adresse: '15 Rue du Palais Gallien, 33000 Bordeaux',
      prixMenu: 330.0,
      nombrePersonnes: 6,
      prixLivraison: 0,
      statut: CommandeStatut.ACCEPTEE,
      utilisateurId: user.id,
      menuId: menuPaques.id,
    },
  });

  // Historique statuts
  await prisma.commandeHistorique.createMany({
    data: [
      { statut: CommandeStatut.RECUE, date: new Date('2026-02-15T10:00:00'), commandeId: commande1.id },
      { statut: CommandeStatut.ACCEPTEE, date: new Date('2026-02-15T14:00:00'), commandeId: commande1.id },
      { statut: CommandeStatut.EN_PREPARATION, date: new Date('2026-03-14T08:00:00'), commandeId: commande1.id },
      { statut: CommandeStatut.EN_LIVRAISON, date: new Date('2026-03-15T17:00:00'), commandeId: commande1.id },
      { statut: CommandeStatut.LIVREE, date: new Date('2026-03-15T19:15:00'), commandeId: commande1.id },
      { statut: CommandeStatut.TERMINEE, date: new Date('2026-03-15T19:30:00'), commandeId: commande1.id },
      { statut: CommandeStatut.RECUE, date: new Date('2026-02-16T09:00:00'), commandeId: commande2.id },
      { statut: CommandeStatut.ACCEPTEE, date: new Date('2026-02-16T11:00:00'), commandeId: commande2.id },
    ],
  });

  // Avis
  await prisma.avis.create({
    data: {
      note: 5,
      description: 'Excellent menu de Noël ! Le foie gras était incroyable et la bûche un pur délice. Service impeccable, je recommande vivement.',
      statut: AvisStatut.VALIDE,
      utilisateurId: user.id,
      commandeId: commande1.id,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
