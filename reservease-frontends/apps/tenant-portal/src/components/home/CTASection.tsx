import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const searchFee = Number(import.meta.env.VITE_SEARCH_FEE || 25);
const processingFee = Number(import.meta.env.VITE_PROCESSING_FEE || 2.5);
const totalFee = searchFee + processingFee;

export function CTASection() {
  return (
    <section className="py-16 md:py-40 relative overflow-hidden bg-background">
      {/* Container holding the breathtaking floating card */}
      <div className="container relative z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#001429] dark:bg-card" />

          <div className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-center flex flex-col items-center">
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/5 border border-white/10 text-white/90 text-xs sm:text-sm font-medium tracking-wide mb-6 sm:mb-8"
              >
                Your perfect place awaits
              </motion.div>

            <motion.h2
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.3 }}
               className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6 tracking-tight max-w-3xl"
            >
              Ready to find
              <br />
              <span className="text-white">
                your next home?
              </span>
            </motion.h2>

            <motion.p
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.4 }}
               className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-12 max-w-xl mx-auto leading-relaxed px-2 sm:px-0"
            >
              Start your intelligent search in under 2 minutes. No account required. Just GHS {totalFee.toFixed(2)} per search.
            </motion.p>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.5 }}
               className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md px-2 sm:px-0"
            >
              <Button
                size="xl"
                className="bg-white text-[#001429] hover:bg-white/90 transition-all duration-300 group w-full sm:w-auto text-base sm:text-lg font-semibold h-12 sm:h-14 px-6 sm:px-8"
                asChild
              >
                <Link to="/search">
                  Start searching
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 hover:text-white w-full sm:w-auto text-base sm:text-lg h-12 sm:h-14"
                asChild
              >
                <Link to="/how-it-works">
                  Learn how it works
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
