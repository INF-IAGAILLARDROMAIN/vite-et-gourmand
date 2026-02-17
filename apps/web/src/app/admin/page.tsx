'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Euro, TrendingUp, Utensils } from 'lucide-react';
import { admin as adminApi } from '@/lib/api';
import type { OrderStats } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState<OrderStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getOrderStats()
      .then(setStats)
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  }, []);

  const totalOrders = stats.reduce((sum, s) => sum + s.totalCommandes, 0);
  const totalRevenue = stats.reduce((sum, s) => sum + s.chiffreAffaires, 0);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-slate-900 mb-8">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: ShoppingBag, label: 'Commandes totales', value: loading ? '...' : totalOrders.toString(), color: 'text-blue-600 bg-blue-100' },
          { icon: Euro, label: 'Chiffre d\'affaires', value: loading ? '...' : formatPrice(totalRevenue), color: 'text-green-600 bg-green-100' },
          { icon: Utensils, label: 'Menus actifs', value: loading ? '...' : stats.length.toString(), color: 'text-primary-600 bg-primary-100' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-white border border-slate-200 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <span className="text-sm text-slate-500">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats per menu */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary-500" />
        Statistiques par menu
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-48 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-32" />
            </div>
          ))}
        </div>
      ) : stats.length === 0 ? (
        <p className="text-slate-500 text-sm">Aucune statistique disponible.</p>
      ) : (
        <div className="space-y-3">
          {stats.map((s) => (
            <div key={s.menuId} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">{s.menuTitre}</p>
                <p className="text-sm text-slate-500">{s.totalCommandes} commande(s)</p>
              </div>
              <p className="text-lg font-semibold text-primary-700">{formatPrice(s.chiffreAffaires)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
