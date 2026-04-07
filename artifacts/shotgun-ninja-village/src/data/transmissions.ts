export interface Transmission {
  num: string;
  title: string;
  brief: string;
  quote: string;
  system: string;
  href: string;
  img: string;
  next: string | null;
}

export const transmissions: Transmission[] = [
  {
    num: "01",
    title: "The Signal in the Static",
    brief: "Kage-9 traces the first surviving beacon through a world buried in corrupted signal and discovers the old network was dismantled from within.",
    quote: "They buried the signal.",
    system: "World ignition and archive breach",
    href: "/shotgun-ninjas-ep1/",
    img: "images/ep1.png",
    next: "Next: Transmission 02 — Forge Protocol"
  },
  {
    num: "02",
    title: "Forge Protocol",
    brief: "A buried creator cell is being erased by counterfeit amplification. Kage-9 recovers BrandForge to map the distortion and reclaim the source.",
    quote: "They stole attention.",
    system: "Recovered system: BrandForge",
    href: "/shotgun-ninjas-ep2/",
    img: "images/ep2.png",
    next: "Next: Transmission 03 — Fracture Scan"
  },
  {
    num: "03",
    title: "Fracture Scan",
    brief: "The counterfeit lattice spreads into steel and infrastructure. Kage-9 activates TorqueShed to reconstruct failure and expose sabotage.",
    quote: "The machine said otherwise.",
    system: "Recovered system: TorqueShed",
    href: "/shotgun-ninjas-ep3/",
    img: "images/ep3.png",
    next: null
  }
];
