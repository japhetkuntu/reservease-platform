import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Edit3,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/api/auth";

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
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i <= idx ? "w-8 bg-primary" : "w-4 bg-border"
          }`}
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

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();

  const returnUrl = searchParams.get("returnUrl") || location.state?.returnTo || "/dashboard";

  // ── State ─────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("details");

  // Step 1 – account details
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 2 – OTP
  const [uniqueId, setUniqueId] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [loading, setLoading] = useState(false);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Success step redirect
  useEffect(() => {
    if (step === "success") {
      const t = setTimeout(() => navigate(returnUrl, { replace: true }), 2000);
      return () => clearTimeout(t);
    }
  }, [step, navigate, returnUrl]);

  // ── Handlers ──────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ── Step 1: Register ──────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim()) {
      toast({ title: "First name required", variant: "destructive" }); return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      toast({ title: "Valid email required", variant: "destructive" }); return;
    }
    if (form.password.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters", variant: "destructive" }); return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" }); return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        source: "web",
      });
      setUniqueId(res.uniqueId);
      setOtpEmail(res.email);
      setNewEmail(res.email);
      setCooldown(60);
      setStep("verify");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast({ title: "Registration failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Enter the 6-digit code", variant: "destructive" }); return;
    }

    setLoading(true);
    try {
      const res = await authApi.verifyEmail({ otp, uniqueId });
      // Backend returns tokens on OTP success — log user in now
      login(res.user, res.token, res.refreshToken);
      setStep("success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid or expired code";
      toast({ title: "Verification failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────
  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      await authApi.resendOtp({ email: otpEmail });
      setCooldown(60);
      toast({ title: "Code resent!", description: `Check ${otpEmail}` });
    } catch {
      toast({ title: "Failed to resend", description: "Try again shortly", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Change email (sends new OTP to new address) ───────────
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.includes("@")) {
      toast({ title: "Invalid email", variant: "destructive" }); return;
    }
    setLoading(true);
    try {
      await authApi.resendOtp({ email: newEmail });
      setOtpEmail(newEmail);
      setCooldown(60);
      setOtp("");
      setEditingEmail(false);
      toast({ title: "Code sent!", description: `A new code was sent to ${newEmail}` });
    } catch {
      toast({ title: "Failed to send code", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-4 md:p-6 flex items-center gap-4">
        {step === "details" && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </Link>
        )}
        {step === "verify" && !editingEmail && (
          <button
            onClick={() => { setStep("details"); setOtp(""); }}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
        {step === "verify" && editingEmail && (
          <button
            onClick={() => setEditingEmail(false)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Cancel</span>
          </button>
        )}
        <h1 className="text-lg font-semibold text-foreground">
          {step === "details" && "Create account"}
          {step === "verify" && (editingEmail ? "Change email" : "Verify email")}
          {step === "success" && "Welcome!"}
        </h1>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-4">
        <div className="w-full max-w-sm">
          <StepDots current={step} />

          <AnimatePresence mode="wait">

            {/* ── Step 1: Account Details ─────────────────── */}
            {step === "details" && (
              <motion.div key="details" {...slide}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Your details</h2>
                  <p className="text-sm text-muted-foreground">We'll send a verification code to your email</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs text-muted-foreground">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Joe"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        className="h-11 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs text-muted-foreground">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Bloggs"
                        value={form.lastName}
                        onChange={handleChange}
                        className="h-11 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs text-muted-foreground">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="pl-7 h-11 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs text-muted-foreground">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPass ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="pl-7 pr-10 h-11 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs text-muted-foreground">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Repeat password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="pl-7 pr-10 h-11 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground">
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {form.confirmPassword && form.password !== form.confirmPassword && (
                      <p className="text-xs text-destructive pl-7">Passwords don't match</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full h-12 text-base mt-2" disabled={loading}>
                    {loading
                      ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Creating account...</>
                      : "Continue"}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-8">
                  Already have an account?{" "}
                  <Link to={`/login${returnUrl !== "/dashboard" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`} className="text-primary font-medium hover:underline">Sign in</Link>
                </p>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="text-primary hover:underline">Terms</Link>{" "}and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </motion.div>
            )}

            {/* ── Step 2a: OTP Entry ──────────────────────── */}
            {step === "verify" && !editingEmail && (
              <motion.div key="verify-otp" {...slide}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
                    <KeyRound className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Check your inbox</h2>
                  <p className="text-sm text-muted-foreground">
                    We sent a 6-digit code to
                  </p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{otpEmail}</p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-xs text-muted-foreground">Verification code</Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      autoFocus
                      className="h-16 bg-transparent border-0 border-b-2 border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-center text-3xl tracking-[0.6em] font-mono"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading
                      ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Verifying...</>
                      : <><ShieldCheck className="h-4 w-4 mr-2" />Verify Email</>}
                  </Button>
                </form>

                {/* Resend + change email */}
                <div className="flex flex-col items-center gap-3 mt-6">
                  <button
                    onClick={handleResend}
                    disabled={cooldown > 0 || loading}
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors disabled:text-muted-foreground disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                  </button>
                  <button
                    onClick={() => { setNewEmail(otpEmail); setEditingEmail(true); }}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Use a different email
                  </button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-6">
                  Didn't receive a code? Check your spam folder or use a different email address.
                </p>
              </motion.div>
            )}

            {/* ── Step 2b: Change Email ───────────────────── */}
            {step === "verify" && editingEmail && (
              <motion.div key="change-email" {...slide}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
                    <Mail className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Update email</h2>
                  <p className="text-sm text-muted-foreground">We'll send a new code to this address</p>
                </div>

                <form onSubmit={handleChangeEmail} className="space-y-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="newEmail" className="text-xs text-muted-foreground">New email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="new@example.com"
                        autoFocus
                        className="pl-7 h-12 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={loading}>
                    {loading
                      ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Sending...</>
                      : "Send New Code"}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ── Step 3: Success / Welcome ───────────────── */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                className="text-center"
              >
                <div className="relative inline-flex mb-6">
                  <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-12 w-12 text-primary" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, transition: { delay: 0.2, type: "spring" } }}
                    className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-success flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-4 w-4 text-success-foreground" />
                  </motion.div>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome, {form.firstName}
                </h2>
                <p className="text-muted-foreground mb-2">
                  Your email has been verified and your account is ready.
                </p>
                <p className="text-sm text-muted-foreground mb-10">
                  You're all set to find your perfect accommodation.
                </p>

                <Button
                  className="w-full h-12 text-base"
                  onClick={() => navigate(returnUrl)}
                >
                  {returnUrl === "/dashboard" ? "Go to Dashboard" : "Continue"}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full h-11 mt-2 text-muted-foreground"
                  onClick={() => navigate("/search")}
                >
                  Start searching now
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
