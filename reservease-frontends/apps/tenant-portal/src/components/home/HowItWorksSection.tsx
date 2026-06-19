import { Link } from "react-router-dom";
import { ArrowRight, FileText, Search, Gift, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Tell us what you need",
    description:
      "Share your budget, preferred location, room type, and must-haves. Takes under 2 minutes — no account required.",
    detail: "Budget · Location · Room type · Amenities",
  },
  {
    number: "02",
    icon: Search,
    title: "We do the searching",
    description:
      "Our system scans verified listings across Ghana and filters out the noise. Only real, inspected properties make it through.",
    detail: "Verified photos · Transparent pricing · No fake listings",
  },
  {
    number: "03",
    icon: Gift,
    title: "Receive your top 3 matches",
    description:
      "Within 24 hours, we send you up to 3 curated options via the app and WhatsApp — each with photos, pricing, and full details.",
    detail: "Delivered in 24–48h · Via WhatsApp & app",
  },
  {
    number: "04",
    icon: Handshake,
    title: "Move in stress-free",
    description:
      "Pick your favourite, coordinate with the landlord directly. If none of the matches work, we send a real agent to personally find your place.",
    detail: "No match? Human agent steps in at no extra cost",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 border-y border-border relative overflow-hidden">

      {/* Subtle dot background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container px-4 sm:px-6 mx-auto relative z-10">

        {/* Header */}
        <div className="max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            The process
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
            Four simple steps
            <br />
            <span className="text-muted-foreground font-medium">to your new home.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Our intelligent matching system combined with real human agents
            guarantees you get the best accommodation, completely stress-free.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative bg-background border border-border rounded-2xl p-7 md:p-9 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
              >
                {/* Number watermark */}
                <span className="absolute top-6 right-7 text-5xl font-black text-muted/30 select-none leading-none">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>

                <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 tracking-tight pr-12">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
                  {step.description}
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/8 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {step.detail}
                </div>

                {/* Connector arrow for non-last cards */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    {idx % 2 === 0 && (
                      <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="h-12 px-8 text-sm font-semibold rounded-xl" asChild>
            <Link to="/search">
              Start your search
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button variant="ghost" size="lg" className="h-12 px-8 text-sm font-semibold rounded-xl text-muted-foreground hover:text-foreground" asChild>
            <Link to="/pricing">See pricing →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}