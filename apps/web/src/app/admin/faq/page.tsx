'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  // Commandes
  {
    category: 'Commandes',
    question: 'Comment créer une nouvelle commande ?',
    answer: 'Depuis l\'espace "Commandes", vous pouvez visualiser toutes les commandes en cours. Les clients passent commande depuis la page détaillée d\'un menu. Vous pouvez ensuite gérer le statut de chaque commande.',
  },
  {
    category: 'Commandes',
    question: 'Quels sont les différents statuts d\'une commande ?',
    answer: 'Une commande passe par les étapes suivantes : Reçue → Acceptée → En préparation → En cours de livraison → Livrée → En attente de retour matériel (si applicable) → Terminée. Vous pouvez également annuler une commande en fournissant un motif et le mode de contact utilisé.',
  },
  {
    category: 'Commandes',
    question: 'Comment annuler une commande ?',
    answer: 'Pour annuler une commande, vous devez d\'abord contacter le client par téléphone ou par mail. Ensuite, dans le détail de la commande, cliquez sur "Annuler" et renseignez le motif d\'annulation ainsi que le mode de contact utilisé (GSM ou email).',
  },
  {
    category: 'Commandes',
    question: 'Comment fonctionne le calcul du prix de livraison ?',
    answer: 'La livraison est facturée à 5 € de base. Si l\'adresse de livraison est en dehors de Bordeaux, un supplément de 0,59 €/km est ajouté. Une réduction de 10 % est appliquée si le nombre de personnes dépasse de 5 le minimum requis par le menu.',
  },
  // Menus
  {
    category: 'Menus',
    question: 'Comment ajouter un nouveau menu ?',
    answer: 'Rendez-vous dans la section "Menus" de l\'espace admin, puis cliquez sur "Nouveau menu". Renseignez le titre, la description, les conditions, le thème, le régime, le prix, le nombre de personnes minimum, le stock disponible et ajoutez les plats (entrées, plats, desserts).',
  },
  {
    category: 'Menus',
    question: 'Comment gérer les allergènes ?',
    answer: 'Les allergènes sont associés à chaque plat individuellement. Lors de la création ou modification d\'un plat, vous pouvez sélectionner les allergènes correspondants. Ils seront automatiquement affichés sur la page détaillée du menu.',
  },
  {
    category: 'Menus',
    question: 'Un plat peut-il appartenir à plusieurs menus ?',
    answer: 'Oui, un même plat (entrée, plat ou dessert) peut être associé à plusieurs menus différents. Cela permet de réutiliser les recettes sans les dupliquer.',
  },
  // Avis
  {
    category: 'Avis',
    question: 'Comment modérer les avis clients ?',
    answer: 'Dans la section "Avis", vous verrez les avis en attente de validation. Vous pouvez les valider (ils apparaîtront sur la page d\'accueil) ou les refuser. Seuls les avis validés sont visibles publiquement.',
  },
  // Horaires
  {
    category: 'Horaires',
    question: 'Comment modifier les horaires d\'ouverture ?',
    answer: 'Dans la section "Horaires", vous pouvez modifier les heures d\'ouverture et de fermeture pour chaque jour de la semaine. Ces horaires sont affichés dans le pied de page du site.',
  },
  // Technique
  {
    category: 'Technique',
    question: 'Comment fonctionne l\'envoi d\'emails ?',
    answer: 'L\'application envoie automatiquement des emails à plusieurs étapes : bienvenue à l\'inscription, confirmation de commande, réinitialisation de mot de passe, notification de retour matériel, invitation à laisser un avis, et transfert des messages du formulaire de contact.',
  },
  {
    category: 'Technique',
    question: 'Que se passe-t-il si MongoDB est indisponible ?',
    answer: 'Les statistiques du dashboard admin basculent automatiquement sur PostgreSQL en cas d\'indisponibilité de MongoDB. L\'application reste pleinement fonctionnelle grâce à ce mécanisme de fallback.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');

  const categories = ['Tous', ...Array.from(new Set(FAQ_DATA.map((f) => f.category)))];
  const filtered = activeCategory === 'Tous' ? FAQ_DATA : FAQ_DATA.filter((f) => f.category === activeCategory);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <HelpCircle className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">FAQ</h1>
          <p className="text-sm text-slate-500">Questions fréquentes et aide</p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
              activeCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ items */}
      <div className="space-y-3">
        {filtered.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={`${item.category}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                  <span className="font-medium text-slate-900">{item.question}</span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-slate-400 transition-transform shrink-0 ml-2',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
