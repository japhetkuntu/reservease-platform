import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Shield, Clock, Users, Search, MessageCircle, Zap, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

const searchFee = Number(import.meta.env.VITE_SEARCH_FEE || 25);
const processingFee = Number(import.meta.env.VITE_PROCESSING_FEE || 2.5);
const totalFee = searchFee + processingFee;

const included = [
  "Personalised accommodation search",
  "Up to 3 verified curated matches",
  "Real photos — physically verified",
  "WhatsApp updates throughout",
  "24–48h turnaround guaranteed",
  "Human agent backup if needed",
  "No hidden fees or commissions",
  "Peace of mind refund guarantee",
];

const notIncluded = [
  "The accommodation rent itself",
  "Agent commissions",
  "Repeat searches (each is separate)",
];

const faqs = [
  { q: "Is GHS 27.50 a one-time fee?", a: `Yes. You pay GHS ${totalFee.toFixed(2)} once per search request. If you want to search again later with different criteria, that's a new request.` },
  { q: "What exactly does the fee cover?", a: "It covers the personalised search, physical listing verification, agent work, and WhatsApp support throughout. You pay the landlord directly for the accommodation." },
  { q: "What if I don't like any of the matches?", a: "Let us know what you'd like changed and we'll refine the search at no extra cost within your active request period." },
  { q: "What if you can't find anything?", a: "If we're unable to provide any options within 72 hours, you get a full refund — no forms, no waiting." },
  { q: "Do I need an account to pay?", a: "No. You can start a search without an account. You'll only need to sign up to track your request and receive matches." },
  { q: "What payment methods do you accept?", a: "MTN Mobile Money, Vodafone Cash, AirtelTigo Money, and card payments. All transactions are secure." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-5 text-left gap-4 group">
        <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{q}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div className={cn("overflow-hidden transition-all duration-200", open ? "max-h-48 pb-5" : "max-h-0")}>
        <p className="text-base text-muted-foreground leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-background relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[100px]" />
          <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
        </div>
        <div className="container px-4 sm:px-6 mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center max-w-5xl mx-auto">
            {/* Left */}
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-5">Pricing</span>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.05] mb-5">
                One payment.<br />
                <span className="text-muted-foreground font-medium">Everything included.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Pay once. We handle the searching, verification, and matching. You just pick your favourite place and move in.
              </p>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-5xl font-bold text-foreground tracking-tight">GHS {totalFee.toFixed(2)}</span>
                <span className="text-base text-muted-foreground">per search</span>
              </div>
              <Button size="lg" className="h-12 px-8 rounded-xl text-sm font-semibold" asChild>
                <Link to="/search">Start searching <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Full refund if we can't find a match within 72h
              </p>
            </div>

            {/* Right: receipt card */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-5 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">What's included</p>
              </div>
              <div className="px-6 py-5 space-y-3">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-border bg-muted/20">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Not included</p>
                {notIncluded.map((item) => (
                  <div key={item} className="flex items-start gap-3 mb-2">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-5 bg-muted/40 border-t border-border flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total today</span>
                <span className="text-2xl font-bold text-foreground">GHS {totalFee.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT BREAKS DOWN ── */}
      <section className="py-20 md:py-24 bg-muted/30 border-y border-border">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="max-w-2xl mx-auto mb-14 text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">What happens after you pay</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">Your money at work.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { icon: Search, title: "We search", body: "Our system and agents scan every verified listing in your area — filtering by your exact budget, room type, and location." },
              { icon: Zap, title: "We curate", body: "Instead of bombarding you with 50 options, we hand-select a maximum of 3 that genuinely match. Quality, not volume." },
              { icon: Users, title: "Agent backup", body: "If the system can't find a perfect match, a real human agent takes over personally — at no extra cost to you." },
              { icon: Shield, title: "We verify", body: "Every property is physically confirmed before it reaches you. If it doesn't match the photos, you get a full refund." },
              { icon: MessageCircle, title: "We update you", body: "You'll hear from us on WhatsApp throughout the process. No black holes, no guessing if anything is happening." },
              { icon: Clock, title: "24–48h turnaround", body: "We work fast. Most requests are fulfilled within 24 hours. You'll never wait more than 48h without an update." },
            ].map((f) => (
              <div key={f.title} className="bg-background rounded-2xl border border-border p-7 hover:border-primary/25 hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-5xl mx-auto">
            <div className="md:col-span-1">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">FAQ</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4">Before you pay.</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                Every question we get asked before someone starts a search.
              </p>
              <Button variant="outline" className="h-10 px-5 rounded-xl text-sm font-semibold" asChild>
                <a href="https://wa.me/233558299409" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Ask on WhatsApp
                </a>
              </Button>
            </div>
            <div className="md:col-span-2">
              {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-20 bg-muted/30 border-t border-border">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="max-w-5xl mx-auto rounded-2xl bg-[#001a35] overflow-hidden px-8 sm:px-14 md:px-16 py-14 md:py-16 relative">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/20 blur-[70px]" />
              <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-blue-500/15 blur-[70px]" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
              <div className="max-w-xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-3">Ready to find your place?</h2>
                <p className="text-lg text-white/60 leading-relaxed">No account needed. GHS {totalFee.toFixed(2)} and 2 minutes is all it takes to get started.</p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
                <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-[#001a35] hover:bg-white/90 font-semibold text-sm whitespace-nowrap" asChild>
                  <Link to="/search">Start searching <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl border-white/20 text-white bg-white/5 hover:bg-white/10 hover:text-white font-semibold text-sm whitespace-nowrap" asChild>
                  <Link to="/how-it-works">How it works →</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}