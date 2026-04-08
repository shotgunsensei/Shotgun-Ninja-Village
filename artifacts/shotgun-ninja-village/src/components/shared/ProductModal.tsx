import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Zap, Clock, Package, Truck, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice, getCheckoutUrl } from "@/services/store";

const badgeStyles: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-secondary text-white" },
  bestseller: { label: "Bestseller", color: "bg-green-600 text-white" },
  limited: { label: "Limited Drop", color: "bg-primary text-white" },
  "supporters-only": { label: "Supporters Only", color: "bg-orange-600 text-white" },
};

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const optionKeys = [...new Set(product.variants.flatMap((v) => Object.keys(v.options)))];

  useEffect(() => {
    const defaults: Record<string, string> = {};
    for (const key of optionKeys) {
      const firstVal = product.variants.find((v) => v.options[key])?.options[key];
      if (firstVal) defaults[key] = firstVal;
    }
    setSelectedOptions(defaults);
  }, [product.id]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const selectedVariant = product.variants.find((v) =>
    optionKeys.every((k) => !v.options[k] || v.options[k] === selectedOptions[k])
  ) || product.variants[0];

  const optionValues = (key: string) => [...new Set(product.variants.map((v) => v.options[key]).filter(Boolean))];

  const badge = product.badge ? badgeStyles[product.badge] : null;
  const checkoutUrl = selectedVariant ? getCheckoutUrl(selectedVariant.id) : "#";
  const isLive = checkoutUrl !== "#store-coming-soon";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-background border border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 border border-border bg-background/80 text-muted-foreground hover:text-white hover:border-primary transition-all"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 aspect-square bg-muted/20 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
            <div className="text-muted-foreground/15 font-display text-7xl uppercase tracking-[0.3em] select-none">
              SN
            </div>
            {badge && (
              <div className={`absolute top-3 left-3 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${badge.color}`}>
                {badge.label}
              </div>
            )}
            {product.limitedDrop && (
              <div className="absolute top-3 right-12 p-1.5 border border-primary/40 bg-background/80 text-primary">
                <Zap size={12} />
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                {product.collections.map((c) => (
                  <span key={c} className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest bg-muted/30 px-1.5 py-0.5 border border-border">
                    {c.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-display text-white uppercase tracking-widest mb-2">
                {product.title}
              </h2>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-5">
              <span className="text-3xl font-display text-white">{formatPrice(selectedVariant?.price || 0)}</span>
              {selectedVariant?.compareAtPrice && (
                <span className="ml-3 text-lg font-mono text-muted-foreground line-through">{formatPrice(selectedVariant.compareAtPrice)}</span>
              )}
            </div>

            {optionKeys.map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                  {key}: <span className="text-white">{selectedOptions[key]}</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {optionValues(key).map((val) => {
                    const isSelected = selectedOptions[key] === val;
                    const variantAvailable = product.variants.some(
                      (v) => v.options[key] === val && v.available
                    );
                    return (
                      <button
                        key={val}
                        data-option={`${key}-${val}`}
                        aria-pressed={isSelected}
                        onClick={(e) => { e.stopPropagation(); setSelectedOptions((prev) => ({ ...prev, [key]: val })); }}
                        disabled={!variantAvailable}
                        className={`px-3 py-1.5 border font-mono text-xs uppercase tracking-wider transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : variantAvailable
                              ? "border-border text-muted-foreground hover:border-primary/50 hover:text-white"
                              : "border-border/50 text-muted-foreground/30 cursor-not-allowed line-through"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {selectedVariant && !selectedVariant.available && (
              <div className="mb-4 px-3 py-2 border border-primary/30 bg-primary/5 font-mono text-xs text-primary">
                This variant is currently unavailable.
              </div>
            )}

            <div className="mt-auto space-y-3">
              {selectedVariant?.available !== false && isLive ? (
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clip-diagonal w-full py-3 font-display text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white cursor-pointer"
                >
                  <ShoppingBag size={18} /> Buy Now
                </a>
              ) : (
                <div
                  className={`clip-diagonal w-full py-3 font-display text-lg uppercase tracking-widest flex items-center justify-center gap-2 ${
                    selectedVariant?.available === false
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary/60 text-white/70 cursor-default"
                  }`}
                  aria-disabled="true"
                >
                  <ShoppingBag size={18} />
                  {selectedVariant?.available === false ? "Unavailable" : "Coming Soon"}
                </div>
              )}

              {selectedVariant && (
                <p className="text-[10px] font-mono text-muted-foreground text-center uppercase tracking-widest">
                  SKU: {selectedVariant.sku}
                </p>
              )}

              {product.madeToOrder && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground justify-center border-t border-border/50 pt-3">
                  <Clock size={10} /> Made to order &middot; Ships in 5–10 business days
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center">
                  <Package size={12} className="mx-auto text-muted-foreground/50 mb-1" />
                  <span className="text-[8px] font-mono text-muted-foreground/50 uppercase">Premium</span>
                </div>
                <div className="text-center">
                  <Truck size={12} className="mx-auto text-muted-foreground/50 mb-1" />
                  <span className="text-[8px] font-mono text-muted-foreground/50 uppercase">Global Ship</span>
                </div>
                <div className="text-center">
                  <Shield size={12} className="mx-auto text-muted-foreground/50 mb-1" />
                  <span className="text-[8px] font-mono text-muted-foreground/50 uppercase">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
