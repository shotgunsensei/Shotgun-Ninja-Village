import type { LucideIcon } from "lucide-react";

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
