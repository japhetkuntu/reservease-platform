import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Eye, EyeOff, KeyRound, Mail, ArrowRight, ArrowLeft,
  AlertCircle, CheckCircle2, ShieldCheck, RefreshCw, Loader2, Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { authApi } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

type Step = "details" | "verify" | "success";

// ─── Step indicator ───────────────────────────────────────────
function StepDots({ current }: { current: Step }) {
  const steps: Step[] = ["details", "verify", "success"];
  const idx = steps.indexOf(current);
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div
          key={s}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i <= idx ? "w-8 bg-primary" : "w-4 bg-border"
          )}
        />
      ))}
    </div>
  );
}

// ─── Slide animation ──────────────────────────────────────────
const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

export function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ── State ─────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("details");

  // Step 1 – account details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  // Step 2 – OTP
  const [uniqueId, setUniqueId] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Success redirect
  useEffect(() => {
    if (step === "success") {
      const t = setTimeout(() => navigate('/dashboard', { replace: true }), 2500);
      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  // ── Step 1: Register ──────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        source: "AccommodationPortal"
      });
      // Response gives uniqueId required for Verify endpoint
      setUniqueId(res.uniqueId || "");
      setOtpEmail(res.email || email);
      setNewEmail(res.email || email);
      setCooldown(60);
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await authApi.verifyEmail({ otp, uniqueId });
      login(res.user, res.token, res.refreshToken);
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────
  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    setError(null);
    try {
      await authApi.resendOtp({ email: otpEmail });
      setCooldown(60);
    } catch (err: any) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Change Email ──────────────────────────────────────────
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.resendOtp({ email: newEmail });
      setOtpEmail(newEmail);
      setCooldown(60);
      setOtp("");
      setEditingEmail(false);
    } catch {
      setError("Failed to send code to new email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left: Form Panel ─────────────────── */}
      <div className="flex-1 flex flex-col justify-between border-r bg-white dark:bg-background relative overflow-hidden min-h-screen">

        {/* Header Navigation */}
        <div className="flex items-center justify-between p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">ReservEase</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Owner Portal</p>
            </div>
          </div>

          {(step === "verify" && !editingEmail) && (
            <button
              onClick={() => { setStep("details"); setOtp(""); setError(null); }}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          {(step === "verify" && editingEmail) && (
            <button
              onClick={() => { setEditingEmail(false); setError(null); }}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Cancel
            </button>
          )}
        </div>

        {/* Dynamic Form Area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-8">
          <div className="w-full max-w-[400px]">
            <AnimatePresence mode="wait">
              {/* ── Step 1: Details ─────────────────── */}
              {step === "details" && (
                <motion.div key="details" {...slide} className="space-y-8">
                  <div className="space-y-1.5">
                    <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
                    <p className="text-muted-foreground text-sm">List your first property in under 10 minutes. It's free.</p>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-destructive leading-tight">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName" type="text" placeholder="Kofi"
                          value={firstName} onChange={e => setFirstName(e.target.value)}
                          className="h-11" required autoFocus
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName" type="text" placeholder="Mensah"
                          value={lastName} onChange={e => setLastName(e.target.value)}
                          className="h-11" required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email" type="email" placeholder="owner@example.com"
                          value={email} onChange={e => setEmail(e.target.value)}
                          className="pl-9 h-11" required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
                          value={password} onChange={e => setPassword(e.target.value)}
                          className="pl-9 pr-10 h-11" required minLength={8}
                        />
                        <button
                          type="button" onClick={() => setShowPw(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPw ? 'Hide password' : 'Show password'}
                        >
                          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword" type={showPw ? 'text' : 'password'} placeholder="Repeat password"
                          value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                          className="pl-9 h-11" required
                        />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      By signing up you agree to our{' '}
                      <Link to="#" className="text-primary hover:underline">Terms</Link> and{' '}
                      <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.
                    </p>

                    <Button type="submit" className="w-full h-11 gap-2 mt-4" disabled={loading}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating account…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Create Account <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <Separator />
                    <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                      Already have an account?
                    </span>
                  </div>

                  <Button variant="outline" className="w-full h-11" asChild>
                    <Link to="/login">Sign in instead</Link>
                  </Button>
                </motion.div>
              )}

              {/* ── Step 2a: Enter OTP ─────────────────── */}
              {step === "verify" && !editingEmail && (
                <motion.div key="verify-otp" {...slide} className="space-y-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
                      <KeyRound className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Check your inbox</h2>
                    <p className="text-muted-foreground text-sm">
                      We sent a 6-digit verification code to
                    </p>
                    <p className="font-medium mt-1 text-sm">{otpEmail}</p>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3.5 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-destructive leading-tight">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-2">
                      <Input
                        id="otp" type="text" inputMode="numeric"
                        placeholder="000000"
                        value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6} autoFocus
                        className="h-16 bg-transparent border-0 border-b-2 border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-center text-3xl tracking-[0.6em] font-mono"
                      />
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={loading || otp.length !== 6}>
                      {loading ? (
                         <span className="flex items-center gap-2">
                           <Loader2 className="w-4 h-4 animate-spin" /> Verifying…
                         </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" /> Verify Email
                        </span>
                      )}
                    </Button>
                  </form>

                  <div className="flex flex-col items-center gap-4 mt-6">
                    <button
                      onClick={handleResend}
                      disabled={cooldown > 0 || loading}
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors disabled:text-muted-foreground disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={cn("h-3.5 w-3.5", { "animate-spin": loading && !otp })} />
                      {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                    </button>
                    <button
                      onClick={() => { setNewEmail(otpEmail); setEditingEmail(true); setError(null); }}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Change email address
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2b: Change Email ───────────────── */}
              {step === "verify" && editingEmail && (
                <motion.div key="change-email" {...slide} className="space-y-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
                      <Mail className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Update email</h2>
                    <p className="text-muted-foreground text-sm">We'll send a new code to this address</p>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3.5 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-destructive leading-tight">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleChangeEmail} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="newEmail">New email address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newEmail" type="email"
                          value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="new@example.com" autoFocus
                          className="pl-9 h-11" required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11" disabled={loading}>
                      {loading ? (
                         <span className="flex items-center gap-2">
                           <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                         </span>
                      ) : "Send New Code"}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* ── Step 3: Success ───────────────────── */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                  className="text-center space-y-6"
                >
                  <div className="relative inline-flex mb-2">
                    <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Welcome, {firstName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Your email has been verified. Redirecting you to your dashboard...
                    </p>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        <div className="p-6 sm:p-8 border-t flex justify-between items-center">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ReservEase</p>
          <div className="hidden sm:block">
            <StepDots current={step} />
          </div>
        </div>
      </div>

      {/* ── Right: Brand Panel ─────────────────── */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 text-white p-12 w-[520px] xl:w-[600px] shrink-0">
        <div />

        <div className="space-y-10 max-w-md">
          <div className="space-y-5">
            <h2 className="text-4xl font-bold tracking-tight leading-tight">
              Join 500+ owners already listing with ReservEase.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              The easiest way to reach thousands of verified tenants across Ghana.
            </p>
          </div>

          <div className="space-y-3">
            {[
              ['✓', 'Free to list — no commission, no hidden fees'],
              ['✓', 'Receive tenant requests directly to your dashboard'],
              ['✓', 'Manage photos, pricing, and availability in minutes'],
              ['✓', 'Verified owner badge for added tenant trust'],
            ].map(([check, text]) => (
              <div key={text} className="flex items-center gap-3 text-sm">
                <span className="text-emerald-400 font-bold">{check}</span>
                <span className="text-zinc-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-zinc-600 text-xs">Trusted by property owners across Ghana</p>
      </div>
    </div>
  );
}
