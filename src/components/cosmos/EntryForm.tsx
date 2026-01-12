import React, { useState } from 'react';
import { useStore, CollectionField } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, Save, Loader2 } from 'lucide-react';
import { chatService } from '@/lib/chat';
import { toast } from 'sonner';
export function EntryForm({ 
  collectionId, 
  entryId, 
  onComplete 
}: { 
  collectionId: string; 
  entryId?: string; 
  onComplete: () => void;
}) {
  const collections = useStore(s => s.collections);
  const addEntry = useStore(s => s.addEntry);
  const updateEntry = useStore(s => s.updateEntry);
  const entries = useStore(s => s.entries);
  const collection = collections.find(c => c.id === collectionId);
  const entry = entryId ? entries.find(e => e.id === entryId) : null;
  const [formData, setFormData] = useState<Record<string, any>>(entry?.data || {});
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  if (!collection) return null;
  const handleSave = () => {
    if (entryId) {
      updateEntry(entryId, formData);
    } else {
      addEntry(collectionId, formData);
    }
    toast.success('Content saved to Cosmos Index');
    onComplete();
  };
  const generateWithAI = async (field: CollectionField) => {
    setIsGenerating(field.key);
    try {
      const context = JSON.stringify(formData);
      const prompt = `Generate a creative ${field.label} for a content entry in a collection called ${collection.name}. Context: ${context}`;
      let result = '';
      await chatService.sendMessage(prompt, undefined, (chunk) => {
        result += chunk;
      });
      setFormData(prev => ({ ...prev, [field.key]: result.trim() }));
      toast.success(`AI generated ${field.label}`);
    } catch (e) {
      toast.error('AI generation failed');
    } finally {
      setIsGenerating(null);
    }
  };
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 space-y-8">
      <div className="grid gap-8">
        {collection.fields.map((field) => (
          <div key={field.id} className="space-y-3 group">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-mono uppercase tracking-widest text-slate-400">
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </Label>
              <button
                onClick={() => generateWithAI(field)}
                disabled={!!isGenerating}
                className="flex items-center gap-1.5 text-[10px] font-bold text-sky-400 hover:text-sky-300 disabled:opacity-50 transition-colors uppercase tracking-widest"
              >
                {isGenerating === field.key ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                Magic Fill
              </button>
            </div>
            {field.type === 'rich-text' ? (
              <Textarea 
                value={formData[field.key] || ''}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                className="bg-slate-950 border-white/10 min-h-[160px] focus:ring-sky-500/20"
                placeholder={`Write ${field.label.toLowerCase()}...`}
              />
            ) : field.type === 'boolean' ? (
              <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-white/10">
                <input 
                  type="checkbox" 
                  checked={!!formData[field.key]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                  className="rounded border-white/20 bg-slate-900 text-sky-500"
                />
                <span className="text-sm text-slate-300">Enabled / Active</span>
              </div>
            ) : (
              <Input 
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                value={formData[field.key] || ''}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                className="bg-slate-950 border-white/10 h-12 focus:ring-sky-500/20"
                placeholder={field.label}
              />
            )}
          </div>
        ))}
      </div>
      <div className="pt-8 border-t border-white/5 flex justify-end">
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl min-w-[120px]">
          <Save className="h-4 w-4 mr-2" />
          Commit to Cosmos
        </Button>
      </div>
    </div>
  );
}