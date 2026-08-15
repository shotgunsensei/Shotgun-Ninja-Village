import React, { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Radio,
  ShieldAlert,
} from "lucide-react";
import { BadgeGrid } from "@/components/community/BadgeGrid";
import { OperatorAvatar } from "@/components/community/OperatorAvatar";
import { usePageMeta } from "@/hooks/usePageMeta";
import { communityApi, type VillageUser } from "@/services/community";

export default function CommunityOperator() {
  const { callsign = "" } = useParams<{ callsign: string }>();
  const [operator, setOperator] = useState<VillageUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  usePageMeta({
    title: operator ? `@${operator.callsign}` : "Village Operator",
    description:
      operator?.bio ||
      "View a Shotgun Ninja Village operator profile and earned badges.",
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    communityApi
      .operator(callsign)
      .then((result) => active && setOperator(result.user))
      .catch(
        (requestError) =>
          active &&
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Operator could not be loaded",
          ),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [callsign]);

  if (loading)
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12" role="status">
        <div className="h-40 animate-pulse border border-border bg-card" />
        <span className="sr-only">Loading operator profile</span>
      </div>
    );
  if (error || !operator)
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <ShieldAlert size={34} className="mx-auto text-primary" />
        <h1 className="mt-3 font-display text-4xl uppercase text-white">
          Operator not found
        </h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">{error}</p>
        <Link
          href="/community"
          className="mt-6 inline-flex items-center gap-2 bg-primary px-4 py-2 font-mono text-xs uppercase text-white"
        >
          <ArrowLeft size={13} /> Back to the Village
        </Link>
      </div>
    );

  const earned = operator.badges.filter((badge) => badge.earned);
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-14">
      <Link
        href="/community"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase text-muted-foreground hover:text-white"
      >
        <ArrowLeft size={13} /> The Village
      </Link>
      <header className="operator-profile mt-6 border border-primary/35 bg-card p-6 md:p-9">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-5">
            <OperatorAvatar
              callsign={operator.callsign}
              color={operator.avatarColor}
              className="size-20 text-xl"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase text-primary">
                  Verified Village profile
                </span>
                {operator.tier !== "free" && (
                  <span className="border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[8px] uppercase text-amber-200">
                    {operator.tier}
                  </span>
                )}
              </div>
              <h1 className="text-balance font-display text-4xl uppercase text-white md:text-6xl">
                @{operator.callsign}
              </h1>
              <p className="font-mono text-sm text-slate-300">
                {operator.displayName}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px border border-border bg-border text-center">
            <div className="bg-background/80 p-3">
              <Award size={14} className="mx-auto text-primary" />
              <strong className="mt-1 block font-display text-xl tabular-nums text-white">
                {earned.length}
              </strong>
              <span className="font-mono text-[8px] uppercase text-muted-foreground">
                Badges
              </span>
            </div>
            <div className="bg-background/80 p-3">
              <Radio size={14} className="mx-auto text-cyan-300" />
              <strong className="mt-1 block font-display text-xl uppercase text-white">
                {operator.archetype ? "Locked" : "Open"}
              </strong>
              <span className="font-mono text-[8px] uppercase text-muted-foreground">
                Alignment
              </span>
            </div>
          </div>
        </div>
        <div className="mt-7 grid gap-5 border-t border-border pt-6 md:grid-cols-[1fr_auto]">
          <div>
            <span className="font-mono text-[9px] uppercase text-muted-foreground">
              Operator bio
            </span>
            <p className="mt-1 max-w-2xl whitespace-pre-wrap text-pretty text-sm leading-relaxed text-slate-200">
              {operator.bio || "This operator has not added a field note yet."}
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-muted-foreground">
            <CalendarDays size={13} /> Joined{" "}
            {new Intl.DateTimeFormat(undefined, {
              month: "short",
              year: "numeric",
            }).format(new Date(operator.createdAt))}
          </div>
        </div>
      </header>
      <section className="mt-9">
        <div className="mb-4">
          <span className="font-mono text-[10px] uppercase text-primary">
            Public recognition
          </span>
          <h2 className="text-balance font-display text-3xl uppercase text-white">
            Earned badges
          </h2>
        </div>
        {earned.length > 0 ? (
          <BadgeGrid badges={earned} showLocked={false} />
        ) : (
          <div className="border border-dashed border-border p-7 text-center font-mono text-xs text-muted-foreground">
            No public badges earned yet.
          </div>
        )}
      </section>
    </div>
  );
}
