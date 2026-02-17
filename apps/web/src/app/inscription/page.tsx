import type { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Inscription',
  description: 'Créez votre compte Vite & Gourmand pour commander nos menus traiteur.',
};

export default function InscriptionPage() {
  return <RegisterClient />;
}
