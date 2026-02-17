// Types matching the Prisma schema / API responses

export interface Role {
  id: number;
  libelle: string;
}

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  adressePostale: string;
  isActive: boolean;
  createdAt: string;
  role: Role;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    role: string;
  };
}

export interface Menu {
  id: number;
  titre: string;
  nombrePersonneMinimale: number;
  prixParPersonne: number;
  description: string;
  quantiteRestante: number;
  conditions: string | null;
  themes: { theme: Theme }[];
  regimes: { regime: Regime }[];
  plats: { plat: Plat }[];
  images: MenuImage[];
}

export interface MenuImage {
  id: number;
  url: string;
  alt: string | null;
}

export interface Theme {
  id: number;
  libelle: string;
}

export interface Regime {
  id: number;
  libelle: string;
}

export interface Plat {
  id: number;
  titrePlat: string;
  photo: string | null;
  type: 'ENTREE' | 'PLAT' | 'DESSERT';
  allergenes?: { allergene: Allergene }[];
}

export interface Allergene {
  id: number;
  libelle: string;
}

export type CommandeStatut =
  | 'RECUE'
  | 'ACCEPTEE'
  | 'EN_PREPARATION'
  | 'EN_LIVRAISON'
  | 'LIVREE'
  | 'ATTENTE_RETOUR_MATERIEL'
  | 'TERMINEE'
  | 'ANNULEE';

export interface Commande {
  id: number;
  numeroCommande: string;
  dateCommande: string;
  datePrestation: string;
  heurePrestation: string;
  adresse: string;
  prixMenu: number;
  nombrePersonnes: number;
  prixLivraison: number;
  statut: CommandeStatut;
  validationMateriel: boolean;
  motifAnnulation: string | null;
  modeContact: string | null;
  menu: { id: number; titre: string };
  utilisateur?: { id: number; nom: string; prenom: string; email: string };
  historiqueStatuts?: CommandeHistorique[];
}

export interface CommandeHistorique {
  id: number;
  statut: CommandeStatut;
  date: string;
}

export type AvisStatut = 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';

export interface Avis {
  id: number;
  note: number;
  description: string;
  statut: AvisStatut;
  createdAt: string;
  utilisateur: { nom: string; prenom: string };
  commande: { menu: { titre: string } };
}

export interface Horaire {
  id: number;
  jour: string;
  heureOuverture: string;
  heureFermeture: string;
}

export interface OrderStats {
  menuId: number;
  menuTitre: string;
  totalCommandes: number;
  chiffreAffaires: number;
}

export interface RevenueEntry {
  date: string;
  menu: string;
  montant: number;
}
