'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, ChefHat, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterClient() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    telephone: '',
    adressePostale: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (form.password.length < 10) {
      setError('Le mot de passe doit contenir au moins 10 caractères');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await register(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-16 sm:py-24 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Inscription réussie !</h1>
          <p className="text-slate-600 mb-6">Votre compte a été créé. Vous pouvez maintenant vous connecter.</p>
          <Link
            href="/connexion"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Se connecter
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-4"
      >
        <div className="text-center mb-8">
          <ChefHat className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-slate-900">Créer un compte</h1>
          <p className="text-sm text-slate-500 mt-2">
            Déjà inscrit ?{' '}
            <Link href="/connexion" className="text-primary-600 hover:underline font-medium">
              Connectez-vous
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <Input id="prenom" label="Prénom" placeholder="Jean" value={form.prenom} onChange={update('prenom')} required />
            <Input id="nom" label="Nom" placeholder="Dupont" value={form.nom} onChange={update('nom')} required />
          </div>
          <Input id="email" label="Email" type="email" placeholder="votre@email.com" value={form.email} onChange={update('email')} required autoComplete="email" />
          <Input id="telephone" label="Téléphone" type="tel" placeholder="06 12 34 56 78" value={form.telephone} onChange={update('telephone')} required />
          <Input id="adresse" label="Adresse postale" placeholder="12 Rue de la Paix, 33000 Bordeaux" value={form.adressePostale} onChange={update('adressePostale')} required />
          <Input id="password" label="Mot de passe" type="password" placeholder="Min. 10 caractères" value={form.password} onChange={update('password')} required autoComplete="new-password" />
          <Input id="confirmPassword" label="Confirmer le mot de passe" type="password" placeholder="Confirmez votre mot de passe" value={form.confirmPassword} onChange={update('confirmPassword')} required autoComplete="new-password" />

          <p className="text-xs text-slate-400">
            Le mot de passe doit contenir au moins 10 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.
          </p>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

          <Button type="submit" loading={loading} size="lg" className="w-full">
            <UserPlus className="h-4 w-4" />
            S&apos;inscrire
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
