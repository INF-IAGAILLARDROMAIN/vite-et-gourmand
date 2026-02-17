'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CheckCircle, Users, UserX, UserCheck } from 'lucide-react';
import { admin as adminApi } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Employee {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  isActive: boolean;
  createdAt: string;
  role: string;
}

export default function AdminEmployesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingList, setLoadingList] = useState(true);
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

  const loadEmployees = () => {
    adminApi.getEmployees()
      .then(setEmployees)
      .catch(() => setEmployees([]))
      .finally(() => setLoadingList(false));
  };

  useEffect(() => { loadEmployees(); }, []);

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
      loadEmployees();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver ce compte ?')) return;
    try {
      await adminApi.disableEmployee(id);
      loadEmployees();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      alert(message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-slate-900 mb-8">Gestion des employés</h1>

      {/* Employee list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200 rounded-xl p-6 mb-8"
      >
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-500" />
          Liste des employés
        </h2>

        {loadingList ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : employees.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun employé enregistré.</p>
        ) : (
          <div className="space-y-3">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${emp.isActive ? 'border-slate-200 bg-slate-50' : 'border-red-200 bg-red-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {emp.isActive ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">
                      {emp.prenom} {emp.nom}
                      {!emp.isActive && <span className="ml-2 text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Désactivé</span>}
                    </p>
                    <p className="text-xs text-slate-500">{emp.email} &middot; {emp.telephone}</p>
                  </div>
                </div>
                {emp.isActive && (
                  <button
                    onClick={() => handleDisable(emp.id)}
                    className="text-xs text-red-600 hover:text-red-800 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Désactiver
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
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
