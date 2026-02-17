import type { CommandeStatut } from './types';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export const STATUT_LABELS: Record<CommandeStatut, string> = {
  RECUE: 'Reçue',
  ACCEPTEE: 'Acceptée',
  EN_PREPARATION: 'En préparation',
  EN_LIVRAISON: 'En livraison',
  LIVREE: 'Livrée',
  ATTENTE_RETOUR_MATERIEL: 'Attente retour matériel',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée',
};

export const STATUT_COLORS: Record<CommandeStatut, string> = {
  RECUE: 'bg-blue-100 text-blue-800',
  ACCEPTEE: 'bg-indigo-100 text-indigo-800',
  EN_PREPARATION: 'bg-yellow-100 text-yellow-800',
  EN_LIVRAISON: 'bg-orange-100 text-orange-800',
  LIVREE: 'bg-emerald-100 text-emerald-800',
  ATTENTE_RETOUR_MATERIEL: 'bg-purple-100 text-purple-800',
  TERMINEE: 'bg-green-100 text-green-800',
  ANNULEE: 'bg-red-100 text-red-800',
};

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
