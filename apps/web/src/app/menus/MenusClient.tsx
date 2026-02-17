'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, Users, Euro, ArrowRight, X } from 'lucide-react';
import { menus as menusApi } from '@/lib/api';
import type { Menu } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';
import Card from '@/components/ui/Card';

export default function MenusClient() {
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [regimeFilter, setRegimeFilter] = useState('');
  const [prixMax, setPrixMax] = useState('');

  useEffect(() => {
    const params: Record<string, string> = {};
    if (themeFilter) params.theme = themeFilter;
    if (regimeFilter) params.regime = regimeFilter;
    if (prixMax) params.prixMax = prixMax;

    setLoading(true);
    menusApi.getAll(params)
      .then(setMenuList)
      .catch(() => setMenuList([]))
      .finally(() => setLoading(false));
  }, [themeFilter, regimeFilter, prixMax]);

  const filtered = menuList.filter((m) =>
    m.titre.toLowerCase().includes(search.toLowerCase()),
  );

  const allThemes = [...new Set(menuList.flatMap((m) => m.themes?.map((t) => t.theme.libelle) ?? []))];
  const allRegimes = [...new Set(menuList.flatMap((m) => m.regimes?.map((r) => r.regime.libelle) ?? []))];

  const hasFilters = themeFilter || regimeFilter || prixMax;

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">
            Nos Menus
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Trouvez le menu parfait pour votre événement
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-end">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les thèmes</option>
            {allThemes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={regimeFilter}
            onChange={(e) => setRegimeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les régimes</option>
            {allRegimes.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={prixMax}
            onChange={(e) => setPrixMax(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Budget max</option>
            <option value="20">20€ / pers</option>
            <option value="30">30€ / pers</option>
            <option value="50">50€ / pers</option>
            <option value="80">80€ / pers</option>
          </select>

          {hasFilters && (
            <button
              onClick={() => { setThemeFilter(''); setRegimeFilter(''); setPrixMax(''); }}
              className="flex items-center gap-1 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
              Effacer
            </button>
          )}
        </div>

        {/* Menu grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-48 bg-slate-200 rounded-lg mb-4" />
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-full mb-4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-500">Aucun menu trouvé</p>
            <p className="text-sm text-slate-400 mt-1">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((menu, i) => (
              <motion.div
                key={menu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="flex flex-col h-full">
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    {menu.images?.[0] ? (
                      <img
                        src={menu.images[0].url}
                        alt={menu.images[0].alt || menu.titre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">🍽️</span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {menu.themes?.map((t) => (
                        <span key={t.theme.id} className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                          {t.theme.libelle}
                        </span>
                      ))}
                      {menu.regimes?.map((r) => (
                        <span key={r.regime.id} className="px-2 py-0.5 text-xs bg-accent-500/10 text-accent-700 rounded-full">
                          {r.regime.libelle}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-lg font-heading font-bold text-slate-900 mb-2">
                      {menu.titre}
                    </h2>

                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                      {menu.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {formatPrice(menu.prixParPersonne)}/pers
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Min. {menu.nombrePersonneMinimale}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/menus/${menu.id}`}
                      className="mt-4 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-all hover:-translate-y-0.5"
                    >
                      Voir le détail
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
