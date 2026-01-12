import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore } from '@/lib/store';
import { CollectionGrid } from '@/components/cosmos/CollectionGrid';
import { SchemaEditor } from '@/components/cosmos/SchemaEditor';
import { EntryForm } from '@/components/cosmos/EntryForm';
import { EntryList } from '@/components/cosmos/EntryList';
import {
  ChevronRight,
  ArrowLeft,
  Download
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
type ViewState =
  | { type: 'grid' }
  | { type: 'collection'; collectionId: string }
  | { type: 'entry'; collectionId: string; entryId?: string };
export function ContentPage() {
  const [view, setView] = useState<ViewState>({ type: 'grid' });
  const collections = useStore(s => s.collections);
  const entries = useStore(s => s.entries);
  const activeCollection = view.type !== 'grid'
    ? collections.find(c => c.id === view.collectionId)
    : null;
  const navigateToGrid = () => setView({ type: 'grid' });
  const navigateToCollection = (id: string) => setView({ type: 'collection', collectionId: id });
  const navigateToEntry = (colId: string, entryId?: string) => setView({ type: 'entry', collectionId: colId, entryId });

  const handleExportJSON = (collectionId: string) => {
    const collectionEntries = entries.filter(e => e.collectionId === collectionId);
    const blob = new Blob([JSON.stringify(collectionEntries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collection-${collectionId}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Collection exported as JSON');
  };

  const handleExportCSV = (collection: any) => {
    const collectionEntries = entries.filter(e => e.collectionId === collection.id);
    if (collectionEntries.length === 0) {
      toast.error('No entries to export');
      return;
    }
    const headers = collection.fields.map((f: any) => f.key);
    const csvRows = [];
    csvRows.push(headers.join(','));
    for (const entry of collectionEntries) {
      const row = headers.map((header: string) => {
        let val = entry.data[header] || '';
        if (typeof val === 'string') {
          val = val.replace(/"/g, '""');
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            val = `"${val}"`;
          }
        }
        return val;
      });
      csvRows.push(row.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collection-${collection.id}-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Collection exported as CSV');
  };

  return (
    <AppLayout container>
      <div className="space-y-8 min-h-[60vh]">
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
          <div className="space-y-10 animate-fade-in" key="cosmos-grid">
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
          <div className="space-y-6 animate-slide-up" key={`col-${activeCollection.id}`}>
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
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl text-slate-300">
                      <Download className="h-4 w-4 mr-2" /> Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-slate-300">
                    <DropdownMenuItem onClick={() => handleExportJSON(activeCollection.id)} className="hover:bg-white/5 cursor-pointer">
                      Download JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportCSV(activeCollection)} className="hover:bg-white/5 cursor-pointer">
                      Download CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={() => navigateToEntry(activeCollection.id)}
                  className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl shadow-lg shadow-sky-500/20"
                >
                  Create Entry
                </Button>
              </div>
            </div>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="bg-slate-900 border border-white/5 p-1 rounded-xl mb-6">
                <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-sky-500">Content</TabsTrigger>
                <TabsTrigger value="schema" className="rounded-lg data-[state=active]:bg-sky-500">Schema Architect</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="mt-0">
                <EntryList
                  key={`list-${activeCollection.id}`}
                  collectionId={activeCollection.id}
                  onEdit={(entryId) => navigateToEntry(activeCollection.id, entryId)}
                />
              </TabsContent>
              <TabsContent value="schema" className="mt-0">
                <SchemaEditor 
                  key={`schema-${activeCollection.id}`}
                  collectionId={activeCollection.id} 
                />
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
              key={view.entryId || 'new-entry'}
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