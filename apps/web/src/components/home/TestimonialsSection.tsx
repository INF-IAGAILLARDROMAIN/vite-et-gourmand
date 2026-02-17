'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Marie Dupont',
    event: 'Mariage',
    note: 5,
    text: 'Un service impeccable du début à la fin. Les invités ont adoré les plats ! Le menu était raffiné et la livraison parfaitement ponctuelle.',
  },
  {
    name: 'Pierre Martin',
    event: 'Séminaire entreprise',
    note: 5,
    text: 'Nous avons fait appel à Vite & Gourmand pour notre séminaire annuel. Qualité irréprochable, équipe réactive. Je recommande vivement.',
  },
  {
    name: 'Sophie Laurent',
    event: 'Anniversaire',
    note: 4,
    text: 'Un régal pour les papilles ! Le menu champêtre était parfait pour l\'anniversaire de ma fille. Tout le monde a été bluffé.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">
            Ce que disent nos clients
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            La satisfaction de nos clients est notre meilleure récompense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative p-6 bg-warm-50 rounded-xl border border-warm-200 hover:shadow-md transition-shadow"
            >
              <Quote className="h-8 w-8 text-primary-200 mb-4" />

              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                {t.text}
              </p>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${j < t.note ? 'text-primary-500 fill-primary-500' : 'text-slate-300'}`}
                  />
                ))}
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
