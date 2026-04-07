import React from "react";
import { Crosshair } from "lucide-react";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function Arsenal() {
  const gear = [
    {
      id: "shotgun-back",
      name: "Back-Mounted Shotgun",
      type: "Heavy Ordnance",
      desc: "Secure tactical mount. Balanced silhouette. Heavy ordnance for sustained engagements.",
      img: asset("images/gear-shotgun-back.png")
    },
    {
      id: "shotgun-hip",
      name: "Hip Quickdraw Shotgun",
      type: "Tactical Response",
      desc: "Quickdraw swivel mechanism. Immediate deployment. Mechanical precision at close range.",
      img: asset("images/gear-shotgun-hip.png")
    },
    {
      id: "katana",
      name: "Energy Katana",
      type: "Precision Blade",
      desc: "Engineered precision blade. Mounted opposite the hip shotgun. Not medieval — mechanical.",
      img: asset("images/gear-katana.png")
    },
    {
      id: "headphones",
      name: "Armored Cyber Headphones",
      type: "Comms & Interface",
      desc: "Over-ear hybrid of studio gear, comms hardware, and combat interface. Signal processing meets field awareness.",
      img: asset("images/gear-headphones.png")
    },
    {
      id: "armor",
      name: "Red Cybernetic Armor",
      type: "Defense System",
      desc: "Matte red with gloss accents. Black underlayer for flexibility. Gunmetal mechanical joints and weapon mounts.",
      img: asset("images/gear-armor.png")
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 border-b border-primary/30 pb-6">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-2 glitch-text" data-text="THE ARSENAL">
          THE ARSENAL
        </h1>
        <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 uppercase tracking-widest">
          Hardware Schematics // Loadout Catalog
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gear.map((item) => (
          <div key={item.id} className="tactical-border bg-card group flex flex-col">
            <div className="aspect-square bg-muted/30 p-6 relative flex items-center justify-center overflow-hidden border-b border-border">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={item.img} alt={item.name} className="w-full h-full object-contain relative z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" />
              <Crosshair className="absolute top-4 right-4 text-muted-foreground opacity-30 group-hover:text-primary group-hover:opacity-100 transition-all" size={24} />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-1 border border-secondary/20 bg-secondary/5 px-2 py-0.5 inline-block self-start">
                {item.type}
              </div>
              <h3 className="text-2xl font-display text-white uppercase tracking-widest mb-3 mt-2">
                {item.name}
              </h3>
              <p className="text-muted-foreground font-mono text-sm flex-1">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
