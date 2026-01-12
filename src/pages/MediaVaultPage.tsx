import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Upload, 
  Sparkles, 
  Trash2, 
  FileIcon, 
  ImageIcon, 
  MoreVertical,
  CheckCircle2,
  Loader2,
  Filter
} from 'lucide-react';
import { chatService } from '@/lib/chat';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
export function MediaVaultPage() {
  const media = useStore(s => s.media);
  const deleteMedia = useStore(s => s.deleteMedia);
  const updateMediaAlt = useStore(s => s.updateMediaAlt);
  const addMedia = useStore(s => s.addMedia);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generatingAltId, setGeneratingAltId] = useState<string | null>(null);
  const filteredMedia = media.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.altText?.toLowerCase().includes(search.toLowerCase())
  );
  const handleUpload = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          addMedia({
            name: `upload-${Date.now()}.png`,
            type: 'image/png',
            size: '1.4 MB',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
            altText: 'Generated abstract flow'
          });
          setIsUploading(false);
          setUploadProgress(0);
          toast.success('Asset synchronized with R2 bucket');
        }, 500);
      } else {
        setUploadProgress(progress);
      }
    }, 400);
  };
  const generateAlt = async (id: string, name: string) => {
    setGeneratingAltId(id);
    try {
      let alt = '';
      await chatService.sendMessage(`Generate a professional alt-text for an image named "${name}" in a modern web app. Keep it under 100 characters.`, undefined, (chunk) => {
        alt += chunk;
      });
      updateMediaAlt(id, alt.trim());
      toast.success('AI Alt-text generated');
    } catch (e) {
      toast.error('AI protocol failed');
    } finally {
      setGeneratingAltId(null);
    }
  };
  return (
    <AppLayout container>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-white tracking-tighter">Media Vault</h1>
            <p className="text-slate-500">Orchestrate your R2 assets and AI metadata.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search assets..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-900/50 border-white/5 focus:ring-sky-500/20 rounded-xl"
              />
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl shadow-lg shadow-sky-500/20"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Sync Asset
            </Button>
          </div>
        </div>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 space-y-3"
          >
            <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-slate-400">
              <span>R2 UPLOAD PROTOCOL IN PROGRESS...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-1.5 bg-slate-800" />
          </motion.div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMedia.map((asset) => (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="group relative h-full border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300 overflow-hidden rounded-2xl">
                  <div className="aspect-video relative overflow-hidden bg-slate-950">
                    <img 
                      src={asset.url} 
                      alt={asset.altText} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                        onClick={() => generateAlt(asset.id, asset.name)}
                        disabled={generatingAltId === asset.id}
                      >
                        {generatingAltId === asset.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="bg-rose-500/20 backdrop-blur-md text-rose-400 hover:bg-rose-500/40"
                        onClick={() => deleteMedia(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white truncate max-w-[160px]">{asset.name}</p>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{asset.size} • {asset.type.split('/')[1]}</p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    {asset.altText ? (
                      <p className="text-[11px] text-slate-400 italic line-clamp-2 bg-white/5 p-2 rounded-lg">
                        "{asset.altText}"
                      </p>
                    ) : (
                      <div className="text-[10px] text-slate-600 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Awaiting AI Alt-text...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredMedia.length === 0 && (
          <div className="h-64 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-slate-500 gap-4">
            <Filter className="h-10 w-10 opacity-20" />
            <p className="text-sm font-mono tracking-widest uppercase">No assets matching filter</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}