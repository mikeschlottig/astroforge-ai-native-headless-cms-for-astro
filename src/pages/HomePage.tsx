import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Activity, 
  Database, 
  Cpu, 
  Globe, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
const MOCK_DATA = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 600 },
  { name: '12:00', value: 800 },
  { name: '16:00', value: 500 },
  { name: '20:00', value: 900 },
  { name: '23:59', value: 700 },
];
export function HomePage() {
  return (
    <AppLayout container>
      <div className="space-y-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 md:p-12 lg:p-16">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-sky-500/10 blur-[100px]" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1 text-xs font-medium text-sky-400">
              <Sparkles className="h-3 w-3" />
              AI Architect Active
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              The Bridge <br />
              <span className="text-slate-500">of AstroForge</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Monitor your content cosmos and orchestrate your Astro builds with the power of integrated AI intelligence.
            </p>
            <div className="flex gap-4">
              <button className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-400 hover:scale-105 active:scale-95">
                Quick Deploy
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all hover:bg-white/10">
                View Logs
              </button>
            </div>
          </div>
        </section>
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Nodes", value: "1,248", icon: Database, color: "text-sky-400", trend: "+12%" },
            { title: "AI Queries", value: "48.2k", icon: Cpu, color: "text-indigo-400", trend: "+5.4%" },
            { title: "Traffic", value: "852k", icon: Globe, color: "text-emerald-400", trend: "+18%" },
            { title: "Latency", value: "12ms", icon: Activity, color: "text-rose-400", trend: "-2ms" },
          ].map((stat, i) => (
            <Card key={i} className="border-white/5 bg-slate-900/40 backdrop-blur-sm overflow-hidden group">
              <CardContent className="p-6 relative">
                <div className={`absolute top-0 right-0 p-4 ${stat.color} opacity-20 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-12 w-12" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-500">{stat.title}</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center mb-1">
                      <ArrowUpRight className="h-3 w-3" /> {stat.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Activity Chart */}
        <Card className="border-white/5 bg-slate-900/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
            <CardTitle className="text-sm font-mono tracking-widest uppercase text-slate-400">System Activity (24h)</CardTitle>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-tighter">Live Monitor</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#0ea5e9' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors closeButton />
    </AppLayout>
  );
}