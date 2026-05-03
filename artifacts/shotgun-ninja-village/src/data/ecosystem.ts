import type { LucideIcon } from "lucide-react";
import { Terminal, Wrench, Cpu, BarChart3, Activity, Crosshair } from "lucide-react";

export type EcosystemTier = "recovered" | "extended";

export interface EcosystemProduct {
  id: string;
  name: string;
  designation?: string;
  universeRole: string;
  realRole: string;
  shortDesc: string;
  longDesc: string;
  quote?: string;
  episode?: string;
  url: string;
  urlLabel: string;
  icon: LucideIcon;
  color: string;
  borderColor: string;
  tier: EcosystemTier;
}

export const ecosystem: EcosystemProduct[] = [
  {
    id: "brandforge",
    name: "BrandForge OS",
    designation: "SYS-BF-02",
    universeRole: "Campaign Command Platform",
    realRole: "Brand strategy, content deployment, and audience signal management for creators and operators",
    shortDesc: "Recovered in Transmission 02. Build influence architecture, deploy market signals, and cut through algorithmic suppression.",
    longDesc: "Recovered during Transmission 02. Maps signal distortion, identifies counterfeit amplification, and deploys corrective narratives. The first system Kage-9 brought back online — built for creators who refuse to be buried.",
    quote: "He opened the BrandForge console. The signal map lit up like a war room.",
    episode: "Recovered in Transmission 02: Forge Protocol",
    url: "https://bf-os.com",
    urlLabel: "bf-os.com",
    icon: Terminal,
    color: "text-blue-400",
    borderColor: "border-blue-400/30",
    tier: "recovered",
  },
  {
    id: "torqueshed",
    name: "TorqueShed",
    designation: "SYS-TS-03",
    universeRole: "Mechanical Intelligence Bay",
    realRole: "Forensic diagnostics, failure reconstruction, and mechanical system analysis for operators and technicians",
    shortDesc: "Recovered in Transmission 03. Decode stress patterns, reconstruct failure chains, and expose sabotage hiding in infrastructure.",
    longDesc: "Recovered during Transmission 03. Reconstructs failure chains from raw field data, decodes stress patterns, and exposes sabotage hidden in infrastructure. The second system pulled from the wreckage.",
    quote: "The torque archive reconstructed the failure map. Every fracture told a story.",
    episode: "Recovered in Transmission 03: Fracture Scan",
    url: "https://TorqueShed.pro",
    urlLabel: "TorqueShed.pro",
    icon: Wrench,
    color: "text-orange-500",
    borderColor: "border-orange-500/30",
    tier: "recovered",
  },
  {
    id: "techdeck",
    name: "TechDeck",
    universeRole: "Operations Console",
    realRole: "IT oversight and infrastructure control",
    shortDesc: "Infrastructure control, diagnostics, and command-layer support for field operations.",
    longDesc: "Command-layer support, diagnostics, and infrastructure monitoring. The backbone behind every field operation.",
    url: "https://techdeck.app",
    urlLabel: "TechDeck.app",
    icon: Cpu,
    color: "text-purple-500",
    borderColor: "border-purple-500/30",
    tier: "extended",
  },
  {
    id: "tradeflowkit",
    name: "TradeFlowKit",
    universeRole: "Commerce Operations",
    realRole: "Trade logistics and transaction intelligence",
    shortDesc: "Supply chain mapping, transaction intelligence, and commerce flow optimization.",
    longDesc: "Supply chain mapping, flow optimization, and transaction intelligence for commerce operations.",
    url: "https://tradeflowkit.com",
    urlLabel: "TradeFlowKit.com",
    icon: BarChart3,
    color: "text-green-500",
    borderColor: "border-green-500/30",
    tier: "extended",
  },
  {
    id: "pulsedesk",
    name: "PulseDesk",
    universeRole: "Triage Network",
    realRole: "Healthcare operations and incident coordination",
    shortDesc: "Coordinates incidents, escalations, and operational visibility across distributed teams under pressure.",
    longDesc: "Coordinates incidents, escalations, and operational visibility across distributed teams. Built for high-stakes coordination under pressure.",
    url: "https://pulsedesk.support",
    urlLabel: "PulseDesk.support",
    icon: Activity,
    color: "text-rose-400",
    borderColor: "border-rose-400/30",
    tier: "extended",
  },
  {
    id: "faultlinelab",
    name: "FaultlineLab",
    universeRole: "Diagnostic Training Range",
    realRole: "Diagnostic challenges, fault analysis, and high-pressure problem solving",
    shortDesc: "Run scenarios. Trace faults. Sharpen the signal-war reflexes through high-pressure diagnostic challenges.",
    longDesc: "Run scenarios. Trace faults. Prove the operator under load. The training range where signal-war reflexes get sharpened.",
    url: "https://faultlinelab.com",
    urlLabel: "FaultlineLab.com",
    icon: Crosshair,
    color: "text-yellow-400",
    borderColor: "border-yellow-400/30",
    tier: "extended",
  },
];

export const recoveredSystems = ecosystem.filter((p) => p.tier === "recovered");
export const extendedSystems = ecosystem.filter((p) => p.tier === "extended");
