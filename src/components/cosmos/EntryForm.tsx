import React, { useState } from 'react';
import { useStore, CollectionField } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, Save, Loader2, X, Bold, Italic, List, ImageIcon as ImageIcon2, FileText } from 'lucide-react';
import { chatService } from '@/lib/chat';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  const media = useStore(s => s.media);
  const collection = collections.find(c => c.id === collectionId);
  const entry = entryId ? entries.find(e => e.id === entryId) : null;
  const [formData, setFormData] = useState<Record<string, any>>(entry?.data || {});
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
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
      const prompt = `Generate a creative ${field.label} for a content entry in a collection called ${collection.name}. Context: ${context}. Return ONLY the value, no extra text.`;
      let result = '';
      await chatService.sendMessage(prompt, undefined, (chunk) => {
        result += chunk;
      });
      // Sanitize AI output (strip markdown backticks if AI returns them)
      const cleanResult = result.replace(/```/g, '').trim();
      setFormData(prev => ({ ...prev, [field.key]: cleanResult }));
      toast.success(`AI generated content for ${field.label}`);
    } catch (e) {
      toast.error('AI generation failed. Check architect status.');
    } finally {
      setIsGenerating(null);
    }
  };

  const insertText = (key: string, before: string, after: string = '') => {
    const el = document.getElementById(`md-${key}`) as HTMLTextAreaElement;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const current = formData[key] || '';
    const selected = current.substring(start, end);
    const newText = current.substring(0, start) + before + selected + after + current.substring(end);
    setFormData(prev => ({ ...prev, [key]: newText }));
    
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const handleAssetSelect = (asset: any) => {
    if (activeFieldKey) {
      const mdImage = `![${asset.altText || asset.name}](${asset.url})`;
      insertText(activeFieldKey, mdImage);
    }
    setPickerOpen(false);
    setActiveFieldKey(null);
  };

  const parseMarkdown = (md: string) => {
    if (!md) return <div className="text-slate-600 italic">Nothing to preview...</div>;
    let html = md
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.125rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.25rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.5rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" style="margin: 1rem 0; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.1); max-height: 16rem; object-fit: cover;" />')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" style="color: #38bdf8; text-decoration: none;">$1</a>')
      .replace(/\n$/gim, '<br />');
    html = html.replace(/^\* (.*$)/gim, '<li style="margin-left: 1rem; list-style-type: disc;">$1</li>');
    return <div dangerouslySetInnerHTML={{ __html: html }} className="text-slate-300 text-sm leading-relaxed" />;
  };

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 space-y-8 shadow-2xl">
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
              <Tabs defaultValue="write" className="w-full border border-white/10 rounded-xl overflow-hidden bg-slate-950">
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-slate-900/50">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-400" onClick={() => insertText(field.key, '**', '**')}><Bold className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-400" onClick={() => insertText(field.key, '*', '*')}><Italic className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-400" onClick={() => insertText(field.key, '\n* ', '')}><List className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-400" onClick={() => { setActiveFieldKey(field.key); setPickerOpen(true); }}><ImageIcon2 className="h-4 w-4" /></Button>
                  </div>
                  <TabsList className="bg-slate-900 h-8">
                    <TabsTrigger value="write" className="text-xs px-3">Write</TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs px-3">Preview</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="write" className="m-0 border-none">
                  <Textarea id={`md-${field.key}`} value={formData[field.key] || ''} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="bg-transparent border-none min-h-[200px] focus-visible:ring-0 text-slate-200 font-mono text-sm resize-y" placeholder={`Write ${field.label.toLowerCase()}...`} />
                </TabsContent>
                <TabsContent value="preview" className="m-0 border-none p-4 min-h-[200px] bg-slate-950">
                  {parseMarkdown(formData[field.key])}
                </TabsContent>
              </Tabs>
            ) : field.type === 'boolean' ? (
              <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-white/10">
                <input
                  type="checkbox"
                  id={`field-${field.id}`}
                  checked={!!formData[field.key]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                  className="rounded border-white/20 bg-slate-900 text-sky-500 h-4 w-4 focus:ring-sky-500"
                />
                <label htmlFor={`field-${field.id}`} className="text-sm text-slate-300 cursor-pointer">Enabled / Active</label>
              </div>
            ) : (
              <Input
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                value={formData[field.key] || ''}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                className="bg-slate-950 border-white/10 h-12 focus:ring-sky-500/20 text-slate-200"
                placeholder={field.label}
              />
            )}
          </div>
        ))}
        {collection.fields.length === 0 && (
          <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-xl">
            <p className="text-slate-500 text-sm">No fields defined in schema. Edit schema in the Architect tab first.</p>
          </div>
        )}
      </div>
      <div className="pt-8 border-t border-white/5 flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={onComplete} 
          className="border-white/10 hover:bg-white/5 text-slate-400 rounded-xl"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={collection.fields.length === 0}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl min-w-[140px] shadow-lg shadow-emerald-500/20"
        >
          <Save className="h-4 w-4 mr-2" />
          Commit to Cosmos
        </Button>
      </div>
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Media Asset</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
            {media.map(m => (
              <div key={m.id} className="group cursor-pointer rounded-xl border border-white/10 overflow-hidden bg-slate-950 hover:border-sky-500/50 transition-colors" onClick={() => handleAssetSelect(m)}>
                <div className="aspect-video bg-slate-900 relative">
                  {m.type.startsWith('image/') ? (
                    <img src={m.url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full"><FileText className="h-8 w-8 text-slate-500" /></div>
                  )}
                </div>
                <div className="p-2 text-xs truncate text-slate-400 group-hover:text-sky-400">{m.name}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}