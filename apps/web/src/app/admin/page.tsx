'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Euro, TrendingUp, Utensils } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

  const chartData = stats.map((s) => ({
    name: s.menuTitre.length > 20 ? s.menuTitre.slice(0, 20) + '...' : s.menuTitre,
    commandes: s.totalCommandes,
    ca: Math.round(s.chiffreAffaires * 100) / 100,
  }));

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

      {/* Chart: orders per menu */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary-500" />
        Commandes par menu
      </h2>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-80 animate-pulse" />
      ) : stats.length === 0 ? (
        <p className="text-slate-500 text-sm mb-8">Aucune statistique disponible.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-xl p-6 mb-10"
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                formatter={(value, name) => {
                  const v = Number(value ?? 0);
                  return name === 'CA (€)' ? [formatPrice(v), 'Chiffre d\'affaires'] : [v, 'Commandes'];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="commandes" name="Commandes" fill="#c2410c" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="ca" name="CA (€)" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Table: stats per menu */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Détail par menu</h2>
      {!loading && stats.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-medium text-slate-600">Menu</th>
                <th className="text-right p-4 font-medium text-slate-600">Commandes</th>
                <th className="text-right p-4 font-medium text-slate-600">Chiffre d&apos;affaires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.map((s) => (
                <tr key={s.menuId} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">{s.menuTitre}</td>
                  <td className="p-4 text-right text-slate-600">{s.totalCommandes}</td>
                  <td className="p-4 text-right font-semibold text-primary-700">{formatPrice(s.chiffreAffaires)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
