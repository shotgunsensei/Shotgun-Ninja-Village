import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Megaphone, DoorOpen, BookOpen, Wrench, Hammer, Shirt, MessageCircle,
  Users, Crown, Award, Lock, Zap, Bell, ChevronRight, ExternalLink,
  MessageSquare, Eye, Pin, Flame, ShoppingBag, Globe
} from "lucide-react";
import { categories, featuredTopics, memberPerks } from "@/data/community";

const iconMap: Record<string, React.ElementType> = {
  megaphone: Megaphone,
  "door-open": DoorOpen,
  "book-open": BookOpen,
  wrench: Wrench,
  hammer: Hammer,
  shirt: Shirt,
  "message-circle": MessageCircle,
  crown: Crown,
  award: Award,
  lock: Lock,
  zap: Zap,
  bell: Bell,
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Community() {
  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col">

      <section className="relative w-full py-20 md:py-28 flex items-center justify-center overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative z-10 container px-4 mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-secondary/30 bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-widest">
            <Users size={14} /> Community Hub
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-4 glitch-text" data-text="THE VILLAGE">
            THE VILLAGE
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-mono max-w-2xl mx-auto mb-8">
            The central gathering point for operators, builders, and signal hunters across the Shotgun Ninjas network. Share intel. Build together. Strengthen the village.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#categories"
              className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-8 py-3 font-display text-xl uppercase tracking-widest transition-all inline-flex items-center gap-2"
            >
              <MessageSquare size={20} /> Explore Channels
            </a>
            <a
              href="#perks"
              className="clip-diagonal border border-primary/50 hover:bg-primary/10 text-primary px-8 py-3 font-display text-xl uppercase tracking-widest transition-all inline-flex items-center gap-2 bg-background/50 backdrop-blur"
            >
              Member Perks <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </section>

      <section id="categories" className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
        <motion.div {...fadeUp}>
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-2">
              CHANNELS
            </h2>
            <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-lg">
              Seven zones. Each one purpose-built for a different kind of signal.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || MessageCircle;
            return (
              <motion.div
                key={cat.id}
                className="tactical-border bg-card p-5 group hover:border-primary transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 border border-border bg-background ${cat.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-display text-white uppercase tracking-widest group-hover:text-primary transition-colors truncate">
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground mt-1">
                      <span>{cat.topicCount} topics</span>
                      <span>{cat.postCount} posts</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground font-mono text-xs leading-relaxed">
                  {cat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
          <motion.div {...fadeUp}>
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-2">
                  ACTIVE SIGNALS
                </h2>
                <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-lg">
                  Trending discussions from across the village network.
                </p>
              </div>
              <div className="text-xs font-mono text-muted-foreground bg-muted/50 border border-border px-3 py-1.5">
                LIVE FEED // MOCK DATA
              </div>
            </div>
          </motion.div>

          <div className="space-y-2">
            {featuredTopics.map((topic, i) => {
              const cat = categories.find((c) => c.slug === topic.categorySlug);
              return (
                <motion.div
                  key={topic.id}
                  className="group border border-border bg-card/50 p-4 hover:border-primary/50 transition-all cursor-pointer"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex flex-col items-center gap-1 text-muted-foreground min-w-[50px]">
                      <MessageSquare size={16} />
                      <span className="text-xs font-mono">{topic.replyCount}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {topic.pinned && <Pin size={12} className="text-primary" />}
                        {topic.hot && <Flame size={12} className="text-orange-500" />}
                        <h3 className="text-lg font-display text-white uppercase tracking-wider group-hover:text-primary transition-colors truncate">
                          {topic.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground flex-wrap">
                        {cat && (
                          <span className={`px-1.5 py-0.5 border border-border bg-background ${cat.color}`}>
                            {cat.name}
                          </span>
                        )}
                        <span>{topic.author}</span>
                        {topic.authorBadge && (
                          <span className="text-secondary bg-secondary/10 border border-secondary/20 px-1.5 py-0.5">
                            {topic.authorBadge}
                          </span>
                        )}
                        <span className="hidden sm:inline"><Eye size={10} className="inline mr-1" />{topic.viewCount}</span>
                        <span>{topic.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="perks" className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
        <motion.div {...fadeUp}>
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-2">
              MEMBER PERKS
            </h2>
            <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-lg">
              What you unlock when you enter the village. More tiers coming soon.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["free", "supporter", "founder"] as const).map((tier) => {
            const tierPerks = memberPerks.filter((p) => p.tier === tier);
            const tierLabels = { free: "Open Access", supporter: "Ronin Supporter", founder: "Founding Ninja" };
            const tierColors = { free: "border-secondary/30 bg-secondary/5", supporter: "border-orange-500/30 bg-orange-500/5", founder: "border-primary/30 bg-primary/5" };
            const tierBadge = { free: "text-secondary", supporter: "text-orange-500", founder: "text-primary" };
            const comingSoon = tier !== "free";

            return (
              <motion.div
                key={tier}
                className={`tactical-border bg-card p-6 relative ${comingSoon ? "opacity-80" : ""}`}
                {...fadeUp}
              >
                {comingSoon && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-muted border border-border font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                    Coming Soon
                  </div>
                )}
                <div className={`inline-flex items-center gap-2 px-2.5 py-1 border text-xs font-mono uppercase tracking-widest mb-4 ${tierColors[tier]} ${tierBadge[tier]}`}>
                  {tier === "founder" && <Crown size={12} />}
                  {tier === "supporter" && <Award size={12} />}
                  {tier === "free" && <Users size={12} />}
                  {tierLabels[tier]}
                </div>

                <div className="space-y-4">
                  {tierPerks.map((perk) => {
                    const PerkIcon = iconMap[perk.icon] || Zap;
                    return (
                      <div key={perk.id} className="flex items-start gap-3">
                        <PerkIcon size={16} className={`mt-0.5 flex-shrink-0 ${tierBadge[tier]}`} />
                        <div>
                          <h4 className="text-sm font-display text-white uppercase tracking-wider">{perk.title}</h4>
                          <p className="text-xs font-mono text-muted-foreground mt-0.5">{perk.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-display text-white uppercase tracking-widest mb-2">
                Gear Up While You're Here
              </h3>
              <p className="text-muted-foreground font-mono text-sm">
                Support the village through the Ronin Supply store. Merch buyers unlock future community perks.
              </p>
            </div>
            <Link
              href="/merch"
              className="clip-diagonal bg-primary/20 border border-primary/40 text-primary px-6 py-2.5 font-display text-lg uppercase tracking-widest hover:bg-primary hover:text-white transition-all inline-flex items-center gap-2 whitespace-nowrap"
            >
              <ShoppingBag size={18} /> Browse Ronin Supply <ChevronRight size={16} />
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
