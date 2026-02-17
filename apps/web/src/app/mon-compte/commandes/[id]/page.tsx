'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Ban, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { commandes as commandesApi, avis as avisApi } from '@/lib/api';
import type { Commande } from '@/lib/types';
import { formatDate, formatDateTime, formatPrice, STATUT_LABELS, STATUT_COLORS, cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';

export default function CommandeDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [order, setOrder] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Avis form
  const [showAvisForm, setShowAvisForm] = useState(false);
  const [avisNote, setAvisNote] = useState(5);
  const [avisDesc, setAvisDesc] = useState('');
  const [avisLoading, setAvisLoading] = useState(false);
  const [avisSuccess, setAvisSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/connexion');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && id) {
      commandesApi.getById(id)
        .then(setOrder)
        .catch(() => router.push('/mon-compte/commandes'))
        .finally(() => setLoading(false));
    }
  }, [user, id, router]);

  const handleCancel = async () => {
    if (!order || !confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) return;
    setCancelling(true);
    try {
      await commandesApi.cancel(order.id);
      setOrder({ ...order, statut: 'ANNULEE' });
    } catch {
      alert('Impossible d\'annuler cette commande');
    } finally {
      setCancelling(false);
    }
  };

  const handleAvis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setAvisLoading(true);
    try {
      await avisApi.create({ commandeId: order.id, note: avisNote, description: avisDesc });
      setAvisSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Erreur');
    } finally {
      setAvisLoading(false);
    }
  };

  if (authLoading || !user) return null;

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/mon-compte/commandes" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Mes commandes
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-heading font-bold text-slate-900">
                Commande #{order.numeroCommande}
              </h1>
              <p className="text-sm text-slate-500 mt-1">Passée le {formatDateTime(order.dateCommande)}</p>
            </div>
            <Badge className={cn(STATUT_COLORS[order.statut], 'text-sm px-4 py-1.5')}>
              {STATUT_LABELS[order.statut]}
            </Badge>
          </div>

          {/* Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 space-y-4">
            <h2 className="font-semibold text-slate-900 text-lg">{order.menu.titre}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-4 w-4 text-primary-500" />
                <span>Prestation : {formatDate(order.datePrestation)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4 text-primary-500" />
                <span>Heure : {order.heurePrestation}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span>{order.adresse}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="h-4 w-4 text-primary-500" />
                <span>{order.nombrePersonnes} personnes</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Menu</span>
                <span className="text-slate-900">{formatPrice(order.prixMenu)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Livraison</span>
                <span className="text-slate-900">{order.prixLivraison === 0 ? 'Gratuite' : formatPrice(order.prixLivraison)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-slate-100 pt-2">
                <span>Total</span>
                <span className="text-primary-700">{formatPrice(order.prixMenu + order.prixLivraison)}</span>
              </div>
            </div>
          </div>

          {/* Status history */}
          {order.historiqueStatuts && order.historiqueStatuts.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-slate-900 mb-4">Suivi de commande</h2>
              <div className="space-y-3">
                {order.historiqueStatuts.map((h, i) => (
                  <div key={h.id} className="flex items-center gap-3">
                    <div className={cn(
                      'w-3 h-3 rounded-full shrink-0',
                      i === 0 ? 'bg-primary-500' : 'bg-slate-300',
                    )} />
                    <div>
                      <span className="text-sm font-medium text-slate-900">{STATUT_LABELS[h.statut]}</span>
                      <span className="text-xs text-slate-500 ml-2">{formatDateTime(h.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {order.statut === 'RECUE' && (
              <Button variant="danger" onClick={handleCancel} loading={cancelling}>
                <Ban className="h-4 w-4" />
                Annuler la commande
              </Button>
            )}

            {order.statut === 'TERMINEE' && !avisSuccess && (
              <Button variant="outline" onClick={() => setShowAvisForm(!showAvisForm)}>
                <Star className="h-4 w-4" />
                Laisser un avis
              </Button>
            )}
          </div>

          {/* Avis form */}
          {showAvisForm && !avisSuccess && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleAvis}
              className="bg-white border border-slate-200 rounded-xl p-6 mt-6 space-y-4"
            >
              <h3 className="font-semibold text-slate-900">Votre avis</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Note</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setAvisNote(n)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={cn(
                          'h-8 w-8 transition-colors',
                          n <= avisNote ? 'text-primary-500 fill-primary-500' : 'text-slate-300',
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                id="avis"
                label="Commentaire"
                placeholder="Partagez votre expérience..."
                value={avisDesc}
                onChange={(e) => setAvisDesc(e.target.value)}
                required
              />
              <Button type="submit" loading={avisLoading}>
                Envoyer l&apos;avis
              </Button>
            </motion.form>
          )}

          {avisSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              <p className="text-sm text-green-800">Merci pour votre avis ! Il sera publié après validation.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
