import { Link } from "wouter";
import React from "react";
import { ShieldCheck } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  UniverseFooter,
  EcosystemCard,
  recoveredSystems,
  extendedSystems,
} from "@workspace/sn-ecosystem";
import { NextWaypoint } from "@/components/shared/NextWaypoint";
import { ExternalFunnel } from "@/components/shared/ExternalFunnel";

export default function Intel() {
  usePageMeta({
    title: "Forge Intel",
    description: "The real tools & platforms behind the fiction",
  });

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="container mx-auto px-4 py-12 max-w-6xl flex-1">
        <div className="mb-12 border-b border-primary/30 pb-6 flex items-center justify-between">
          <div>
            <h1
              className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-2 glitch-text"
              data-text="FORGE INTEL"
            >
              FORGE INTEL
            </h1>
            <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-lg mb-2">
              Field-recovered platforms from the first operational cycle. Each one pulled from a mission. Each one online.
            </p>
            <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-lg">
              The real tools & platforms behind the fiction.
            </p>
          </div>
          <ShieldCheck size={48} className="text-primary/20 hidden md:block" aria-hidden="true" />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display text-white uppercase tracking-widest mb-1">
            Recovered Systems
          </h2>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Field-recovered during Transmissions 02 and 03
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {recoveredSystems.map((sys) => (
            <EcosystemCard key={sys.id} product={sys} variant="full" />
          ))}
        </div>

        <div className="border-t border-border pt-10 mb-8">
          <h2 className="text-2xl md:text-3xl font-display text-muted-foreground uppercase tracking-widest mb-1">
            Extended Network
          </h2>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Additional systems connected to the tactical network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {extendedSystems.map((sys) => (
            <EcosystemCard key={sys.id} product={sys} variant="compact" />
          ))}
        </div>
      </div>
      
      <NextWaypoint waypoints={[
        { href: "https://shotgunninjas.com", title: "ShotgunNinjas.com", desc: "The main hub of the universe.", isExternal: true },
        { href: "https://www.operatoros.net", title: "OperatorOS", desc: "The tactical operator platform.", isExternal: true }
      ]} />
      
      <ExternalFunnel />

      <UniverseFooter LinkComponent={Link} />
    </div>
  );
}
