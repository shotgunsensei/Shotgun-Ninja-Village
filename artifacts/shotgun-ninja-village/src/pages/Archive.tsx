import { Link } from "wouter";
import React from "react";
import { PlayCircle, ChevronRight, Radio } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { transmissions } from "@/data/transmissions";
import { UniverseFooter } from "@workspace/sn-ecosystem";
import { markWatched, getWatched, getNextUnwatched } from "@/lib/watchProgress";
import { ShareButton } from "@/components/shared/ShareButton";
import { NextWaypoint } from "@/components/shared/NextWaypoint";
import { ExternalFunnel } from "@/components/shared/ExternalFunnel";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function Archive() {
  usePageMeta({ title: "Mission Archive", description: "All three animated episodes — watch them free, in order" });
  
  const watched = getWatched();
  const nextTx = getNextUnwatched(transmissions.map(t => t.num));
  const continueTx = nextTx ? transmissions.find(t => t.num === nextTx) : null;

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="container mx-auto px-4 py-12 max-w-6xl flex-1">
        <div className="mb-12 border-b border-primary/30 pb-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-secondary/30 bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-widest">
            <Radio size={14} /> Signal Archive
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-2 glitch-text" data-text="THE ARCHIVE">
            THE ARCHIVE
          </h1>
          <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 uppercase tracking-widest mb-2">
            Three operations. Three recovered signals. Watch in sequence.
          </p>
          <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-lg mb-6">
            All three animated episodes — watch them free, in order.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {continueTx && (
              <a
                href={continueTx.href}
                onClick={() => markWatched(continueTx.num)}
                className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-6 py-2 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2"
              >
                <PlayCircle size={18} /> Continue: Transmission {continueTx.num}
              </a>
            )}
            <ShareButton title="Watch the Shotgun Ninjas animated trilogy in the Mission Archive." />
          </div>
        </div>

        <div className="space-y-6">
          {transmissions.map((tx) => {
            const isWatched = watched.includes(tx.num);
            return (
            <a
              key={tx.num}
              href={tx.href}
              onClick={() => markWatched(tx.num)}
              className={`group tactical-border bg-card overflow-hidden flex flex-col md:flex-row transition-all hover:border-primary block ${isWatched ? 'border-primary/30' : ''}`}
            >
              <div className="w-full md:w-2/5 aspect-video relative overflow-hidden">
                <img
                  src={asset(tx.img)}
                  alt={tx.title}
                  className={`w-full h-full object-cover filter brightness-75 contrast-125 group-hover:scale-105 transition-transform duration-700 ${isWatched ? 'grayscale opacity-80' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur border border-primary/40 font-mono text-[10px] text-primary uppercase tracking-widest">
                  Transmission {tx.num}
                </div>
                {isWatched && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-primary/20 backdrop-blur border border-primary/40 font-mono text-[10px] text-white uppercase tracking-widest flex items-center gap-1.5">
                    <Radio size={10} /> Signal Received / Watched
                  </div>
                )}
              </div>

              <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-display text-white uppercase tracking-widest mb-3 group-hover:text-primary transition-colors">
                  {tx.title}
                </h2>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-3 max-w-xl">
                  {tx.brief}
                </p>
                <div className="border-l-2 border-border pl-3 mb-4">
                  <p className="font-mono text-sm italic text-white/70">"{tx.quote}"</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-1 border border-secondary/20">
                    {tx.system}
                  </span>
                  {tx.next && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {tx.next}
                    </span>
                  )}
                </div>
                <div className="clip-diagonal bg-primary/20 border border-primary/40 text-primary px-4 py-2 font-display text-sm uppercase tracking-widest inline-flex items-center gap-2 self-start group-hover:bg-primary group-hover:text-white transition-all">
                  <PlayCircle size={16} /> {isWatched ? "Rewatch Transmission" : "Watch Transmission"}
                </div>
              </div>
            </a>
          )})}
        </div>
      </div>
      
      <NextWaypoint waypoints={[
        { href: "/operators", title: "Operator Files", desc: "Read the dossiers of the operators involved." },
        { href: "/community", title: "The Village", desc: "Discuss the transmissions with the community." }
      ]} />
      
      <ExternalFunnel />

      <UniverseFooter LinkComponent={Link} exclude={["archive"]} />
    </div>
  );
}
