import React from "react";
import { cn } from "@/lib/utils";
import type { VillageUser } from "@/services/community";

const colorClasses: Record<VillageUser["avatarColor"], string> = {
  crimson: "border-red-500/50 bg-red-500/15 text-red-100",
  cyan: "border-cyan-400/50 bg-cyan-400/15 text-cyan-100",
  amber: "border-amber-400/50 bg-amber-400/15 text-amber-100",
  emerald: "border-emerald-400/50 bg-emerald-400/15 text-emerald-100",
  violet: "border-violet-400/50 bg-violet-400/15 text-violet-100",
};

export function OperatorAvatar({
  callsign,
  color = "crimson",
  className,
}: {
  callsign: string;
  color?: VillageUser["avatarColor"];
  className?: string;
}) {
  const initials =
    callsign
      .replace(/[^a-z0-9]/gi, "")
      .slice(0, 2)
      .toUpperCase() || "SN";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center border font-mono text-xs font-bold",
        colorClasses[color],
        className,
      )}
    >
      {initials}
    </span>
  );
}
