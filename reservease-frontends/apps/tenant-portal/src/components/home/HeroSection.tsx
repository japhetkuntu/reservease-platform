import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search as SearchIcon, Shield, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg-premium.png";

const trustItems = [
  { icon: Users, text: "500+ matched" },
  { icon: Star, text: "4.9/5 rating" },
  { icon: Shield, text: "Verified listings" },
];

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[100svh] md:min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Immersive Background */}
      <div className="absolute inset-0 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src={heroImage}
            alt="Breathtaking background"
            className="w-full h-full object-cover object-center opacity-60 dark:opacity-40"
            loading="eager"
          />
        </motion.div>

        {/* Simple elegant overlay */}
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <div className="container relative z-10 py-10 md:py-0 flex flex-col items-center text-center px-4 sm:px-6">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 1.02, 0.73, 1] }}
          className="group cursor-pointer mb-6 md:mb-8"
        >
          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-lg bg-background border border-border transition-all duration-300">
            <span className="relative z-10 text-xs md:text-sm font-medium text-foreground tracking-wide">
              The smartest way to find a home
            </span>
          </div>
        </motion.div>

        {/* Hero Typography */}
        <div className="max-w-4xl mx-auto mb-8 md:mb-10 w-full">
          <motion.h1
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 1.02, 0.73, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-foreground leading-[1.1] tracking-tight px-2"
          >
            Finding your next place
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="relative whitespace-nowrap inline-block mt-1 sm:mt-2 text-primary">
              should feel like magic.
            </span>
          </motion.h1>
        </div>

        {/* Clean Search Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.21, 1.02, 0.73, 1] }}
          className="w-full max-w-2xl mx-auto mb-10 md:mb-14 relative px-2"
        >
          <div
            onClick={() => navigate("/search?for=self")}
            className="relative flex items-center h-16 sm:h-20 bg-background border border-border rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:border-primary/50"
          >
            <div className="flex-1 flex items-center px-4 sm:px-8">
              <SearchIcon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground mr-3 sm:mr-4 flex-shrink-0" />
              <div className="flex flex-col items-start gap-1 sm:gap-0.5 text-left truncate w-full">
                <span className="text-sm sm:text-lg font-semibold text-foreground truncate w-full">Where do you want to live?</span>
                <span className="text-[10px] sm:text-sm text-muted-foreground truncate w-full">Any location • Any budget</span>
              </div>
            </div>

            <div className="pr-2 sm:pr-4 h-full flex items-center">
              <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary text-primary-foreground transition-transform duration-300 flex-shrink-0">
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center items-center gap-2 md:gap-3 relative z-20">
             <span className="text-xs md:text-sm text-muted-foreground font-medium">Searching for a friend?</span>
             <Button
               variant="link"
               onClick={() => navigate("/search?for=others")}
               className="h-auto p-0 text-xs md:text-sm font-bold text-primary hover:text-primary transition-colors underline-offset-4 hover:underline pointer-events-auto"
             >
               Start a delegated search →
             </Button>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-x-8 sm:gap-y-4 pt-6 md:pt-10 border-t border-white/5 w-full"
        >
          {trustItems.map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-3 bg-muted px-4 py-2.5 rounded-lg border border-border w-full sm:w-auto">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10">
                <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 z-20"
      >
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
          Scroll to discover
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-lg border border-border flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
