import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ShoppingBag, Tag, ChevronRight, Shield, User, Zap,
  Award, Package, Truck, Star, Users, Play, Clock,
  RefreshCw, CreditCard, ArrowRight, Flame, AlertTriangle
} from "lucide-react";
import type { Product, Collection } from "@/data/products";
import { getProducts, getCollections, getFeaturedProducts, formatPrice } from "@/services/store";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductModal } from "@/components/shared/ProductModal";
import { UniverseFooter } from "@workspace/sn-ecosystem";
import { usePageMeta } from "@/hooks/usePageMeta";
import { NextWaypoint } from "@/components/shared/NextWaypoint";
import { ExternalFunnel } from "@/components/shared/ExternalFunnel";

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
  usePageMeta({ title: "Merch", description: "Operator-grade apparel and accessories from the Shotgun Ninjas universe. Featured gear, bestsellers, and limited drops." });
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    Promise.all([getProducts(), getCollections(), getFeaturedProducts()])
      .then(([prods, cols, feat]) => {
        setAllProducts(prods);
        setAllCollections(cols);
        setFeaturedProducts(feat);
      })
      .catch((err) => {
        console.error("[Merch] data load failed:", err);
        setLoadError(true);
      })
      .finally(() => setLoaded(true));
  }, []);

  const filteredProducts = activeCollection
    ? allProducts.filter((p) => p.collections.includes(activeCollection))
    : allProducts;

  const limitedProducts = allProducts.filter((p) => p.limitedDrop);
  const bestsellers = allProducts.filter((p) => p.badge === "bestseller");

  if (!loaded) {
    return (
      <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={32} className="mx-auto text-primary/40 mb-3 animate-pulse" />
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Loading supply cache...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col">

      {loadError && (
        <div role="alert" className="border-b border-primary/40 bg-primary/10 text-primary px-4 py-2 font-mono text-xs uppercase tracking-widest text-center">
          <AlertTriangle size={12} className="inline mr-1.5 align-[-2px]" aria-hidden="true" />
          Supply channel partial. Showing cached inventory.
        </div>
      )}

      <section className="relative w-full py-16 md:py-24 flex items-center justify-center overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative z-10 container px-4 mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 border border-primary/30 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest">
            <ShoppingBag size={14} /> Official Store
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-3 glitch-text" data-text="MERCH">
            MERCH
          </h1>

          <p className="text-sm font-mono text-primary uppercase tracking-widest mb-4">
            The Ronin Supply Line
          </p>

          <p className="text-base md:text-lg text-muted-foreground font-mono max-w-xl mx-auto mb-6">
            Operator-grade apparel and accessories from the Shotgun Ninjas universe. Every purchase fuels the next transmission.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <a
              href="#shop"
              className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-6 py-2.5 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2"
            >
              <ShoppingBag size={18} /> Shop Now
            </a>
            {limitedProducts.length > 0 && (
              <a
                href="#drops"
                className="clip-diagonal border border-primary/50 hover:bg-primary/10 text-primary px-6 py-2.5 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2 bg-background/50 backdrop-blur"
              >
                <Zap size={18} /> Limited Drops
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] font-mono text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Package size={13} /> Premium Materials</span>
            <span className="inline-flex items-center gap-1.5"><Truck size={13} /> Worldwide Shipping</span>
            <span className="inline-flex items-center gap-1.5"><Shield size={13} /> Satisfaction Guaranteed</span>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="border-b border-border bg-card/20">
          <div className="container mx-auto px-4 py-10 md:py-14 max-w-6xl">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <Star size={18} className="text-secondary" />
                <h2 className="text-2xl font-display text-white uppercase tracking-widest">Featured Gear</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-secondary/30 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {bestsellers.length > 0 && (
        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-10 md:py-14 max-w-6xl">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <Flame size={18} className="text-green-500" />
                <h2 className="text-2xl font-display text-white uppercase tracking-widest">Bestsellers</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-green-500/30 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bestsellers.map((product) => (
                  <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {limitedProducts.length > 0 && (
        <section id="drops" className="border-b border-border bg-primary/[0.03]">
          <div className="container mx-auto px-4 py-10 md:py-14 max-w-6xl">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-2">
                <Zap size={18} className="text-primary" />
                <h2 className="text-2xl font-display text-white uppercase tracking-widest">Limited Drops</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>
              <p className="text-muted-foreground font-mono text-xs mb-6 pl-8">
                One-run releases. Once sold out, they won't be restocked.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {limitedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section id="shop" className="container mx-auto px-4 py-14 md:py-18 max-w-6xl">
        <SectionHeading title="COLLECTIONS" subtitle="Browse by collection. Click again to clear." />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
          {allCollections.map((col) => {
            const Icon = collectionIcons[col.icon] || Tag;
            const isActive = activeCollection === col.handle;
            return (
              <button
                key={col.id}
                onClick={() => setActiveCollection(isActive ? null : col.handle)}
                className={`group border p-3 transition-all text-center ${
                  isActive
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card/50 hover:border-primary/50"
                }`}
              >
                <Icon size={18} className={`mx-auto mb-1.5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"}`} />
                <span className={`block font-display text-[10px] uppercase tracking-widest leading-tight ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"}`}>
                  {col.title}
                </span>
                <span className="block font-mono text-[8px] text-muted-foreground/50 mt-0.5">{col.productCount} items</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-xl font-display text-white uppercase tracking-widest">
            {activeCollection
              ? allCollections.find((c) => c.handle === activeCollection)?.title || "Products"
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
              <ProductCard product={product} onSelect={setSelectedProduct} />
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
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
          <motion.div {...fadeUp}>
            <h3 className="text-2xl font-display text-white uppercase tracking-widest text-center mb-8">
              The Merch Standard
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="tactical-border bg-card p-4 text-center">
                <Package size={22} className="text-primary mx-auto mb-2.5" />
                <h4 className="text-sm font-display text-white uppercase tracking-widest mb-1">Premium Quality</h4>
                <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
                  Heavyweight fabrics, precision printing, and hand-inspected finishing on every piece.
                </p>
              </div>
              <div className="tactical-border bg-card p-4 text-center">
                <Clock size={22} className="text-primary mx-auto mb-2.5" />
                <h4 className="text-sm font-display text-white uppercase tracking-widest mb-1">Made to Order</h4>
                <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
                  Each item is produced when you order. Zero waste. 5–10 business days production.
                </p>
              </div>
              <div className="tactical-border bg-card p-4 text-center">
                <Truck size={22} className="text-primary mx-auto mb-2.5" />
                <h4 className="text-sm font-display text-white uppercase tracking-widest mb-1">Global Shipping</h4>
                <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
                  Produced and shipped worldwide via tracked carriers. Delivery within 2–4 weeks.
                </p>
              </div>
              <div className="tactical-border bg-card p-4 text-center">
                <CreditCard size={22} className="text-primary mx-auto mb-2.5" />
                <h4 className="text-sm font-display text-white uppercase tracking-widest mb-1">Secure Checkout</h4>
                <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
                  Industry-standard encryption. Powered by Shopify. Your payment info is never stored.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <motion.div {...fadeUp}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-l-2 border-primary pl-4">
                <h4 className="text-sm font-display text-white uppercase tracking-widest mb-1">Returns & Exchanges</h4>
                <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                  Not the right fit? Contact us within 30 days for exchanges on unworn items. Made-to-order items are final sale.
                </p>
              </div>
              <div className="border-l-2 border-secondary pl-4">
                <h4 className="text-sm font-display text-white uppercase tracking-widest mb-1">Support the Mission</h4>
                <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                  Every purchase directly funds future transmissions, new systems, and community tools. You're not buying merch — you're funding the network.
                </p>
              </div>
              <div className="border-l-2 border-orange-500 pl-4">
                <h4 className="text-sm font-display text-white uppercase tracking-widest mb-1">Supporter Perks</h4>
                <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                  Merch buyers unlock future community badges and access to gated Village channels as the supporter tier rolls out.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <NextWaypoint waypoints={[
        { href: "/community", title: "The Village", desc: "Share your gear and connect with other operators." }
      ]} />

      <ExternalFunnel />

      <UniverseFooter LinkComponent={Link} exclude={["merch"]} />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
