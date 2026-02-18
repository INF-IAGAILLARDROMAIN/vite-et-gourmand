'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { avis as avisApi } from '@/lib/api';
import type { Avis } from '@/lib/types';

const FALLBACK_TESTIMONIALS = [
  {
    id: 0,
    note: 5,
    description: 'Un service impeccable du début à la fin. Les invités ont adoré les plats ! Le menu était raffiné et la livraison parfaitement ponctuelle.',
    utilisateur: { prenom: 'Marie', nom: 'D.' },
  },
  {
    id: 1,
    note: 5,
    description: 'Nous avons fait appel à Vite & Gourmand pour notre séminaire annuel. Qualité irréprochable, équipe réactive. Je recommande vivement.',
    utilisateur: { prenom: 'Pierre', nom: 'M.' },
  },
  {
    id: 2,
    note: 4,
    description: 'Un régal pour les papilles ! Le menu champêtre était parfait pour l\'anniversaire de ma fille. Tout le monde a été bluffé.',
    utilisateur: { prenom: 'Sophie', nom: 'L.' },
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [reviews, setReviews] = useState<Array<{
    id: number;
    note: number;
    description: string;
    utilisateur: { prenom: string; nom: string };
  }>>(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    avisApi.getValidated()
      .then((data: Avis[]) => {
        if (data && data.length > 0) {
          const mapped = data.slice(0, 6).map((a) => ({
            id: a.id,
            note: a.note,
            description: a.description,
            utilisateur: a.utilisateur || { prenom: 'Client', nom: '' },
          }));
          // Always show at least 3 testimonials — supplement with fallbacks if needed
          if (mapped.length < 3) {
            const needed = 3 - mapped.length;
            const apiIds = new Set(mapped.map((m) => m.description));
            const extras = FALLBACK_TESTIMONIALS
              .filter((f) => !apiIds.has(f.description))
              .slice(0, needed);
            setReviews([...mapped, ...extras]);
          } else {
            setReviews(mapped);
          }
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

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

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative p-6 bg-warm-50 rounded-xl border border-warm-200 hover:shadow-md transition-shadow"
            >
              <Quote className="h-8 w-8 text-primary-200 mb-4" />

              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                &ldquo;{t.description}&rdquo;
              </p>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${j < t.note ? 'text-primary-500 fill-primary-500' : 'text-slate-300'}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                  {t.utilisateur.prenom.charAt(0)}{t.utilisateur.nom.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {t.utilisateur.prenom} {t.utilisateur.nom}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
