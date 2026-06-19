import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PulseBackground } from "@/components/layout/PulseBackground";

import { useAuth } from "@/contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login({ email, password });
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to initialize session. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
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
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary text-primary-foreground shadow-[0_20px_50px_rgba(0,34,68,0.3)] mb-4 group relative"
          >
            <Shield className="h-10 w-10 relative z-10 transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-white/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          </motion.div>

          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md"
            >
              <ShieldCheck size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Secure Access</span>
            </motion.div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground leading-none">
              Control <span className="text-primary">Center</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xs mx-auto">
              ReservEase administration and infrastructure management.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="group relative"
        >
          {/* Glowing border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-[3rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

          <div className="relative bg-card/60 backdrop-blur-3xl border border-white/20 p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3 group/field">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1 group-focus-within/field:text-primary transition-colors">
                  Email Architecture
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within/field:text-primary transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@reservease.com"
                    className="pl-12 h-14 bg-background/40 border-2 border-border/50 rounded-2xl focus:border-primary focus:ring-0 transition-all font-bold text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 group/field">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-focus-within/field:text-primary transition-colors">
                    Access Key
                  </Label>
                  <Link to="/reset-password" title="Reset Key" className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors italic underline decoration-primary/20 hover:decoration-primary">
                    Forgot Key?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within/field:text-primary transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="pl-12 h-14 bg-background/40 border-2 border-border/50 rounded-2xl focus:border-primary focus:ring-0 transition-all font-bold text-base"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group/btn transition-all active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <span className="flex items-center gap-3">
                    Initialize Session
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-500" />
                  </span>
                )}
              </Button>
            </form>
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
            Powered by ReservEase Pulse 2026
          </div>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
            &copy; {new Date().getFullYear()} reservEase inc · infrastructure division
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
