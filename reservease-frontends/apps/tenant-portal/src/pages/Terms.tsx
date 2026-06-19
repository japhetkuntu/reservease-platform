import { motion } from "framer-motion";
import { FileText, Shield, Users, CreditCard, MessageCircle, HelpCircle, Lock, Eye, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

const searchFee = Number(import.meta.env.VITE_SEARCH_FEE || 25);
const processingFee = Number(import.meta.env.VITE_PROCESSING_FEE || 2.5);
const totalFee = searchFee + processingFee;

const termsSections = [
  {
    icon: Users,
    title: "Who We Serve",
    content: `ReservEase is a personalized accommodation discovery platform designed for students, workers, and individuals seeking long-term or short-term stays in Ghana. Whether you're a student looking for a hostel, a professional seeking an apartment, or a visitor needing a short-stay, we're here to bridge the gap between you and your next home.`
  },
  {
    icon: CreditCard,
    title: "The Search Process",
    content: `Upon payment of the search service fee (GHS ${totalFee.toFixed(2)}), our intelligent matching engine and dedicated agents begin scouting for properties that match your exact specifications. For every request, you're entitled to up to 3 verified matches and 3 free search refinements if the initial matches aren't a perfect fit.`
  },
  {
    icon: Shield,
    title: "Verification & Trust",
    content: `We prioritize your safety. "Verified" properties on ReservEase have been physically inspected or strictly vetted by our team. However, we strongly advise all users to personally inspect any property before making significant financial commitments like rent advance or security deposits directly to landlords.`
  },
  {
    icon: MessageCircle,
    title: "Communication & Updates",
    content: `We keep you updated in real-time via WhatsApp and in-app notifications. By using our service, you agree to receive automated updates and personal messages from our search agents regarding your requests.`
  },
  {
    icon: FileText,
    title: "Refunds & Cancellations",
    content: `The service fee is non-refundable once the search process has been initiated by our team (usually within 1 hour). If we are unable to provide any matching options within 72 hours, you are eligible for a full refund of the base search fee.`
  },
];

const privacySections = [
  {
    icon: Lock,
    title: "Data Security",
    content: `Your personal information, including your phone number and search preferences, is encrypted and stored securely. We never sell your data to third-party advertisers.`
  },
  {
    icon: Eye,
    title: "What We Collect",
    content: `We collect information necessary to find your perfect home: your name, contact details, and specific accommodation preferences (location, budget, facilities). We also monitor search patterns to improve our matching algorithm.`
  },
  {
    icon: Shield,
    title: "Third-Party Sharing",
    content: `We only share relevant search preferences with partner landlords and agents to facilitate your booking. We do not share your private contact information until you express a direct interest in a specific property.`
  }
];

const keyPoints = [
  "Personalized matching for all user types",
  "Up to 3 verified matches + 3 free refinements",
  "Dedicated agent support included",
  "Real-time WhatsApp & In-app updates",
  "Transparent non-refundable service fee model",
];

export default function Terms() {
  return (
    <Layout>
      <div className="container py-16 md:py-24 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            Legal & Privacy
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our commitment to transparency, security, and a better search experience for everyone.
          </p>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-16"
        >
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            The ReservEase Promise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2 text-sm font-semibold text-foreground bg-background/50 p-4 rounded-2xl border border-primary/10">
                {point}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Terms Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
               <h2 className="text-2xl font-black text-foreground tracking-tight">Terms of Service</h2>
               <div className="h-px flex-1 bg-border/50" />
            </div>
            {termsSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group p-1"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <section.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Privacy Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
               <h2 className="text-2xl font-black text-foreground tracking-tight">Data Privacy</h2>
               <div className="h-px flex-1 bg-border/50" />
            </div>
            {privacySections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group p-1"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-success/10 transition-colors">
                    <section.icon className="h-6 w-6 text-muted-foreground group-hover:text-success transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="p-8 rounded-2xl bg-success/5 border border-success/20 mt-8 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                    <Shield size={120} className="text-success" />
                </div>
                <h4 className="text-base font-bold text-success mb-2 relative z-10">Is my data shared?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                    We only share your requirements with owners. Your contact info is only released when you initiate a viewing or confirm interest.
                </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center p-10 bg-card border border-border rounded-2xl"
        >
          <HelpCircle className="h-10 w-10 text-primary mx-auto mb-6 opacity-40" />
          <h3 className="text-xl font-bold text-foreground mb-3">
            Questions about these terms?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Our legal team is happy to clarify anything. We believe in clear rules and happy customers.
          </p>
          <a
            href="mailto:legal@reservease.com"
            className="inline-flex h-12 items-center justify-center px-8 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all active:scale-95"
          >
            Contact Legal Team
          </a>
        </motion.div>

        {/* Last Updated */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.6 }}
          className="text-center text-[10px] text-muted-foreground mt-12 font-black uppercase tracking-[0.3em]"
        >
          Revised: March 03, 2026 • ReservEase Technologies
        </motion.p>
      </div>
    </Layout>
  );
}
