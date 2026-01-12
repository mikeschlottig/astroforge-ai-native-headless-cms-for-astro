import React from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  User, 
  Box, 
  MoreVertical, 
  ChevronRight, 
  Plus,
  Layers
} from 'lucide-react';
import { format } from 'date-fns';
const ICON_MAP: Record<string, any> = {
  FileText,
  User,
  Box,
  Layers
};
export function CollectionGrid({ onSelect }: { onSelect: (id: string) => void }) {
  const collections = useStore(s => s.collections);
  const entries = useStore(s => s.entries);
  const addCollection = useStore(s => s.addCollection);
  const handleCreate = () => {
    addCollection({
      name: 'New Collection',
      description: 'Define your content structure here.',
      icon: 'Layers',
      fields: []
    });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((col) => {
        const Icon = ICON_MAP[col.icon] || Box;
        const count = entries.filter(e => e.collectionId === col.id).length;
        return (
          <Card 
            key={col.id}
            onClick={() => onSelect(col.id)}
            className="group relative cursor-pointer border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-slate-500 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-slate-800 text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-white group-hover:text-sky-400 transition-colors">{col.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{col.description}</p>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Population</span>
                  <span className="text-sm font-bold text-slate-300">{count} Entities</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Last Sync</span>
                  <span className="text-[10px] text-slate-400">{format(col.updatedAt, 'MMM d, HH:mm')}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Access Protocol</span>
                <ChevronRight className="h-3 w-3 text-sky-400" />
              </div>
            </CardContent>
          </Card>
        );
      })}
      <button
        onClick={handleCreate}
        className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/5 bg-transparent hover:bg-white/5 hover:border-sky-500/30 transition-all min-h-[220px]"
      >
        <div className="p-4 rounded-full bg-slate-900 border border-white/5 group-hover:scale-110 transition-transform mb-4">
          <Plus className="h-6 w-6 text-slate-500 group-hover:text-sky-400" />
        </div>
        <span className="text-sm font-bold text-slate-500 group-hover:text-slate-300">Ignite New Collection</span>
        <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest mt-1">Manual Initialization</span>
      </button>
    </div>
  );
}