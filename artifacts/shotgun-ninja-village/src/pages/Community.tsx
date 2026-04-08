import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Megaphone, DoorOpen, BookOpen, Wrench, Hammer, Shirt, MessageCircle,
  Users, Crown, Award, Lock, Zap, Bell, ChevronRight,
  MessageSquare, Eye, Pin, Flame, ShoppingBag, ExternalLink, Radio,
  ArrowRight, UserPlus, Shield
} from "lucide-react";
import type { ForumCategory, ForumTopic, MemberPerk, CommunityStats } from "@/data/community";
import {
  getCategories, getFeaturedTopics, getMemberPerks, getCommunityStats,
  getCategoryUrl, getTopicUrl, getCommunityHomeUrl, getSignupUrl, isLive
} from "@/services/community";
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
  shield: Shield,
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const avatarColors: Record<string, string> = {
  K9: "bg-primary/80 text-white",
  SG: "bg-purple-500/80 text-white",
  NR: "bg-orange-500/80 text-white",
  BR: "bg-green-500/80 text-white",
  CW: "bg-secondary/80 text-white",
  DX: "bg-blue-400/80 text-white",
};

function MiniAvatar({ initials, className = "" }: { initials: string; className?: string }) {
  const colorClass = avatarColors[initials] || "bg-muted text-muted-foreground";
  return (
    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-mono font-bold border border-background ${colorClass} ${className}`}>
      {initials}
    </div>
  );
}

export default function Community() {
  const live = isLive();
  const signupHref = getSignupUrl();

  const [allCategories, setCategories] = useState<ForumCategory[]>([]);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [perks, setPerks] = useState<MemberPerk[]>([]);
  const [stats, setStats] = useState<CommunityStats>({ totalMembers: 0, onlineNow: 0, totalTopics: 0, totalPosts: 0, newestMember: "" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getCategories(), getFeaturedTopics(), getMemberPerks(), getCommunityStats()])
      .then(([cats, tops, prks, sts]) => {
        setCategories(cats);
        setTopics(tops);
        setPerks(prks);
        setStats(sts);
        setLoaded(true);
      });
  }, []);

  const openCategories = allCategories.filter((c) => !c.locked);
  const gatedCategories = allCategories.filter((c) => c.locked);

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
              href={signupHref}
              target={live ? "_blank" : undefined}
              rel={live ? "noopener noreferrer" : undefined}
              className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-6 py-2.5 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2"
            >
              <UserPlus size={18} /> Join The Village
            </a>
            <a
              href="#channels"
              className="clip-diagonal border border-primary/50 hover:bg-primary/10 text-primary px-6 py-2.5 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2 bg-background/50 backdrop-blur"
            >
              Explore Channels <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Operators", value: stats.totalMembers.toLocaleString(), icon: Users },
              { label: "Online Now", value: stats.onlineNow.toString(), icon: Radio, pulse: true },
              { label: "Topics", value: stats.totalTopics.toLocaleString(), icon: MessageSquare },
              { label: "Posts", value: stats.totalPosts.toLocaleString(), icon: MessageCircle },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5 py-1">
                <stat.icon size={14} className={`text-muted-foreground flex-shrink-0 ${stat.pulse ? "animate-pulse text-green-500" : ""}`} />
                <div>
                  <div className="text-base font-display text-white uppercase tracking-wider leading-none">{stat.value}</div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="channels" className="container mx-auto px-4 py-14 md:py-18 max-w-6xl">
        <SectionHeading title="CHANNELS" subtitle="Purpose-built zones for every kind of signal." />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {openCategories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || MessageCircle;
            const url = getCategoryUrl(cat.slug);
            const isClickable = live && url !== "#community-coming-soon";
            const Wrapper = isClickable ? "a" : "div";
            const wrapperProps = isClickable ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {};

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Wrapper
                  {...wrapperProps}
                  className="tactical-border bg-card p-4 group hover:border-primary/60 transition-all cursor-pointer block h-full"
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
                        <span className="opacity-40">&middot;</span>
                        <span>{cat.postCount} posts</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground font-mono text-xs leading-relaxed mb-2">
                    {cat.description}
                  </p>
                  {cat.latestPosterAvatars && cat.latestPosterAvatars.length > 0 && (
                    <div className="flex items-center gap-1 mt-auto">
                      <span className="text-[9px] font-mono text-muted-foreground mr-1">Recent:</span>
                      {cat.latestPosterAvatars.map((a, j) => (
                        <MiniAvatar key={j} initials={a} className="-ml-0.5 first:ml-0" />
                      ))}
                    </div>
                  )}
                </Wrapper>
              </motion.div>
            );
          })}
        </div>

        {gatedCategories.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={12} className="text-orange-400" />
              <span className="text-xs font-mono text-orange-400 uppercase tracking-widest">Gated Channels</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {gatedCategories.map((cat, i) => {
                const Icon = iconMap[cat.icon] || Lock;
                return (
                  <motion.div
                    key={cat.id}
                    className="tactical-border bg-card/60 p-4 group border-orange-500/20 relative overflow-hidden"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-orange-500/10 border-l border-b border-orange-500/20 font-mono text-[8px] text-orange-400 uppercase tracking-widest">
                      {cat.requiredGroup === "founding-ninjas" ? "Founders Only" : "Supporters Only"}
                    </div>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-1.5 border border-orange-500/30 bg-orange-500/5 text-orange-400">
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-display text-white/60 uppercase tracking-widest leading-tight">
                          {cat.name}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mt-0.5">
                          <span>{cat.topicCount} topics</span>
                          <span className="opacity-40">&middot;</span>
                          <span>{cat.postCount} posts</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground/60 font-mono text-xs leading-relaxed">
                      {cat.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="border-y border-border bg-card/20">
        <div className="container mx-auto px-4 py-14 md:py-18 max-w-6xl">
          <SectionHeading title="ACTIVE SIGNALS" subtitle="Trending threads from across the village." />

          <div className="space-y-1.5">
            {topics.map((topic, i) => {
              const cat = allCategories.find((c) => c.slug === topic.categorySlug);
              const url = getTopicUrl(topic.id);
              const isClickable = live && url !== "#community-coming-soon";

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  {isClickable ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="group border border-border bg-card/40 px-4 py-3 hover:border-primary/40 transition-all cursor-pointer block">
                      <TopicRow topic={topic} cat={cat} />
                    </a>
                  ) : (
                    <div className="group border border-border bg-card/40 px-4 py-3 hover:border-primary/40 transition-all cursor-pointer">
                      <TopicRow topic={topic} cat={cat} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {live && (
            <div className="mt-4 text-center">
              <a
                href={getCommunityHomeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-secondary hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
              >
                View all topics <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </section>

      <section id="join" className="border-b border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-14 md:py-18 max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-2">
              JOIN THE NETWORK
            </h2>
            <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-md mx-auto text-left">
              Three steps. Free to enter. Upgrade if you want to go deeper.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { step: "01", title: "Create Account", desc: "Sign up and claim your callsign. Free and instant.", icon: UserPlus, color: "text-secondary" },
              { step: "02", title: "Enter The Village", desc: "Access all public channels. Post, reply, and connect.", icon: DoorOpen, color: "text-secondary" },
              { step: "03", title: "Gear Up", desc: "Grab merch or become a supporter to unlock gated channels.", icon: Shield, color: "text-orange-400" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                className="tactical-border bg-card p-5 text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Step {s.step}</div>
                <s.icon size={24} className={`mx-auto mb-3 ${s.color}`} />
                <h3 className="text-lg font-display text-white uppercase tracking-widest mb-1">{s.title}</h3>
                <p className="text-muted-foreground font-mono text-xs">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <a
              href={signupHref}
              target={live ? "_blank" : undefined}
              rel={live ? "noopener noreferrer" : undefined}
              className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-8 py-3 font-display text-xl uppercase tracking-widest transition-all inline-flex items-center gap-2"
            >
              <UserPlus size={20} /> Join The Village
            </a>
            <p className="text-muted-foreground font-mono text-[10px] mt-3 uppercase tracking-widest">
              Free &middot; No credit card &middot; Instant access
            </p>
          </div>
        </div>
      </section>

      <section id="perks" className="container mx-auto px-4 py-14 md:py-18 max-w-6xl">
        <SectionHeading title="MEMBER TIERS" subtitle="Three access levels. More unlocking as the network grows." />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["free", "supporter", "founder"] as const).map((tier) => {
            const tierPerks = perks.filter((p) => p.tier === tier);
            const tierLabels = { free: "Open Access", supporter: "Ronin Supporter", founder: "Founding Ninja" };
            const tierColors = { free: "border-secondary/30 bg-secondary/5", supporter: "border-orange-500/30 bg-orange-500/5", founder: "border-primary/30 bg-primary/5" };
            const tierBadge = { free: "text-secondary", supporter: "text-orange-500", founder: "text-primary" };
            const tierBorderHighlight = { free: "", supporter: "hover:border-orange-500/40", founder: "hover:border-primary/40" };
            const comingSoon = tier !== "free";

            return (
              <motion.div
                key={tier}
                className={`tactical-border bg-card p-5 relative ${comingSoon ? "opacity-80" : ""} ${tierBorderHighlight[tier]} transition-all`}
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

                {tier === "free" && (
                  <a
                    href={signupHref}
                    target={live ? "_blank" : undefined}
                    rel={live ? "noopener noreferrer" : undefined}
                    className="mt-5 w-full clip-diagonal bg-secondary/20 hover:bg-secondary/30 border border-secondary/30 text-secondary px-4 py-2 font-display text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    Sign Up Free <ArrowRight size={14} />
                  </a>
                )}
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

function TopicRow({ topic, cat }: { topic: ForumTopic; cat?: ForumCategory }) {
  return (
    <div className="flex items-center gap-3">
      {topic.authorAvatar && (
        <div className="hidden sm:block">
          <MiniAvatar initials={topic.authorAvatar} className="w-7 h-7 text-[10px]" />
        </div>
      )}

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
        {topic.excerpt && (
          <p className="text-[11px] font-mono text-muted-foreground/70 truncate mb-1 hidden md:block">
            {topic.excerpt}
          </p>
        )}
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
  );
}
