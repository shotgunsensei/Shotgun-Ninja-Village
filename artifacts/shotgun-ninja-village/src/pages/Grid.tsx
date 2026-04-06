import React from "react";
import { MapPin, Skull } from "lucide-react";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function Grid() {
  const zones = [
    {
      id: "forge",
      name: "The Forge Grid",
      desc: "Industrial/digital zones where new tools, apps, systems, and modules are created or recovered.",
      img: asset("images/zone-forge.png")
    },
    {
      id: "noise",
      name: "The Noise Sectors",
      desc: "Areas flooded with manipulation, false signals, fraud platforms, surveillance haze, corrupted infrastructure.",
      img: asset("images/zone-noise.png")
    },
    {
      id: "archive",
      name: "The Archive Fractures",
      desc: "Lost or hidden nodes containing forgotten methods, blueprints, codebases, creative artifacts.",
      img: asset("images/zone-archive.png")
    },
    {
      id: "haven",
      name: "Operator Havens",
      desc: "Safehouses, labs, garages, studios, and command nodes where creators and operators rebuild.",
      img: asset("images/zone-haven.png")
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12 border-b border-primary/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-2 glitch-text" data-text="THE GRID MAP">
            THE GRID MAP
          </h1>
          <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 uppercase tracking-widest">
            Topological scan // Sector Analysis
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-1.5 text-primary font-mono text-xs">
          <MapPin size={14} className="animate-bounce" /> SIGNAL DETECTED
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {zones.map((zone) => (
          <div key={zone.id} className="group relative tactical-border bg-card overflow-hidden h-[300px] flex flex-col justify-end">
            <div className="absolute inset-0 z-0">
              <img src={zone.img} alt={zone.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
            
            <div className="relative z-10 p-6 border-l-4 border-transparent group-hover:border-primary transition-all">
              <h2 className="text-3xl font-display text-white uppercase tracking-widest mb-2 drop-shadow-md">
                {zone.name}
              </h2>
              <p className="text-muted-foreground font-mono text-sm max-w-md group-hover:text-white/90 transition-colors">
                {zone.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="tactical-border bg-card/50 p-6 md:p-8 backdrop-blur border-destructive/50">
        <div className="flex items-center gap-3 mb-6">
          <Skull className="text-destructive" size={24} />
          <h2 className="text-2xl font-display text-white uppercase tracking-widest">Threat Archetypes</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            "Corrupted Signal Brokers",
            "Data Smugglers",
            "System Parasites",
            "Counterfeit Creators",
            "Infrastructure Hunters"
          ].map((threat, i) => (
            <div key={i} className="bg-background border border-border p-4 hover:border-destructive transition-colors group">
              <div className="text-destructive font-mono text-xs mb-2 opacity-50 group-hover:opacity-100">CLASS {i+1}</div>
              <div className="font-display text-lg uppercase text-white tracking-wider">{threat}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
