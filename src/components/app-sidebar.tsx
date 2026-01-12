import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Database,
  Settings,
  Sparkles,
  Zap,
  SquareArrowOutUpRight,
  Github,
  BookOpen,
  Cloud
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/" },
    { title: "Architect", icon: Bot, path: "/architect" },
    { title: "Cosmos", icon: Database, path: "/content" },
    { title: "Islands", icon: Zap, path: "/islands" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ];
  const resourceLinks = [
    { title: "Astro.build", url: "https://astro.build" },
    { title: "Islands Guide", url: "https://docs.astro.build/en/concepts/islands/" },
    { title: "Cloudflare Workers", url: "https://developers.cloudflare.com/workers/" },
  ];
  return (
    <Sidebar className="border-none bg-slate-950 text-slate-300">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg shadow-sky-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tighter text-white">ASTRO<span className="text-sky-400">FORGE</span></span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Operations
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  className={cn(
                    "h-10 px-3 transition-all duration-200 group relative",
                    location.pathname === item.path
                      ? "bg-sky-500/10 text-sky-400 ring-1 ring-inset ring-sky-500/20 shadow-[0_0_15px_-5px_rgba(56,189,248,0.3)]"
                      : "hover:bg-white/5 hover:text-slate-100"
                  )}
                >
                  <Link to={item.path}>
                    <item.icon className={cn("size-4", location.pathname === item.path ? "text-sky-400" : "text-slate-500 group-hover:text-slate-300")} />
                    <span className="font-medium text-sm">{item.title}</span>
                    {location.pathname === item.path && (
                      <div className="absolute right-2 h-1 w-1 rounded-full bg-sky-400" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Resources
          </SidebarGroupLabel>
          <SidebarMenu>
            {resourceLinks.map((link) => (
              <SidebarMenuItem key={link.url}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full h-9 px-3 text-xs font-medium text-slate-500 hover:text-sky-400 hover:bg-white/5 rounded-lg transition-all"
                >
                  <span>{link.title}</span>
                  <SquareArrowOutUpRight className="h-3 w-3 opacity-50" />
                </a>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Status
          </SidebarGroupLabel>
          <div className="space-y-4 px-3">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>R2 STORAGE</span>
                <span className="text-slate-200">2.4 GB</span>
              </div>
              <div className="h-1 w-full rounded-full bg-slate-800">
                <div className="h-full w-[45%] rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              </div>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6">
        <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Cloud className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-semibold text-slate-200">Cloud Status</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-tighter flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             Nodes Synchronized
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-[10px] text-slate-600 font-mono">v1.1.0-PROTO</span>
          <Github className="size-4 text-slate-600 hover:text-slate-400 cursor-pointer transition-colors" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}