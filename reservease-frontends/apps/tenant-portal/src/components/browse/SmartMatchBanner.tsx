import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/** Inline card — placed inside the grid as a full-width col-span item (desktop only). */
export function SmartMatchBannerInline() {
  return (
    <div className="hidden md:flex col-span-full items-center justify-between gap-6 rounded-2xl bg-brand-dark text-white px-8 py-6">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-base leading-tight">Want AI-ranked matches in 24 hours?</p>
          <p className="text-sm text-white/70 mt-0.5">
            Tell us exactly what you need — our agents find your top 3 verified options.
          </p>
        </div>
      </div>
      <Button
        asChild
        size="lg"
        className="shrink-0 bg-white text-brand-dark hover:bg-white/90 font-semibold"
      >
        <Link to="/search?for=self">
          Try Smart Match <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

/** Sticky bottom bar — shown on mobile, sits above the bottom nav. */
export function SmartMatchBannerMobile() {
  return (
    <div className="md:hidden fixed bottom-20 left-4 right-4 z-40 flex items-center justify-between gap-3 rounded-2xl bg-brand-dark text-white px-4 py-3 shadow-xl">
      <div className="flex items-center gap-2 min-w-0">
        <Sparkles className="h-4 w-4 shrink-0 text-white" />
        <p className="text-sm font-medium leading-tight truncate">
          Get AI matches in 24h
        </p>
      </div>
      <Button
        asChild
        size="sm"
        className="shrink-0 bg-white text-brand-dark hover:bg-white/90 font-semibold text-xs"
      >
        <Link to="/search?for=self">Try Smart Match</Link>
      </Button>
    </div>
  );
}
