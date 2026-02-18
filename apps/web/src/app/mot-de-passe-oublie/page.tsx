import type { Metadata } from 'next';
import ForgotPasswordClient from './ForgotPasswordClient';

export const metadata: Metadata = {
  title: 'Mot de passe oublié',
  description: 'Réinitialisez votre mot de passe Vite & Gourmand en quelques clics.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
