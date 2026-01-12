import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore } from '@/lib/store';
import { CollectionGrid } from '@/components/cosmos/CollectionGrid';
import { SchemaEditor } from '@/components/cosmos/SchemaEditor';
import { EntryForm } from '@/components/cosmos/EntryForm';
import { EntryList } from '@/components/cosmos/EntryList';
import {
  ChevronRight,
  Database,
  ArrowLeft,
  Settings2,
  FileJson,
  Sparkles
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
type ViewState =
  | { type: 'grid' }
  | { type: 'collection'; collectionId: string }
  | { type: 'entry'; collectionId: string; entryId?: string };
export function ContentPage() {
  const [view, setView] = useState<ViewState>({ type: 'grid' });
  const collections = useStore(s => s.collections);
  const activeCollection = view.type !== 'grid'
    ? collections.find(c => c.id === view.collectionId)
    : null;
  const navigateToGrid = () => setView({ type: 'grid' });
  const navigateToCollection = (id: string) => setView({ type: 'collection', collectionId: id });
  const navigateToEntry = (colId: string, entryId?: string) => setView({ type: 'entry', collectionId: colId, entryId });
  return (
    <AppLayout container>
      <div className="space-y-8 min-h-[60vh]">
        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
          <button
            onClick={navigateToGrid}
            className="hover:text-sky-400 transition-colors"
          >
            Cosmos
          </button>
          {activeCollection && (
            <>
              <ChevronRight className="h-3 w-3" />
              <button
                onClick={() => navigateToCollection(activeCollection.id)}
                className="hover:text-sky-400 transition-colors"
              >
                {activeCollection.name}
              </button>
            </>
          )}
          {view.type === 'entry' && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-200">{view.entryId ? 'Edit Entry' : 'New Entry'}</span>
            </>
          )}
        </nav>
        {view.type === 'grid' && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold text-white tracking-tighter">Content Cosmos</h1>
              <p className="text-slate-500 max-w-2xl">
                The orchestration layer for your data. Define schemas and manage content across your Astro applications.
              </p>
            </div>
            <CollectionGrid onSelect={navigateToCollection} />
          </div>
        )}
        {view.type === 'collection' && activeCollection && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={navigateToGrid} className="rounded-xl border border-white/5">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">{activeCollection.name}</h1>
                  <p className="text-sm text-slate-500">{activeCollection.description}</p>
                </div>
              </div>
              <Button
                onClick={() => navigateToEntry(activeCollection.id)}
                className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl shadow-lg shadow-sky-500/20"
              >
                Create Entry
              </Button>
            </div>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="bg-slate-900 border border-white/5 p-1 rounded-xl mb-6">
                <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-sky-500">Content</TabsTrigger>
                <TabsTrigger value="schema" className="rounded-lg data-[state=active]:bg-sky-500">Schema Architect</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="mt-0">
                <EntryList 
                  collectionId={activeCollection.id} 
                  onEdit={(entryId) => navigateToEntry(activeCollection.id, entryId)} 
                />
              </TabsContent>
              <TabsContent value="schema" className="mt-0">
                <SchemaEditor collectionId={activeCollection.id} />
              </TabsContent>
            </Tabs>
          </div>
        )}
        {view.type === 'entry' && activeCollection && (
          <div className="max-w-4xl mx-auto space-y-8 animate-scale-in">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigateToCollection(activeCollection.id)} className="rounded-xl border border-white/5">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-white">
                {view.entryId ? 'Edit' : 'New'} {activeCollection.name.replace(/s$/, '')}
              </h1>
            </div>
            <EntryForm
              collectionId={activeCollection.id}
              entryId={view.entryId}
              onComplete={() => navigateToCollection(activeCollection.id)}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}