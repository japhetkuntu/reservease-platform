import { Link } from "react-router-dom";

const footerLinks = [
  { label: "How it Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Support", href: "/support" },
  { label: "Terms", href: "/terms" },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t border-border bg-background ${className || ""}`}>
      <div className="container-px max-w-7xl mx-auto py-12 md:py-14">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand Column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <span className="text-sm font-bold text-primary-foreground">R</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-600 text-foreground">ReservEase</span>
                <span className="text-xs text-muted-foreground">Accommodation, simplified</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Finding homes is now easier than ever. Browse, book, and move with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-col gap-2">
            <h3 className="text-sm font-600 text-foreground mb-1">Quick Links</h3>
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Support Column */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-600 text-foreground mb-1">Support</h3>
            <Link to="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Help Center
            </Link>
            <Link to="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Contact Us
            </Link>
            <a href="mailto:support@reservease.com" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              support@reservease.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Bottom Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} ReservEase. All rights reserved. | Made with care in Ghana 🇬🇭
          </p>
        </div>
      </div>
    </footer>
  );
}
