import React from "react";
import { ArrowUpRight, Globe, Code } from "lucide-react";

export function ExternalFunnel() {
  return (
    <section className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://shotgunninjas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group tactical-border bg-card/40 hover:bg-card p-4 flex items-start gap-4 transition-all hover:border-primary/60"
          >
            <div className="p-2 border border-border bg-background group-hover:border-primary/30 text-primary">
              <Globe size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-display text-lg text-white uppercase tracking-widest group-hover:text-primary transition-colors leading-none">
                  ShotgunNinjas.com
                </h4>
                <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                The main hub of the universe. Extended lore, music, and central network access.
              </p>
            </div>
          </a>

          <a
            href="https://www.operatoros.net"
            target="_blank"
            rel="noopener noreferrer"
            className="group tactical-border bg-card/40 hover:bg-card p-4 flex items-start gap-4 transition-all hover:border-secondary/60"
          >
            <div className="p-2 border border-border bg-background group-hover:border-secondary/30 text-secondary">
              <Code size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-display text-lg text-white uppercase tracking-widest group-hover:text-secondary transition-colors leading-none">
                  OperatorOS.net
                </h4>
                <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                The operator platform. Tactical intelligence and deep system management.
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
