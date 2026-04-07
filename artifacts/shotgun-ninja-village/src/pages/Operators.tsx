import React from "react";
import { UserSquare, Target, Activity } from "lucide-react";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function Operators() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 border-b border-primary/30 pb-6">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-2 glitch-text" data-text="OPERATOR FILES">
          OPERATOR FILES
        </h1>
        <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 uppercase tracking-widest">
          Classified Dossier // Clearance Level 9
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Image Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="tactical-border bg-card p-2 relative overflow-hidden">
            <div className="absolute top-2 right-2 flex items-center gap-2 z-20 bg-background/80 px-2 py-1 font-mono text-[10px] text-secondary border border-secondary/30">
              <Activity size={12} className="animate-pulse" /> LIVE
            </div>
            <div className="aspect-[3/4] relative bg-muted flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
              <img src={asset("images/kage-9-operator.png")} alt="Kage-9" className="w-full h-full object-cover object-top relative z-10 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
              <div className="absolute inset-0 scanlines z-20" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div className="border border-border bg-card p-3">
              <span className="text-muted-foreground block mb-1">STATUS</span>
              <span className="text-secondary">ACTIVE</span>
            </div>
            <div className="border border-border bg-card p-3">
              <span className="text-muted-foreground block mb-1">CALLSIGN</span>
              <span className="text-white">KAGE-9</span>
            </div>
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="tactical-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <UserSquare size={24} className="text-primary" />
              <h2 className="text-3xl font-display text-white uppercase tracking-widest">Hayaku Kageru</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-mono text-primary mb-2 uppercase">Role</h3>
                  <p className="text-white font-mono text-sm">Systems warrior, precision builder, covert guardian, field tactician</p>
                </div>
                <div>
                  <h3 className="text-sm font-mono text-primary mb-2 uppercase">Tactical Designations</h3>
                  <ul className="text-white font-mono text-sm space-y-1 list-disc list-inside pl-4">
                    <li>Signal Hunter</li>
                    <li>Archive Ghost</li>
                    <li>Last Blade of a Broken Network</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-mono text-primary mb-2 uppercase">Personality</h3>
                  <p className="text-muted-foreground font-mono text-sm">Calm under pressure, highly observant, speaks with precision, protective of skilled people, quiet disdain for frauds.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-mono text-primary mb-2 uppercase">Physical Specs</h3>
                  <p className="text-muted-foreground font-mono text-sm">Tan skin, brown short textured hair with blonde-highlighted tips, glowing blue eyes, athletic agile build.</p>
                </div>
                <div>
                  <h3 className="text-sm font-mono text-primary mb-2 uppercase">Gear Loadout</h3>
                  <ul className="text-white font-mono text-sm space-y-2">
                    <li className="flex items-start gap-2"><Target size={14} className="text-secondary mt-0.5 shrink-0" /> Red cybernetic ninja armor with black/gunmetal support layers</li>
                    <li className="flex items-start gap-2"><Target size={14} className="text-secondary mt-0.5 shrink-0" /> Armored cyber headphones</li>
                    <li className="flex items-start gap-2"><Target size={14} className="text-secondary mt-0.5 shrink-0" /> Back-mounted shotgun</li>
                    <li className="flex items-start gap-2"><Target size={14} className="text-secondary mt-0.5 shrink-0" /> Hip quickdraw shotgun</li>
                    <li className="flex items-start gap-2"><Target size={14} className="text-secondary mt-0.5 shrink-0" /> Energy katana</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-mono text-primary mb-3 uppercase">Origin Record</h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-6">
                Emerged from the collapse of a network that protected creative/technical knowledge systems. Survived because he learned how systems fail. Now recovers and reforges systems one mission at a time.
              </p>
              
              <div className="bg-muted/50 border-l-2 border-secondary p-4 font-mono text-sm italic text-white/90">
                <p className="mb-2">"Noise spreads fastest where no one checks the signal."</p>
                <p className="mb-2">"Tools decide who survives collapse."</p>
                <p>"Truth leaves a pattern. I just know where to look."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
