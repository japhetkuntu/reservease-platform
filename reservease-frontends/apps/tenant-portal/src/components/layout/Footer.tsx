import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Mail, Twitter, Facebook, Youtube } from "lucide-react";

const quickLinks = [
  { label: "How it Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Support", href: "/support" },
  { label: "Terms & Conditions", href: "/terms" },
];

const socialLinks = [
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/233558299409" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/reservease" },
  { icon: Twitter, label: "Twitter / X", href: "https://twitter.com/reservease" },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t border-border bg-background ${className || ""}`}>
      <div className="container-px max-w-7xl mx-auto pt-14 pb-8">

        {/* ── Top: brand + nav grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary group-hover:opacity-90 transition-opacity">
                <span className="text-sm font-black text-primary-foreground">R</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold text-foreground">ReservEase</span>
                <span className="text-[11px] text-muted-foreground mt-0.5">Accommodation, simplified</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Ghana's smartest way to find verified accommodation. Tell us what you need — we deliver your matches in 24 hours.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors duration-200"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Quick Links</p>
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Support */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Support</p>
            <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 w-fit">Help Center</Link>
            <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 w-fit">Contact Us</Link>
            <a href="mailto:support@reservease.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 w-fit">
              support@reservease.com
            </a>
            <a
              href="https://wa.me/233558299409"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors w-fit mt-1"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp us
            </a>
          </div>

          {/* CTA column */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Get Started</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ready to find your next place? Start a search — no account needed.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group w-fit"
            >
              Start searching
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              View pricing →
            </Link>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border" />

        {/* ── Bottom bar ── */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} ReservEase. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Made with care in Ghana 🇬🇭
          </p>
        </div>
      </div>
    </footer>
  );
}