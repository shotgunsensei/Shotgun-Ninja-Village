import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  Edit3,
  Eye,
  Lock,
  MessageCircle,
  Send,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { OperatorAvatar } from "@/components/community/OperatorAvatar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  communityApi,
  formatRelativeTime,
  type TopicDetail,
  type TopicPost,
} from "@/services/community";

const fieldClass =
  "w-full border border-input bg-background px-3 py-2.5 text-sm text-white outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

export default function CommunityTopic() {
  const { id = "" } = useParams<{ id: string }>();
  const { user, refresh } = useAuth();
  const [, navigate] = useLocation();
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [posts, setPosts] = useState<TopicPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState("");
  const [replyError, setReplyError] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);

  usePageMeta({
    title: topic?.title ?? "Village Topic",
    description:
      topic?.excerpt ?? "Read a discussion from the Shotgun Ninja Village.",
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await communityApi.topic(id);
      setTopic(result.topic);
      setPosts(result.posts);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Topic could not be loaded",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id, user?.id]);

  const submitReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const body = String(new FormData(form).get("body") ?? "");
    setReplying(true);
    setReplyError("");
    try {
      await communityApi.reply(id, body);
      form.reset();
      await load();
      await refresh();
    } catch (requestError) {
      setReplyError(
        requestError instanceof Error
          ? requestError.message
          : "Reply could not be published",
      );
    } finally {
      setReplying(false);
    }
  };

  const updateTitle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!topic) return;
    const title = String(new FormData(event.currentTarget).get("title") ?? "");
    try {
      await communityApi.updateTopic(topic.id, title);
      setEditingTitle(false);
      await load();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Title could not be updated",
      );
    }
  };

  const removeTopic = async () => {
    if (!topic) return;
    await communityApi.removeTopic(topic.id);
    navigate(`/community/${topic.categorySlug}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12" role="status">
        <div className="h-10 w-3/4 animate-pulse bg-muted" />
        <div className="mt-7 h-64 animate-pulse border border-border bg-card" />
        <span className="sr-only">Loading topic</span>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <ShieldAlert size={34} className="mx-auto text-primary" />
        <h1 className="mt-4 text-balance font-display text-4xl uppercase text-white">
          Signal unavailable
        </h1>
        <p
          role="alert"
          className="mt-2 text-pretty font-mono text-sm text-muted-foreground"
        >
          {error || "Topic not found"}
        </p>
        <Link
          href="/community"
          className="mt-6 inline-flex items-center gap-2 bg-primary px-4 py-2 font-mono text-xs uppercase text-white"
        >
          <ArrowLeft size={13} /> Back to the Village
        </Link>
      </div>
    );
  }

  const canManageTopic =
    topic.isMine || user?.role === "admin" || user?.role === "moderator";

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <Link
        href={`/community/${topic.categorySlug}`}
        className="inline-flex items-center gap-2 font-mono text-xs uppercase text-muted-foreground hover:text-white"
      >
        <ArrowLeft size={13} /> Back to board
      </Link>

      <header className="mt-6 border-b border-border pb-7">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase text-muted-foreground">
          <span className="text-primary">
            {topic.categorySlug.replaceAll("-", " ")}
          </span>
          <span>·</span>
          <span>{formatRelativeTime(topic.createdAt)}</span>
          {topic.locked && (
            <span className="flex items-center gap-1 text-amber-300">
              <Lock size={10} /> Locked
            </span>
          )}
        </div>
        {editingTitle ? (
          <form
            onSubmit={updateTitle}
            className="mt-3 flex flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="topic-title-edit">
              Topic title
            </label>
            <input
              id="topic-title-edit"
              name="title"
              defaultValue={topic.title}
              minLength={6}
              maxLength={140}
              className={fieldClass}
              required
              autoFocus
            />
            <button className="bg-primary px-4 py-2 font-mono text-xs uppercase text-white">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingTitle(false)}
              className="border border-border px-4 py-2 font-mono text-xs uppercase text-muted-foreground"
            >
              Cancel
            </button>
          </form>
        ) : (
          <h1 className="mt-2 text-balance font-display text-4xl uppercase leading-tight text-white md:text-6xl">
            {topic.title}
          </h1>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase text-muted-foreground">
            <span>
              <Eye size={12} className="mr-1 inline" />{" "}
              <span className="tabular-nums">{topic.viewCount}</span> views
            </span>
            <span>
              <MessageCircle size={12} className="mr-1 inline" />{" "}
              <span className="tabular-nums">
                {Math.max(0, posts.length - 1)}
              </span>{" "}
              replies
            </span>
          </div>
          {canManageTopic && (
            <div className="flex gap-2">
              <button
                onClick={() => setEditingTitle(true)}
                className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[10px] uppercase text-muted-foreground hover:text-white"
              >
                <Edit3 size={11} /> Edit title
              </button>
              <ConfirmDialog
                trigger={
                  <button className="inline-flex items-center gap-1.5 border border-primary/40 px-3 py-1.5 font-mono text-[10px] uppercase text-primary hover:bg-primary/10">
                    <Trash2 size={11} /> Remove topic
                  </button>
                }
                title="Remove this topic?"
                description="The topic and every reply will disappear from public boards. This cannot be undone from the site."
                confirmLabel="Remove topic"
                onConfirm={removeTopic}
              />
            </div>
          )}
        </div>
      </header>

      <section className="mt-7 space-y-3" aria-label="Discussion posts">
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            canModerate={user?.role === "admin" || user?.role === "moderator"}
            onChanged={load}
          />
        ))}
      </section>

      <section
        className="mt-8 border border-primary/35 bg-card p-5 md:p-6"
        aria-labelledby="reply-heading"
      >
        <h2
          id="reply-heading"
          className="text-balance font-display text-2xl uppercase text-white"
        >
          Add to the signal
        </h2>
        {topic.locked ? (
          <p className="mt-2 flex items-center gap-2 font-mono text-xs text-amber-200">
            <Lock size={13} /> This topic is locked to new replies.
          </p>
        ) : user ? (
          <form onSubmit={submitReply} className="mt-4">
            <label className="sr-only" htmlFor="reply-body">
              Your reply
            </label>
            <textarea
              id="reply-body"
              name="body"
              required
              minLength={2}
              maxLength={10000}
              rows={6}
              className={fieldClass}
              placeholder={`Reply as @${user.callsign}. Keep it useful and respectful.`}
            />
            {replyError && (
              <p role="alert" className="mt-2 font-mono text-xs text-red-200">
                {replyError}
              </p>
            )}
            <div className="mt-3 flex justify-end">
              <button
                disabled={replying}
                className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 font-mono text-xs uppercase text-white hover:bg-primary/90 disabled:opacity-60"
              >
                <Send size={13} /> {replying ? "Publishing…" : "Publish reply"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-3 flex flex-col items-start justify-between gap-4 border border-border bg-background/60 p-4 sm:flex-row sm:items-center">
            <p className="text-pretty font-mono text-xs text-muted-foreground">
              Visitors can read the complete discussion. A free callsign is
              required only to reply.
            </p>
            <Link
              href={`/account?mode=signup&returnTo=/community/topic/${topic.id}`}
              className="shrink-0 bg-primary px-4 py-2 font-mono text-xs uppercase text-white"
            >
              Create free account
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function PostCard({
  post,
  index,
  canModerate,
  onChanged,
}: {
  post: TopicPost;
  index: number;
  canModerate: boolean;
  onChanged: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const canManage = post.isMine || canModerate;

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await communityApi.updatePost(
        post.id,
        String(new FormData(event.currentTarget).get("body") ?? ""),
      );
      setEditing(false);
      await onChanged();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Post could not be updated",
      );
    }
  };

  const remove = async () => {
    await communityApi.removePost(post.id);
    await onChanged();
  };

  return (
    <article
      id={`post-${post.id}`}
      className={
        post.isOriginal
          ? "border border-primary/35 bg-card"
          : "border border-border bg-card/70"
      }
    >
      <div className="grid md:grid-cols-[180px_1fr]">
        <aside className="border-b border-border bg-background/45 p-4 md:border-b-0 md:border-r">
          <div className="flex items-center gap-3 md:block">
            <OperatorAvatar
              callsign={post.author}
              color={post.avatarColor}
              className="md:mb-3"
            />
            <div>
              <Link
                href={`/community/operator/${post.author}`}
                className="block truncate font-display text-lg uppercase text-white hover:text-primary"
              >
                @{post.author}
              </Link>
              <span className="block truncate font-mono text-[10px] text-muted-foreground">
                {post.authorDisplayName}
              </span>
            </div>
          </div>
          <PostFlair tier={post.authorTier} archetype={post.authorArchetype} />
        </aside>
        <div className="min-w-0 p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 font-mono text-[9px] uppercase text-muted-foreground">
            <span>
              #{String(index + 1).padStart(2, "0")} ·{" "}
              {formatRelativeTime(post.createdAt)}
              {post.updatedAt !== post.createdAt ? " · edited" : ""}
            </span>
            {canManage && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing((value) => !value);
                    setError("");
                  }}
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  <Edit3 size={10} /> Edit
                </button>
                {!post.isOriginal && (
                  <ConfirmDialog
                    trigger={
                      <button className="inline-flex items-center gap-1 text-primary hover:text-red-200">
                        <Trash2 size={10} /> Remove
                      </button>
                    }
                    title="Remove this reply?"
                    description="This reply will be removed from the discussion."
                    confirmLabel="Remove reply"
                    onConfirm={remove}
                  />
                )}
              </div>
            )}
          </div>
          {editing ? (
            <form onSubmit={save}>
              <textarea
                name="body"
                defaultValue={post.body}
                minLength={post.isOriginal ? 10 : 2}
                maxLength={10000}
                rows={7}
                className={fieldClass}
                required
              />
              {error && (
                <p role="alert" className="mt-2 font-mono text-xs text-red-200">
                  {error}
                </p>
              )}
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="border border-border px-3 py-1.5 font-mono text-[10px] uppercase text-muted-foreground"
                >
                  Cancel
                </button>
                <button className="bg-primary px-3 py-1.5 font-mono text-[10px] uppercase text-white">
                  Save edit
                </button>
              </div>
            </form>
          ) : (
            <p className="whitespace-pre-wrap break-words text-pretty text-sm leading-7 text-slate-200">
              {post.body}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function PostFlair({
  tier,
  archetype,
}: {
  tier: string;
  archetype: string | null;
}) {
  const tierLabel =
    tier === "founder"
      ? "Founding Ninja"
      : tier === "supporter"
        ? "Ronin Supporter"
        : "Village Initiate";
  const archetypes: Record<string, string> = {
    builder: "Forge Ghost",
    protector: "Heavy Vanguard",
    tracer: "Signal Hunter",
    breaker: "System Breaker",
  };
  return (
    <div className="mt-3 flex flex-wrap gap-1.5 md:block md:space-y-1.5">
      <span className="block w-fit border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase text-red-100">
        {tierLabel}
      </span>
      {archetype && (
        <span className="block w-fit border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 font-mono text-[8px] uppercase text-cyan-100">
          {archetypes[archetype] ?? archetype}
        </span>
      )}
    </div>
  );
}
