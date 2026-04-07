import React from "react";
import { Cpu, Wrench, ShieldCheck, Terminal, BarChart3, ExternalLink, ChevronRight } from "lucide-react";

const recoveredSystems = [
  {
    id: "brandforge",
    name: "BrandForge OS",
    designation: "SYS-BF-02",
    universeRole: "Campaign Command Platform",
    realRole: "Brand strategy, content deployment, and audience signal management for creators and operators",
    desc: "Recovered during Transmission 02. BrandForge maps signal distortion, identifies counterfeit amplification, and deploys corrective narratives. The first system Kage-9 brought back online — built for creators who refuse to be buried.",
    quote: "He opened the BrandForge console. The signal map lit up like a war room.",
    icon: Terminal,
    color: "text-blue-400",
    borderColor: "border-blue-400/30",
    url: "https://bf-os.com",
    urlLabel: "bf-os.com",
    episode: "Recovered in Transmission 02: Forge Protocol"
  },
  {
    id: "torqueshed",
    name: "TorqueShed",
    designation: "SYS-TS-03",
    universeRole: "Mechanical Intelligence Bay",
    realRole: "Forensic diagnostics, failure reconstruction, and mechanical system analysis for operators and technicians",
    desc: "Recovered during Transmission 03. TorqueShed reconstructs failure chains from raw field data, decodes stress patterns, and exposes sabotage hidden inside infrastructure. The second system Kage-9 pulled from the wreckage.",
    quote: "The torque archive reconstructed the failure map. Every fracture told a story.",
    icon: Wrench,
    color: "text-orange-500",
    borderColor: "border-orange-500/30",
    url: "https://TorqueShed.pro",
    urlLabel: "TorqueShed.pro",
    episode: "Recovered in Transmission 03: Fracture Scan"
  }
];

const extendedNetwork = [
  {
    id: "techdeck",
    name: "TechDeck",
    universeRole: "Operations Console",
    realRole: "IT oversight and infrastructure control",
    desc: "Command-layer support, diagnostics, and infrastructure monitoring. The backbone that keeps field operations running.",
    icon: Cpu,
    color: "text-purple-500",
    url: "https://techdeck.app",
    urlLabel: "TechDeck.app"
  },
  {
    id: "tradeflowkit",
    name: "TradeFlowKit",
    universeRole: "Commerce Operations",
    realRole: "Trade logistics and transaction intelligence",
    desc: "Supply chain mapping, flow optimization, and transaction intelligence for commerce operators.",
    icon: BarChart3,
    color: "text-green-500",
    url: "https://tradeflowkit.com",
    urlLabel: "TradeFlowKit.com"
  }
];

export default function Intel() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 border-b border-primary/30 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-2 glitch-text" data-text="FORGE INTEL">
            FORGE INTEL
          </h1>
          <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-lg">
            Systems recovered from the first operational cycle. Each one pulled from a mission. Each one operational.
          </p>
        </div>
        <ShieldCheck size={48} className="text-primary/20 hidden md:block" />
      </div>

      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-display text-white uppercase tracking-widest mb-1">
          Recovered Systems
        </h2>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Field-recovered during Transmissions 02 and 03
        </p>
      </div>

      <div className="space-y-6 mb-16">
        {recoveredSystems.map((sys) => {
          const Icon = sys.icon;
          return (
            <a
              key={sys.id}
              href={sys.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tactical-border bg-card p-6 md:p-8 group hover:border-primary transition-all relative overflow-hidden block"
            >
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className={`p-4 border ${sys.borderColor} bg-background flex-shrink-0 relative`}>
                  <div className={`absolute top-0 left-0 w-full h-1 bg-current opacity-50 ${sys.color}`} />
                  <Icon size={32} className={sys.color} />
                  <div className="mt-2 text-[9px] font-mono text-muted-foreground text-center uppercase tracking-widest">
                    {sys.designation}
                  </div>
                </div>

                <div className="flex-1 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-1">
                    <h3 className="text-3xl font-display text-white uppercase tracking-widest group-hover:text-primary transition-colors">
                      {sys.name}
                    </h3>
                    <span className="text-xs font-mono uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 border border-primary/20">
                      {sys.universeRole}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-muted-foreground mb-4">
                    {sys.realRole}
                  </p>

                  <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-4 max-w-3xl">
                    {sys.desc}
                  </p>

                  <div className="border-l-2 border-border pl-4 mb-5">
                    <p className="font-mono text-sm italic text-white/70">
                      "{sys.quote}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-1 border border-secondary/20">
                      {sys.episode}
                    </span>
                  </div>

                  <div className="mt-5 clip-diagonal bg-primary/20 border border-primary/40 text-primary px-5 py-2 font-display text-sm uppercase tracking-widest inline-flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                    Access System <ChevronRight size={16} />
                  </div>

                  <span className="ml-4 inline-flex items-center gap-1 text-secondary font-mono text-xs">
                    {sys.urlLabel} <ExternalLink size={12} />
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <div className="border-t border-border pt-10 mb-8">
        <h2 className="text-2xl md:text-3xl font-display text-muted-foreground uppercase tracking-widest mb-1">
          Extended Network
        </h2>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Additional systems connected to the tactical network
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {extendedNetwork.map((sys) => {
          const Icon = sys.icon;
          return (
            <a
              key={sys.id}
              href={sys.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-border bg-card/50 p-5 flex items-start gap-4 hover:border-primary/50 transition-all"
            >
              <Icon size={24} className={`${sys.color} flex-shrink-0 mt-0.5`} />
              <div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-1">
                  <h3 className="text-xl font-display text-white uppercase tracking-widest group-hover:text-primary transition-colors">
                    {sys.name}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">{sys.universeRole}</span>
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-2">{sys.realRole}</p>
                <p className="text-muted-foreground font-mono text-xs leading-relaxed mb-3">{sys.desc}</p>
                <span className="inline-flex items-center gap-1 text-secondary font-mono text-xs group-hover:text-white transition-colors">
                  {sys.urlLabel} <ExternalLink size={10} />
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <div className="tactical-border bg-card/50 p-6 md:p-8 text-center">
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
