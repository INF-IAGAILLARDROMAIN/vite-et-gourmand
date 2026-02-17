'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Users, Euro, RefreshCw } from 'lucide-react';
import { menus as menusApi } from '@/lib/api';
import type { Menu } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function AdminMenusPage() {
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    menusApi.getAll()
      .then(setMenuList)
      .catch(() => setMenuList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce menu ?')) return;
    try {
      await menusApi.delete(id);
      setMenuList(menuList.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Gestion des menus</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-48 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-32" />
            </div>
          ))}
        </div>
      ) : menuList.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Aucun menu</p>
      ) : (
        <div className="space-y-3">
          {menuList.map((menu, i) => (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="bg-white border border-slate-200 rounded-lg p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{menu.titre}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Euro className="h-3 w-3" />
                      {formatPrice(menu.prixParPersonne)}/pers
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Min. {menu.nombrePersonneMinimale}
                    </span>
                    <span>Stock : {menu.quantiteRestante}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {menu.themes?.map((t) => (
                      <span key={t.theme.id} className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">{t.theme.libelle}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleDelete(menu.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
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
