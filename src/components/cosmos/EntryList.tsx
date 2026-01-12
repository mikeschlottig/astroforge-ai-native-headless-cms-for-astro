import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Edit,
  Trash2,
  Search,
  User,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
export function EntryList({ collectionId, onEdit }: { collectionId: string, onEdit: (id: string) => void }) {
  const entries = useStore(s => s.entries);
  const deleteEntry = useStore(s => s.deleteEntry);
  const collections = useStore(s => s.collections);
  const [search, setSearch] = useState('');
  const collection = collections.find(c => c.id === collectionId);
  const filteredEntries = entries
    .filter(e => e.collectionId === collectionId)
    .filter(e => {
      if (!e.data) return false;
      const primaryValue = Object.values(e.data)[0]?.toString() || '';
      return primaryValue.toLowerCase().includes(search.toLowerCase());
    });
  if (!collection) return null;
  const getEntryTitle = (entry: any) => {
    const firstFieldKey = collection.fields?.[0]?.key;
    if (firstFieldKey && entry.data?.[firstFieldKey]) {
      return entry.data[firstFieldKey].toString();
    }
    // Fallback to first available data piece or ID
    const fallback = Object.values(entry.data || {})[0];
    return fallback?.toString() || `Entry ${entry.id.slice(0, 8)}`;
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder={`Search ${collection.name.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900 border-white/5 focus:ring-sky-500/20 h-10 rounded-xl"
          />
        </div>
      </div>
      <div className="rounded-2xl border border-white/5 bg-slate-900/40 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950/50">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-xs font-mono uppercase text-slate-500">Entry</TableHead>
              <TableHead className="text-xs font-mono uppercase text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-mono uppercase text-slate-500">Author</TableHead>
              <TableHead className="text-xs font-mono uppercase text-slate-500">Last Modified</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id} className="border-white/5 hover:bg-white/5 group transition-colors">
                <TableCell className="font-medium text-slate-200">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold truncate max-w-[200px]">
                      {getEntryTitle(entry)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{entry.id.split('-')[0]}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      entry.status === 'published'
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }
                  >
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center">
                      <User className="h-3 w-3" />
                    </div>
                    {entry.author || 'System'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <Clock className="h-3 w-3" />
                    {entry.updatedAt ? format(entry.updatedAt, 'MMM d, HH:mm') : 'Unknown'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-sky-500/20 hover:text-sky-400"
                      onClick={() => onEdit(entry.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-rose-500/20 hover:text-rose-400"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredEntries.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-slate-600 font-mono tracking-widest uppercase">Index Empty</p>
          </div>
        )}
      </div>
    </div>
  );
}