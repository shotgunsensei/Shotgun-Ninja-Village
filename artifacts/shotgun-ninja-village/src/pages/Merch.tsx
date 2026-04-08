import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ShoppingBag, Tag, ChevronRight, Shield, User, Zap,
  Award, Package, Truck, Star, Users, Play
} from "lucide-react";
import { products, collections } from "@/data/products";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductCard } from "@/components/shared/ProductCard";
import { UniverseFooter } from "@/components/shared/UniverseFooter";

const collectionIcons: Record<string, React.ElementType> = {
  shield: Shield,
  user: User,
  play: Play,
  tag: Tag,
  zap: Zap,
  award: Award,
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Merch() {
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  const filteredProducts = activeCollection
    ? products.filter((p) => p.collections.includes(activeCollection))
    : products;

  const limitedProducts = products.filter((p) => p.limitedDrop);

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col">

      <section className="relative w-full py-16 md:py-24 flex items-center justify-center overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative z-10 container px-4 mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 border border-primary/30 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest">
            <ShoppingBag size={14} /> Official Store
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-3 glitch-text" data-text="RONIN SUPPLY">
            RONIN SUPPLY
          </h1>

          <p className="text-base md:text-lg text-muted-foreground font-mono max-w-xl mx-auto mb-6">
            Operator-grade apparel and accessories from the Shotgun Ninjas universe. Every purchase fuels the next transmission.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] font-mono text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Package size={13} /> Premium Materials</span>
            <span className="inline-flex items-center gap-1.5"><Truck size={13} /> Worldwide Shipping</span>
            <span className="inline-flex items-center gap-1.5"><Shield size={13} /> Satisfaction Guaranteed</span>
          </div>
        </div>
      </section>

      {limitedProducts.length > 0 && (
        <section className="border-b border-border bg-primary/[0.03]">
          <div className="container mx-auto px-4 py-10 md:py-14 max-w-6xl">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <Zap size={18} className="text-primary" />
                <h2 className="text-2xl font-display text-white uppercase tracking-widest">Limited Drops</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {limitedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-14 md:py-18 max-w-6xl">
        <SectionHeading title="COLLECTIONS" subtitle="Browse by collection. Click again to clear." />

        <div className="flex flex-wrap gap-2 mb-10">
          {collections.map((col) => {
            const Icon = collectionIcons[col.icon] || Tag;
            const isActive = activeCollection === col.handle;
            return (
              <button
                key={col.id}
                onClick={() => setActiveCollection(isActive ? null : col.handle)}
                className={`group border px-3 py-2 inline-flex items-center gap-2 transition-all text-left ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-white"
                }`}
              >
                <Icon size={14} className="flex-shrink-0" />
                <span className="font-display text-xs uppercase tracking-widest">{col.title}</span>
                <span className="font-mono text-[9px] opacity-40">{col.productCount}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-xl font-display text-white uppercase tracking-widest">
            {activeCollection
              ? collections.find((c) => c.handle === activeCollection)?.title || "Products"
              : "All Products"}
          </h3>
          {activeCollection && (
            <button
              onClick={() => setActiveCollection(null)}
              className="font-mono text-[10px] text-primary hover:text-white transition-colors uppercase tracking-widest border border-primary/30 px-2 py-0.5 hover:bg-primary/10"
            >
              Clear
            </button>
          )}
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-mono text-muted-foreground">{filteredProducts.length} items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-14 border border-border bg-card/20">
            <ShoppingBag size={32} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-mono text-sm mb-1">No products in this collection yet.</p>
            <button
              onClick={() => setActiveCollection(null)}
              className="text-primary font-mono text-xs hover:text-white transition-colors"
            >
              View all products
            </button>
          </div>
        )}
      </section>

      <section className="border-t border-border bg-card/20">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3">
              <Package size={20} className="text-primary mx-auto mb-2" />
              <h4 className="text-sm font-display text-white uppercase tracking-widest mb-1">Premium Quality</h4>
              <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">Premium materials. Print-on-demand precision.</p>
            </div>
            <div className="p-3">
              <Truck size={20} className="text-primary mx-auto mb-2" />
              <h4 className="text-sm font-display text-white uppercase tracking-widest mb-1">Global Shipping</h4>
              <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">Produced and shipped worldwide. Made to order.</p>
            </div>
            <div className="p-3">
              <Star size={20} className="text-primary mx-auto mb-2" />
              <h4 className="text-sm font-display text-white uppercase tracking-widest mb-1">Fund the Mission</h4>
              <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">Every purchase directly funds future transmissions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-display text-white uppercase tracking-widest mb-1">
                Join the Village
              </h3>
              <p className="text-muted-foreground font-mono text-xs">
                Share your gear, connect with operators, and unlock buyer perks.
              </p>
            </div>
            <Link
              href="/community"
              className="clip-diagonal bg-secondary/20 border border-secondary/40 text-secondary px-5 py-2 font-display text-base uppercase tracking-widest hover:bg-secondary hover:text-white transition-all inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Users size={16} /> The Village <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <UniverseFooter exclude={["merch"]} />
    </div>
  );
}
