import { Check, ArrowUpRight, ShieldCheck, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "500+", label: "People housed" },
  { value: "24h", label: "Avg. match time" },
  { value: "4.9", label: "Average rating" },
  { value: "3", label: "Curated matches" },
];

const features = [
  {
    icon: Zap,
    title: "Precision over volume",
    description:
      "We don't flood you with 50 random listings. You get a maximum of 3 highly curated, verified accommodations hand-picked to match your exact lifestyle and budget.",
    checks: ["Verified photos", "No hidden fees", "Transparent pricing"],
    accent: "primary",
  },
  {
    icon: Users,
    title: "Human agents as backup",
    description:
      "When our matching system can't find the perfect fit right away, a real person steps in — personally hunting down your ideal place at no extra cost to you.",
    checks: ["No extra charge", "24–48h turnaround", "Direct communication"],
    accent: "primary",
  },
  {
    icon: ShieldCheck,
    title: "Peace of mind guarantee",
    description:
      "Every listing is physically verified by our team before it reaches you. If a property doesn't look like its photos, we refund your search fee — immediately.",
    checks: ["Physical verification", "Instant refund", "No questions asked"],
    accent: "success",
  },
];

export function ValueSection() {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">

      {/* ── Section header ── */}
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="max-w-2xl mx-auto mb-16 md:mb-20 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            Why ReservEase
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
            We do the searching.
            <br />
            <span className="text-muted-foreground font-medium">
              You make the choice.
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Stop scrolling through endless fake listings. Tell us what you need
            once — we bring back only the best.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden mb-20 md:mb-24">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-8 px-4 bg-background text-center"
            >
              <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {s.value}
              </span>
              <span className="text-sm text-muted-foreground mt-1.5">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Feature rows ── */}
        <div className="space-y-0 divide-y divide-border border-y border-border">
          {features.map((f, idx) => {
            const Icon = f.icon;
            const isReversed = idx % 2 !== 0;
            return (
              <div
                key={f.title}
                className={`flex flex-col md:flex-row gap-12 md:gap-20 py-16 md:py-20 ${
                  isReversed ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Text side */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 mb-6">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-4">
                    {f.title}
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                    {f.description}
                  </p>
                  <ul className="space-y-3">
                    {f.checks.map((c) => (
                      <li key={c} className="flex items-center gap-3 text-sm font-medium text-foreground">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual side */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 relative overflow-hidden">
                    {/* decorative corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[80px]" />

                    {idx === 0 && (
                      <div className="relative z-10 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Your matches
                        </p>
                        {["Studio near UMaT · GHS 450/mo", "1-bed in East Legon · GHS 900/mo", "Shared hostel, Kumasi · GHS 280/mo"].map(
                          (item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 rounded-xl bg-background border border-border text-sm"
                            >
                              <span className="font-medium text-foreground">{item}</span>
                              <span className="ml-3 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary" />
                              </span>
                            </div>
                          )
                        )}
                        <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex -space-x-2">
                            {[11, 12, 13].map((n) => (
                              <img
                                key={n}
                                src={`https://i.pravatar.cc/40?img=${n}`}
                                alt=""
                                className="w-6 h-6 rounded-full border-2 border-background object-cover"
                              />
                            ))}
                          </div>
                          <span>Over 500+ renters matched</span>
                        </div>
                      </div>
                    )}

                    {idx === 1 && (
                      <div className="relative z-10 space-y-5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Agent update
                        </p>
                        <div className="space-y-3">
                          {[
                            { t: "Request received", done: true },
                            { t: "Searching verified listings", done: true },
                            { t: "Agent assigned", done: true },
                            { t: "Matches being prepared", done: false },
                          ].map((step) => (
                            <div key={step.t} className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  step.done
                                    ? "bg-primary"
                                    : "border-2 border-border"
                                }`}
                              >
                                {step.done && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                              </div>
                              <span
                                className={`text-sm ${
                                  step.done ? "text-foreground font-medium" : "text-muted-foreground"
                                }`}
                              >
                                {step.t}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs text-primary font-medium">
                          ⚡ Your agent will WhatsApp you within 24h
                        </div>
                      </div>
                    )}

                    {idx === 2 && (
                      <div className="relative z-10 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Guarantee
                        </p>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
                          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              100% match guarantee
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Listing doesn't match photos?
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900">
                          <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                            Instant refund issued
                          </span>
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                            GHS 27.50
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          No forms, no waiting. Refunded immediately.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom link ── */}
        <div className="mt-16 text-center">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            See exactly how it works
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}