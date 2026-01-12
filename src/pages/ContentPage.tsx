import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Database, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
export function ContentPage() {
  const collections = [
    { name: "Blog Posts", count: 24, icon: FileText, color: "text-sky-400" },
    { name: "Authors", count: 8, icon: Tag, color: "text-indigo-400" },
    { name: "Media Assets", count: 142, icon: ImageIcon, color: "text-emerald-400" },
  ];
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Content Cosmos</h1>
            <p className="text-sm text-slate-500 font-mono">Phase 2: Management Protocol Initializing...</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search entities..." 
                className="rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 w-full md:w-64"
              />
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20">
              <Plus className="h-4 w-4" /> Create New
            </button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((col, i) => (
            <Card key={i} className="group cursor-pointer border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl bg-slate-800 p-3 ${col.color}`}>
                    <col.icon className="h-6 w-6" />
                  </div>
                  <button className="text-slate-600 hover:text-slate-400">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-lg font-bold text-white">{col.name}</h3>
                  <p className="text-xs text-slate-500">{col.count} entries found</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-mono text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>OPEN COLLECTION</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Static Mockup for Table */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-slate-900/40 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Activity</span>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-tighter">
                Synchronized
              </div>
            </div>
            <button className="text-slate-500 hover:text-slate-300">
              <Filter className="h-4 w-4" />
            </button>
          </div>
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
              <Database className="h-6 w-6 text-slate-700" />
            </div>
            <div className="space-y-1">
              <h4 className="text-slate-300 font-medium">Cosmos Indexer Active</h4>
              <p className="text-sm text-slate-500">The content management protocol is currently in read-only mode for Phase 1.</p>
            </div>
            <div className="flex gap-2">
              <div className="h-1 w-8 rounded-full bg-sky-500" />
              <div className="h-1 w-8 rounded-full bg-slate-800" />
              <div className="h-1 w-8 rounded-full bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}