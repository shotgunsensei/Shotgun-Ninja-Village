import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Award,
  Crown,
  Eye,
  Flame,
  Lock,
  MessageCircle,
  MessageSquare,
  Pin,
  Radio,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { OperatorAvatar } from "@/components/community/OperatorAvatar";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { usePageMeta } from "@/hooks/usePageMeta";
import { resolveIcon } from "@/lib/iconMap";
import {
  communityApi,
  formatRelativeTime,
  type CommunityCategory,
  type CommunityStats,
  type TopicSummary,
} from "@/services/community";

const emptyStats: CommunityStats = {
  totalMembers: 0,
  onlineNow: 0,
  totalTopics: 0,
  totalPosts: 0,
  newestMember: null,
};

export default function Community() {
  usePageMeta({
    title: "The Village Community",
    description:
      "Browse public Shotgun Ninja message boards, create an operator account, post topics, reply, and earn persistent badges.",
  });
  const { user } = useAuth();
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [stats, setStats] = useState<CommunityStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      communityApi.categories(),
      communityApi.topics(),
      communityApi.stats(),
    ])
      .then(([categoryResult, topicResult, statsResult]) => {
        if (!active) return;
        setCategories(categoryResult.categories);
        setTopics(topicResult.topics.slice(0, 8));
        setStats(statsResult);
      })
      .catch(
        (requestError) =>
          active &&
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Village channels are unavailable",
          ),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user?.id]);

  return (
    <div className="min-h-[100dvh]">
      <section className="community-hero relative overflow-hidden border-b border-primary/25">
        <div className="relative z-10 container mx-auto grid max-w-6xl gap-8 px-4 py-14 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-xs uppercase text-cyan-200">
              <Radio
                size={13}
                className="motion-safe:animate-pulse"
                aria-hidden="true"
              />{" "}
              Public network online
            </div>
            <h1 className="text-balance font-display text-6xl font-bold uppercase leading-[0.9] text-white md:text-8xl">
              The
              <br />
              <span className="text-primary">Village</span>
            </h1>
            <p className="mt-5 max-w-2xl text-pretty font-mono text-sm leading-relaxed text-slate-300 md:text-base">
              Read every public board as a visitor. Claim a free callsign to
              start topics, reply to operators, sync your alignment, and build a
              badge record that travels with your profile.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {user ? (
                <Link
                  href="/community/village-gate"
                  className="inline-flex items-center gap-2 bg-primary px-5 py-3 font-display text-lg uppercase text-white hover:bg-primary/90"
                >
                  Enter the boards <ArrowRight size={17} />
                </Link>
              ) : (
                <Link
                  href="/account?mode=signup&returnTo=/community"
                  className="inline-flex items-center gap-2 bg-primary px-5 py-3 font-display text-lg uppercase text-white hover:bg-primary/90"
                >
                  <UserPlus size={17} /> Claim a callsign
                </Link>
              )}
              <a
                href="#channels"
                className="inline-flex items-center gap-2 border border-white/20 bg-background/70 px-5 py-3 font-display text-lg uppercase text-white hover:border-cyan-400/40"
              >
                Browse as visitor <ArrowRight size={17} />
              </a>
            </div>
          </div>

          <div className="border border-white/15 bg-background/80 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">
                Network telemetry
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-emerald-300">
                <span className="size-1.5 bg-emerald-400" /> Live data
              </span>
            </div>
            <div className="grid grid-cols-2 gap-px border border-border bg-border">
              {[
                { label: "Operators", value: stats.totalMembers, Icon: Users },
                { label: "Online now", value: stats.onlineNow, Icon: Radio },
                {
                  label: "Topics",
                  value: stats.totalTopics,
                  Icon: MessageSquare,
                },
                {
                  label: "Posts",
                  value: stats.totalPosts,
                  Icon: MessageCircle,
                },
              ].map(({ label, value, Icon }) => (
                <div key={label} className="bg-card p-4">
                  <Icon
                    size={14}
                    className="mb-2 text-primary"
                    aria-hidden="true"
                  />
                  <strong className="block font-display text-2xl tabular-nums text-white">
                    {Number(value).toLocaleString()}
                  </strong>
                  <span className="font-mono text-[9px] uppercase text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            {stats.newestMember && (
              <p className="mt-3 font-mono text-[10px] text-muted-foreground">
                Newest signal:{" "}
                <Link
                  href={`/community/operator/${stats.newestMember}`}
                  className="text-cyan-300"
                >
                  @{stats.newestMember}
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="container mx-auto max-w-6xl px-4 pt-8">
          <div
            role="alert"
            className="border border-primary/40 bg-primary/10 p-4 font-mono text-sm text-red-100"
          >
            <strong className="block uppercase">
              Community uplink unavailable
            </strong>
            <span className="mt-1 block text-xs text-muted-foreground">
              {error}. No placeholder activity is being presented as live.
            </span>
          </div>
        </div>
      )}

      <section
        id="channels"
        className="container mx-auto max-w-6xl px-4 py-12 md:py-16"
      >
        <SectionHeading
          title="Message Boards"
          subtitle="Public channels are readable without an account. Sign in only when you want to contribute."
        />
        {loading ? (
          <ChannelSkeleton />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-border bg-card/35">
        <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <SectionHeading
              title="Active Signals"
              subtitle="The latest live discussions from across accessible channels."
            />
            <Link
              href="/community/village-gate"
              className="mb-8 inline-flex items-center gap-1 font-mono text-xs uppercase text-cyan-300 hover:text-white"
            >
              All discussions <ArrowRight size={13} />
            </Link>
          </div>
          {!loading && topics.length === 0 ? (
            <div className="border border-dashed border-border bg-background/40 p-8 text-center">
              <MessageSquare
                size={28}
                className="mx-auto text-primary"
                aria-hidden="true"
              />
              <h3 className="mt-3 text-balance font-display text-2xl uppercase text-white">
                The channel is clear
              </h3>
              <p className="mx-auto mt-1 max-w-md text-pretty font-mono text-xs text-muted-foreground">
                Be the first operator to introduce yourself at the Village Gate.
              </p>
              <Link
                href={
                  user
                    ? "/community/village-gate"
                    : "/account?mode=signup&returnTo=/community/village-gate"
                }
                className="mt-5 inline-flex items-center gap-2 bg-primary px-4 py-2 font-mono text-xs uppercase text-white"
              >
                Start the first signal <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {topics.map((topic) => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  category={categories.find(
                    (item) => item.slug === topic.categorySlug,
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <SectionHeading
          title="Access & Recognition"
          subtitle="The free community is live now. Paid recognition stays gated until it can be granted honestly."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <TierCard
            icon={ShieldCheck}
            title="Open Access"
            status="Available now"
            color="text-cyan-300"
            perks={[
              "Read every public board",
              "Create topics and replies",
              "Persistent profile and milestone badges",
            ]}
          />
          <TierCard
            icon={Award}
            title="Ronin Supporter"
            status="Rollout pending"
            color="text-amber-300"
            perks={[
              "Supporter flair on posts",
              "Ronin Lounge access",
              "Future early merch windows",
            ]}
          />
          <TierCard
            icon={Crown}
            title="Founding Ninja"
            status="Grant-only"
            color="text-primary"
            perks={[
              "Permanent founder badge",
              "Founders Chamber access",
              "First-look feedback windows",
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ category }: { category: CommunityCategory }) {
  const Icon = resolveIcon(category.icon, MessageCircle);
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex size-9 items-center justify-center border border-border bg-background ${category.color}`}
        >
          <Icon size={17} aria-hidden="true" />
        </span>
        {category.locked && (
          <span className="flex items-center gap-1 border border-amber-400/30 bg-amber-400/10 px-2 py-1 font-mono text-[9px] uppercase text-amber-200">
            <Lock size={10} /> {category.requiredTier}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-balance font-display text-2xl uppercase text-white group-hover:text-primary">
        {category.name}
      </h3>
      <p className="mt-1 min-h-12 text-pretty font-mono text-xs leading-relaxed text-muted-foreground">
        {category.description}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] uppercase text-muted-foreground">
        <span className="tabular-nums">
          {category.topicCount} topics · {category.postCount} posts
        </span>
        <span
          className={category.canAccess ? "text-cyan-300" : "text-amber-300"}
        >
          {category.canAccess ? "Open →" : "Locked"}
        </span>
      </div>
    </>
  );
  const classes =
    "group block border bg-card p-5 transition-colors " +
    (category.canAccess
      ? "border-border hover:border-primary/50"
      : "border-amber-400/20 opacity-80");
  return category.canAccess ? (
    <Link href={`/community/${category.slug}`} className={classes}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}

export function TopicRow({
  topic,
  category,
}: {
  topic: TopicSummary;
  category?: CommunityCategory;
}) {
  return (
    <Link
      href={`/community/topic/${topic.id}`}
      className="group grid gap-3 border border-border bg-background/65 p-4 hover:border-primary/45 sm:grid-cols-[auto_1fr_auto] sm:items-center"
    >
      <OperatorAvatar callsign={topic.author} className="size-9" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {topic.pinned && (
            <Pin
              size={12}
              className="shrink-0 text-primary"
              aria-label="Pinned"
            />
          )}
          {topic.replyCount >= 10 && (
            <Flame
              size={12}
              className="shrink-0 text-amber-400"
              aria-label="Active"
            />
          )}
          <h3 className="line-clamp-1 text-balance font-display text-lg uppercase text-white group-hover:text-primary">
            {topic.title}
          </h3>
        </div>
        <p className="mt-0.5 line-clamp-1 text-pretty font-mono text-[11px] text-muted-foreground">
          {topic.excerpt}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase text-muted-foreground">
          <span className="text-slate-300">@{topic.author}</span>
          <span>in {category?.name ?? topic.categorySlug}</span>
          <span>{formatRelativeTime(topic.lastPostedAt)}</span>
        </div>
      </div>
      <div className="flex gap-3 font-mono text-[10px] text-muted-foreground sm:block sm:text-right">
        <span className="block tabular-nums">
          <MessageCircle size={11} className="mr-1 inline" />
          {topic.replyCount}
        </span>
        <span className="block tabular-nums">
          <Eye size={11} className="mr-1 inline" />
          {topic.viewCount}
        </span>
      </div>
    </Link>
  );
}

function TierCard({
  icon: Icon,
  title,
  status,
  color,
  perks,
}: {
  icon: React.ElementType;
  title: string;
  status: string;
  color: string;
  perks: string[];
}) {
  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <Icon size={20} className={color} />
        <span className="border border-border bg-background px-2 py-1 font-mono text-[8px] uppercase text-muted-foreground">
          {status}
        </span>
      </div>
      <h3 className="mt-4 text-balance font-display text-2xl uppercase text-white">
        {title}
      </h3>
      <ul className="mt-4 space-y-2">
        {perks.map((perk) => (
          <li
            key={perk}
            className="flex gap-2 text-pretty font-mono text-xs text-muted-foreground"
          >
            <ArrowRight size={11} className={`mt-0.5 shrink-0 ${color}`} />
            {perk}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChannelSkeleton() {
  return (
    <div
      className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-live="polite"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-48 animate-pulse border border-border bg-card"
        />
      ))}
      <span className="sr-only">Loading message boards</span>
    </div>
  );
}
