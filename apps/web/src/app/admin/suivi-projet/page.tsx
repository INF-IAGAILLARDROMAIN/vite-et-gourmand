'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle2, Circle, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface ProjectTask {
  label: string;
  status: 'done' | 'in_progress' | 'todo';
  category: string;
}

const PROJECT_TASKS: ProjectTask[] = [
  // Setup
  { category: 'Setup', label: 'Création du repository GitHub', status: 'done' },
  { category: 'Setup', label: 'Structure monorepo (apps/web + apps/api)', status: 'done' },
  { category: 'Setup', label: 'Configuration des branches (main / develop / feature)', status: 'done' },
  { category: 'Setup', label: 'Board Kanban (GitHub Issues)', status: 'done' },
  // Base de données
  { category: 'Base de données', label: 'Schéma Prisma (PostgreSQL)', status: 'done' },
  { category: 'Base de données', label: 'Migrations et seed de données', status: 'done' },
  { category: 'Base de données', label: 'Fichiers SQL (CREATE TABLE + INSERT INTO)', status: 'done' },
  { category: 'Base de données', label: 'Connexion MongoDB Atlas (statistiques)', status: 'done' },
  // Backend
  { category: 'Backend API', label: 'Module Auth (register, login, reset password)', status: 'done' },
  { category: 'Backend API', label: 'Module Menus (CRUD + filtres)', status: 'done' },
  { category: 'Backend API', label: 'Module Plats (CRUD + allergènes)', status: 'done' },
  { category: 'Backend API', label: 'Module Commandes (workflow complet)', status: 'done' },
  { category: 'Backend API', label: 'Module Avis (modération)', status: 'done' },
  { category: 'Backend API', label: 'Module Horaires (CRUD)', status: 'done' },
  { category: 'Backend API', label: 'Module Contact (envoi email)', status: 'done' },
  { category: 'Backend API', label: 'Module Admin (employés + statistiques)', status: 'done' },
  { category: 'Backend API', label: 'Emails automatiques (7 templates)', status: 'done' },
  // Frontend
  { category: 'Frontend', label: 'Page d\'accueil (présentation + avis)', status: 'done' },
  { category: 'Frontend', label: 'Catalogue menus + filtres dynamiques', status: 'done' },
  { category: 'Frontend', label: 'Vue détaillée menu (allergènes, conditions)', status: 'done' },
  { category: 'Frontend', label: 'Pages auth (inscription, connexion, reset)', status: 'done' },
  { category: 'Frontend', label: 'Formulaire de commande multi-étapes', status: 'done' },
  { category: 'Frontend', label: 'Espace utilisateur (commandes, profil)', status: 'done' },
  { category: 'Frontend', label: 'Espace employé (menus, commandes, avis, horaires)', status: 'done' },
  { category: 'Frontend', label: 'Espace admin (employés, dashboard, graphiques)', status: 'done' },
  { category: 'Frontend', label: 'Page Contact', status: 'done' },
  { category: 'Frontend', label: 'Mentions légales + CGV', status: 'done' },
  // Déploiement
  { category: 'Déploiement', label: 'Frontend déployé sur Vercel', status: 'done' },
  { category: 'Déploiement', label: 'API déployée sur Vercel (serverless)', status: 'done' },
  { category: 'Déploiement', label: 'PostgreSQL sur Neon', status: 'done' },
  { category: 'Déploiement', label: 'MongoDB Atlas configuré', status: 'done' },
  // Documentation
  { category: 'Documentation', label: 'README.md (installation locale)', status: 'done' },
  { category: 'Documentation', label: 'Documentation technique', status: 'done' },
  { category: 'Documentation', label: 'Manuel d\'utilisation', status: 'done' },
  { category: 'Documentation', label: 'Charte graphique', status: 'done' },
  { category: 'Documentation', label: 'Gestion de projet', status: 'done' },
  { category: 'Documentation', label: 'Export des documents en PDF', status: 'todo' },
  { category: 'Documentation', label: 'Maquettes (3 desktop + 3 mobile)', status: 'todo' },
  // Livraison
  { category: 'Livraison', label: 'Copie à rendre (Word)', status: 'todo' },
  { category: 'Livraison', label: 'Dépôt sur Studi', status: 'todo' },
];

const STATUS_CONFIG = {
  done: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Terminé' },
  in_progress: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'En cours' },
  todo: { icon: Circle, color: 'text-slate-400', bg: 'bg-slate-50', label: 'À faire' },
};

export default function SuiviProjetPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/admin');
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) return null;

  const categories = Array.from(new Set(PROJECT_TASKS.map((t) => t.category)));
  const totalDone = PROJECT_TASKS.filter((t) => t.status === 'done').length;
  const totalTasks = PROJECT_TASKS.length;
  const progressPercent = Math.round((totalDone / totalTasks) * 100);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <ClipboardList className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Suivi de projet</h1>
          <p className="text-sm text-slate-500">Avancement global du projet Vite & Gourmand</p>
        </div>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200 rounded-xl p-5 mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">Progression globale</span>
          <span className="text-sm font-bold text-primary-700">{totalDone}/{totalTasks} ({progressPercent}%)</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-primary-600 h-3 rounded-full"
          />
        </div>
        <div className="flex gap-4 mt-3">
          {(['done', 'in_progress', 'todo'] as const).map((status) => {
            const config = STATUS_CONFIG[status];
            const count = PROJECT_TASKS.filter((t) => t.status === status).length;
            return (
              <span key={status} className="flex items-center gap-1.5 text-xs text-slate-500">
                <config.icon className={cn('h-3.5 w-3.5', config.color)} />
                {count} {config.label.toLowerCase()}
              </span>
            );
          })}
        </div>
      </motion.div>

      {/* Tasks by category */}
      <div className="space-y-6">
        {categories.map((cat, catIndex) => {
          const tasks = PROJECT_TASKS.filter((t) => t.category === cat);
          const catDone = tasks.filter((t) => t.status === 'done').length;
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: catIndex * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-700">{cat}</h2>
                <span className="text-xs text-slate-400">{catDone}/{tasks.length}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {tasks.map((task, i) => {
                  const config = STATUS_CONFIG[task.status];
                  const Icon = config.icon;
                  return (
                    <div key={i} className={cn('flex items-center gap-3 px-4 py-3', config.bg)}>
                      <Icon className={cn('h-4 w-4 shrink-0', config.color)} />
                      <span className={cn(
                        'text-sm',
                        task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-800',
                      )}>
                        {task.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
