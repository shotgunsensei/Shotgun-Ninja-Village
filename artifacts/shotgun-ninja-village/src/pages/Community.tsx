import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Megaphone, DoorOpen, BookOpen, Wrench, Hammer, Shirt, MessageCircle,
  Users, Crown, Award, Lock, Zap, Bell, ChevronRight,
  MessageSquare, Eye, Pin, Flame, ShoppingBag
} from "lucide-react";
import { categories, featuredTopics, memberPerks } from "@/data/community";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { UniverseFooter } from "@/components/shared/UniverseFooter";

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

      <section className="relative w-full py-16 md:py-24 flex items-center justify-center overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative z-10 container px-4 mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 border border-secondary/30 bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-widest">
            <Users size={14} /> Network Hub
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-widest mb-3 glitch-text" data-text="THE VILLAGE">
            THE VILLAGE
          </h1>

          <p className="text-base md:text-lg text-muted-foreground font-mono max-w-xl mx-auto mb-8">
            Where operators connect. Discuss transmissions, share builds, surface theories, and shape the future of the Shotgun Ninjas network.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#channels"
              className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-6 py-2.5 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2"
            >
              <MessageSquare size={18} /> Explore Channels
            </a>
            <a
              href="#perks"
              className="clip-diagonal border border-primary/50 hover:bg-primary/10 text-primary px-6 py-2.5 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2 bg-background/50 backdrop-blur"
            >
              Member Perks <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section id="channels" className="container mx-auto px-4 py-14 md:py-18 max-w-6xl">
        <SectionHeading title="CHANNELS" subtitle="Seven zones. Each one purpose-built for a different kind of signal." />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || MessageCircle;
            return (
              <motion.div
                key={cat.id}
                className="tactical-border bg-card p-4 group hover:border-primary/60 transition-all cursor-pointer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className={`p-1.5 border border-border bg-background ${cat.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-display text-white uppercase tracking-widest group-hover:text-primary transition-colors leading-tight">
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mt-0.5">
                      <span>{cat.topicCount} topics</span>
                      <span className="opacity-40">·</span>
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

      <section className="border-y border-border bg-card/20">
        <div className="container mx-auto px-4 py-14 md:py-18 max-w-6xl">
          <SectionHeading title="ACTIVE SIGNALS" subtitle="Trending threads from across the village." />

          <div className="space-y-1.5">
            {featuredTopics.map((topic, i) => {
              const cat = categories.find((c) => c.slug === topic.categorySlug);
              return (
                <motion.div
                  key={topic.id}
                  className="group border border-border bg-card/40 px-4 py-3 hover:border-primary/40 transition-all cursor-pointer"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-center text-muted-foreground min-w-[40px]">
                      <MessageSquare size={14} />
                      <span className="text-[10px] font-mono mt-0.5">{topic.replyCount}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {topic.pinned && <Pin size={11} className="text-primary flex-shrink-0" />}
                        {topic.hot && <Flame size={11} className="text-orange-500 flex-shrink-0" />}
                        <h3 className="text-base font-display text-white uppercase tracking-wider group-hover:text-primary transition-colors truncate">
                          {topic.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground flex-wrap">
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
                        <span className="hidden sm:inline"><Eye size={10} className="inline mr-0.5" />{topic.viewCount}</span>
                        <span className="opacity-50">{topic.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="perks" className="container mx-auto px-4 py-14 md:py-18 max-w-6xl">
        <SectionHeading title="MEMBER PERKS" subtitle="Three tiers. More unlocking soon." />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["free", "supporter", "founder"] as const).map((tier) => {
            const tierPerks = memberPerks.filter((p) => p.tier === tier);
            const tierLabels = { free: "Open Access", supporter: "Ronin Supporter", founder: "Founding Ninja" };
            const tierColors = { free: "border-secondary/30 bg-secondary/5", supporter: "border-orange-500/30 bg-orange-500/5", founder: "border-primary/30 bg-primary/5" };
            const tierBadge = { free: "text-secondary", supporter: "text-orange-500", founder: "text-primary" };
            const comingSoon = tier !== "free";

            return (
              <motion.div
                key={tier}
                className={`tactical-border bg-card p-5 relative ${comingSoon ? "opacity-75" : ""}`}
                {...fadeUp}
              >
                {comingSoon && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-muted border border-border font-mono text-[8px] text-muted-foreground uppercase tracking-widest">
                    Coming Soon
                  </div>
                )}
                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-xs font-mono uppercase tracking-widest mb-4 ${tierColors[tier]} ${tierBadge[tier]}`}>
                  {tier === "founder" && <Crown size={11} />}
                  {tier === "supporter" && <Award size={11} />}
                  {tier === "free" && <Users size={11} />}
                  {tierLabels[tier]}
                </div>

                <div className="space-y-3">
                  {tierPerks.map((perk) => {
                    const PerkIcon = iconMap[perk.icon] || Zap;
                    return (
                      <div key={perk.id} className="flex items-start gap-2.5">
                        <PerkIcon size={14} className={`mt-0.5 flex-shrink-0 ${tierBadge[tier]}`} />
                        <div>
                          <h4 className="text-sm font-display text-white uppercase tracking-wider leading-tight">{perk.title}</h4>
                          <p className="text-[11px] font-mono text-muted-foreground mt-0.5 leading-relaxed">{perk.description}</p>
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

      <section className="border-t border-border bg-card/20">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-display text-white uppercase tracking-widest mb-1">
                Gear Up While You're Here
              </h3>
              <p className="text-muted-foreground font-mono text-xs">
                Merch buyers unlock future community perks and supporter status.
              </p>
            </div>
            <Link
              href="/merch"
              className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-5 py-2 font-display text-base uppercase tracking-widest transition-all inline-flex items-center gap-2 whitespace-nowrap"
            >
              <ShoppingBag size={16} /> Ronin Supply <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <UniverseFooter exclude={["community"]} />
    </div>
  );
}
