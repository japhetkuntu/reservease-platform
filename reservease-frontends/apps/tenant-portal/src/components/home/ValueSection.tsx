import { motion } from "framer-motion";
import { Users, Clock, CheckCircle, ArrowUpRight, Check, ShieldCheck, Zap } from "lucide-react";

export function ValueSection() {
  return (
    <section className="py-16 md:py-36 relative overflow-hidden bg-background">
      {/* Subtle background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] rounded-full bg-primary/[0.03] dark:bg-primary/[0.02] blur-[120px] pointer-events-none" />

      <div className="container relative z-10 px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-background border border-border text-foreground text-xs md:text-sm font-medium tracking-wide mb-4 md:mb-6">
            Why Choose ReservEase
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.12] md:leading-[1.1] tracking-tight mb-4 md:mb-6">
            A brutally beautiful way{" "}
            <br className="hidden sm:block" />
            <span className="text-muted-foreground sm:ml-3">to find your next home.</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed px-2">
            Stop scrolling through endless, fake listings. We do the heavy lifting while you simply pick your favorite match.
          </p>
        </motion.div>

        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(250px,_auto)] md:auto-rows-[minmax(300px,_auto)] gap-4 md:gap-6 max-w-6xl mx-auto">

          {/* Card 1: Curated Matches (Large) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-8 group relative bg-card border border-border rounded-2xl p-6 sm:p-8 md:p-10 overflow-hidden md:hover:border-primary/30 transition-colors duration-500 flex flex-col justify-between"
          >

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg bg-background border border-border mb-6 flex-shrink-0">
                <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Precision over volume.</h3>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                We deliver a maximum of 3 highly-curated, verified accommodations that match your exact lifestyle and budget criteria perfectly.
              </p>
            </div>

            <div className="relative z-10 mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-md">
               <div className="flex items-center gap-3 bg-background/50 rounded-xl p-3 border border-border/50">
                  <Check className="h-4 w-4 md:h-5 md:w-5 text-success flex-shrink-0" />
                  <span className="text-xs md:text-sm font-medium">Verified Photos</span>
               </div>
               <div className="flex items-center gap-3 bg-background/50 rounded-xl p-3 border border-border/50">
                  <Check className="h-4 w-4 md:h-5 md:w-5 text-success flex-shrink-0" />
                  <span className="text-xs md:text-sm font-medium">No hidden fees</span>
               </div>
            </div>
          </motion.div>

          {/* Card 2: Speed (Small) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-4 group relative bg-primary rounded-2xl p-6 sm:p-8 md:p-10 overflow-hidden text-primary-foreground flex flex-col justify-center items-center text-center py-10"
          >

            <div className="relative z-10">
              <Zap className="h-10 w-10 md:h-12 md:w-12 text-primary-foreground/90 mx-auto mb-4 md:mb-6" />
              <div className="text-5xl md:text-6xl font-bold mb-1 md:mb-2 tracking-tighter">24<span className="text-2xl md:text-3xl text-primary-foreground/70">h</span></div>
              <p className="text-base md:text-lg font-medium text-primary-foreground/90">Avg matching time</p>
            </div>
          </motion.div>

          {/* Card 3: Human Backup (Medium) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-6 group relative bg-card border border-border rounded-2xl p-6 sm:p-8 md:p-10 overflow-hidden md:hover:border-primary/30 transition-colors duration-500"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg bg-background border border-border mb-5 md:mb-6 md:group-hover:bg-primary md:group-hover:text-primary-foreground transition-colors duration-500">
               <Users className="h-6 w-6 md:h-7 md:w-7 text-primary md:group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">Human Backup Agents</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              If our algorithms can't find the perfect match right away, a dedicated human agent steps in to personally hunt down your ideal accommodation at no extra cost.
            </p>
            <div className="hidden md:block absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <ArrowUpRight className="h-6 w-6 text-primary" />
            </div>
          </motion.div>

          {/* Card 4: Trust (Medium) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-6 group relative bg-card border border-border rounded-2xl p-6 sm:p-8 md:p-10 overflow-hidden md:hover:border-success/30 transition-colors duration-500 flex flex-col justify-between"
          >

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
               <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg bg-background border border-border mb-5 md:mb-6">
                     <ShieldCheck className="h-6 w-6 md:h-7 md:w-7 text-success" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">Peace of Mind Guarantee</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                     Every listing is physically verified by our team. If a property doesn't look exactly like its photos, we refund your search fee immediately.
                  </p>
               </div>

               <div className="flex items-center gap-3 md:gap-4 border-t border-border pt-4 md:pt-6 mt-auto">
                  <div className="flex -space-x-3">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                           <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                     ))}
                  </div>
                  <div className="text-xs md:text-sm font-medium">Over <span className="text-foreground">500+</span> renters</div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
