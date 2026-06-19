import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Shield, Star, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustItems = [
  { icon: Users, label: "500+ housed", sub: "across Ghana" },
  { icon: Star, label: "4.9 / 5", sub: "average rating" },
  { icon: Shield, label: "Verified only", sub: "every listing" },
];

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[100svh] md:min-h-screen flex flex-col justify-center overflow-hidden bg-background pt-0">

      {/* ── Atmospheric background — pure CSS, no image, no Framer opacity ── */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        {/* warm left blob */}
        <div className="absolute -left-40 top-0 h-[700px] w-[700px] rounded-full bg-primary/8 blur-[120px]" />
        {/* cool right blob */}
        <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-blue-500/6 blur-[120px]" />
        {/* centre glow */}
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/4 blur-[100px]" />

        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="container mx-auto relative z-10 flex flex-col items-center text-center px-4 sm:px-6 py-16 md:py-0">

        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background/80 backdrop-blur-sm mb-8 md:mb-10 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs md:text-sm font-medium text-foreground tracking-wide">
            Ghana's smartest accommodation search
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl mx-auto text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold text-foreground leading-[1.05] tracking-tight mb-6 md:mb-7 px-2">
          Finding your next
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          place{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-primary">should feel</span>
            {/* underline accent */}
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-primary/30" />
          </span>
          {" "}like magic.
        </h1>

        {/* Sub-headline */}
        <p className="max-w-xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 md:mb-12 px-4">
          Tell us what you need. We search verified listings and bring you up to 3
          perfect matches — within 24 hours.
        </p>

        {/* ── Search bar ── */}
        <div className="w-full max-w-2xl mx-auto mb-8 px-2 sm:px-0">
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate("/search?for=self")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/search?for=self")}
            className="group relative flex items-center h-[68px] sm:h-20 bg-background border-2 border-border hover:border-primary/60 rounded-2xl cursor-pointer overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex-1 flex items-center px-5 sm:px-7 gap-4">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-col items-start text-left min-w-0">
                <span className="text-sm sm:text-base font-semibold text-foreground truncate w-full">
                  Where do you want to live?
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground truncate w-full">
                  Tarkwa · Accra · Kumasi · any location
                </span>
              </div>
            </div>

            <div className="pr-3 sm:pr-4 flex-shrink-0">
              <div className="flex items-center justify-center h-11 w-11 sm:h-13 sm:w-13 rounded-xl bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>

          {/* Delegated search link */}
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Searching for someone else?{" "}
            <button
              onClick={() => navigate("/search?for=others")}
              className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              Search on their behalf →
            </button>
          </p>
        </div>

        {/* ── Trust strip ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-2">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/60 border border-border/60 w-full sm:w-auto"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-foreground leading-none">
                  {item.label}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {item.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-20 text-muted-foreground">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-border flex items-start justify-center pt-1.5">
          <div className="w-0.5 h-2 rounded-full bg-muted-foreground animate-bounce" />
        </div>
      </div>
    </section>
  );
}