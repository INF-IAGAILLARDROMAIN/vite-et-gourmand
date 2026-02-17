'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Utensils, Star, Clock, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const SIDEBAR_LINKS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/commandes', icon: ShoppingBag, label: 'Commandes' },
  { href: '/admin/menus', icon: Utensils, label: 'Menus' },
  { href: '/admin/avis', icon: Star, label: 'Avis' },
  { href: '/admin/horaires', icon: Clock, label: 'Horaires' },
  { href: '/admin/employes', icon: Users, label: 'Employés' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isEmployee } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isEmployee)) router.push('/connexion');
  }, [user, loading, isEmployee, router]);

  if (loading || !user || !isEmployee) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Retour au site
            </Link>
            <nav className="space-y-1">
              {SIDEBAR_LINKS.map((link) => {
                // Hide employees link for non-admins
                if (link.href === '/admin/employes' && user.role !== 'administrateur') return null;

                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
