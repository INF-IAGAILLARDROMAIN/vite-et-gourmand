'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { avis as avisApi } from '@/lib/api';
import type { Avis } from '@/lib/types';
import { formatDate, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function AdminAvisPage() {
  const [reviews, setReviews] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    avisApi.getPending()
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleValidate = async (id: number, statut: 'VALIDE' | 'REFUSE') => {
    setProcessing(id);
    try {
      await avisApi.validate(id, statut);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erreur');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Modération des avis</h1>
        <Button variant="ghost" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-48 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
          <p className="text-slate-500">Aucun avis en attente de modération</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="bg-white border border-slate-200 rounded-lg p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-slate-900 text-sm">
                      {review.utilisateur.prenom} {review.utilisateur.nom}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">Menu : {review.commande.menu.titre}</p>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={cn('h-4 w-4', n <= review.note ? 'text-primary-500 fill-primary-500' : 'text-slate-300')} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700">{review.description}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleValidate(review.id, 'VALIDE')}
                    disabled={processing === review.id}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Valider"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleValidate(review.id, 'REFUSE')}
                    disabled={processing === review.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Refuser"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
