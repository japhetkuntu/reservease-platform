import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/api/auth";

type Step = "email" | "otp" | "new-password" | "done";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Step 1: Send reset OTP ────────────────────────────────────
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const resp = await authApi.forgotPassword(email);
      setUniqueId(resp.uniqueId);
      toast({ title: "Code sent!", description: "Check your email for the reset code" });
      setStep("otp");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not send reset code";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: OTP entry (just advance to new-password step) ─────
  const handleOtpNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Invalid code", description: "Please enter the 6-digit code", variant: "destructive" });
      return;
    }
    setStep("new-password");
  };

  // ── Step 3: Submit new password ───────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.resetPassword({
        uniqueId,
        otpCode: otp,
        password,
        confirmPassword,
      });
      // Backend returns tokens on success — log the user in directly
      if (response.token) {
        login(response.user, response.token, response.refreshToken);
      }
      setStep("done");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reset password";
      toast({ title: "Reset failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 md:p-6 flex items-center gap-4">
        {step === "done" ? null : (
          <button
            onClick={() => {
              if (step === "email") navigate(-1);
              else if (step === "otp") setStep("email");
              else if (step === "new-password") setStep("otp");
            }}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
        <h1 className="text-lg font-semibold text-foreground">Reset Password</h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            {/* ── Step 1: Email ──────────────────────────────────── */}
            {step === "email" && (
              <motion.div key="email" variants={slideVariants} initial="initial" animate="animate" exit="exit">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Forgot password?</h2>
                  <p className="text-muted-foreground text-sm">Enter your email and we'll send a reset code</p>
                </div>
                <form onSubmit={handleRequestReset} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-8 h-12 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                        autoFocus
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={loading}>
                    {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Sending...</> : "Send Reset Code"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link to="/login" className="text-primary hover:underline">Sign in</Link>
                  </p>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: OTP ────────────────────────────────────── */}
            {step === "otp" && (
              <motion.div key="otp" variants={slideVariants} initial="initial" animate="animate" exit="exit">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                    <KeyRound className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Enter code</h2>
                  <p className="text-muted-foreground text-sm">We sent a 6-digit code to <strong>{email}</strong></p>
                </div>
                <form onSubmit={handleOtpNext} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm text-muted-foreground">Reset Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="h-14 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-center text-2xl tracking-[0.5em] font-mono"
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={otp.length !== 6}>
                    Continue
                  </Button>
                  <button
                    type="button"
                    onClick={handleRequestReset}
                    disabled={loading}
                    className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors disabled:text-muted-foreground"
                  >
                    {loading ? "Resending..." : "Resend code"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Step 3: New Password ───────────────────────────── */}
            {step === "new-password" && (
              <motion.div key="new-password" variants={slideVariants} initial="initial" animate="animate" exit="exit">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">New password</h2>
                  <p className="text-muted-foreground text-sm">Choose a strong password for your account</p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm text-muted-foreground">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-8 pr-10 h-12 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                        autoFocus
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground pl-8">At least 6 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-8 h-12 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={loading}>
                    {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Resetting...</> : "Reset Password"}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ── Step 4: Done ───────────────────────────────────── */}
            {step === "done" && (
              <motion.div key="done" variants={slideVariants} initial="initial" animate="animate" className="text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-success/10 mb-6">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Password reset!</h2>
                <p className="text-muted-foreground mb-8">Your password has been changed successfully</p>
                <Button className="w-full h-12" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
