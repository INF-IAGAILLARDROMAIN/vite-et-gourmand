'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Save, RefreshCw } from 'lucide-react';
import { horaires as horairesApi } from '@/lib/api';
import type { Horaire } from '@/lib/types';
import Button from '@/components/ui/Button';

export default function AdminHorairesPage() {
  const [list, setList] = useState<Horaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<number, { heureOuverture: string; heureFermeture: string }>>({});
  const [saving, setSaving] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    horairesApi.getAll()
      .then((data) => {
        setList(data);
        const edits: Record<number, { heureOuverture: string; heureFermeture: string }> = {};
        data.forEach((h) => { edits[h.id] = { heureOuverture: h.heureOuverture, heureFermeture: h.heureFermeture }; });
        setEditing(edits);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (id: number) => {
    const edit = editing[id];
    if (!edit) return;
    setSaving(id);
    try {
      await horairesApi.update(id, edit);
      setList(list.map((h) => h.id === id ? { ...h, ...edit } : h));
    } catch (err: any) {
      alert(err.message || 'Erreur');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Gestion des horaires</h1>
        <Button variant="ghost" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-48" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Aucun horaire configuré</p>
      ) : (
        <div className="space-y-3">
          {list.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="bg-white border border-slate-200 rounded-lg p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary-500" />
                  <span className="font-medium text-slate-900 w-24 capitalize">{h.jour}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={editing[h.id]?.heureOuverture ?? h.heureOuverture}
                    onChange={(e) => setEditing({ ...editing, [h.id]: { ...editing[h.id], heureOuverture: e.target.value } })}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="time"
                    value={editing[h.id]?.heureFermeture ?? h.heureFermeture}
                    onChange={(e) => setEditing({ ...editing, [h.id]: { ...editing[h.id], heureFermeture: e.target.value } })}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSave(h.id)}
                    loading={saving === h.id}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
