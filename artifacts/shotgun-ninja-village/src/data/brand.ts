import type { Archetype } from "@/lib/quizScoring";

export const brandAsset = (path: string) =>
  `${import.meta.env.BASE_URL}brand/${path}`;

export const factions: {
  id: Archetype;
  name: string;
  verb: string;
  district: string;
  color: string;
  description: string;
}[] = [
  {
    id: "builder",
    name: "Forge Ghost",
    verb: "Rebuild",
    district: "The Forge Grid",
    color: "#9edce6",
    description: "Recover the blueprint. Give broken systems a second life.",
  },
  {
    id: "protector",
    name: "Heavy Vanguard",
    verb: "Defend",
    district: "Operator Havens",
    color: "#e54444",
    description: "Hold the safehouse. Keep a clear signal alive for everyone.",
  },
  {
    id: "tracer",
    name: "Signal Hunter",
    verb: "Trace",
    district: "The Archive Fractures",
    color: "#f2eadc",
    description: "Follow the fragment. Find the truth beneath the static.",
  },
  {
    id: "breaker",
    name: "System Breaker",
    verb: "Disrupt",
    district: "The Noise Sectors",
    color: "#f3ae72",
    description:
      "Break the counterfeit network. Open a path through the noise.",
  },
];

export const merchDirection: Record<
  string,
  { family: string; code: string; motif: string }
> = {
  "signal-hunter-tee": {
    family: "Signal Essentials",
    code: "SG / 01",
    motif:
      "The split-ring signal crest. A village uniform in bone and crimson.",
  },
  "kage-9-operator-hoodie": {
    family: "Kage-9",
    code: "K9 / 01",
    motif:
      "The red mask, cyan core, and blond-streak silhouette of Hayaku Kageru.",
  },
  "fracture-scan-drop-tee": {
    family: "Transmission Archive",
    code: "TX / 03",
    motif: "A fractured industrial skyline from the third transmission.",
  },
  "village-signal-cap": {
    family: "Signal Essentials",
    code: "SG / 02",
    motif: "A compact signal crest, drawn to read at embroidery scale.",
  },
  "tactical-sticker-pack": {
    family: "Village Marks",
    code: "VM / 01",
    motif:
      "Six original signal, operator, and faction marks. One shared visual language.",
  },
  "founding-ninja-tee": {
    family: "Founders",
    code: "FN / 01",
    motif:
      "The village gate and two red ribbons, a banner for the first operators.",
  },
  "forge-protocol-long-sleeve": {
    family: "Transmission Archive",
    code: "TX / 02",
    motif: "A recovered route map with forge nodes and sleeve insignia.",
  },
  "noise-sector-poster": {
    family: "World Prints",
    code: "WP / 01",
    motif:
      "Lanterns, rooftops, and a fractured signal ring over the Noise Sectors.",
  },
};
