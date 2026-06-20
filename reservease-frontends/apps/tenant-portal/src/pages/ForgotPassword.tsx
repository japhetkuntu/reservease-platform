import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/api/auth";
import { cn } from "@/lib/utils";

type Step = "email" | "otp" | "new-password" | "done";

const stepMeta: Record<Step, { icon: React.ElementType; title: string; sub: string }> = {
  email: { icon: Mail, title: "Forgot your password?", sub: "Enter your email and we'll send a reset code." },
  otp: { icon: KeyRound, title: "Check your inbox", sub: "" },
  "new-password": { icon: Lock, title: "Choose a new password", sub: "Pick something strong — at least 6 characters." },
  done: { icon: CheckCircle2, title: "Password reset!", sub: "You're all set. Your password has been changed." },
};

function StepIndicator({ current }: { current: Step }) {
  const steps: Step[] = ["email", "otp", "new-password", "done"];
  const idx = steps.indexOf(current);
  return (
    <div className="flex items-center gap-1.5 mb-8">
      {steps.map((s, i) => (
        <div key={s} className={cn(
          "h-1 rounded-full transition-all duration-300",
          i < idx ? "flex-1 bg-primary" :
          i === idx ? "flex-[2] bg-primary" :
          "flex-1 bg-border"
        )} />
      ))}
    </div>
  );
}

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

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) { toast({ title: "Invalid email", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const resp = await authApi.forgotPassword(email);
      setUniqueId(resp.uniqueId);
      toast({ title: "Code sent!", description: "Check your email for the reset code." });
      setStep("otp");
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Could not send reset code", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleOtpNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast({ title: "Enter the 6-digit code", variant: "destructive" }); return; }
    setStep("new-password");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast({ title: "Password too short", description: "Min. 6 characters", variant: "destructive" }); return; }
    if (password !== confirmPassword) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const response = await authApi.resetPassword({ uniqueId, otpCode: otp, password, confirmPassword });
      if (response.token) login(response.user, response.token, response.refreshToken);
      setStep("done");
    } catch (err: unknown) {
      toast({ title: "Reset failed", description: err instanceof Error ? err.message : "Try again", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleBack = () => {
    if (step === "email") navigate(-1);
    else if (step === "otp") setStep("email");
    else if (step === "new-password") setStep("otp");
  };

  const meta = stepMeta[step];
  const Icon = meta.icon;

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Header */}
      {step !== "done" && (
        <header className="flex items-center px-6 py-5 border-b border-border">
          <button onClick={handleBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
        </header>
      )}

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {step !== "done" && <StepIndicator current={step} />}

          {/* Icon + heading */}
          <div className={cn("mb-8", step === "done" && "text-center mt-4")}>
            <div className={cn(
              "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5",
              step === "done" ? "bg-primary/10 w-16 h-16 rounded-full mx-auto" : "bg-primary/10"
            )}>
              <Icon className={cn("text-primary", step === "done" ? "h-8 w-8" : "h-6 w-6")} />
            </div>
            <h1 className={cn("font-bold text-foreground mb-1.5 tracking-tight", step === "done" ? "text-2xl text-center" : "text-2xl")}>
              {meta.title}
            </h1>
            {step === "otp" ? (
              <p className={cn("text-sm text-muted-foreground", step === "done" && "text-center")}>
                We sent a 6-digit code to <strong className="text-foreground">{email}</strong>
              </p>
            ) : (
              <p className={cn("text-sm text-muted-foreground", step === "done" && "text-center")}>{meta.sub}</p>
            )}
          </div>

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleRequestReset} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" autoFocus
                    className="pl-10 h-11 rounded-xl border-border text-sm" />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 rounded-xl text-sm font-semibold" disabled={loading}>
                {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Sending…</> : "Send reset code"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Remember it?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
              </p>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <form onSubmit={handleOtpNext} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="otp" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reset code</Label>
                <Input id="otp" type="text" inputMode="numeric" placeholder="000000" value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6} autoFocus
                  className="h-14 rounded-xl border-border text-center text-3xl tracking-[0.5em] font-mono" />
              </div>
              <Button type="submit" className="w-full h-11 rounded-xl text-sm font-semibold" disabled={otp.length !== 6}>
                Continue
              </Button>
              <button type="button" onClick={handleRequestReset} disabled={loading}
                className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors disabled:text-muted-foreground">
                {loading ? "Resending…" : "Resend code"}
              </button>
            </form>
          )}

          {/* Step 3: New password */}
          {step === "new-password" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPass ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" autoFocus
                    className="pl-10 pr-11 h-11 rounded-xl border-border text-sm" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="confirmPassword" type="password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                    className="pl-10 h-11 rounded-xl border-border text-sm" />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive">Passwords don't match</p>
                )}
              </div>
              <Button type="submit" className="w-full h-11 rounded-xl text-sm font-semibold" disabled={loading}>
                {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Resetting…</> : "Reset password"}
              </Button>
            </form>
          )}

          {/* Step 4: Done */}
          {step === "done" && (
            <div className="text-center space-y-4">
              <Button className="w-full h-11 rounded-xl text-sm font-semibold" onClick={() => navigate("/dashboard")}>
                Go to dashboard
              </Button>
              <Button variant="ghost" className="w-full h-10 text-sm text-muted-foreground" asChild>
                <Link to="/login">Back to sign in</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}