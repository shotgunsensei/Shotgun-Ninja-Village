import { ShoppingBag, Zap, Clock } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/services/store";

const badgeStyles: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-secondary text-white" },
  bestseller: { label: "Bestseller", color: "bg-green-600 text-white" },
  limited: { label: "Limited Drop", color: "bg-primary text-white" },
  "supporters-only": { label: "Supporters Only", color: "bg-orange-600 text-white" },
};

export function ProductCard({ product }: { product: Product }) {
  const basePrice = product.variants[0]?.price || 0;
  const compareAt = product.variants[0]?.compareAtPrice;
  const badge = product.badge ? badgeStyles[product.badge] : null;
  const sizes = [...new Set(product.variants.map((v) => v.options.size).filter(Boolean))];
  const colors = [...new Set(product.variants.map((v) => v.options.color).filter(Boolean))];

  return (
    <div className="tactical-border bg-card group hover:border-primary transition-all flex flex-col h-full">
      <div className="aspect-[4/3] bg-muted/20 relative flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="text-muted-foreground/20 font-display text-5xl uppercase tracking-[0.3em] select-none">
          SN
        </div>
        {badge && (
          <div className={`absolute top-3 left-3 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${badge.color}`}>
            {badge.label}
          </div>
        )}
        {product.limitedDrop && (
          <div className="absolute top-3 right-3 p-1.5 border border-primary/40 bg-background/80 text-primary">
            <Zap size={12} />
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="text-lg sm:text-xl font-display text-white uppercase tracking-widest mb-1.5 group-hover:text-primary transition-colors leading-tight">
          {product.title}
        </h3>
        <p className="text-muted-foreground font-mono text-xs leading-relaxed mb-3 flex-1 line-clamp-3">
          {product.description}
        </p>

        {(sizes.length > 0 || colors.length > 0) && (
          <div className="flex flex-wrap gap-1 mb-3">
            {sizes.map((size) => (
              <span key={size} className="px-1.5 py-0.5 border border-border bg-background font-mono text-[9px] text-muted-foreground">
                {size}
              </span>
            ))}
            {colors.map((color) => (
              <span key={color} className="px-1.5 py-0.5 border border-border bg-background font-mono text-[9px] text-muted-foreground">
                {color}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between mt-auto pt-2 border-t border-border/50">
          <div>
            <span className="text-xl font-display text-white">{formatPrice(basePrice)}</span>
            {compareAt && (
              <span className="ml-2 text-sm font-mono text-muted-foreground line-through">{formatPrice(compareAt)}</span>
            )}
          </div>
          <button className="clip-diagonal bg-primary/20 border border-primary/40 text-primary px-3 py-1 font-display text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all inline-flex items-center gap-1.5 cursor-pointer">
            <ShoppingBag size={12} /> Buy
          </button>
        </div>

        {product.madeToOrder && (
          <p className="text-[9px] font-mono text-muted-foreground mt-2 flex items-center gap-1 opacity-70">
            <Clock size={9} /> Made to order. Ships in 5–10 business days.
          </p>
        )}
      </div>
    </div>
  );
}
