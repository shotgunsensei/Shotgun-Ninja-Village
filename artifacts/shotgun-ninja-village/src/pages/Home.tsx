import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, PlayCircle, Archive, UserSquare, Map, Crosshair, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

function AnimatedTagline() {
  const text = "In a fractured near-future where truth is manipulated, systems are corrupted, and creators are exploited... tools decide who survives.";
  const [displayedChars, setDisplayedChars] = useState(0);

  useEffect(() => {
    if (displayedChars >= text.length) return;
    const timeout = setTimeout(() => setDisplayedChars((c) => c + 1), 18);
    return () => clearTimeout(timeout);
  }, [displayedChars, text.length]);

  return (
    <p className="text-lg md:text-xl text-muted-foreground font-mono max-w-2xl mx-auto mb-8 border-l-2 border-primary pl-4 text-left">
      {text.slice(0, displayedChars)}
      {displayedChars < text.length && <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-0.5 align-middle" />}
    </p>
  );
}

export default function Home() {
  const sections = [
    { title: "Archive", desc: "Episode logs", link: "/archive", icon: Archive },
    { title: "Operator Files", desc: "Kage-9 dossier", link: "/operators", icon: UserSquare },
    { title: "Grid Map", desc: "World sectors", link: "/grid", icon: Map },
    { title: "Arsenal", desc: "Gear loadout", link: "/arsenal", icon: Crosshair },
    { title: "Forge Intel", desc: "Tactical systems", link: "/intel", icon: ShieldCheck },
  ];

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col">
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
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white uppercase tracking-tighter mb-4 drop-shadow-lg glitch-text"
            data-text="THE SIGNAL FEED"
          >
            THE SIGNAL FEED
          </h1>
          <AnimatedTagline />
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/archive"
              className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-8 py-3 font-display text-xl uppercase tracking-widest transition-all inline-flex items-center gap-2"
            >
              Access Archive <ChevronRight size={20} />
            </Link>
            <Link
              href="/operators"
              className="clip-diagonal border border-primary/50 hover:bg-primary/10 text-primary px-8 py-3 font-display text-xl uppercase tracking-widest transition-all inline-flex items-center gap-2 bg-background/50 backdrop-blur"
            >
              View Intel <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
            <h2 className="text-3xl font-display text-white uppercase tracking-widest">Now Playing</h2>
            <span className="text-xs font-mono text-primary uppercase animate-pulse">Live Signal</span>
          </div>

          <a
            href="/shotgun-ninjas-ep1/"
            className="group tactical-border bg-card overflow-hidden flex flex-col md:flex-row transition-all hover:border-primary"
          >
            <div className="w-full md:w-2/5 aspect-video relative overflow-hidden">
              <img
                src={asset("images/ep1.png")}
                alt="Episode 1: The Signal in the Static"
                className="w-full h-full object-cover filter brightness-75 contrast-125 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60" />
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-primary/90 text-white font-mono text-[10px] uppercase tracking-widest">
                Now Playing
              </div>
            </div>
            <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                Episode 01
              </div>
              <h3 className="text-3xl md:text-4xl font-display text-white uppercase tracking-widest mb-3 group-hover:text-primary transition-colors">
                The Signal in the Static
              </h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-4 max-w-xl">
                A fractured city drowns in manipulated signals. Kage-9 traces an impossible signal through the ruins
                of a collapsed archive sector and discovers evidence that the old protection network was intentionally
                dismantled.
              </p>
              <div className="clip-diagonal bg-primary/20 border border-primary/40 text-primary px-4 py-2 font-display text-sm uppercase tracking-widest inline-flex items-center gap-2 self-start group-hover:bg-primary group-hover:text-white transition-all">
                <PlayCircle size={16} /> Initialize Playback
              </div>
            </div>
          </a>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
            <h2 className="text-3xl font-display text-white uppercase tracking-widest">Command Nodes</h2>
            <span className="text-xs font-mono text-muted-foreground uppercase">All Sectors</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.link}
                  href={section.link}
                  className="group tactical-border bg-card p-5 flex flex-col items-center text-center transition-all hover:border-primary hover:bg-primary/5"
                >
                  <Icon size={28} className="text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                  <h3 className="font-display text-lg text-white uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-[11px] font-mono text-muted-foreground">{section.desc}</p>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
        </motion.div>
      </section>
    </div>
  );
}

function Card({ title, desc, link, img }: { title: string; desc: string; link: string; img: string }) {
  return (
    <Link
      href={link}
      className="group relative block tactical-border bg-card overflow-hidden transition-all hover:border-primary"
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
      <div className="aspect-video w-full overflow-hidden border-b border-border relative">
        <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors z-10" />
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
        />
      </div>
      <div className="p-5 relative z-20">
        <h3 className="text-2xl font-display text-white uppercase tracking-widest mb-2 group-hover:text-primary transition-colors flex items-center justify-between">
          {title}
          <ChevronRight
            size={20}
            className="text-primary opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all"
          />
        </h3>
        <p className="text-sm font-mono text-muted-foreground line-clamp-2">{desc}</p>
      </div>
    </Link>
  );
}
