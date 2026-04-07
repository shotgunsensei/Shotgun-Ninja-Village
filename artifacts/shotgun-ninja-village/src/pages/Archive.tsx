import React from "react";
import { PlayCircle, ExternalLink } from "lucide-react";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function Archive() {
  const episodes = [
    {
      id: "ep1",
      num: "01",
      title: "The Signal in the Static",
      status: "NOW PLAYING",
      synopsis: "A fractured city drowns in manipulated signals. Kage-9 traces an impossible signal through the ruins of a collapsed archive sector and discovers evidence that the old protection network was intentionally dismantled.",
      img: asset("images/ep1.png"),
      href: "/shotgun-ninjas-ep1/",
      active: true
    },
    {
      id: "ep2",
      num: "02",
      title: "Forge Protocol",
      status: "NOW PLAYING",
      synopsis: "Independent creators are being buried under algorithmic suppression. Kage-9 infiltrates a signal distortion hub and deploys BrandForge OS — a recovered command platform — to restore signal integrity and reclaim stolen visibility.",
      img: asset("images/ep2.png"),
      href: "/shotgun-ninjas-ep2/",
      active: true
    },
    {
      id: "ep3",
      num: "03",
      title: "Fracture Scan",
      status: "NOW PLAYING",
      synopsis: "A transport unit carrying critical archive materials fails in a dead industrial zone. Kage-9 discovers TorqueShed — a forensic mechanical intelligence console — and exposes a sabotage pattern threatening the entire infrastructure network.",
      img: asset("images/ep3.png"),
      href: "/shotgun-ninjas-ep3/",
      active: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 border-b border-primary/30 pb-6 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-2 glitch-text" data-text="THE ARCHIVE">
          THE ARCHIVE
        </h1>
        <p className="text-muted-foreground font-mono text-sm md:text-base border-l-2 border-primary pl-4 max-w-2xl">
          Recovered visual logs. Decrypted operational records.
        </p>
      </div>

      <div className="space-y-8">
        {episodes.map((ep) => (
          <div key={ep.id} className="tactical-border bg-card p-1 md:p-2 transition-all hover:border-primary">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-2/5 aspect-video relative overflow-hidden bg-muted">
                {ep.img && <img src={ep.img} alt={ep.title} className="w-full h-full object-cover filter brightness-75 contrast-125" />}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-background/80 backdrop-blur border border-white/10 font-mono text-xs text-white">
                  EP_{ep.num}
                </div>
              </div>
              <div className="w-full md:w-3/5 p-4 md:py-6 md:pr-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest border bg-primary/20 border-primary text-primary">
                    {ep.status}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display text-white uppercase tracking-wider mb-4">
                  {ep.title}
                </h2>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-6">
                  {ep.synopsis}
                </p>
                
                <a href={ep.href} className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-6 py-2 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2 self-start">
                  <PlayCircle size={18} /> Initialize Playback
                </a>
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
        <p className="font-mono text-xs text-muted-foreground mt-3">New episodes, extended lore, and classified field reports</p>
      </div>
    </div>
  );
}
