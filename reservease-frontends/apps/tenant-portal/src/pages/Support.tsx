import { useState } from "react";
import { MessageCircle, Mail, Phone, Send, Loader2, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    sub: "Fastest — we reply within minutes",
    value: "+233 55 829 9409",
    href: "https://wa.me/233558299409",
    accent: "bg-green-50 text-green-700 border-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
    cta: "Open WhatsApp",
  },
  {
    icon: Mail,
    title: "Email",
    sub: "We reply within 24 hours",
    value: "support@reservease.com",
    href: "mailto:support@reservease.com",
    accent: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
    cta: "Send email",
  },
  {
    icon: Phone,
    title: "Phone",
    sub: "Mon–Fri, 9am–5pm GMT",
    value: "+233 55 785 4823",
    href: "tel:+233557854823",
    accent: "bg-primary/8 text-primary border-primary/20",
    cta: "Call us",
  },
];

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Missing fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    toast({ title: "Message sent!", description: "We'll reply to your email within 24 hours." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="pt-20 pb-14 md:pt-28 md:pb-16 bg-background relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-primary/6 blur-[100px]" />
        </div>
        <div className="container px-4 sm:px-6 mx-auto relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-5">Support</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.05] mb-5">
            We're here.<br />
            <span className="text-muted-foreground font-medium">How can we help?</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Questions about your search, a match you received, or anything else — reach us on any channel below.
          </p>
        </div>
      </section>

      {/* ── CONTACT CHANNELS ── */}
      <section className="pb-16 md:pb-20 bg-background">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {channels.map((c) => (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex flex-col p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-5 border", c.accent)}>
                  <c.icon className="h-6 w-6" />
                </div>
                <p className="text-base font-bold text-foreground mb-1">{c.title}</p>
                <p className="text-xs text-muted-foreground mb-4">{c.sub}</p>
                <p className="text-sm font-semibold text-foreground mb-5">{c.value}</p>
                <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                  {c.cta} <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT: FORM + INFO ── */}
      <section className="py-16 md:py-20 bg-muted/30 border-y border-border">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 max-w-5xl mx-auto items-start">

            {/* Left: info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Find us</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-6">Our office.</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">Address</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Tarkwa, Western Region<br />Ghana 🇬🇭
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">Hours</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Monday – Friday: 9:00 AM – 5:00 PM GMT<br />
                        Saturday: 10:00 AM – 2:00 PM GMT
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/15">
                <p className="text-sm font-bold text-foreground mb-2">Need urgent help?</p>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  For anything time-sensitive — a pending booking, an urgent verification, a match you want to act on fast — WhatsApp is always fastest.
                </p>
                <Button size="sm" className="h-9 px-4 rounded-xl text-sm font-semibold" asChild>
                  <a href="https://wa.me/233558299409" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> Priority chat
                  </a>
                </Button>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3 bg-background rounded-2xl border border-border p-8 md:p-10">
              <h2 className="text-xl font-bold text-foreground mb-2">Send a message</h2>
              <p className="text-sm text-muted-foreground mb-8">We'll reply to your email within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name *</Label>
                    <Input id="name" name="name" placeholder="John Doe" value={form.name} onChange={handleChange}
                      className="h-11 rounded-xl border-border bg-background text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email *</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange}
                      className="h-11 rounded-xl border-border bg-background text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subject</Label>
                  <Input id="subject" name="subject" placeholder="About my search request..." value={form.subject} onChange={handleChange}
                    className="h-11 rounded-xl border-border bg-background text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message *</Label>
                  <Textarea id="message" name="message" placeholder="Tell us everything..." rows={5} value={form.message} onChange={handleChange}
                    className="rounded-xl border-border bg-background text-sm resize-none" />
                </div>
                <Button type="submit" size="lg" className="w-full h-12 rounded-xl font-semibold" disabled={loading}>
                  {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Sending...</> : <><Send className="mr-2 h-4 w-4" />Send message</>}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}