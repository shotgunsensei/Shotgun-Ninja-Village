import React from "react";
import { Cpu, Lock, Wrench, ShieldCheck, Terminal } from "lucide-react";

export default function Intel() {
  const products = [
    {
      id: "brandforge",
      name: "BrandForge OS",
      role: "Campaign Command Platform",
      desc: "Build influence architecture, launch narratives, deploy market signals, weaponize visibility for creators.",
      quote: "He opened the BrandForge console.",
      icon: Terminal,
      color: "text-blue-400"
    },
    {
      id: "torqueshed",
      name: "TorqueShed",
      role: "Mechanical Intelligence Bay",
      desc: "Diagnose machine failures, decode stress patterns, reconstruct failure chains from field data.",
      quote: "The torque archive reconstructed the failure map.",
      icon: Wrench,
      color: "text-orange-500"
    },
    {
      id: "techdeck",
      name: "TechDeck",
      role: "Operations Console",
      desc: "IT oversight, infrastructure control, diagnostics, command-layer support.",
      quote: "TechDeck lit up the command wall.",
      icon: Cpu,
      color: "text-purple-500"
    },
    {
      id: "snapproof",
      name: "Snapproof OS",
      role: "Evidence Lock Platform",
      desc: "Capture, protect, verify, and transfer critical records in hostile environments.",
      quote: "The package was locked through Snapproof protocol.",
      icon: Lock,
      color: "text-green-500"
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
            <div key={prod.id} className="tactical-border bg-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start group hover:bg-card/80 transition-colors relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={`p-4 border border-border bg-background flex-shrink-0 relative`}>
                <div className={`absolute top-0 left-0 w-full h-1 bg-current opacity-50 ${prod.color}`} />
                <Icon size={32} className={prod.color} />
              </div>
              
              <div className="flex-1 relative z-10">
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
                  <h2 className="text-3xl font-display text-white uppercase tracking-widest">
                    {prod.name}
                  </h2>
                  <span className="text-xs font-mono uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 border border-primary/20">
                    {prod.role}
                  </span>
                </div>
                
                <p className="text-muted-foreground font-mono text-sm mb-4 max-w-3xl leading-relaxed">
                  {prod.desc}
                </p>
                
                <div className="border-l-2 border-border pl-4 mt-6">
                  <p className="font-mono text-sm italic text-white/70">
                    "{prod.quote}"
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
