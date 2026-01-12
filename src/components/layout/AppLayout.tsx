import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useStore } from "@/lib/store";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  const currentProject = useStore((s) => s.currentProject);
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#020617] text-slate-50 selection:bg-sky-500/30">
        {/* Animated Background Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-900/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        </div>
        <AppSidebar />
        <SidebarInset className={`relative z-10 flex flex-col min-h-screen bg-transparent border-l border-white/5 ${className || ""}`}>
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-xl px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-400 hover:text-white" />
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-sky-400">PROJ:</span>
                <span className="text-sm font-medium tracking-tight text-slate-200">{currentProject}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle className="relative top-0 right-0" />
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 p-[1px]">
                <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-bold">AF</div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {container ? (
              <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 ${contentClassName || ""}`}>
                {children}
              </div>
            ) : (
              <div className={contentClassName}>{children}</div>
            )}
          </main>
          <footer className="py-4 px-6 border-t border-white/5 bg-slate-950/20 text-center">
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              AstroForge Engine v1.0.4 • AI Limit Notice: Shared capacity may apply.
            </p>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}