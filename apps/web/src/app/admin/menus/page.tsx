'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Users, Euro, RefreshCw, X } from 'lucide-react';
import { menus as menusApi, plats as platsApi } from '@/lib/api';
import type { Menu, Theme, Regime, Plat } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface MenuFormData {
  titre: string;
  description: string;
  nombrePersonneMinimale: number;
  prixParPersonne: number;
  quantiteRestante: number;
  conditions: string;
  themeIds: number[];
  regimeIds: number[];
  platIds: number[];
}

const INITIAL_FORM: MenuFormData = {
  titre: '',
  description: '',
  nombrePersonneMinimale: 1,
  prixParPersonne: 0,
  quantiteRestante: 10,
  conditions: '',
  themeIds: [],
  regimeIds: [],
  platIds: [],
};

export default function AdminMenusPage() {
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<MenuFormData>(INITIAL_FORM);

  // Reference data
  const [themes, setThemes] = useState<Theme[]>([]);
  const [regimes, setRegimes] = useState<Regime[]>([]);
  const [allPlats, setAllPlats] = useState<Plat[]>([]);

  const load = () => {
    setLoading(true);
    menusApi.getAll()
      .then(setMenuList)
      .catch(() => setMenuList([]))
      .finally(() => setLoading(false));
  };

  const loadReferenceData = () => {
    menusApi.getThemes().then(setThemes).catch(() => {});
    menusApi.getRegimes().then(setRegimes).catch(() => {});
    platsApi.getAll().then(setAllPlats).catch(() => {});
  };

  useEffect(() => { load(); loadReferenceData(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce menu ?')) return;
    try {
      await menusApi.delete(id);
      setMenuList(menuList.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  const toggleArrayValue = (field: 'themeIds' | 'regimeIds' | 'platIds', value: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        titre: form.titre,
        description: form.description,
        nombrePersonneMinimale: form.nombrePersonneMinimale,
        prixParPersonne: form.prixParPersonne,
        quantiteRestante: form.quantiteRestante,
      };
      if (form.conditions.trim()) payload.conditions = form.conditions;
      if (form.themeIds.length > 0) payload.themeIds = form.themeIds;
      if (form.regimeIds.length > 0) payload.regimeIds = form.regimeIds;
      if (form.platIds.length > 0) payload.platIds = form.platIds;

      await menusApi.create(payload);
      setForm(INITIAL_FORM);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  const platsByType = {
    ENTREE: allPlats.filter((p) => p.type === 'ENTREE'),
    PLAT: allPlats.filter((p) => p.type === 'PLAT'),
    DESSERT: allPlats.filter((p) => p.type === 'DESSERT'),
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

      {/* Add menu button */}
      <AnimatePresence>
        {!showForm && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={() => setShowForm(true)}
            className="w-full mb-6 flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-primary-300 rounded-xl text-primary-600 font-medium hover:bg-primary-50 hover:border-primary-400 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Ajouter un menu
          </motion.button>
        )}
      </AnimatePresence>

      {/* Create menu form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-900">Nouveau menu</h2>
                <button type="button" onClick={() => { setShowForm(false); setError(''); }} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {/* Titre */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Titre *</label>
                  <input
                    type="text"
                    required
                    value={form.titre}
                    onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    placeholder="Ex: Menu Gastronomique d'Été"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Décrivez le menu..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                  />
                </div>

                {/* Prix par personne */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prix par personne (€) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={0.01}
                    value={form.prixParPersonne || ''}
                    onChange={(e) => setForm({ ...form, prixParPersonne: parseFloat(e.target.value) || 0 })}
                    placeholder="45.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>

                {/* Nombre de personnes minimum */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Personnes minimum *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.nombrePersonneMinimale}
                    onChange={(e) => setForm({ ...form, nombrePersonneMinimale: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock disponible *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.quantiteRestante}
                    onChange={(e) => setForm({ ...form, quantiteRestante: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>

                {/* Conditions */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Conditions</label>
                  <input
                    type="text"
                    value={form.conditions}
                    onChange={(e) => setForm({ ...form, conditions: e.target.value })}
                    placeholder="Ex: Commander 48h à l'avance"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>

              {/* Thèmes */}
              {themes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Thèmes</label>
                  <div className="flex flex-wrap gap-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleArrayValue('themeIds', t.id)}
                        className={cn(
                          'px-3 py-1.5 text-sm rounded-full border transition-colors',
                          form.themeIds.includes(t.id)
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-primary-400',
                        )}
                      >
                        {t.libelle}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Régimes */}
              {regimes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Régimes</label>
                  <div className="flex flex-wrap gap-2">
                    {regimes.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleArrayValue('regimeIds', r.id)}
                        className={cn(
                          'px-3 py-1.5 text-sm rounded-full border transition-colors',
                          form.regimeIds.includes(r.id)
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-green-400',
                        )}
                      >
                        {r.libelle}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Plats */}
              {allPlats.length > 0 && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Plats</label>
                  {(['ENTREE', 'PLAT', 'DESSERT'] as const).map((type) => {
                    const items = platsByType[type];
                    if (items.length === 0) return null;
                    const labels = { ENTREE: 'Entrées', PLAT: 'Plats', DESSERT: 'Desserts' };
                    return (
                      <div key={type} className="mb-3">
                        <p className="text-xs font-medium text-slate-500 uppercase mb-1.5">{labels[type]}</p>
                        <div className="flex flex-wrap gap-2">
                          {items.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => toggleArrayValue('platIds', p.id)}
                              className={cn(
                                'px-3 py-1.5 text-sm rounded-full border transition-colors',
                                form.platIds.includes(p.id)
                                  ? 'bg-amber-600 text-white border-amber-600'
                                  : 'bg-white text-slate-600 border-slate-300 hover:border-amber-400',
                              )}
                            >
                              {p.titrePlat}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Création...' : 'Créer le menu'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setError(''); }}>
                  Annuler
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu list */}
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
                    {menu.regimes?.map((r) => (
                      <span key={r.regime.id} className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">{r.regime.libelle}</span>
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
