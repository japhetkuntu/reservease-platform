import { FileText, Shield, Users, CreditCard, MessageCircle, HelpCircle, Lock, Eye, Sparkles, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

const searchFee = Number(import.meta.env.VITE_SEARCH_FEE || 25);
const processingFee = Number(import.meta.env.VITE_PROCESSING_FEE || 2.5);
const totalFee = searchFee + processingFee;

const termsSections = [
  {
    icon: Users,
    title: "Who We Serve",
    content: `ReservEase is a personalised accommodation discovery platform for students, workers, and individuals seeking long-term or short-term stays in Ghana. Whether you're a student looking for a hostel, a professional seeking an apartment, or a visitor needing a short-stay, we bridge the gap between you and your next home.`,
  },
  {
    icon: CreditCard,
    title: "The Search Process",
    content: `Upon payment of the search service fee (GHS ${totalFee.toFixed(2)}), our matching engine and dedicated agents begin scouting for properties that match your exact specifications. For every request, you're entitled to up to 3 verified matches and 3 free search refinements if the initial matches aren't a perfect fit.`,
  },
  {
    icon: Shield,
    title: "Verification & Trust",
    content: `We prioritise your safety. "Verified" properties on ReservEase have been physically inspected or strictly vetted by our team. However, we strongly advise all users to personally inspect any property before making significant financial commitments like rent advance or security deposits directly to landlords.`,
  },
  {
    icon: MessageCircle,
    title: "Communication & Updates",
    content: `We keep you updated in real-time via WhatsApp and in-app notifications. By using our service, you agree to receive automated updates and personal messages from our search agents regarding your requests.`,
  },
  {
    icon: FileText,
    title: "Refunds & Cancellations",
    content: `The service fee is non-refundable once the search process has been initiated by our team (usually within 1 hour). If we are unable to provide any matching options within 72 hours, you are eligible for a full refund of the base search fee.`,
  },
];

const privacySections = [
  {
    icon: Lock,
    title: "Data Security",
    content: `Your personal information, including your phone number and search preferences, is encrypted and stored securely. We never sell your data to third-party advertisers.`,
  },
  {
    icon: Eye,
    title: "What We Collect",
    content: `We collect information necessary to find your perfect home: your name, contact details, and specific accommodation preferences (location, budget, facilities). We also monitor search patterns to improve our matching algorithm.`,
  },
  {
    icon: Shield,
    title: "Third-Party Sharing",
    content: `We only share relevant search preferences with partner landlords and agents to facilitate your booking. We do not share your private contact information until you express a direct interest in a specific property.`,
  },
];

const promises = [
  "Personalised matching for all user types",
  "Up to 3 verified matches per search",
  "3 free search refinements included",
  "Dedicated agent support at no extra cost",
  "Real-time WhatsApp & in-app updates",
  "Transparent, non-refundable fee model",
];

export default function Terms() {
  return (
    <Layout>

      {/* ── HERO ── */}
      <section className="pt-20 pb-14 md:pt-28 md:pb-16 bg-background relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute -right-32 bottom-0 h-[300px] w-[300px] rounded-full bg-blue-500/4 blur-[100px]" />
        </div>
        <div className="container-px max-w-4xl mx-auto relative z-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-5">
            Legal & Privacy
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.05] mb-5">
            Terms of Service &<br />
            <span className="text-muted-foreground font-medium">Privacy Policy.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            Our commitment to transparency, security, and a better search experience for everyone in Ghana.
          </p>
        </div>
      </section>

      {/* ── PROMISE STRIP ── */}
      <section className="py-10 bg-muted/30 border-y border-border">
        <div className="container-px max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm font-semibold text-foreground">The ReservEase Promise</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {promises.map((point) => (
              <div key={point} className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container-px max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-14">

            {/* Terms column */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-xl font-bold text-foreground tracking-tight whitespace-nowrap">Terms of Service</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-8">
                {termsSections.map((section) => (
                  <div key={section.title} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors duration-200">
                      <section.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-2">{section.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy column */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-xl font-bold text-foreground tracking-tight whitespace-nowrap">Data Privacy</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-8">
                {privacySections.map((section) => (
                  <div key={section.title} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors duration-200">
                      <section.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-2">{section.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Data sharing callout */}
              <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/15 relative overflow-hidden">
                <div className="pointer-events-none absolute -right-4 -top-4 opacity-[0.06]">
                  <Shield size={100} className="text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground mb-2 relative z-10">Is my data shared with landlords?</p>
                <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                  We only share your requirements with property owners — never your direct contact info. That's only released when you personally confirm interest in a specific property.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="container-px max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Legal contact */}
            <div className="bg-background rounded-2xl border border-border p-8 flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-5">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Questions about these terms?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                Our team is happy to clarify anything. We believe in clear rules and happy customers.
              </p>
              <a
                href="mailto:legal@reservease.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group w-fit"
              >
                legal@reservease.com
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Start searching */}
            <div className="bg-brand-dark rounded-2xl p-8 flex flex-col relative overflow-hidden">
              <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-[50px]" />
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5 relative z-10">
                <Sparkles className="h-5 w-5 text-white/80" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2 relative z-10">Ready to find your place?</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-6 flex-1 relative z-10">
                Now you know the rules. Start your search — no account needed, just GHS {totalFee.toFixed(2)}.
              </p>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/80 transition-colors group w-fit relative z-10"
              >
                Start searching
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Last updated */}
          <p className="text-center text-[11px] text-muted-foreground/50 mt-10 uppercase tracking-[0.2em] font-medium">
            Revised: March 03, 2026 · ReservEase Technologies
          </p>
        </div>
      </section>

    </Layout>
  );
}