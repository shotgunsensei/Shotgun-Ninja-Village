import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  Lock,
  MessageSquare,
  Plus,
  Search,
  Send,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { TopicRow } from "@/pages/Community";
import { usePageMeta } from "@/hooks/usePageMeta";
import { resolveIcon } from "@/lib/iconMap";
import {
  communityApi,
  type CommunityCategory,
  type TopicSummary,
} from "@/services/community";

const fieldClass =
  "w-full border border-input bg-background px-3 py-2.5 text-sm text-white outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

export default function CommunityBoard() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [category, setCategory] = useState<CommunityCategory | null>(null);
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  usePageMeta({
    title: category?.name ?? "Village Message Board",
    description:
      category?.description ??
      "Browse and contribute to a Shotgun Ninja Village message board.",
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [categoryResult, topicResult] = await Promise.all([
        communityApi.categories(),
        communityApi.topics({ category: slug, q: appliedQuery, page }),
      ]);
      setCategory(
        categoryResult.categories.find((item) => item.slug === slug) ?? null,
      );
      setTopics(topicResult.topics);
      setHasMore(topicResult.hasMore);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "This board could not be loaded",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [slug, appliedQuery, page, user?.id]);

  useEffect(() => {
    setPage(1);
  }, [slug]);

  const publishTopic = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!category) return;
    const data = new FormData(event.currentTarget);
    setPublishing(true);
    setFormError("");
    try {
      const result = await communityApi.createTopic({
        categorySlug: category.slug,
        title: String(data.get("title") ?? ""),
        body: String(data.get("body") ?? ""),
      });
      navigate(`/community/topic/${result.id}`);
    } catch (requestError) {
      setFormError(
        requestError instanceof Error
          ? requestError.message
          : "Topic could not be published",
      );
    } finally {
      setPublishing(false);
    }
  };

  const Icon = category
    ? resolveIcon(category.icon, MessageSquare)
    : MessageSquare;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <Link
        href="/community"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase text-muted-foreground hover:text-white"
      >
        <ArrowLeft size={13} /> All message boards
      </Link>

      {category && (
        <header className="mt-6 border-b border-border pb-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="flex max-w-3xl items-start gap-4">
              <span
                className={`flex size-12 shrink-0 items-center justify-center border border-primary/40 bg-primary/10 ${category.color}`}
              >
                <Icon size={22} aria-hidden="true" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-balance font-display text-4xl uppercase text-white md:text-5xl">
                    {category.name}
                  </h1>
                  {category.locked && (
                    <span className="flex items-center gap-1 border border-amber-400/30 bg-amber-400/10 px-2 py-1 font-mono text-[9px] uppercase text-amber-200">
                      <Lock size={10} /> {category.requiredTier}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-pretty font-mono text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase text-slate-400 tabular-nums">
                  {category.topicCount} topics · {category.postCount} posts
                </p>
              </div>
            </div>
            {category.canCreateTopic ? (
              <button
                onClick={() => setComposerOpen((value) => !value)}
                className="inline-flex shrink-0 items-center justify-center gap-2 bg-primary px-5 py-2.5 font-display text-lg uppercase text-white hover:bg-primary/90"
                aria-expanded={composerOpen}
              >
                <Plus size={17} /> New topic
              </button>
            ) : !user ? (
              <Link
                href={`/account?mode=login&returnTo=/community/${slug}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 bg-primary px-5 py-2.5 font-display text-lg uppercase text-white hover:bg-primary/90"
              >
                <Send size={16} /> Sign in to post
              </Link>
            ) : null}
          </div>
        </header>
      )}

      {composerOpen && category?.canCreateTopic && (
        <section
          className="mt-6 border border-primary/40 bg-card p-5 md:p-6"
          aria-labelledby="new-topic-heading"
        >
          <h2
            id="new-topic-heading"
            className="text-balance font-display text-2xl uppercase text-white"
          >
            Start a new signal
          </h2>
          <p className="mt-1 text-pretty font-mono text-xs text-muted-foreground">
            Plain text only. Be specific, constructive, and respectful of the
            operators reading.
          </p>
          {formError && (
            <p
              role="alert"
              className="mt-4 border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-xs text-red-200"
            >
              {formError}
            </p>
          )}
          <form onSubmit={publishTopic} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs uppercase text-slate-300">
                Topic title
              </span>
              <input
                name="title"
                required
                minLength={6}
                maxLength={140}
                className={fieldClass}
                placeholder="What should operators know?"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs uppercase text-slate-300">
                Opening post
              </span>
              <textarea
                name="body"
                required
                minLength={10}
                maxLength={10000}
                rows={7}
                className={fieldClass}
                placeholder="Add context, what you tried, or the idea you want to discuss."
              />
            </label>
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="border border-border px-4 py-2 font-mono text-xs uppercase text-muted-foreground hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={publishing}
                className="inline-flex items-center gap-2 bg-primary px-5 py-2 font-mono text-xs uppercase text-white hover:bg-primary/90 disabled:opacity-60"
              >
                <Send size={13} />{" "}
                {publishing ? "Publishing…" : "Publish topic"}
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="mt-7 grid gap-4 md:grid-cols-[1fr_auto]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setAppliedQuery(query.trim());
          }}
          className="flex max-w-xl"
        >
          <label className="sr-only" htmlFor="board-search">
            Search this board
          </label>
          <input
            id="board-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={`${fieldClass} border-r-0`}
            placeholder="Search topic titles"
          />
          <button
            className="flex size-11 shrink-0 items-center justify-center border border-primary bg-primary text-white hover:bg-primary/90"
            aria-label="Search topics"
          >
            <Search size={16} />
          </button>
        </form>
        {appliedQuery && (
          <button
            onClick={() => {
              setQuery("");
              setAppliedQuery("");
              setPage(1);
            }}
            className="font-mono text-xs uppercase text-muted-foreground underline hover:text-white"
          >
            Clear search
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 border border-primary/40 bg-primary/10 p-5"
        >
          <ShieldAlert size={20} className="text-primary" />
          <h2 className="mt-2 font-display text-2xl uppercase text-white">
            Board unavailable
          </h2>
          <p className="font-mono text-xs text-muted-foreground">{error}</p>
        </div>
      )}
      {loading ? (
        <div className="mt-6 space-y-2" role="status">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse border border-border bg-card"
            />
          ))}
          <span className="sr-only">Loading topics</span>
        </div>
      ) : !error && topics.length > 0 ? (
        <div className="mt-6">
          <div className="space-y-2">
            {topics.map((topic) => (
              <TopicRow
                key={topic.id}
                topic={topic}
                category={category ?? undefined}
              />
            ))}
          </div>
          {(page > 1 || hasMore) && (
            <nav
              className="mt-6 flex items-center justify-between border-t border-border pt-4"
              aria-label="Topic pages"
            >
              <button
                disabled={page === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="border border-border px-4 py-2 font-mono text-xs uppercase text-muted-foreground hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="font-mono text-[10px] uppercase text-muted-foreground tabular-nums">
                Page {page}
              </span>
              <button
                disabled={!hasMore}
                onClick={() => setPage((value) => value + 1)}
                className="border border-border px-4 py-2 font-mono text-xs uppercase text-muted-foreground hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      ) : !error ? (
        <div className="mt-6 border border-dashed border-border bg-card/40 p-9 text-center">
          <MessageSquare size={28} className="mx-auto text-primary" />
          <h2 className="mt-3 text-balance font-display text-2xl uppercase text-white">
            {appliedQuery ? "No matching signals" : "No topics yet"}
          </h2>
          <p className="mx-auto mt-1 max-w-md text-pretty font-mono text-xs text-muted-foreground">
            {appliedQuery
              ? "Try a broader search or clear the filter."
              : user && category?.canCreateTopic
                ? "Start the first useful conversation in this channel."
                : "Sign in with a free account to start the first conversation."}
          </p>
          {!appliedQuery && !user && (
            <Link
              href={`/account?mode=signup&returnTo=/community/${slug}`}
              className="mt-5 inline-flex items-center gap-2 bg-primary px-4 py-2 font-mono text-xs uppercase text-white"
            >
              <Plus size={13} /> Claim a callsign
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}
