'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { KeyRound, CheckCircle } from 'lucide-react';
import { auth } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!token) {
      setError('Token de réinitialisation manquant');
      return;
    }

    setLoading(true);
    try {
      await auth.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-4"
      >
        {success ? (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Mot de passe modifié</h1>
            <p className="text-slate-600 mb-6">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <KeyRound className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h1 className="text-2xl font-heading font-bold text-slate-900">Nouveau mot de passe</h1>
              <p className="text-sm text-slate-500 mt-2">Choisissez un nouveau mot de passe sécurisé.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm">
              <Input
                id="password"
                label="Nouveau mot de passe"
                type="password"
                placeholder="Min. 10 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                id="confirm"
                label="Confirmer"
                type="password"
                placeholder="Confirmez le mot de passe"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <p className="text-xs text-slate-400">
                Min. 10 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.
              </p>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
              <Button type="submit" loading={loading} size="lg" className="w-full">
                Réinitialiser
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
