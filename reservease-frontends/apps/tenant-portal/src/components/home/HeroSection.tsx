import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Shield, Star, Users, Sparkles } from "lucide-react";

const trustItems = [
  { icon: Users, label: "500+ housed", sub: "across Ghana" },
  { icon: Star, label: "4.9 / 5", sub: "average rating" },
  { icon: Shield, label: "Verified only", sub: "every listing" },
];

const CATEGORY_PILLS = [
  { label: "All", value: "" },
  { label: "Hostels", value: "hostel" },
  { label: "Apartments", value: "apartment" },
  { label: "Hotels", value: "hotel-room" },
  { label: "Self-Contain", value: "self-contain" },
];

export function HeroSection() {
  const navigate = useNavigate();
  const [locationInput, setLocationInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = locationInput.trim();
    navigate(q ? `/explore?location=${encodeURIComponent(q)}` : "/explore");
  };

  const handleCategory = (value: string) => {
    navigate(value ? `/explore?category=${encodeURIComponent(value)}` : "/explore");
  };

  return (
    <section className="relative flex flex-col justify-center overflow-hidden bg-background pt-0 pb-8 md:pb-0">

      {/* ── Atmospheric background ── */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[700px] w-[700px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-blue-500/6 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/4 blur-[100px]" />
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
      <div className="container mx-auto relative z-10 flex flex-col items-center text-center px-4 sm:px-6 py-14 md:py-20">

        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background/80 backdrop-blur-sm mb-7 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs md:text-sm font-medium text-foreground tracking-wide">
            Ghana's smartest accommodation search
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl mx-auto text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.06] tracking-tight mb-5 md:mb-6 px-2">
          Find your perfect place{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-primary">in Ghana</span>
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-primary/30" />
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-lg mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 px-4">
          Browse verified listings for free, or let our AI find your top 3 matches in 24 hours.
        </p>

        {/* ── Search bar ── */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-5 px-2 sm:px-0">
          <div className="relative flex items-center h-[60px] sm:h-[68px] bg-background border-2 border-border hover:border-primary/60 focus-within:border-primary/60 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex-1 flex items-center px-4 sm:px-6 gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Where do you want to live? Accra · Kumasi · Tarkwa…"
                className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground outline-none font-medium"
                aria-label="Search by location"
              />
            </div>
            <div className="pr-2.5 sm:pr-3 flex-shrink-0">
              <button
                type="submit"
                className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                aria-label="Browse listings"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Smart Match link */}
          <p className="mt-3 text-sm text-muted-foreground">
            Want AI-ranked matches?{" "}
            <button
              type="button"
              onClick={() => navigate("/search?for=self")}
              className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              Try Smart Match →
            </button>
          </p>
        </form>

        {/* ── Category pills ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORY_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => handleCategory(pill.value)}
              className="px-4 py-2 rounded-full border border-border bg-background/80 text-sm font-medium text-foreground hover:bg-muted/60 hover:border-border/70 transition-all duration-150 shadow-xs"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* ── Trust strip ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
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
    </section>
  );
}
