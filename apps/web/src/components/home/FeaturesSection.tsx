'use client';

import { motion } from 'framer-motion';
import { Utensils, Truck, Users, Shield, Clock, ChefHat } from 'lucide-react';

const FEATURES = [
  {
    icon: ChefHat,
    title: 'Menus sur mesure',
    description: 'Des menus variés adaptés à vos goûts, thèmes et régimes alimentaires.',
  },
  {
    icon: Truck,
    title: 'Livraison incluse',
    description: 'Livraison gratuite à Bordeaux, tarifs avantageux en Gironde et au-delà.',
  },
  {
    icon: Users,
    title: 'Tous événements',
    description: 'Mariages, séminaires, anniversaires, fêtes d\'entreprise... On s\'adapte.',
  },
  {
    icon: Utensils,
    title: 'Produits frais',
    description: 'Des ingrédients de qualité, sélectionnés auprès de producteurs locaux.',
  },
  {
    icon: Clock,
    title: 'Réactifs & ponctuels',
    description: 'Commande validée sous 24h. Livraison à l\'heure, toujours.',
  },
  {
    icon: Shield,
    title: 'Allergènes identifiés',
    description: 'Tous nos plats indiquent clairement les allergènes présents.',
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">
            Pourquoi nous choisir ?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Un service traiteur complet, de la conception du menu à la livraison.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
