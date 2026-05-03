import React from "react";
import { ExternalLink } from "lucide-react";
import type { EcosystemProduct } from "@/data/ecosystem";

interface EcosystemCardProps {
  product: EcosystemProduct;
  variant?: "compact" | "full";
}

export function EcosystemCard({ product, variant = "compact" }: EcosystemCardProps) {
  const Icon = product.icon;

  if (variant === "full") {
    return (
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group block tactical-border bg-card/50 hover:bg-card transition-all p-6 ${product.borderColor}`}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 border ${product.borderColor} flex items-center justify-center flex-shrink-0 bg-background/50`}>
            <Icon className={product.color} size={22} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-display text-2xl text-white uppercase tracking-widest">
                {product.name}
              </h3>
              <span className="px-2 py-0.5 bg-primary/15 border border-primary/30 text-primary font-mono text-[10px] uppercase tracking-widest">
                {product.universeRole}
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground">{product.realRole}</p>
          </div>
        </div>
        <p className="font-mono text-sm text-white/80 mb-3 leading-relaxed">{product.longDesc}</p>
        {product.quote && (
          <p className="font-mono text-xs italic text-white/60 border-l-2 border-border pl-3 mb-3">
            "{product.quote}"
          </p>
        )}
        {product.episode && (
          <span className="inline-block px-2 py-1 bg-secondary/10 border border-secondary/30 text-secondary font-mono text-[10px] uppercase tracking-widest mb-3">
            {product.episode}
          </span>
        )}
        <div className={`mt-2 inline-flex items-center gap-1.5 font-mono text-xs ${product.color} group-hover:underline`}>
          {product.urlLabel} <ExternalLink size={11} />
        </div>
      </a>
    );
  }

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block tactical-border bg-card/40 hover:bg-card transition-all p-4 ${product.borderColor}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={product.color} size={16} aria-hidden="true" />
        <h4 className="font-display text-lg text-white uppercase tracking-widest">{product.name}</h4>
        <span className="ml-auto px-1.5 py-0.5 bg-background/50 border border-border text-muted-foreground font-mono text-[9px] uppercase tracking-widest">
          {product.universeRole}
        </span>
      </div>
      <p className="font-mono text-xs text-white/70 mb-2 leading-relaxed">{product.shortDesc}</p>
      <div className={`inline-flex items-center gap-1 font-mono text-[11px] ${product.color} group-hover:underline`}>
        {product.urlLabel} <ExternalLink size={10} />
      </div>
    </a>
  );
}
