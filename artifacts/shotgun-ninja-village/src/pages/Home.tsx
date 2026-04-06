import React from "react";
import { Link } from "wouter";
import { ChevronRight, ShieldAlert, Activity } from "lucide-react";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function Home() {
  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 z-0">
          <img 
            src={asset("images/hero.png")} 
            alt="Command Center Hero" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>

        <div className="relative z-10 container px-4 md:px-6 mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-secondary/30 bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-widest backdrop-blur-sm">
            <Activity size={14} className="animate-pulse" />
            Signal Intercepted
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white uppercase tracking-tighter mb-4 drop-shadow-lg glitch-text" data-text="THE SIGNAL FEED">
            THE SIGNAL FEED
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-mono max-w-2xl mx-auto mb-8 border-l-2 border-primary pl-4 text-left">
            In a fractured near-future where truth is manipulated, systems are corrupted, and creators are exploited... tools decide who survives.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/archive" className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-8 py-3 font-display text-xl uppercase tracking-widest transition-all inline-flex items-center gap-2">
              Access Archive <ChevronRight size={20} />
            </Link>
            <Link href="/operators" className="clip-diagonal border border-primary/50 hover:bg-primary/10 text-primary px-8 py-3 font-display text-xl uppercase tracking-widest transition-all inline-flex items-center gap-2 bg-background/50 backdrop-blur">
              View Intel <ShieldAlert size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Intel Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <h2 className="text-3xl font-display text-white uppercase tracking-widest">Priority Nodes</h2>
          <span className="text-xs font-mono text-muted-foreground uppercase">Classified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            title="The Operator" 
            desc="Dossier: Hayaku Kageru (Kage-9). Systems warrior, precision builder, covert guardian." 
            link="/operators" 
            img={asset("images/kage-9.png")}
          />
          <Card 
            title="The Forge Grid" 
            desc="Industrial digital zones where new tools and systems are created or recovered." 
            link="/grid" 
            img={asset("images/zone-forge.png")}
          />
          <Card 
            title="Arsenal Specs" 
            desc="Triple-threat loadout. Secure tactical mounts, engineered precision." 
            link="/arsenal" 
            img={asset("images/gear-shotgun-back.png")}
          />
        </div>
      </section>
    </div>
  );
}

function Card({ title, desc, link, img }: { title: string, desc: string, link: string, img: string }) {
  return (
    <Link href={link} className="group relative block tactical-border bg-card overflow-hidden transition-all hover:border-primary">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
      <div className="aspect-video w-full overflow-hidden border-b border-border relative">
        <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors z-10" />
        <img src={img} alt={title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" />
      </div>
      <div className="p-5 relative z-20">
        <h3 className="text-2xl font-display text-white uppercase tracking-widest mb-2 group-hover:text-primary transition-colors flex items-center justify-between">
          {title}
          <ChevronRight size={20} className="text-primary opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all" />
        </h3>
        <p className="text-sm font-mono text-muted-foreground line-clamp-2">
          {desc}
        </p>
      </div>
    </Link>
  );
}
