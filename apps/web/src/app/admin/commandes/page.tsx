'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';
import { commandes as commandesApi } from '@/lib/api';
import type { Commande, CommandeStatut } from '@/lib/types';
import { formatDate, formatPrice, STATUT_LABELS, STATUT_COLORS, cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const STATUS_FLOW: CommandeStatut[] = [
  'RECUE', 'ACCEPTEE', 'EN_PREPARATION', 'EN_LIVRAISON', 'LIVREE', 'ATTENTE_RETOUR_MATERIEL', 'TERMINEE',
];

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  const loadOrders = () => {
    setLoading(true);
    commandesApi.getAll()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const filtered = orders.filter((o) => {
    if (statusFilter && o.statut !== statusFilter) return false;
    if (filter) {
      const q = filter.toLowerCase();
      return o.numeroCommande.toLowerCase().includes(q) ||
        o.menu.titre.toLowerCase().includes(q) ||
        o.utilisateur?.nom?.toLowerCase().includes(q) ||
        o.utilisateur?.prenom?.toLowerCase().includes(q);
    }
    return true;
  });

  const nextStatus = (order: Commande): CommandeStatut | null => {
    const idx = STATUS_FLOW.indexOf(order.statut);
    if (idx >= 0 && idx < STATUS_FLOW.length - 1) return STATUS_FLOW[idx + 1];
    return null;
  };

  const handleAdvance = async (order: Commande) => {
    const next = nextStatus(order);
    if (!next) return;
    setUpdating(order.id);
    try {
      await commandesApi.updateStatus(order.id, next);
      setOrders(orders.map((o) => o.id === order.id ? { ...o, statut: next } : o));
    } catch (err: any) {
      alert(err.message || 'Erreur');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Commandes</h1>
        <Button variant="ghost" size="sm" onClick={loadOrders}>
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tous les statuts</option>
          {STATUS_FLOW.map((s) => (
            <option key={s} value={s}>{STATUT_LABELS[s]}</option>
          ))}
          <option value="ANNULEE">Annulée</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-48 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-32" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Aucune commande trouvée</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const next = nextStatus(order);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="bg-white border border-slate-200 rounded-lg p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 text-sm">#{order.numeroCommande}</span>
                      <Badge className={STATUT_COLORS[order.statut]}>{STATUT_LABELS[order.statut]}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{order.menu.titre}</p>
                    <p className="text-xs text-slate-500">
                      {order.utilisateur?.prenom} {order.utilisateur?.nom} - {formatDate(order.datePrestation)} - {order.nombrePersonnes} pers.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900">{formatPrice(order.prixMenu + order.prixLivraison)}</span>
                    {next && order.statut !== 'ANNULEE' && (
                      <Button
                        size="sm"
                        onClick={() => handleAdvance(order)}
                        loading={updating === order.id}
                      >
                        {STATUT_LABELS[next]}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
