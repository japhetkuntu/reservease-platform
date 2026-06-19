import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Search,
  Gift,
  Handshake,
  Key,
  Check,
  ChevronDown,
  Shield,
  Zap,
  MessageCircle,
  MapPin,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

const searchFee = Number(import.meta.env.VITE_SEARCH_FEE || 25);
const processingFee = Number(import.meta.env.VITE_PROCESSING_FEE || 2.5);
const totalFee = searchFee + processingFee;

// ─── Step data ────────────────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    icon: FileText,
    label: "Submit your request",
    heading: "Tell us exactly what you need.",
    body: "Share your budget, preferred location, room type, and must-have amenities. No account needed — the whole form takes under 2 minutes.",
    tags: ["Takes < 2 min", "No signup", "Available 24/7"],
    visual: "form",
  },
  {
    number: "02",
    icon: Search,
    label: "We search for you",
    heading: "We scan every verified listing so you don't have to.",
    body: "Our system and agents review your preferences and search only verified accommodations — real photos, real prices, no duplicates or ghost listings.",
    tags: ["Verified only", "Real photos", "Transparent pricing"],
    visual: "search",
  },
  {
    number: "03",
    icon: Gift,
    label: "Receive your matches",
    heading: "Up to 3 curated options — within 24 hours.",
    body: "You receive your hand-picked matches via the app and WhatsApp. Each includes photos, full pricing, and everything you need to decide.",
    tags: ["24–48h turnaround", "Via WhatsApp & app", "Max 3 quality picks"],
    visual: "matches",
  },
  {
    number: "04",
    icon: Handshake,
    label: "Choose your favourite",
    heading: "No pressure. Take your time.",
    body: "Review your options, ask us anything, request more info. Pick the one that feels right — we're here to answer every question.",
    tags: ["No pressure", "Direct agent support", "Compare easily"],
    visual: "choose",
  },
  {
    number: "05",
    icon: Key,
    label: "Move in stress-free",
    heading: "You show up. We've handled the rest.",
    body: "We coordinate with the property directly. You pay rent to the landlord — we never touch that money. If none of the matches worked, a human agent personally finds your place at no extra cost.",
    tags: ["Smooth handover", "Agent backup", "Ongoing support"],
    visual: "movein",
  },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "How much does it cost?",
    a: `Each search costs GHS ${totalFee.toFixed(2)}. That covers the personalised search, verification, and agent support — not the accommodation itself. You pay rent directly to the landlord.`,
  },
  {
    q: "Why do I pay before seeing results?",
    a: "Your payment covers the real work: searching, verifying, and matching. We're a service, not a free listings site — this ensures you get genuine, personalised attention rather than random automated results.",
  },
  {
    q: "How quickly will I get recommendations?",
    a: "You'll receive your matches within 24–48 hours. If no exact matches are found, we assign a real human agent who personally finds options for you.",
  },
  {
    q: "Why only 3 options maximum?",
    a: "Quality over quantity. Instead of overwhelming you with 50+ random listings, we carefully select up to 3 accommodations that truly match your preferences. Less noise, better choices.",
  },
  {
    q: "What if nothing matches my preferences?",
    a: "A real human agent steps in — at no extra cost — to personally search for options and get back to you within 24–48 hours. You're never left without support.",
  },
  {
    q: "Can I get a refund?",
    a: "If we're unable to provide any options within 72 hours of your request, you can request a full refund. Partial refunds may be considered for exceptional circumstances.",
  },
];

