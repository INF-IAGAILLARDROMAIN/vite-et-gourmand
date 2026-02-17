'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-16 sm:px-16 text-center"
        >
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
              Prêt à régaler vos invités ?
            </h2>
            <p className="mt-4 text-lg text-primary-100 max-w-xl mx-auto">
              Consultez nos menus et passez commande en quelques clics.
              Livraison gratuite à Bordeaux !
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menus"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-all shadow-lg hover:-translate-y-0.5"
              >
                Voir les menus
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/inscription"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-all hover:-translate-y-0.5"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
