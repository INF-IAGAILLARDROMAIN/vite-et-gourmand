'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl px-8 py-16 sm:px-16 text-center"
        >
          <Image
            src="/images/cta-bg.jpg"
            alt="Cuisine du chef traiteur"
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-primary-900/75" />
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
