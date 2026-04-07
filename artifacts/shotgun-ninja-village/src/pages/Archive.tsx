import React from "react";
import { PlayCircle, ExternalLink, ChevronRight, Radio } from "lucide-react";
import { transmissions } from "@/data/transmissions";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function Archive() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 border-b border-primary/30 pb-6 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-secondary/30 bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-widest">
          <Radio size={12} className="animate-pulse" />
          Trilogy One — Complete
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-2 glitch-text" data-text="MISSION ARCHIVE">
          MISSION ARCHIVE
        </h1>
        <p className="text-muted-foreground font-mono text-sm md:text-base border-l-2 border-primary pl-4 max-w-2xl">
          Recovered field transmissions from Kage-9's first operational cycle. Three missions. Three recovered systems. Watch in order.
        </p>
      </div>

      <div className="space-y-8">
        {transmissions.map((tx, i) => (
          <div key={tx.num} className="tactical-border bg-card p-1 md:p-2 transition-all hover:border-primary group">
            <div className="flex flex-col md:flex-row gap-0">
              <div className="w-full md:w-2/5 aspect-video relative overflow-hidden bg-muted">
                <img
                  src={asset(tx.img)}
                  alt={tx.title}
                  className="w-full h-full object-cover filter brightness-75 contrast-125 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/40" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur border border-primary/40 font-mono text-[10px] text-primary uppercase tracking-widest">
                  Transmission {tx.num}
                </div>
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-primary/90 text-white font-mono text-[10px] uppercase tracking-widest">
                  Decrypted
                </div>
              </div>

              <div className="w-full md:w-3/5 p-5 md:py-6 md:px-8 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-display text-white uppercase tracking-wider mb-3 group-hover:text-primary transition-colors">
                  {tx.title}
                </h2>

                <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-3">
                  {tx.brief}
                </p>

                <div className="border-l-2 border-border pl-3 mb-4">
                  <p className="font-mono text-sm italic text-white/70">"{tx.quote}"</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="text-xs font-mono uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-1 border border-secondary/20">
                    {tx.system}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={tx.href}
                    className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-6 py-2 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2"
                  >
                    <PlayCircle size={18} /> Watch Transmission
                  </a>

                  {tx.next && (
                    <span className="text-xs font-mono text-muted-foreground inline-flex items-center gap-1">
                      <ChevronRight size={12} /> {tx.next}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 tactical-border bg-card/50 p-6 md:p-8 text-center">
        <p className="font-mono text-sm text-muted-foreground mb-3">Full mission archive maintained at</p>
        <a
          href="https://shotgunninjas.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-secondary hover:text-white font-display text-2xl uppercase tracking-widest transition-colors"
        >
          ShotgunNinjas.com <ExternalLink size={20} />
        </a>
        <p className="font-mono text-xs text-muted-foreground mt-3">New transmissions, extended lore, and classified field reports</p>
      </div>
    </div>
  );
}
