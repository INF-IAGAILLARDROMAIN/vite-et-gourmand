'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, CheckCircle, MapPin, Calendar, Clock, Users, Truck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { menus as menusApi, commandes as commandesApi } from '@/lib/api';
import type { Menu } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CommanderPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const menuId = parseInt(params.menuId as string);

  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [orderNum, setOrderNum] = useState('');

  const [form, setForm] = useState({
    datePrestation: '',
    heurePrestation: '',
    adresse: '',
    nombrePersonnes: '',
    modeContact: 'email',
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/connexion');
  }, [user, authLoading, router]);

  useEffect(() => {
    menusApi.getById(menuId)
      .then(setMenu)
      .catch(() => router.push('/menus'))
      .finally(() => setLoading(false));
  }, [menuId, router]);

  if (authLoading || !user) return null;

  const nbPersonnes = parseInt(form.nombrePersonnes) || 0;
  const minPersonnes = menu?.nombrePersonneMinimale ?? 0;
  const prixBase = nbPersonnes * (menu?.prixParPersonne ?? 0);
  const hasDiscount = nbPersonnes >= minPersonnes + 5;
  const prixMenu = hasDiscount ? prixBase * 0.9 : prixBase;
  const isBordeaux = form.adresse.toLowerCase().includes('bordeaux');
  const prixLivraison = isBordeaux ? 0 : form.adresse ? 5 + 0.59 * 20 : 0;
  const total = prixMenu + prixLivraison;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (nbPersonnes < minPersonnes) {
      setError(`Minimum ${minPersonnes} personnes pour ce menu`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await commandesApi.create({
        menuId,
        datePrestation: form.datePrestation,
        heurePrestation: form.heurePrestation,
        adresse: form.adresse,
        nombrePersonnes: nbPersonnes,
        modeContact: form.modeContact,
      });
      setOrderNum(res.numeroCommande);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="py-16 sm:py-24 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Commande confirmée !</h1>
          <p className="text-slate-600 mb-2">N° de commande : <strong>{orderNum}</strong></p>
          <p className="text-sm text-slate-500 mb-6">Vous recevrez un email de confirmation.</p>
          <Link
            href="/mon-compte/commandes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Voir mes commandes
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading || !menu) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href={`/menus/${menu.id}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour au menu
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mb-2">
            Commander : {menu.titre}
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            {formatPrice(menu.prixParPersonne)} / personne - Min. {menu.nombrePersonneMinimale} personnes
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-500" />
                Détails de l&apos;événement
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="date"
                  label="Date de prestation"
                  type="date"
                  value={form.datePrestation}
                  onChange={(e) => setForm({ ...form, datePrestation: e.target.value })}
                  required
                  min={new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]}
                />
                <Input
                  id="heure"
                  label="Heure de prestation"
                  type="time"
                  value={form.heurePrestation}
                  onChange={(e) => setForm({ ...form, heurePrestation: e.target.value })}
                  required
                />
              </div>

              <Input
                id="adresse"
                label="Adresse de livraison"
                placeholder="12 Rue de la Paix, 33000 Bordeaux"
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                required
              />

              <Input
                id="nbPersonnes"
                label={`Nombre de personnes (min. ${menu.nombrePersonneMinimale})`}
                type="number"
                min={menu.nombrePersonneMinimale}
                placeholder={`Min. ${menu.nombrePersonneMinimale}`}
                value={form.nombrePersonnes}
                onChange={(e) => setForm({ ...form, nombrePersonnes: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mode de contact préféré</label>
                <select
                  value={form.modeContact}
                  onChange={(e) => setForm({ ...form, modeContact: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-primary-500"
                >
                  <option value="email">Email</option>
                  <option value="telephone">Téléphone</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>

            {/* Price recap */}
            {nbPersonnes >= minPersonnes && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-xl p-6"
              >
                <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  <ShoppingCart className="h-5 w-5 text-primary-500" />
                  Récapitulatif
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {nbPersonnes} × {formatPrice(menu.prixParPersonne)}
                    </span>
                    <span>{formatPrice(prixBase)}</span>
                  </div>
                  {hasDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction 10% (≥ min+5 pers.)</span>
                      <span>-{formatPrice(prixBase * 0.1)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Livraison {isBordeaux && <span className="text-green-600">(gratuite)</span>}
                    </span>
                    <span>{prixLivraison === 0 ? 'Gratuit' : formatPrice(prixLivraison)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t border-slate-100 pt-3">
                    <span>Total</span>
                    <span className="text-primary-700">{formatPrice(total)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

            <Button type="submit" loading={submitting} size="lg" className="w-full" disabled={nbPersonnes < minPersonnes}>
              <ShoppingCart className="h-4 w-4" />
              Confirmer la commande
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
