import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, ArrowLeft, Loader2, CheckCircle2, Sparkles, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PulseBackground } from "@/components/layout/PulseBackground";

export function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate reset request
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden selection:bg-primary/30">
      <PulseBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md space-y-12"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-card/60 backdrop-blur-xl border border-white/20 text-primary shadow-2xl mb-4 group relative"
          >
            <KeyRound className="h-10 w-10 relative z-10 transition-transform duration-500 group-hover:rotate-12" />
            <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-foreground leading-none">
              Reset <span className="text-primary">Access</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xs mx-auto">
              Recover your administrative credentials and secure your node.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-[3rem] blur opacity-25" />

          <div className="relative bg-card/60 backdrop-blur-3xl border border-white/20 p-10 rounded-[3rem] shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="reset-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="space-y-3 group/field">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1 group-focus-within/field:text-primary transition-colors">
                      Registered Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within/field:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@reservease.com"
                        className="pl-12 h-14 bg-background/40 border-2 border-border/50 rounded-2xl focus:border-primary focus:ring-0 transition-all font-bold text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group transition-all" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        "Generate Recovery Link"
                      )}
                    </Button>

                    <Button variant="ghost" className="w-full h-14 rounded-xl group/back text-muted-foreground hover:text-primary transition-colors font-bold text-sm" asChild>
                      <Link to="/login" className="flex items-center justify-center gap-2">
                        <ArrowLeft className="h-4 w-4 group-hover/back:-translate-x-1 transition-transform" />
                        Return to Control Center
                      </Link>
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="reset-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-8 py-6"
                >
                  <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center relative">
                      <CheckCircle2 className="h-12 w-12 text-emerald-500 relative z-10" />
                      <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black tracking-tight text-foreground">Link Dispatched</h3>
                    <p className="text-base text-muted-foreground font-medium">
                      Check your encrypted inbox for the recovery key sequence.
                    </p>
                  </div>
                  <Button className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group" asChild>
                    <Link to="/login">Back to Sign In</Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
            <Sparkles size={12} />
            Secure Protocol Active
          </div>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
            &copy; {new Date().getFullYear()} reservEase inc · infrastructure division
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
