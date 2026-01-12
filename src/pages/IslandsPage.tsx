import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Zap, Search, ShoppingCart, MessageSquare, Cpu, Layers, Sparkles } from 'lucide-react';
const ISLAND_DEMOS = [
  {
    title: "Global Search",
    strategy: "client:load",
    description: "Hydrates as soon as the page loads. Ideal for critical UI elements.",
    icon: Search,
    color: "text-sky-400"
  },
  {
    title: "Interactive Cart",
    strategy: "client:visible",
    description: "Only hydrates once the component enters the viewport. Great for performance.",
    icon: ShoppingCart,
    color: "text-indigo-400"
  },
  {
    title: "Support Chat",
    strategy: "client:idle",
    description: "Hydrates during browser idle time to avoid blocking the main thread.",
    icon: MessageSquare,
    color: "text-emerald-400"
  }
];
export function IslandsPage() {
  return (
    <AppLayout container>
      <div className="space-y-12">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-400">
            <Zap className="h-3 w-3" />
            Island Architecture Explorer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Astro <span className="text-slate-500">Islands</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            Welcome to the Island Protocol. Here we orchestrate how individual components hydrate within a static ocean of HTML.
          </p>
        </header>
        <section className="grid gap-6 md:grid-cols-3">
          {ISLAND_DEMOS.map((island, i) => (
            <motion.div
              key={island.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-white/5 bg-slate-900/40 backdrop-blur-sm group hover:border-sky-500/30 transition-all">
                <CardHeader className="pb-2">
                  <div className={`p-2 rounded-lg bg-slate-800 w-fit mb-4 group-hover:bg-sky-500 group-hover:text-white transition-all ${island.color}`}>
                    <island.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-white flex items-center justify-between">
                    {island.title}
                    <Badge variant="outline" className="font-mono text-[10px] border-white/10 text-slate-400">
                      {island.strategy}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {island.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>
        <section className="rounded-3xl border border-white/5 bg-slate-950/50 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px]" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <Cpu className="h-6 w-6 text-sky-400" />
                Hydration Lifecycle
              </h2>
              <div className="space-y-4">
                {[
                  { step: "01", label: "Static HTML Delivery", desc: "Pure HTML arrives in the browser instantly." },
                  { step: "02", label: "Island Discovery", desc: "Astro's tiny client runtime finds component boundaries." },
                  { step: "03", label: "Deferred Loading", desc: "JS payloads are fetched only when directives are met." },
                  { step: "04", label: "Hydration", desc: "React/Vue/Svelte islands become interactive." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <span className="text-xs font-mono text-sky-500 pt-1">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 group-hover:text-sky-400 transition-colors">{item.label}</h4>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900/80 rounded-2xl border border-white/5 p-6 font-mono text-xs text-sky-300">
              <div className="flex items-center gap-2 mb-4 text-slate-500">
                <Layers className="h-4 w-4" />
                <span>component-preview.astro</span>
              </div>
              <pre className="overflow-x-auto">
                {`---
import Search from './Search.tsx';
---
<header>
  <!-- Hydrates immediately -->
  <Search client:load /> 
</header>
<main>
  <!-- Hydrates when visible -->
  <HeavyGallery client:visible />
</main>`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}