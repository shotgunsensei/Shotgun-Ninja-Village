import React from "react";
import { Award, Check, LockKeyhole } from "lucide-react";
import type { BadgeView } from "@/services/community";

export function BadgeGrid({
  badges,
  showLocked = true,
}: {
  badges: BadgeView[];
  showLocked?: boolean;
}) {
  const visible = showLocked ? badges : badges.filter((badge) => badge.earned);
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {visible.map((badge) => (
        <div
          key={badge.id}
          className={
            badge.earned
              ? "border border-primary/40 bg-primary/5 p-4"
              : "border border-border bg-background/40 p-4 opacity-65"
          }
        >
          <div className="flex items-start gap-3">
            <span
              className={
                badge.earned
                  ? "flex size-8 items-center justify-center border border-primary/40 text-primary"
                  : "flex size-8 items-center justify-center border border-border text-muted-foreground"
              }
            >
              {badge.earned ? (
                <Award size={16} aria-hidden="true" />
              ) : (
                <LockKeyhole size={15} aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-balance font-display text-lg uppercase text-white">
                  {badge.label}
                </h3>
                {badge.earned && (
                  <Check
                    size={13}
                    className="text-emerald-400"
                    aria-label="Earned"
                  />
                )}
              </div>
              <p className="text-pretty font-mono text-[11px] leading-relaxed text-muted-foreground">
                {badge.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
