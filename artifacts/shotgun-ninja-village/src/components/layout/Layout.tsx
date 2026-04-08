import React from "react";
import { Link, useLocation } from "wouter";
import { Shield, Database, UserSquare, Map, Sword, Cpu, Menu, X, Download, Globe, Users, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

const coreLinks = [
  { href: "/", label: "Signal Feed", icon: Shield },
  { href: "/archive", label: "Archive", icon: Database },
  { href: "/operators", label: "Operator Files", icon: UserSquare },
  { href: "/grid", label: "The Grid Map", icon: Map },
  { href: "/arsenal", label: "Arsenal", icon: Sword },
  { href: "/intel", label: "Forge Intel", icon: Cpu },
];

const hubLinks = [
  { href: "/community", label: "The Village", icon: Users },
  { href: "/merch", label: "Ronin Supply", icon: ShoppingBag },
];

function NavLink({ href, label, icon: Icon, isActive, onClick }: {
  href: string; label: string; icon: React.ElementType; isActive: boolean; onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 font-display text-lg uppercase tracking-wider transition-all border-l-2",
        isActive
          ? "bg-primary/10 text-primary border-primary"
          : "text-muted-foreground border-transparent hover:bg-white/5 hover:text-foreground hover:border-white/20"
      )}
    >
      <Icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
      {label}
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const { canInstall, install } = useInstallPrompt();
  const close = () => setIsOpen(false);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col md:flex-row relative">
      <div className="fixed inset-0 scanlines z-50 pointer-events-none mix-blend-overlay opacity-30" />

      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background/90 backdrop-blur z-40 sticky top-0">
        <Link href="/" className="font-display text-xl text-primary tracking-wider uppercase font-bold">
          SN_Command
        </Link>
        <div className="flex items-center gap-1.5">
          {canInstall && (
            <button
              onClick={install}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-primary/20 border border-primary/40 text-primary font-mono text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              <Download size={12} /> Install
            </button>
          )}
          <a
            href="https://shotgunninjas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-secondary hover:text-white transition-colors"
            aria-label="Main Site"
          >
            <Globe size={18} />
          </a>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-primary" aria-label="Toggle menu">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={close}
          aria-hidden
        />
      )}

      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-[100dvh] w-60 border-r border-border bg-background/95 backdrop-blur z-40 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 border-b border-border/50">
          <Link href="/" onClick={close} className="block">
            <h1 className="text-2xl font-bold font-display text-primary tracking-widest uppercase glitch-text" data-text="SHOTGUN_NINJAS">
              SHOTGUN_NINJAS
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5 uppercase tracking-wider">
              SYS.CMD.NEXUS // ONLINE
            </p>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {coreLinks.map((link) => (
            <NavLink key={link.href} {...link} isActive={location === link.href} onClick={close} />
          ))}

          <div className="pt-2 mt-2 border-t border-border/30 space-y-0.5">
            {hubLinks.map((link) => (
              <NavLink key={link.href} {...link} isActive={location === link.href} onClick={close} />
            ))}
          </div>

          <div className="pt-2 mt-2 border-t border-border/30">
            <a
              href="https://shotgunninjas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 font-display text-lg uppercase tracking-wider transition-all border-l-2 text-secondary border-transparent hover:bg-white/5 hover:text-white hover:border-secondary/40"
            >
              <Globe size={16} className="text-secondary" />
              Main Site
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-border/50 space-y-2.5">
          {canInstall && (
            <button
              onClick={install}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary/20 border border-primary/40 text-primary font-mono text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              <Download size={12} /> Install App
            </button>
          )}
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
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
