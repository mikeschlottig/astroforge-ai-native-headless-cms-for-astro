import React, { useState } from 'react';
import { useStore, FieldType } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Type,
  FileText,
  Hash,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  GripVertical,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
const FIELD_TYPES: { type: FieldType; label: string; icon: any }[] = [
  { type: 'text', label: 'Short Text', icon: Type },
  { type: 'rich-text', label: 'Rich Text', icon: FileText },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'image', label: 'Image Asset', icon: ImageIcon },
  { type: 'boolean', label: 'Boolean', icon: CheckCircle2 },
];
export function SchemaEditor({ collectionId }: { collectionId: string }) {
  const navigate = useNavigate();
  const collections = useStore(s => s.collections);
  const updateCollection = useStore(s => s.updateCollection);
  const [isPrompting, setIsPrompting] = useState(false);
  const collection = collections.find(c => c.id === collectionId);
  if (!collection) return null;
  const addField = (type: FieldType) => {
    const newField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      key: `field_${Date.now()}`
    };
    updateCollection(collectionId, {
      fields: [...collection.fields, newField]
    });
  };
  const removeField = (fieldId: string) => {
    updateCollection(collectionId, {
      fields: collection.fields.filter(f => f.id !== fieldId)
    });
  };
  const handleAISchemaGen = () => {
    setIsPrompting(true);
    setTimeout(() => {
      // Pass collection name as state to the Architect
      navigate('/architect', { state: { 
        initialPrompt: `Generate a JSON schema for a content collection named "${collection.name}". The purpose is ${collection.description}.` 
      }});
    }, 1000);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Field Library</h3>
        <div className="grid grid-cols-1 gap-2">
          {FIELD_TYPES.map((ft) => (
            <button
              key={ft.type}
              onClick={() => addField(ft.type)}
              className="flex items-center gap-3 w-full p-3 rounded-xl bg-slate-900 border border-white/5 hover:border-sky-500/50 hover:bg-slate-800 transition-all text-sm group"
            >
              <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-sky-500/10 text-slate-400 group-hover:text-sky-400 transition-colors">
                <ft.icon className="h-4 w-4" />
              </div>
              <span className="text-slate-300 font-medium">{ft.label}</span>
              <Plus className="h-3 w-3 ml-auto text-slate-600" />
            </button>
          ))}
        </div>
        <div className="mt-8 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Architect</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Need a complex structure? Ask the Architect to generate the full JSON definition.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAISchemaGen}
            disabled={isPrompting}
            className="w-full border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 text-[10px] h-8"
          >
            {isPrompting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : "AUTO-GENERATE SCHEMA"}
          </Button>
        </div>
      </div>
      <div className="lg:col-span-3 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Schema Canvas</h3>
        {collection.fields.length === 0 ? (
          <div className="h-64 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600 gap-4">
            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
              <Plus className="h-6 w-6" />
            </div>
            <p className="text-sm">Add fields from the library to start building</p>
          </div>
        ) : (
          <div className="space-y-3">
            {collection.fields.map((field, idx) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-white/5 bg-slate-900/40 group hover:border-sky-500/30 transition-all">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="cursor-grab active:cursor-grabbing text-slate-700">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800 text-sky-400">
                      {(() => {
                        const fieldType = FIELD_TYPES.find(ft => ft.type === field.type);
                        return fieldType ? React.createElement(fieldType.icon, { className: "h-4 w-4" }) : <Hash className="h-4 w-4" />;
                      })()}
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-tighter text-slate-600 font-bold">Label</label>
                        <input
                          value={field.label}
                          onChange={(e) => {
                            const newFields = [...collection.fields];
                            newFields[idx].label = e.target.value;
                            updateCollection(collectionId, { fields: newFields });
                          }}
                          className="w-full bg-transparent border-none text-sm font-semibold text-white focus:ring-0 p-0"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-tighter text-slate-600 font-bold">API Key</label>
                        <input
                          value={field.key}
                          onChange={(e) => {
                            const newFields = [...collection.fields];
                            newFields[idx].key = e.target.value;
                            updateCollection(collectionId, { fields: newFields });
                          }}
                          className="w-full bg-transparent border-none text-sm font-mono text-sky-400/80 focus:ring-0 p-0"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeField(field.id)}
                      className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}