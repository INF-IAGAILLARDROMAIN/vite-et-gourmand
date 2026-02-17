'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Star, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function MonComptePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/connexion');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const links = [
    { href: '/mon-compte/commandes', icon: ShoppingBag, label: 'Mes commandes', desc: 'Suivre et gérer vos commandes' },
    { href: '/menus', icon: Star, label: 'Commander', desc: 'Parcourir nos menus et passer commande' },
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Profile card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-slate-900">
                  {user.prenom} {user.nom}
                </h1>
                <p className="text-sm text-slate-500">{user.email}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <link.icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="font-semibold text-slate-900">{link.label}</h2>
                </div>
                <p className="text-sm text-slate-500">{link.desc}</p>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </motion.div>
      </div>
    </div>
  );
}
