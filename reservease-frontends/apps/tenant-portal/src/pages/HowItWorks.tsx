import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  FileText,
  Smartphone,
  ThumbsUp,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const steps = [
  {
    icon: FileText,
    title: "1. Submit Your Request",
    description:
      "Tell us about yourself and what you're looking for. Share your budget, preferred location, room type, and must-have amenities.",
    details: ["Takes less than 5 minutes", "No signup required", "Available 24/7"],
  },
  {
    icon: Search,
    title: "2. We Search For You",
    description:
      "Our system and agents review your preferences and search for verified accommodations that match your criteria.",
    details: ["Only verified listings", "Real photos and info", "Transparent pricing"],
  },
  {
    icon: Smartphone,
    title: "3. Receive Up to 3 Matches",
    description:
      "We send you curated recommendations via the app and WhatsApp. Each option includes photos, pricing, and key details.",
    details: ["Within 24-48 hours", "Maximum 3 quality options", "Direct agent support if needed"],
  },
  {
    icon: ThumbsUp,
    title: "4. Choose Your Favorite",
    description:
      "Review the options, ask questions, request more info if needed. Select the one that fits you best.",
    details: ["No pressure", "Take your time", "Compare easily"],
  },
  {
    icon: Key,
    title: "5. Move In Stress-Free",
    description:
      "We help coordinate with the property. You just show up, pay the landlord directly, and settle into your new home!",
    details: ["Smooth handover", "Verified agreements", "Ongoing support"],
  },
];

const searchFee = Number(import.meta.env.VITE_SEARCH_FEE || 25);
const processingFee = Number(import.meta.env.VITE_PROCESSING_FEE || 2.5);
const totalFee = searchFee + processingFee;

const faqs = [
  {
    question: "How much does ReservEase cost?",
    answer:
      `Each search request costs GHS ${totalFee.toFixed(2)}. This covers the personalized search, verification, and agent support—not the accommodation itself. You pay the landlord directly for rent.`,
  },
  {
    question: "Why do I need to pay before seeing results?",
    answer:
      "Your payment covers the time and effort to search, verify, and match you with quality options. We're a service, not a free listings platform. This ensures you get personalized attention, not random results.",
  },
  {
    question: "How long does it take to get recommendations?",
    answer:
      "You'll receive your accommodation matches within 24-48 hours. If no exact matches are found, we assign an agent to personally find options for you.",
  },
  {
    question: "Why only 3 options maximum?",
    answer:
      "Quality over quantity! Instead of overwhelming you with 50+ random listings, we carefully select maximum 3 accommodations that truly match your preferences. Less noise, better choices.",
  },
  {
    question: "What if no accommodation matches my preferences?",
    answer:
      "No worries! We'll assign a real human agent to personally search for options and get back to you within 24-48 hours. You're never left without support.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "If we're unable to provide any options within 72 hours of your request, you may request a full refund. Partial refunds may be considered for exceptional circumstances.",
  },
];

export default function HowItWorks() {
  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Immersive Background */}
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.21, 1.02, 0.73, 1] }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-10"
              >
                <FileText className="h-10 w-10 text-primary" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tight leading-[1.1]">
                Finding home <br />
                <span className="text-primary">
                  made simple.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                ReservEase streamlines your search process. No more endless scrolling or unverified listings—just quality matches delivered to you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" className="rounded-lg px-10 h-14 font-bold active:scale-95 transition-all w-full sm:w-auto" asChild>
                  <Link to="/search">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" className="rounded-lg px-10 h-14 font-bold border-border/40 hover:bg-card/50 transition-all w-full sm:w-auto" asChild>
                  <a href="#steps">See How it Works</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Steps Section */}
        <section id="steps" className="relative py-24 md:py-32">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-12 md:space-y-20 relative">
                {/* Connecting Line (Desktop) */}
                <div className="absolute left-[40px] top-10 bottom-10 w-0.5 bg-border hidden md:block" />

                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
                    className="flex flex-col md:flex-row gap-8 relative"
                  >
                    <div className="flex-shrink-0 relative z-10">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-border text-primary group hover:border-primary/40 transition-all duration-500">
                        <step.icon className="h-10 w-10 relative z-10 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <div className="pt-2 md:pt-4 bg-card border border-border rounded-2xl p-8 md:p-10 flex-1 hover:border-primary/20 transition-all">
                      <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-medium">
                        {step.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {step.details.map((detail) => (
                          <div
                            key={detail}
                            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 text-foreground/80 font-semibold text-sm"
                          >
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-24 md:py-32 bg-muted/20 border-y border-border/40">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 md:mb-24"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest mb-6">
                Common Questions
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
                Got questions? <br className="sm:hidden" /> We've got answers.
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-500"
                >
                  <h3 className="text-lg font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 md:py-40">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto rounded-2xl bg-primary p-12 md:p-24 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                  Ready to find <br className="sm:hidden" /> your dream home?
                </h2>
                <p className="text-primary-foreground/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
                  Thousands have already used ReservEase to skip the stress of searching.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-lg px-10 h-12 text-base font-semibold transition-all active:scale-95" asChild>
                    <Link to="/search">
                      Find Me Accommodation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-lg px-10 h-12 text-base font-semibold transition-all active:scale-95" asChild>
                    <Link to="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
