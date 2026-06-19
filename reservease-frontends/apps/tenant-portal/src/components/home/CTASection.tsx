import { Link } from "react-router-dom";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const searchFee = Number(import.meta.env.VITE_SEARCH_FEE || 25);
const processingFee = Number(import.meta.env.VITE_PROCESSING_FEE || 2.5);
const totalFee = searchFee + processingFee;

export function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="max-w-5xl mx-auto">

          {/* ── Main CTA block ── */}
          <div className="relative rounded-3xl bg-[#001a35] overflow-hidden px-8 sm:px-14 md:px-20 py-16 md:py-20">

            {/* Atmospheric blobs inside the dark card */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-[80px]" />
              <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-blue-500/15 blur-[80px]" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
              {/* Left: text */}
              <div className="flex-1 max-w-xl">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary/80 mb-5">
                  Ready when you are
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-5">
                  Find your next home
                  <br />
                  <span className="text-white/60">
                    in under 48 hours.
                  </span>
                </h2>
                <p className="text-base md:text-lg text-white/60 leading-relaxed mb-2">
                  No account required. Just GHS {totalFee.toFixed(2)} — paid only after you
                  submit your preferences.
                </p>
                <div className="flex items-center gap-2 text-sm text-white/50 mt-4">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>100% refund if we can't find a match within 72h</span>
                </div>
              </div>

              {/* Right: action */}
              <div className="flex flex-col gap-4 flex-shrink-0 min-w-[200px]">
                <Button
                  size="lg"
                  className="h-13 px-8 text-base font-semibold rounded-xl bg-white text-[#001a35] hover:bg-white/90 transition-all w-full"
                  asChild
                >
                  <Link to="/search">
                    Start searching
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 px-8 text-base font-semibold rounded-xl border-white/15 text-white bg-white/5 hover:bg-white/10 hover:text-white transition-all w-full"
                  asChild
                >
                  <Link to="/how-it-works">How it works</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* ── Bottom strip: social proof ── */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {[11, 12, 13, 14].map((n) => (
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/40?img=${n}`}
                    alt=""
                    className="w-7 h-7 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <span>500+ people already housed</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <span>⭐ 4.9/5 average rating</span>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <span>🇬🇭 Made in Ghana</span>
          </div>
        </div>
      </div>
    </section>
  );
}