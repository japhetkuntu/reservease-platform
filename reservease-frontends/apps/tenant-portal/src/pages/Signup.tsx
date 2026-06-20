import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, RefreshCw, Edit3, ShieldCheck, KeyRound, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/api/auth";
import { cn } from "@/lib/utils";

type Step = "details" | "verify" | "success";

const perks = [
  { icon: Zap, text: "Matches delivered in 24h" },
  { icon: Shield, text: "Every listing physically verified" },
  { icon: Users, text: "500+ people already housed" },
];

function StepBar({ current }: { current: Step }) {
  const steps: Step[] = ["details", "verify", "success"];
  const labels = ["Your details", "Verify email", "You're in"];
  const idx = steps.indexOf(current);
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all",
            i < idx ? "bg-primary text-primary-foreground" :
            i === idx ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
            "bg-muted text-muted-foreground"
          )}>
            {i < idx ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
          </div>
          <span className={cn("text-xs font-medium hidden sm:block", i === idx ? "text-foreground" : "text-muted-foreground")}>
            {labels[i]}
          </span>
          {i < steps.length - 1 && <div className={cn("h-px w-6 sm:w-10 flex-shrink-0", i < idx ? "bg-primary" : "bg-border")} />}
        </div>
      ))}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();
  const returnUrl = searchParams.get("returnUrl") || location.state?.returnTo || "/dashboard";

  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uniqueId, setUniqueId] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "success") {
      const t = setTimeout(() => navigate(returnUrl, { replace: true }), 2200);
      return () => clearTimeout(t);
    }
  }, [step, navigate, returnUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim()) { toast({ title: "First name required", variant: "destructive" }); return; }
    if (!form.email.includes("@")) { toast({ title: "Valid email required", variant: "destructive" }); return; }
    if (form.password.length < 6) { toast({ title: "Password too short", description: "Min. 6 characters", variant: "destructive" }); return; }
    if (form.password !== form.confirmPassword) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const res = await authApi.register({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim().toLowerCase(), password: form.password, confirmPassword: form.confirmPassword, source: "web" });
      setUniqueId(res.uniqueId); setOtpEmail(res.email); setNewEmail(res.email); setCooldown(60); setStep("verify");
    } catch (err: unknown) {
      toast({ title: "Registration failed", description: err instanceof Error ? err.message : "Try again", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast({ title: "Enter the 6-digit code", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const res = await authApi.verifyEmail({ otp, uniqueId });
      login(res.user, res.token, res.refreshToken); setStep("success");
    } catch (err: unknown) {
      toast({ title: "Verification failed", description: err instanceof Error ? err.message : "Invalid code", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try { await authApi.resendOtp({ email: otpEmail }); setCooldown(60); toast({ title: "Code resent!", description: `Check ${otpEmail}` }); }
    catch { toast({ title: "Failed to resend", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.includes("@")) { toast({ title: "Invalid email", variant: "destructive" }); return; }
    setLoading(true);
    try { await authApi.resendOtp({ email: newEmail }); setOtpEmail(newEmail); setCooldown(60); setOtp(""); setEditingEmail(false); toast({ title: "Code sent!", description: `Sent to ${newEmail}` }); }
    catch { toast({ title: "Failed to send", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const getBackAction = () => {
    if (step === "verify" && editingEmail) { setEditingEmail(false); return; }
    if (step === "verify") { setStep("details"); setOtp(""); return; }
    navigate(-1);
  };

  return (
    <div className="min-h-dvh flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col justify-between bg-brand-dark px-12 py-10 relative overflow-hidden flex-shrink-0">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary/20 blur-[80px]" />
          <div className="absolute -bottom-20 -right-10 w-64 h-64 rounded-full bg-blue-500/15 blur-[80px]" />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-sm font-black text-white">R</span>
            </div>
            <span className="text-base font-semibold text-white">ReservEase</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">Find your place.<br />Skip the stress.</h2>
            <p className="text-white/60 leading-relaxed">Create your free account and start your first search in under 2 minutes.</p>
          </div>
          <div className="space-y-4">
            {perks.map((p) => (
              <div key={p.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <p.icon className="h-4 w-4 text-white/80" />
                </div>
                <span className="text-sm font-medium text-white/80">{p.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex -space-x-2 mb-3">
            {[11, 12, 13, 14, 15].map((n) => (
              <img key={n} src={`https://i.pravatar.cc/40?img=${n}`} alt="" className="w-8 h-8 rounded-full border-2 border-brand-dark object-cover" />
            ))}
          </div>
          <p className="text-xs text-white/50">500+ people already housed across Ghana</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-5 border-b border-border">
          {step !== "success" ? (
            <button onClick={getBackAction} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}
          <p className="text-sm text-muted-foreground">
            Have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </header>

        <div className="flex-1 flex items-start justify-center px-6 py-10">
          <div className="w-full max-w-sm">
            {step !== "success" && <StepBar current={step} />}

            {/* Step 1: details */}
            {step === "details" && (
              <div>
                <div className="mb-7">
                  <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">Create your account</h1>
                  <p className="text-sm text-muted-foreground">We'll send a verification code to your email</p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">First Name *</Label>
                      <Input id="firstName" name="firstName" placeholder="Joe" value={form.firstName} onChange={handleChange} className="h-11 rounded-xl border-border text-sm" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Last Name</Label>
                      <Input id="lastName" name="lastName" placeholder="Bloggs" value={form.lastName} onChange={handleChange} className="h-11 rounded-xl border-border text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className="pl-10 h-11 rounded-xl border-border text-sm" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="password" name="password" type={showPass ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={handleChange} className="pl-10 pr-11 h-11 rounded-xl border-border text-sm" required />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} className="pl-10 pr-11 h-11 rounded-xl border-border text-sm" required />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {form.confirmPassword && form.password !== form.confirmPassword && (
                      <p className="text-xs text-destructive">Passwords don't match</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full h-11 rounded-xl text-sm font-semibold mt-2" disabled={loading}>
                    {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Creating account…</> : "Continue"}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground text-center mt-6">
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </div>
            )}

            {/* Step 2: OTP */}
            {step === "verify" && !editingEmail && (
              <div>
                <div className="mb-7">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <KeyRound className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">Check your inbox</h1>
                  <p className="text-sm text-muted-foreground">We sent a 6-digit code to <strong className="text-foreground">{otpEmail}</strong></p>
                </div>
                <form onSubmit={handleVerify} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="otp" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Verification code</Label>
                    <Input id="otp" type="text" inputMode="numeric" placeholder="000000" value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6} autoFocus
                      className="h-14 rounded-xl border-border text-center text-3xl tracking-[0.5em] font-mono" />
                  </div>
                  <Button type="submit" className="w-full h-11 rounded-xl text-sm font-semibold" disabled={loading || otp.length !== 6}>
                    {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Verifying…</> : <><ShieldCheck className="mr-2 h-4 w-4" />Verify email</>}
                  </Button>
                </form>
                <div className="flex flex-col items-center gap-3 mt-6">
                  <button onClick={handleResend} disabled={cooldown > 0 || loading}
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors disabled:text-muted-foreground disabled:cursor-not-allowed">
                    <RefreshCw className="h-3.5 w-3.5" />
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                  </button>
                  <button onClick={() => { setNewEmail(otpEmail); setEditingEmail(true); }}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Edit3 className="h-3.5 w-3.5" /> Use a different email
                  </button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-5">Didn't get it? Check your spam folder.</p>
              </div>
            )}

            {/* Step 2b: change email */}
            {step === "verify" && editingEmail && (
              <div>
                <div className="mb-7">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">Update your email</h1>
                  <p className="text-sm text-muted-foreground">We'll send a fresh code to this address</p>
                </div>
                <form onSubmit={handleChangeEmail} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="newEmail" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="newEmail" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="new@example.com" autoFocus
                        className="pl-10 h-11 rounded-xl border-border text-sm" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 rounded-xl text-sm font-semibold" disabled={loading}>
                    {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Sending…</> : "Send new code"}
                  </Button>
                </form>
              </div>
            )}

            {/* Step 3: success */}
            {step === "success" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Welcome, {form.firstName}!</h1>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Your account is ready. You're all set to find your perfect accommodation.</p>
                <Button className="w-full h-11 rounded-xl text-sm font-semibold mb-3" onClick={() => navigate(returnUrl)}>
                  {returnUrl === "/dashboard" ? "Go to dashboard" : "Continue"}
                </Button>
                <Button variant="ghost" className="w-full h-10 text-sm text-muted-foreground" onClick={() => navigate("/search")}>
                  Start searching now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}