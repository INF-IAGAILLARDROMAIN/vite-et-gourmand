'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChefHat, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/menus', label: 'Nos Menus' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isEmployee } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ChefHat className="h-8 w-8 text-primary-600" />
            </motion.div>
            <span className="text-xl font-heading font-bold text-primary-800">
              Vite & Gourmand
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname === link.href
                    ? 'text-primary-700'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-x-2 -bottom-[9px] h-0.5 bg-primary-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {isEmployee && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/mon-compte"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4" />
                  {user.prenom}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-primary-50"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      pathname === link.href
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-primary-100 my-2 pt-2">
                  {user ? (
                    <>
                      {isEmployee && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-primary-50 rounded-lg"
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        href="/mon-compte"
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-primary-50 rounded-lg"
                      >
                        Mon compte
                      </Link>
                      <button
                        onClick={() => { logout(); setMobileOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/connexion"
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-primary-50 rounded-lg"
                      >
                        Connexion
                      </Link>
                      <Link
                        href="/inscription"
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        Inscription
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
