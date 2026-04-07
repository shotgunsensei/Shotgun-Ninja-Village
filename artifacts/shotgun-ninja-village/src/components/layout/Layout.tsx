import React from "react";
import { Link, useLocation } from "wouter";
import { Shield, Database, UserSquare, Map, Sword, Cpu, Menu, X, ExternalLink, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const { canInstall, install } = useInstallPrompt();

  const links = [
    { href: "/", label: "Signal Feed", icon: Shield },
    { href: "/archive", label: "Archive", icon: Database },
    { href: "/operators", label: "Operator Files", icon: UserSquare },
    { href: "/grid", label: "The Grid Map", icon: Map },
    { href: "/arsenal", label: "Arsenal", icon: Sword },
    { href: "/intel", label: "Forge Intel", icon: Cpu },
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col md:flex-row relative">
      <div className="fixed inset-0 scanlines z-50 pointer-events-none mix-blend-overlay opacity-30" />
      
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/90 backdrop-blur z-40 sticky top-0">
        <Link href="/" className="font-display text-2xl text-primary tracking-wider uppercase font-bold">
          SN_Command
        </Link>
        <div className="flex items-center gap-2">
          {canInstall && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 border border-primary/40 text-primary font-mono text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              <Download size={14} /> Install
            </button>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-primary">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-[100dvh] w-64 border-r border-border bg-background/95 backdrop-blur z-40 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="block">
            <h1 className="text-3xl font-bold font-display text-primary tracking-widest uppercase glitch-text" data-text="SHOTGUN_NINJAS">
              SHOTGUN_NINJAS
            </h1>
            <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-wider">
              SYS.CMD.NEXUS // ONLINE
            </p>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-none font-display text-xl uppercase tracking-wider transition-all border-l-2",
                  isActive 
                    ? "bg-primary/10 text-primary border-primary" 
                    : "text-muted-foreground border-transparent hover:bg-white/5 hover:text-foreground hover:border-white/20"
                )}
              >
                <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border/50 space-y-3">
          {canInstall && (
            <button
              onClick={install}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/20 border border-primary/40 text-primary font-mono text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              <Download size={14} /> Install App
            </button>
          )}
          <a
            href="https://shotgunninjas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-secondary hover:text-white transition-colors"
          >
            <ExternalLink size={12} /> ShotgunNinjas.com
          </a>
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>STATUS: SECURE</span>
            <span className="text-secondary animate-pulse">●</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 relative overflow-x-hidden min-h-[100dvh]">
        {children}
      </main>
    </div>
  );
}
