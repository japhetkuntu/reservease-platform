import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Search, Gift, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Share your preferences",
    description: "Budget, location, room type, must-haves — takes under 2 minutes.",
  },
  {
    icon: Search,
    number: "02",
    title: "We search for you",
    description: "Our system scans verified listings that match your criteria.",
  },
  {
    icon: Gift,
    number: "03",
    title: "Review your matches",
    description: "Receive up to 3 curated options with photos, pricing, and details.",
  },
  {
    icon: Handshake,
    number: "04",
    title: "No luck? We step in",
    description: "A real agent personally finds accommodation within 24-48 hours.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-36 relative overflow-hidden bg-background">
       {/* Ambient Lighting */}
       <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />
       <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-success/5 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />

      <div className="container relative z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16 md:mb-28"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4 md:mb-6">
            Four simple steps to
            <br />
            <span className="text-primary relative inline-block mt-1">
               <span className="relative z-10">your new home.</span>
               <span className="absolute bottom-1 left-0 w-full h-2 md:h-3 bg-primary/20 -z-10 rounded-full" />
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Our intelligent matching system combined with expert human agents guarantees you get the best accommodation, completely stress-free.
          </p>
        </motion.div>

        {/* Vertical Animated Timeline */}
        <div className="max-w-3xl mx-auto relative pl-4 md:pl-0">
           {/* Connecting Line */}
           <div className="absolute top-6 md:top-10 bottom-10 left-[27px] md:left-1/2 md:-translate-x-1/2 w-0.5 bg-border/50 hidden sm:block">
              <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 whileInView={{ height: "100%", opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-success to-primary"
              />
           </div>

          <div className="space-y-8 md:space-y-24">
            {steps.map((step, index) => {
               const isEven = index % 2 === 0;
               return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex flex-col sm:flex-row items-start gap-4 sm:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                 {/* Center Dot (Desktop & Tablet) */}
                 <div className="hidden sm:block absolute left-[27px] md:left-1/2 top-10 md:top-1/2 -translate-y-1/2 md:-translate-x-1/2 z-10">
                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border-[3px] md:border-4 border-primary/20 flex items-center justify-center p-1">
                      <div className="w-full h-full rounded-full bg-primary animate-pulse-soft" />
                   </div>
                 </div>

                 {/* Content Card */}
                 <div className={`w-full sm:pl-16 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-12 lg:pr-24' : 'md:pl-12 lg:pl-24'}`}>
                    <div className="group relative bg-card border-2 border-border/50 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:border-primary/30 transition-colors duration-500">
                       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 rounded-2xl md:rounded-3xl" />

                       <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4 md:gap-5">
                          <div className="flex-shrink-0">
                             <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center md:group-hover:bg-primary md:group-hover:text-primary-foreground transition-colors duration-500">
                                <step.icon className="w-5 h-5 md:w-6 md:h-6 text-primary md:group-hover:text-primary-foreground transition-colors" />
                             </div>
                             <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-background border border-border flex items-center justify-center text-[10px] md:text-xs font-bold text-foreground">
                                {step.number}
                             </div>
                          </div>
                          <div>
                             <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 md:mb-2">{step.title}</h3>
                             <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                {step.description}
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )})}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 md:mt-24 w-full"
        >
          <Button size="xl" className="border-border/50 group px-8 w-full sm:w-auto h-14 md:h-16 text-base md:text-lg" asChild>
            <Link to="/search">
              Start your search now
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
