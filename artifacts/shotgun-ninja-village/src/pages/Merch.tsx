import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ShoppingBag, Tag, ChevronRight, ExternalLink, Shield, User, Zap,
  Award, Star, Package, Truck, Clock, Users, MessageSquare, Play
} from "lucide-react";
import { products, collections, type Product } from "@/data/products";
import { formatPrice } from "@/services/store";

const collectionIcons: Record<string, React.ElementType> = {
  shield: Shield,
  user: User,
  play: Play,
  tag: Tag,
  zap: Zap,
  award: Award,
};

const badgeStyles: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-secondary text-white" },
  bestseller: { label: "Bestseller", color: "bg-green-600 text-white" },
  limited: { label: "Limited Drop", color: "bg-primary text-white" },
  "supporters-only": { label: "Supporters Only", color: "bg-orange-600 text-white" },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function ProductCard({ product }: { product: Product }) {
  const basePrice = product.variants[0]?.price || 0;
  const compareAt = product.variants[0]?.compareAtPrice;
  const badge = product.badge ? badgeStyles[product.badge] : null;
  const sizes = [...new Set(product.variants.map((v) => v.options.size).filter(Boolean))];

  return (
    <div className="tactical-border bg-card group hover:border-primary transition-all flex flex-col">
      <div className="aspect-square bg-muted/30 relative flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="text-muted-foreground/30 font-display text-6xl uppercase tracking-widest select-none">
          SN
        </div>
        {badge && (
          <div className={`absolute top-3 left-3 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${badge.color}`}>
            {badge.label}
          </div>
        )}
        {product.limitedDrop && (
          <div className="absolute top-3 right-3 p-1.5 border border-primary/40 bg-background/80 text-primary">
            <Zap size={14} />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-display text-white uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p className="text-muted-foreground font-mono text-xs leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {sizes.map((size) => (
              <span key={size} className="px-2 py-0.5 border border-border bg-background font-mono text-[10px] text-muted-foreground">
                {size}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between mt-auto">
          <div>
            <span className="text-2xl font-display text-white">{formatPrice(basePrice)}</span>
            {compareAt && (
              <span className="ml-2 text-sm font-mono text-muted-foreground line-through">{formatPrice(compareAt)}</span>
            )}
          </div>
          <button className="clip-diagonal bg-primary/20 border border-primary/40 text-primary px-4 py-1.5 font-display text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all inline-flex items-center gap-1.5">
            <ShoppingBag size={14} /> Buy
          </button>
        </div>

        {product.madeToOrder && (
          <p className="text-[10px] font-mono text-muted-foreground mt-2 flex items-center gap-1">
            <Clock size={10} /> Made to order — ships in 5-10 business days
          </p>
        )}
      </div>
    </div>
  );
}

export default function Merch() {
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  const filteredProducts = activeCollection
    ? products.filter((p) => p.collections.includes(activeCollection))
    : products;

  const featuredProducts = products.filter((p) => p.featured);
  const limitedProducts = products.filter((p) => p.limitedDrop);

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col">

      <section className="relative w-full py-20 md:py-28 flex items-center justify-center overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative z-10 container px-4 mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-secondary/30 bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-widest">
            <ShoppingBag size={14} /> Merch Hub
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-4 glitch-text" data-text="RONIN SUPPLY">
            RONIN SUPPLY
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-mono max-w-2xl mx-auto mb-8">
            Premium gear from the Shotgun Ninjas universe. Every purchase supports the village and moves the mission forward.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Package size={14} /> Premium Materials</span>
            <span className="inline-flex items-center gap-1.5"><Truck size={14} /> Worldwide Shipping</span>
            <span className="inline-flex items-center gap-1.5"><Shield size={14} /> Satisfaction Guaranteed</span>
          </div>
        </div>
      </section>

      {limitedProducts.length > 0 && (
        <section className="border-b border-border bg-primary/5">
          <div className="container mx-auto px-4 py-12 max-w-6xl">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <Zap size={20} className="text-primary" />
                <h2 className="text-2xl font-display text-white uppercase tracking-widest">Limited Drops</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {limitedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
        <motion.div {...fadeUp}>
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-2">
              COLLECTIONS
            </h2>
            <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-lg">
              Browse by collection or explore the full catalog below.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {collections.map((col) => {
            const Icon = collectionIcons[col.icon] || Tag;
            const isActive = activeCollection === col.handle;
            return (
              <button
                key={col.id}
                onClick={() => setActiveCollection(isActive ? null : col.handle)}
                className={`group border p-4 text-center transition-all ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-white"
                }`}
              >
                <Icon size={20} className="mx-auto mb-2" />
                <span className="block font-display text-sm uppercase tracking-widest">{col.title}</span>
                <span className="block font-mono text-[10px] mt-1 opacity-50">{col.productCount} items</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-2xl font-display text-white uppercase tracking-widest">
            {activeCollection
              ? collections.find((c) => c.handle === activeCollection)?.title || "Products"
              : "All Products"}
          </h3>
          {activeCollection && (
            <button
              onClick={() => setActiveCollection(null)}
              className="text-xs font-mono text-primary hover:text-white transition-colors"
            >
              Clear filter
            </button>
          )}
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-mono text-muted-foreground">{filteredProducts.length} items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 border border-border bg-card/30">
            <p className="text-muted-foreground font-mono text-sm">No products in this collection yet.</p>
          </div>
        )}
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <Package size={24} className="text-primary mx-auto mb-3" />
              <h4 className="text-lg font-display text-white uppercase tracking-widest mb-1">Premium Quality</h4>
              <p className="text-xs font-mono text-muted-foreground">Every item produced with premium materials and print-on-demand precision.</p>
            </div>
            <div className="p-4">
              <Truck size={24} className="text-primary mx-auto mb-3" />
              <h4 className="text-lg font-display text-white uppercase tracking-widest mb-1">Ships Worldwide</h4>
              <p className="text-xs font-mono text-muted-foreground">Produced and shipped globally. Made to order — allow 5-10 business days.</p>
            </div>
            <div className="p-4">
              <Star size={24} className="text-primary mx-auto mb-3" />
              <h4 className="text-lg font-display text-white uppercase tracking-widest mb-1">Support the Village</h4>
              <p className="text-xs font-mono text-muted-foreground">Every purchase directly supports the Shotgun Ninjas universe and future transmissions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-display text-white uppercase tracking-widest mb-2">
                Join the Community
              </h3>
              <p className="text-muted-foreground font-mono text-sm">
                Share your gear, connect with other operators, and unlock future buyer perks in the village forum.
              </p>
            </div>
            <Link
              href="/community"
              className="clip-diagonal bg-primary/20 border border-primary/40 text-primary px-6 py-2.5 font-display text-lg uppercase tracking-widest hover:bg-primary hover:text-white transition-all inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Users size={18} /> Enter the Village <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <div className="tactical-border bg-card/50 p-6 md:p-8 text-center">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Part of the Shotgun Ninjas Universe</p>
            <a
              href="https://shotgunninjas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary hover:text-white font-display text-2xl uppercase tracking-widest transition-colors"
            >
              ShotgunNinjas.com <ExternalLink size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
