import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Settings, Shield, Cpu, Database, Zap, CheckCircle2, Loader2 } from 'lucide-react';
export function SettingsPage() {
  const [isTesting, setIsTesting] = useState(false);
  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.success) {
        toast.success('Forge core is operational');
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error('Connection to Cloudflare Agent failed');
    } finally {
      setIsTesting(false);
    }
  };
  return (
    <AppLayout container>
      <div className="space-y-10">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">System Configuration</h1>
          <p className="text-slate-500">Manage your AI Architect and Cloudflare Infrastructure.</p>
        </header>
        <div className="grid gap-8">
          <Card className="border-white/5 bg-slate-900/40">
            <CardHeader>
              <div className="flex items-center gap-2 text-sky-400 mb-2">
                <Cpu className="h-5 w-5" />
                <CardTitle>AI Orchestrator</CardTitle>
              </div>
              <CardDescription className="text-slate-500">Configure global AI behavior and model defaults.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-400 uppercase tracking-widest">Preferred Model</Label>
                  <Input defaultValue="Gemini 2.0 Flash" className="bg-slate-950 border-white/10" disabled />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-400 uppercase tracking-widest">Max Token Limit</Label>
                  <Input defaultValue="16,000" type="number" className="bg-slate-950 border-white/10" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-white/5">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-slate-200">Stream Responses</Label>
                  <p className="text-xs text-slate-500">Enable character-by-character UI updates.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/5 bg-slate-900/40">
            <CardHeader>
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Database className="h-5 w-5" />
                <CardTitle>Infrastructure Status</CardTitle>
              </div>
              <CardDescription className="text-slate-500">Cloudflare Workers & Bindings health check.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { name: "CHAT_AGENT (Durable Object)", status: "Connected", healthy: true },
                  { name: "APP_CONTROLLER (Durable Object)", status: "Connected", healthy: true },
                  { name: "R2_BUCKET (Assets)", status: "Provisioned", healthy: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-slate-950/50">
                    <span className="text-xs font-mono text-slate-300">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">{item.status}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                onClick={handleTestConnection} 
                disabled={isTesting}
                className="w-full border-white/10 hover:bg-white/5"
              >
                {isTesting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2 text-amber-400" />}
                Run Global Health Ping
              </Button>
            </CardContent>
          </Card>
          <Card className="border-white/5 bg-slate-950/40 border-dashed">
            <CardHeader>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Security & Keys</CardTitle>
              </div>
              <CardDescription>Secrets are managed via Cloudflare Dashboard Environment Variables.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 italic">Forge encryption layer active. Manual key entry disabled for security protocol compliance.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}