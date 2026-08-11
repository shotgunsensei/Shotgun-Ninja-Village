import React from "react";
import { motion } from "framer-motion";
import { Radio, Activity, Mail, Award } from "lucide-react";
import { transmissions } from "@/data/transmissions";
import { getOperatorBadges, getQuizResult } from "@/lib/operatorRecord";
import { ShareButton } from "@/components/shared/ShareButton";

interface BadgeDef {
  id: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  earned: boolean;
}

export function OperatorRecord({ className = "" }: { className?: string }) {
  const badges = getOperatorBadges(transmissions.map((t) => t.num));
  const quiz = getQuizResult();

  // Only surface the panel once the fan has hit at least one milestone.
  if (badges.earnedCount === 0) return null;

  const defs: BadgeDef[] = [
    {
      id: "trilogy",
      label: "Full Transmission",
      desc: "All 3 transmissions watched",
      icon: Radio,
      earned: badges.trilogyComplete,
    },
    {
      id: "quiz",
      label: quiz ? quiz.name : "Alignment Locked",
      desc: quiz ? "Operator archetype calibrated" : "Take the alignment quiz",
      icon: Activity,
      earned: badges.quizComplete,
    },
    {
      id: "enlisted",
      label: "Archive Enlisted",
      desc: "Signal channel locked in",
      icon: Mail,
      earned: badges.enlisted,
    },
  ];

  const earnedLabels = defs.filter((d) => d.earned).map((d) => d.label);
  const shareTitle =
    badges.earnedCount === defs.length
      ? "Operator record complete — full trilogy watched, archetype calibrated, archive enlisted. Shotgun Ninjas."
      : `Operator record: ${earnedLabels.join(", ")} — Shotgun Ninjas. What's your record?`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`tactical-border bg-card/60 p-5 md:p-6 ${className}`}
      aria-label="Operator record"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-primary" />
          <h3 className="font-display text-xl text-white uppercase tracking-widest">
            Operator Record
          </h3>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest border border-border bg-background px-1.5 py-0.5">
            {badges.earnedCount}/{defs.length} Earned
          </span>
        </div>
        <ShareButton title={shareTitle} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {defs.map((b) => (
          <div
            key={b.id}
            className={`border p-3 flex items-start gap-3 transition-all ${
              b.earned
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-background/40 opacity-50"
            }`}
          >
            <div
              className={`p-1.5 border flex-shrink-0 ${
                b.earned
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <b.icon size={14} />
            </div>
            <div className="min-w-0">
              <div
                className={`font-display text-sm uppercase tracking-widest leading-tight ${
                  b.earned ? "text-white" : "text-muted-foreground"
                }`}
              >
                {b.label}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                {b.earned ? b.desc : `Locked — ${b.desc.toLowerCase()}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