// ─── Visual mockups per step ──────────────────────────────────────────────────
function StepVisual({ type }: { type: string }) {
  if (type === "form") {
    return (
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Your preferences</p>
        {[
          { icon: MapPin, label: "Location", value: "Tarkwa, Western Region" },
          { icon: Clock, label: "Budget", value: "GHS 400 – 700 / month" },
          { icon: Gift, label: "Room type", value: "Self-contained, furnished" },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <row.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{row.label}</p>
              <p className="text-sm font-semibold text-foreground truncate">{row.value}</p>
            </div>
          </div>
        ))}
        <div className="mt-4 w-full h-10 rounded-xl bg-primary flex items-center justify-center gap-2 text-sm font-semibold text-primary-foreground">
          Submit request <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    );
  }

  if (type === "search") {
    return (
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Search in progress</p>
        {[
          { label: "Scanning verified listings", done: true },
          { label: "Filtering by your budget", done: true },
          { label: "Checking photos & info", done: true },
          { label: "Removing duplicates", done: false, active: true },
          { label: "Ranking top matches", done: false },
        ].map((step) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
              step.done ? "bg-primary" : step.active ? "border-2 border-primary" : "border-2 border-border"
            )}>
              {step.done && <Check className="h-3 w-3 text-primary-foreground" />}
              {step.active && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
            </div>
            <span className={cn(
              "text-sm",
              step.done ? "text-foreground font-medium" : step.active ? "text-primary font-semibold" : "text-muted-foreground"
            )}>
              {step.label}
            </span>
          </div>
        ))}
        <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs font-medium text-primary">
          ⚡ Processing 2,400+ listings across Ghana
        </div>
      </div>
    );
  }

  if (type === "matches") {
    return (
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Your matches</p>
        {[
          { name: "Studio near UMaT campus", price: "GHS 450/mo", tag: "Best match" },
          { name: "1-bed, East Tarkwa", price: "GHS 600/mo", tag: "Most popular" },
          { name: "Shared room, furnished", price: "GHS 290/mo", tag: "Best value" },
        ].map((m, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
            <div>
              <p className="text-sm font-semibold text-foreground">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.price}</p>
            </div>
            <span className="ml-3 text-[10px] font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
              {m.tag}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
          <div className="flex -space-x-1.5">
            {[11, 12, 13].map((n) => (
              <img key={n} src={`https://i.pravatar.cc/40?img=${n}`} alt="" className="w-5 h-5 rounded-full border border-background" />
            ))}
          </div>
          Delivered via WhatsApp in 24h
        </div>
      </div>
    );
  }

  if (type === "choose") {
    return (
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Compare options</p>
        {[
          { name: "Studio near UMaT", selected: true, price: "GHS 450/mo", rating: "4.8" },
          { name: "1-bed, East Tarkwa", selected: false, price: "GHS 600/mo", rating: "4.6" },
        ].map((opt, i) => (
          <div key={i} className={cn(
            "p-4 rounded-xl border-2 transition-colors",
            opt.selected ? "border-primary bg-primary/5" : "border-border bg-background"
          )}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{opt.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.price}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-foreground">{opt.rating}</span>
              </div>
            </div>
            {opt.selected && (
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary">
                <Check className="h-3.5 w-3.5" /> Selected
              </div>
            )}
          </div>
        ))}
        <button className="w-full mt-2 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
          Confirm selection →
        </button>
      </div>
    );
  }

  if (type === "movein") {
    return (
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Move-in checklist</p>
        {[
          "Agent confirmed with landlord",
          "Lease agreement reviewed",
          "Property matches photos",
          "Keys collected",
          "You're home 🎉",
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className={i === 4 ? "font-semibold text-foreground" : "text-foreground"}>{item}</span>
          </div>
        ))}
        <div className="mt-4 p-3 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900 text-sm font-medium text-green-700 dark:text-green-400">
          🛡 Peace of Mind Guarantee active
        </div>
      </div>
    );
  }

  return null;
}

// ─── FAQ accordion item ───────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left gap-4 group"
      >
        <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {q}
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200",
          open && "rotate-180"
        )} />
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        open ? "max-h-96 pb-5" : "max-h-0"
      )}>
        <p className="text-base text-muted-foreground leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HowItWorks() {
  return (
    <Layout>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[100px]" />
          <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
        </div>
        <div className="container px-4 sm:px-6 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-5">
              How it works
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-6">
              Finding home
              <br />
              <span className="text-muted-foreground font-medium">made simple.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
              No endless scrolling. No fake listings. Tell us what you need — we
              deliver verified matches straight to your phone.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="h-12 px-8 rounded-xl text-sm font-semibold" asChild>
                <Link to="/search">
                  Get started — GHS {totalFee.toFixed(2)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl text-sm font-semibold" asChild>
                <a href="#steps">See the process ↓</a>
              </Button>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="mt-14 flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { icon: Zap, stat: "24h", label: "avg. match time" },
              { icon: Shield, stat: "100%", label: "verified listings" },
              { icon: MessageCircle, stat: "WhatsApp", label: "direct updates" },
              { icon: Star, stat: "4.9 / 5", label: "average rating" },
            ].map((item) => (
              <div key={item.stat} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-none">{item.stat}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STEPS ════════════════════════════════════════════════════════════ */}
      <section id="steps" className="py-20 md:py-24 bg-muted/30 border-y border-border">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="max-w-2xl mx-auto mb-14 text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              The process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
              Five steps from search to move-in.
            </h2>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/25 hover:shadow-sm transition-all duration-300"
                >
                  {/* Left: text */}
                  <div className="p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Step {step.number}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight mb-4 leading-snug">
                        {step.heading}
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-8">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-muted border border-border text-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: visual mockup */}
                  <div className="p-8 md:p-10 bg-muted/40">
                    <StepVisual type={step.visual} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-5xl mx-auto">

            {/* Left: sticky header */}
            <div className="md:col-span-1">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4">
                Questions we always get.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                Still not sure? Reach us on WhatsApp and we'll answer in minutes.
              </p>
              <Button variant="outline" className="h-10 px-5 rounded-xl text-sm font-semibold" asChild>
                <a href="https://wa.me/233558299409" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat with us
                </a>
              </Button>
            </div>

            {/* Right: accordion */}
            <div className="md:col-span-2">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-muted/30 border-t border-border">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="max-w-5xl mx-auto rounded-2xl bg-[#001a35] overflow-hidden px-8 sm:px-14 md:px-16 py-14 md:py-16 relative">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/20 blur-[70px]" />
              <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-blue-500/15 blur-[70px]" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
              <div className="max-w-xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-3">
                  Ready to find your place?
                </h2>
                <p className="text-lg text-white/60 leading-relaxed">
                  No account needed. Just GHS {totalFee.toFixed(2)} and 2 minutes
                  to tell us what you're looking for.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
                <Button
                  size="lg"
                  className="h-12 px-8 rounded-xl bg-white text-[#001a35] hover:bg-white/90 font-semibold text-sm whitespace-nowrap"
                  asChild
                >
                  <Link to="/search">
                    Start searching
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 rounded-xl border-white/20 text-white bg-white/5 hover:bg-white/10 hover:text-white font-semibold text-sm whitespace-nowrap"
                  asChild
                >
                  <Link to="/pricing">View pricing →</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
}