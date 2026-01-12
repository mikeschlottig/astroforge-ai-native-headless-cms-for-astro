import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold, Italic, List, ImageIcon, FileText, Loader2,
  Image as LucideImage, Globe, CheckCircle2, Rocket
} from 'lucide-react';
export function EditorPage() {
  const media = useStore(s => s.media);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [keywords, setKeywords] = useState('');
  const [featuredImage, setFeaturedImage] = useState<any>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<'insert' | 'featured'>('insert');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const insertText = (before: string, after: string = '') => {
    const el = document.getElementById('md-editor') as HTMLTextAreaElement;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.substring(start, end);
    const newText = content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };
  const handleAssetSelect = (asset: any) => {
    if (pickerMode === 'insert') {
      const mdImage = `![${asset.altText || asset.name}](${asset.url})`;
      insertText(mdImage);
    } else {
      setFeaturedImage(asset);
    }
    setPickerOpen(false);
  };
  const handleDeploy = () => {
    if (!title || !content) {
      toast.error('Title and Content are required for deployment');
      return;
    }
    setIsDeploying(true);
    setDeployStep(1);
    setTimeout(() => setDeployStep(2), 1500); // Syncing Assets...
    setTimeout(() => setDeployStep(3), 3000); // Building Astro Islands...
    setTimeout(() => {
      setDeployStep(4); // Deployed
      toast.success('Content successfully deployed to global edge network');
      setTimeout(() => {
        setIsDeploying(false);
        setDeployStep(0);
      }, 2000);
    }, 4500);
  };
  const parseMarkdown = (md: string) => {
    if (!md) return <div className="text-slate-600 italic">Start writing to see preview...</div>;
    let html = md
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.125rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.25rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.5rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" style="margin: 1rem 0; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.1); max-width: 100%; height: auto;" />')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" style="color: #38bdf8; text-decoration: none;">$1</a>')
      .replace(/\n$/gim, '<br />');
    html = html.replace(/^\* (.*$)/gim, '<li style="margin-left: 1rem; list-style-type: disc;">$1</li>');
    return <div dangerouslySetInnerHTML={{ __html: html }} className="text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none" />;
  };
  return (
    <AppLayout container>
      <div className="space-y-8">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-400">
            <FileText className="h-3 w-3" />
            Advanced Editor
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Content <span className="text-slate-500">Orchestration</span>
          </h1>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-white/5 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/5 bg-slate-950/50">
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post Title..." 
                  className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 px-0 h-auto placeholder:text-slate-600 text-slate-200"
                />
              </div>
              <Tabs defaultValue="write" className="w-full">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-slate-900/80">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-400" onClick={() => insertText('**', '**')}><Bold className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-400" onClick={() => insertText('*', '*')}><Italic className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-400" onClick={() => insertText('\n* ', '')}><List className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-400" onClick={() => { setPickerMode('insert'); setPickerOpen(true); }}><ImageIcon className="h-4 w-4" /></Button>
                  </div>
                  <TabsList className="bg-slate-950 h-8 border border-white/5">
                    <TabsTrigger value="write" className="text-xs px-4">Write</TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs px-4">Preview</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="write" className="m-0 border-none p-0">
                  <Textarea 
                    id="md-editor"
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    className="bg-transparent border-none min-h-[500px] focus-visible:ring-0 text-slate-300 font-mono text-sm resize-y p-6" 
                    placeholder="Type your markdown here..." 
                  />
                </TabsContent>
                <TabsContent value="preview" className="m-0 border-none p-6 min-h-[500px] bg-slate-950/50">
                  {parseMarkdown(content)}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          {/* Right Column - Config */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-white/5 bg-slate-900/40 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-sky-400 mb-1">
                  <Globe className="h-4 w-4" />
                  <CardTitle className="text-sm">SEO Configuration</CardTitle>
                </div>
                <CardDescription className="text-xs">Optimize for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-slate-400">Meta Description</Label>
                  <Textarea 
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    className="bg-slate-950 border-white/10 text-xs text-slate-300 resize-none h-20" 
                    placeholder="Brief summary for search results..." 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-slate-400">Keywords</Label>
                  <Input 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="bg-slate-950 border-white/10 text-xs text-slate-300 h-8" 
                    placeholder="astro, cms, cloudflare..." 
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/5 bg-slate-900/40 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <LucideImage className="h-4 w-4" />
                  <CardTitle className="text-sm">Featured Image</CardTitle>
                </div>
                <CardDescription className="text-xs">OpenGraph & Social Sharing</CardDescription>
              </CardHeader>
              <CardContent>
                {featuredImage ? (
                  <div className="relative group rounded-xl overflow-hidden border border-white/10">
                    <img src={featuredImage.url} alt="Featured" className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" onClick={() => { setPickerMode('featured'); setPickerOpen(true); }} className="text-xs">
                        Change
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setPickerMode('featured'); setPickerOpen(true); }}
                    className="w-full aspect-video rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 hover:border-white/20 transition-all bg-slate-950/50"
                  >
                    <ImageIcon className="h-6 w-6 mb-2" />
                    <span className="text-xs">Select from Vault</span>
                  </button>
                )}
              </CardContent>
            </Card>
            <Card className="border-sky-500/20 bg-sky-950/10 backdrop-blur-sm shadow-xl overflow-hidden relative">
              {isDeploying && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                  <Loader2 className="h-8 w-8 text-sky-400 animate-spin mb-4" />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={deployStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm font-medium text-white"
                    >
                      {deployStep === 1 && "Initializing Build Protocol..."}
                      {deployStep === 2 && "Synchronizing Assets to R2..."}
                      {deployStep === 3 && "Compiling Astro Islands..."}
                      {deployStep === 4 && <span className="text-emerald-400 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Deployment Successful</span>}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
              <CardContent className="p-6">
                <Button 
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 h-12 rounded-xl text-sm font-bold"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy to Edge
                </Button>
                <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-widest font-mono">
                  Triggers static build & R2 sync
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
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
            {media.length === 0 && (
              <div className="col-span-3 py-12 text-center text-slate-500 text-sm">
                No media assets found in vault.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}