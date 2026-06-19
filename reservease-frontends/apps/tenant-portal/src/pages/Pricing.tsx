import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Shield,
  Clock,
  Users,
  Search,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const benefits = [
  {
    icon: Search,
    title: "Personalized Search",
    description: "We search based on your exact preferences—budget, location, and amenities",
  },
  {
    icon: Zap,
    title: "Up to 3 Quality Matches",
    description: "Quality over quantity—receive curated options that actually fit your needs",
  },
  {
    icon: Users,
    title: "Agent Support",
    description: "If no listings match, our agents personally find accommodation for you",
  },
  {
    icon: Clock,
    title: "24-48 Hour Turnaround",
    description: "Fast results—no endless scrolling through fake or outdated listings",
  },
  {
    icon: Shield,
    title: "Verified Accommodations",
    description: "Every option is checked for legitimacy and safety",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Updates",
    description: "Real-time notifications when we find your matches",
  },
];

const searchFee = Number(import.meta.env.VITE_SEARCH_FEE || 25);
const processingFee = Number(import.meta.env.VITE_PROCESSING_FEE || 2.5);
const totalFee = searchFee + processingFee;

const includedFeatures = [
  "Personalized accommodation search",
  `Up to 3 verified matches`,
  "Agent assistance if needed",
  "WhatsApp notifications",
  "24-48 hour response time",
  "No hidden fees or commissions",
];

export default function Pricing() {
  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Immersive Background */}
        <div className="absolute inset-0 bg-background pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
        </div>

        {/* Header Section */}
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-4">
          <div className="container">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-wider mb-8"
              >
                Simple, Transparent Pricing
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tight leading-[1.1]">
                One payment. <br />
                <span className="text-primary">
                  Total peace of mind.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
                Forget endless scrolling and unverified listings. Pay once and let our experts find your perfect accommodation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Card Section */}
        <section className="relative py-12 px-4 mb-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-xl mx-auto"
            >
              <div className="group relative">
                <div className="relative bg-card border border-border rounded-2xl p-10 md:p-14 text-center overflow-hidden">

                  <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold tracking-wide mb-6">
                    MOST POPULAR
                  </div>

                  <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight">Full Search Service</h3>
                  <div className="flex items-center justify-center gap-1 mb-10">
                    <span className="text-2xl font-bold text-muted-foreground mr-1">GHS</span>
                    <span className="text-7xl md:text-8xl font-black text-foreground tracking-tighter">
                      {totalFee.toFixed(2)}
                    </span>
                  </div>

                  <Button size="lg" className="w-full rounded-lg h-12 text-base font-semibold active:scale-95 transition-all mb-10 group" asChild>
                    <Link to="/search">
                      Get Started Now
                      <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>

                  <div className="space-y-5 text-left max-w-sm mx-auto">
                    {includedFeatures.map((feature, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                        key={index}
                        className="flex items-center gap-4 py-1"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-success/20 border border-success/30 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-success font-black" />
                        </div>
                        <span className="text-foreground/90 font-semibold text-sm md:text-base">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="relative py-24 px-4 bg-muted/20 border-t border-border/40">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
                Why thousands trust us.
              </h2>
              <p className="text-muted-foreground font-medium max-w-2xl mx-auto">
                We're not just a listings site. We're your personal relocation concierge.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Style Context */}
        <section className="relative py-24 md:py-32 px-4">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto rounded-2xl bg-primary p-10 md:p-20 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-10 tracking-tight">
                  What happens after I pay?
                </h2>

                <div className="grid md:grid-cols-3 gap-10">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-lg bg-white/20 text-white flex items-center justify-center mb-6 text-2xl font-black border border-white/30">
                      1
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">We Search</h4>
                    <p className="text-white/80 font-medium">
                      Our system and agents scan thousands of verified listings based on your exact profile.
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-lg bg-white/20 text-white flex items-center justify-center mb-6 text-2xl font-black border border-white/30">
                      2
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">We Match</h4>
                    <p className="text-white/80 font-medium">
                      You receive your top 3 matches—hand-picked and verified for legitimacy.
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-lg bg-white/20 text-white flex items-center justify-center mb-6 text-2xl font-black border border-white/30">
                      3
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">You Choose</h4>
                    <p className="text-white/80 font-medium">
                      Pick your favorite and move in. No extra fees, no hassle, no stress.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 text-center">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Button size="lg" className="rounded-lg px-10 h-12 text-base font-semibold active:scale-95 transition-all" asChild>
                <Link to="/search">
                  Find My Accommodation
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              <p className="text-muted-foreground mt-6 font-bold flex items-center justify-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                No signup required to start. 100% money-back search guarantee.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
