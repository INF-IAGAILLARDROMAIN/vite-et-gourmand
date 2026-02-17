'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { horaires as horairesApi } from '@/lib/api';
import type { Horaire } from '@/lib/types';

const DAYS_ORDER = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function Footer() {
  const [horaires, setHoraires] = useState<Horaire[]>([]);

  useEffect(() => {
    horairesApi.getAll()
      .then(setHoraires)
      .catch(() => setHoraires([]));
  }, []);

  const sortedHoraires = [...horaires].sort(
    (a, b) => DAYS_ORDER.indexOf(a.jour) - DAYS_ORDER.indexOf(b.jour),
  );

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo_vite_e_gourmand.png"
                alt="Vite & Gourmand"
                width={96}
                height={96}
                className="h-10 w-10 brightness-0 invert"
              />
              <span className="text-xl font-heading font-bold text-white">
                Vite &amp; Gourmand
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Traiteur événementiel à Bordeaux. Des menus raffinés livrés directement
              chez vous pour tous vos événements.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-primary-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/menus" className="text-sm hover:text-primary-400 transition-colors">
                  Nos Menus
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-sm hover:text-primary-400 transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-sm hover:text-primary-400 transition-colors">
                  CGV
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary-400 mt-0.5 shrink-0" />
                <span>12 Rue Sainte-Catherine, 33000 Bordeaux</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary-400 shrink-0" />
                <span>05 56 00 00 00</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary-400 shrink-0" />
                <span>contact@viteetgourmand.fr</span>
              </li>
            </ul>
          </div>

          {/* Horaires — dynamic from API */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              <Clock className="inline h-4 w-4 mr-1 text-primary-400" />
              Horaires
            </h3>
            <ul className="space-y-1 text-sm">
              {sortedHoraires.length > 0 ? (
                sortedHoraires.map((h) => (
                  <li key={h.id} className="flex justify-between">
                    <span>{h.jour}</span>
                    <span className="text-slate-400">
                      {h.heureOuverture && h.heureFermeture
                        ? `${h.heureOuverture} - ${h.heureFermeture}`
                        : 'Fermé'}
                    </span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="text-slate-400">9h - 19h</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Samedi</span>
                    <span className="text-slate-400">10h - 18h</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="text-slate-400">Fermé</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Vite &amp; Gourmand. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <Link href="/mentions-legales" className="hover:text-primary-400 transition-colors">
              Mentions légales
            </Link>
            <Link href="/cgv" className="hover:text-primary-400 transition-colors">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
