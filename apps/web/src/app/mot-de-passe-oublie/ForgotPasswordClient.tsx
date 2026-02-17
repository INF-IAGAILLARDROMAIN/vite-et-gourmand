'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { auth } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.forgotPassword(email);
    } catch {
      // Anti-enumeration: always show success
    } finally {
      setSent(true);
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
        {sent ? (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Email envoyé</h1>
            <p className="text-slate-600 mb-6">
              Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation.
            </p>
            <Link href="/connexion" className="text-primary-600 hover:underline font-medium text-sm">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <Mail className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h1 className="text-2xl font-heading font-bold text-slate-900">Mot de passe oublié</h1>
              <p className="text-sm text-slate-500 mt-2">
                Entrez votre email, nous vous enverrons un lien de réinitialisation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm">
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" loading={loading} size="lg" className="w-full">
                Envoyer le lien
              </Button>
              <div className="text-center">
                <Link href="/connexion" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600">
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la connexion
                </Link>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
