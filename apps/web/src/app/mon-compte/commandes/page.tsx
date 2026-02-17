'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Clock, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { commandes as commandesApi } from '@/lib/api';
import type { Commande } from '@/lib/types';
import { formatDate, formatPrice, STATUT_LABELS, STATUT_COLORS } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

export default function MesCommandesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/connexion');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      commandesApi.getMine()
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/mon-compte" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Mon compte
        </Link>

        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mb-8">
          Mes commandes
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-48 mb-3" />
                <div className="h-4 bg-slate-200 rounded w-32" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-500">Aucune commande pour le moment</p>
            <Link href="/menus" className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:underline font-medium">
              Découvrir nos menus
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={`/mon-compte/commandes/${order.id}`}
                  className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-slate-900">#{order.numeroCommande}</span>
                        <Badge className={STATUT_COLORS[order.statut]}>{STATUT_LABELS[order.statut]}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">{order.menu.titre}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(order.datePrestation)}
                        </span>
                        <span>{order.nombrePersonnes} pers.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-slate-900">
                        {formatPrice(order.prixMenu + order.prixLivraison)}
                      </span>
                      <Eye className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
