import React from "react";
import { Cpu, Wrench, ShieldCheck, Terminal, BarChart3, ExternalLink } from "lucide-react";

export default function Intel() {
  const products = [
    {
      id: "brandforge",
      name: "BrandForge OS",
      role: "Campaign Command Platform",
      desc: "Build influence architecture, launch narratives, deploy market signals, weaponize visibility for creators.",
      quote: "He opened the BrandForge console. The signal map lit up like a war room.",
      icon: Terminal,
      color: "text-blue-400",
      url: "https://bf-os.com",
      urlLabel: "bf-os.com",
      episode: "Featured in EP2: Forge Protocol"
    },
    {
      id: "torqueshed",
      name: "TorqueShed",
      role: "Mechanical Intelligence Bay",
      desc: "Diagnose machine failures, decode stress patterns, reconstruct failure chains from field data. Forensic-grade mechanical analysis.",
      quote: "The torque archive reconstructed the failure map. Every fracture told a story.",
      icon: Wrench,
      color: "text-orange-500",
      url: "https://TorqueShed.pro",
      urlLabel: "TorqueShed.pro",
      episode: "Featured in EP3: Fracture Scan"
    },
    {
      id: "techdeck",
      name: "TechDeck",
      role: "Operations Console",
      desc: "IT oversight, infrastructure control, diagnostics, command-layer support. The backbone of every field operation.",
      quote: "TechDeck lit up the command wall. Every node, every route, every risk — visible.",
      icon: Cpu,
      color: "text-purple-500",
      url: "https://techdeck.app",
      urlLabel: "TechDeck.app",
      episode: "Core infrastructure platform"
    },
    {
      id: "tradeflowkit",
      name: "TradeFlowKit",
      role: "Commerce Operations Platform",
      desc: "Trade logistics, supply chain mapping, transaction intelligence, and flow optimization for commerce operators.",
      quote: "The trade routes were compromised. TradeFlowKit mapped the deviation in seconds.",
      icon: BarChart3,
      color: "text-green-500",
      url: "https://tradeflowkit.com",
      urlLabel: "TradeFlowKit.com",
      episode: "Commerce intelligence system"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 border-b border-primary/30 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-2 glitch-text" data-text="FORGE INTEL">
            FORGE INTEL
          </h1>
          <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 uppercase tracking-widest">
            Tactical Systems // Production Platforms
          </p>
        </div>
        <ShieldCheck size={48} className="text-primary/20 hidden md:block" />
      </div>

      <div className="space-y-6">
        {products.map((prod) => {
          const Icon = prod.icon;
          return (
            <a
              key={prod.id}
              href={prod.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tactical-border bg-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start group hover:border-primary transition-all relative overflow-hidden block cursor-pointer"
            >
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-4 border border-border bg-background flex-shrink-0 relative">
                <div className={`absolute top-0 left-0 w-full h-1 bg-current opacity-50 ${prod.color}`} />
                <Icon size={32} className={prod.color} />
              </div>
              
              <div className="flex-1 relative z-10">
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
                  <h2 className="text-3xl font-display text-white uppercase tracking-widest group-hover:text-primary transition-colors">
                    {prod.name}
                  </h2>
                  <span className="text-xs font-mono uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 border border-primary/20">
                    {prod.role}
                  </span>
                </div>
                
                <p className="text-muted-foreground font-mono text-sm mb-4 max-w-3xl leading-relaxed">
                  {prod.desc}
                </p>
                
                <div className="border-l-2 border-border pl-4 mt-4 mb-4">
                  <p className="font-mono text-sm italic text-white/70">
                    "{prod.quote}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="inline-flex items-center gap-2 text-secondary font-mono text-sm group-hover:text-white transition-colors">
                    {prod.urlLabel} <ExternalLink size={14} />
                  </span>
                  <span className="text-xs font-mono text-muted-foreground border-l border-border pl-4">
                    {prod.episode}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-16 tactical-border bg-card/50 p-6 md:p-8 text-center">
        <p className="font-mono text-sm text-muted-foreground mb-4">All systems connected to the Shotgun Ninjas tactical network</p>
        <a
          href="https://shotgunninjas.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-secondary hover:text-white font-display text-2xl uppercase tracking-widest transition-colors"
        >
          ShotgunNinjas.com <ExternalLink size={20} />
        </a>
        <p className="font-mono text-xs text-muted-foreground mt-3">Universe hub — episodes, lore, operator intel, and platform access</p>
      </div>
    </div>
  );
}
