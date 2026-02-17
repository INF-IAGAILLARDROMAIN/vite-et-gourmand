'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CheckCircle } from 'lucide-react';
import { admin as adminApi } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminEmployesPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    adressePostale: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await adminApi.createEmployee(form) as { message: string };
      setSuccess(res.message || 'Employé créé avec succès');
      setForm({ email: '', password: '', nom: '', prenom: '', telephone: '', adressePostale: '' });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-slate-900 mb-8">Gestion des employés</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg"
      >
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary-500" />
          Créer un compte employé
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="prenom" label="Prénom" value={form.prenom} onChange={update('prenom')} required />
            <Input id="nom" label="Nom" value={form.nom} onChange={update('nom')} required />
          </div>
          <Input id="email" label="Email" type="email" value={form.email} onChange={update('email')} required />
          <Input id="password" label="Mot de passe temporaire" type="password" value={form.password} onChange={update('password')} required />
          <Input id="telephone" label="Téléphone" type="tel" value={form.telephone} onChange={update('telephone')} required />
          <Input id="adresse" label="Adresse" value={form.adressePostale} onChange={update('adressePostale')} required />

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            <UserPlus className="h-4 w-4" />
            Créer l&apos;employé
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
