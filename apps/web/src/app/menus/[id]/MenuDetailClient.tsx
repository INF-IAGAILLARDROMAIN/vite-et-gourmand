'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Euro, AlertTriangle, ShoppingCart, Utensils } from 'lucide-react';
import { menus as menusApi } from '@/lib/api';
import type { Menu } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';

export default function MenuDetailClient({ menuId }: { menuId: number }) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    menusApi.getById(menuId)
      .then(setMenu)
      .catch(() => setError('Menu introuvable'))
      .finally(() => setLoading(false));
  }, [menuId]);

  if (loading) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mb-8" />
          <div className="h-64 bg-slate-200 rounded-xl mb-8" />
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-slate-200 rounded w-full mb-2" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="py-16 text-center">
        <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-lg text-slate-500">{error || 'Menu introuvable'}</p>
        <Link href="/menus" className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Retour aux menus
        </Link>
      </div>
    );
  }

  const entrees = menu.plats?.filter((p) => p.plat.type === 'ENTREE') ?? [];
  const plats = menu.plats?.filter((p) => p.plat.type === 'PLAT') ?? [];
  const desserts = menu.plats?.filter((p) => p.plat.type === 'DESSERT') ?? [];

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link href="/menus" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour aux menus
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Hero image */}
          <div className="h-64 sm:h-80 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl overflow-hidden flex items-center justify-center mb-8">
            {menu.images?.[0] ? (
              <img src={menu.images[0].url} alt={menu.images[0].alt || menu.titre} className="w-full h-full object-cover" />
            ) : (
              <span className="text-7xl">🍽️</span>
            )}
          </div>

          {/* Title + tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {menu.themes?.map((t) => (
              <span key={t.theme.id} className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                {t.theme.libelle}
              </span>
            ))}
            {menu.regimes?.map((r) => (
              <span key={r.regime.id} className="px-3 py-1 text-xs font-medium bg-accent-500/10 text-accent-700 rounded-full">
                {r.regime.libelle}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-4">{menu.titre}</h1>

          <div className="flex flex-wrap items-center gap-6 mb-6 text-slate-600">
            <span className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-primary-500" />
              <span className="text-lg font-semibold text-slate-900">{formatPrice(menu.prixParPersonne)}</span>
              <span className="text-sm">/ personne</span>
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-500" />
              <span>Min. {menu.nombrePersonneMinimale} personnes</span>
            </span>
            {menu.quantiteRestante <= 5 && (
              <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                Plus que {menu.quantiteRestante} disponible(s)
              </span>
            )}
          </div>

          <p className="text-slate-700 leading-relaxed mb-8">{menu.description}</p>

          {menu.conditions && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-primary-800">
                <strong>Conditions :</strong> {menu.conditions}
              </p>
            </div>
          )}

          {/* Composition */}
          <div className="space-y-8 mb-10">
            <h2 className="text-2xl font-heading font-bold text-slate-900 flex items-center gap-2">
              <Utensils className="h-6 w-6 text-primary-500" />
              Composition du menu
            </h2>

            {[
              { label: 'Entrées', items: entrees },
              { label: 'Plats', items: plats },
              { label: 'Desserts', items: desserts },
            ].map((section) => section.items.length > 0 && (
              <div key={section.label}>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">{section.label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.items.map((p) => (
                    <div
                      key={p.plat.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-primary-200 hover:shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-lg shrink-0">
                        {p.plat.type === 'ENTREE' ? '🥗' : p.plat.type === 'PLAT' ? '🍖' : '🍰'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.plat.titrePlat}</p>
                        {p.plat.allergenes && p.plat.allergenes.length > 0 && (
                          <p className="text-xs text-red-500 mt-0.5">
                            Allergènes : {p.plat.allergenes.map((a) => a.allergene.libelle).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-heading font-bold text-xl text-slate-900">Envie de ce menu ?</p>
              <p className="text-sm text-slate-500 mt-1">
                À partir de {formatPrice(menu.prixParPersonne * menu.nombrePersonneMinimale)} pour {menu.nombrePersonneMinimale} personnes
              </p>
            </div>
            {user ? (
              <Link
                href={`/commander/${menu.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:-translate-y-0.5"
              >
                <ShoppingCart className="h-4 w-4" />
                Commander
              </Link>
            ) : (
              <Link
                href="/connexion"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all shadow-sm"
              >
                Se connecter pour commander
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
