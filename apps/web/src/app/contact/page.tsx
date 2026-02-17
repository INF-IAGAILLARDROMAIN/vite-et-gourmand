import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez Vite & Gourmand pour vos demandes de devis, informations sur nos menus traiteur ou toute autre question.',
};

export default function ContactPage() {
  return <ContactClient />;
}
