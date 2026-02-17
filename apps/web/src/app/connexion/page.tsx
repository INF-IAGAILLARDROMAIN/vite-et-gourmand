import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte Vite & Gourmand pour passer commande et suivre vos événements.',
};

export default function ConnexionPage() {
  return <LoginClient />;
}
