/**
 * MatchScoreBadge — displays the 0-100 match score with a colour-coded ring
 * and an expandable breakdown panel showing per-dimension scores.
 *
 * Used in:
 *  - AccommodationCard (compact variant)
 *  - Listing detail page (expanded variant with breakdown bars)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScoreBreakdown, MatchHighlight } from "@/lib/matching/types";

// ── Score colour thresholds ───────────────────────────────────────────────────
// 75+ = green  (great match)
// 50-74 = amber (decent match)
// <50 = red/muted (weak)

function scoreColor(score: number): { ring: string; text: string; bg: string } {
  if (score >= 75) return { ring: "ring-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" };
  if (score >= 50) return { ring: "ring-amber-400",  text: "text-amber-600  dark:text-amber-400",  bg: "bg-amber-400/10"  };
  return           { ring: "ring-red-400",    text: "text-red-600    dark:text-red-400",    bg: "bg-red-400/10"    };
}

function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent match";
  if (score >= 75) return "Great match";
  if (score >= 60) return "Good match";
  if (score >= 45) return "Decent match";
  return "Weak match";
}

// ── Compact badge (used on listing cards) ────────────────────────────────────

interface CompactBadgeProps {
  score: number;
  className?: string;
}

export function MatchScoreCompact({ score, className }: CompactBadgeProps) {
  const { ring, text, bg } = scoreColor(score);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset",
        bg, text, ring,
        className,
      )}
      aria-label={`${score}% match — ${scoreLabel(score)}`}
    >
      {score}% match
    </span>
  );
}

// ── Expanded badge (used on detail page) ─────────────────────────────────────

const DIMENSION_LABELS: Record<string, string> = {
  location:   "Location",
  budget:     "Budget",
  roomType:   "Room type",
  features:   "Amenities",
  resilience: "Power & Water",
  payment:    "Payment terms",
  trust:      "Trust & Security",
  lifestyle:  "Lifestyle",
};

interface DimensionBarProps {
  label: string;
  score: number;
}

function DimensionBar({ label, score }: DimensionBarProps) {
  const { text } = scoreColor(score);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className={cn("font-semibold tabular-nums", text)}>{score}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
          className={cn(
            "h-full rounded-full",
            score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-400" : "bg-red-400",
          )}
        />
      </div>
    </div>
  );
}

interface ExpandedBadgeProps {
  score: number;
  breakdown?: ScoreBreakdown;
  highlights?: MatchHighlight[];
  className?: string;
}

export function MatchScoreExpanded({ score, breakdown, highlights, className }: ExpandedBadgeProps) {
  const [open, setOpen] = useState(false);
  const { ring, text, bg } = scoreColor(score);
  const label = scoreLabel(score);

  const dimensionEntries = breakdown
    ? (Object.entries(breakdown) as [string, number | undefined][])
        .filter(([, v]) => v != null)
        .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    : [];

  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {/* Header row */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          {/* Score ring */}
          <div
            className={cn(
              "relative flex h-12 w-12 items-center justify-center rounded-full ring-2 shrink-0",
              ring, bg,
            )}
          >
            <span className={cn("text-sm font-black tabular-nums leading-none", text)}>{score}</span>
          </div>
          <div className="text-left">
            <p className={cn("text-sm font-semibold", text)}>{label}</p>
            <p className="text-xs text-muted-foreground">{score}% match score</p>
          </div>
        </div>
        {dimensionEntries.length > 0 && (
          open
            ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
            : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Highlights (always visible) */}
      {highlights && highlights.length > 0 && !open && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {highlights.slice(0, 3).map((h, i) => (
            <span
              key={i}
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                h.type === "positive" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                h.type === "warning"  && "bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-500/20",
                h.type === "neutral"  && "bg-muted text-muted-foreground border-border",
              )}
            >
              {h.text}
            </span>
          ))}
        </div>
      )}

      {/* Expandable breakdown */}
      <AnimatePresence>
        {open && dimensionEntries.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.2 } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.15 } }}
            className="overflow-hidden border-t border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {dimensionEntries.map(([dim, score]) => (
                <DimensionBar
                  key={dim}
                  label={DIMENSION_LABELS[dim] ?? dim}
                  score={score ?? 0}
                />
              ))}

              {highlights && highlights.length > 0 && (
                <div className="pt-2 border-t border-border space-y-1.5">
                  {highlights.map((h, i) => (
                    <p
                      key={i}
                      className={cn(
                        "text-xs flex items-start gap-1.5",
                        h.type === "positive" && "text-emerald-600 dark:text-emerald-400",
                        h.type === "warning"  && "text-amber-600  dark:text-amber-400",
                        h.type === "neutral"  && "text-muted-foreground",
                      )}
                    >
                      <span className="mt-px">
                        {h.type === "positive" ? "✓" : h.type === "warning" ? "!" : "·"}
                      </span>
                      {h.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
