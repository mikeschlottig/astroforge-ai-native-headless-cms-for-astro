import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
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
  Zap,
  ArrowUpRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
const MOCK_DATA = [
  { name: '00:00', islands: 120, queries: 400 },
  { name: '04:00', islands: 150, queries: 300 },
  { name: '08:00', islands: 300, queries: 600 },
  { name: '12:00', islands: 450, queries: 800 },
  { name: '16:00', islands: 380, queries: 500 },
  { name: '20:00', islands: 520, queries: 900 },
  { name: '23:59', islands: 480, queries: 700 },
];
export function HomePage() {
  return (
    <AppLayout container>
      <div className="space-y-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 md:p-12 lg:p-16">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-sky-500/10 blur-[100px]" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1 text-xs font-medium text-sky-400">
              <Sparkles className="h-3 w-3" />
              New Protocol: Islands v1.1
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              The Forge <br />
              <span className="text-slate-500">Dashboard</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Monitor your content cosmos and orchestrate your Astro hydration strategies with integrated AI intelligence.
            </p>
            <div className="flex gap-4">
              <Link to="/islands" className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-400 hover:scale-105 active:scale-95 flex items-center gap-2">
                Explore Islands
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/content" className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all hover:bg-white/10">
                Manage Cosmos
              </Link>
            </div>
          </div>
        </section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Active Islands", value: "482", icon: Zap, color: "text-amber-400", trend: "+24 today" },
            { title: "AI Queries", value: "48.2k", icon: Cpu, color: "text-sky-400", trend: "+5.4%" },
            { title: "Cosmos Nodes", value: "1.2k", icon: Database, color: "text-indigo-400", trend: "+12%" },
            { title: "Hydration Rate", value: "98.4%", icon: Activity, color: "text-emerald-400", trend: "Optimal" },
          ].map((stat, i) => (
            <Card key={i} className="border-white/5 bg-slate-900/40 backdrop-blur-sm group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-slate-800/50 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> {stat.trend}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-white/5 bg-slate-900/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
            <CardTitle className="text-sm font-mono tracking-widest uppercase text-slate-400">Activity: Islands & AI</CardTitle>
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
                    <linearGradient id="colorIslands" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="islands" stroke="#f59e0b" fill="url(#colorIslands)" strokeWidth={2} />
                  <Area type="monotone" dataKey="queries" stroke="#0ea5e9" fill="url(#colorQueries)" strokeWidth={2} />
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