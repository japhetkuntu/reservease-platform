import { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Loader2, Lock, Eye, EyeOff, CheckCircle2, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/api/auth";

const perks = [
  { icon: Zap, text: "Matches delivered in 24h" },
  { icon: Shield, text: "Every listing verified" },
  { icon: Users, text: "500+ people already housed" },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const returnUrl = searchParams.get("returnUrl") || location.state?.returnTo || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast({ title: "Email required", variant: "destructive" }); return; }
    if (!password) { toast({ title: "Password required", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      login(
        { name: response.user?.name ?? "User", email: response.user?.email ?? email, isVerified: response.user?.isVerified },
        response.token,
        response.refreshToken
      );
      toast({ title: "Welcome back!" });
      setSuccess(true);
      setTimeout(() => navigate(returnUrl), 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Login failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">Redirecting you now…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel: brand ── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col justify-between bg-[#001a35] px-12 py-10 relative overflow-hidden flex-shrink-0">
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
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Ghana's smartest<br />accommodation search.
            </h2>
            <p className="text-white/60 leading-relaxed">
              Tell us what you need. We find verified options and deliver them to your phone within 24 hours.
            </p>
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
              <img key={n} src={`https://i.pravatar.cc/40?img=${n}`} alt="" className="w-8 h-8 rounded-full border-2 border-[#001a35] object-cover" />
            ))}
          </div>
          <p className="text-xs text-white/50">Join 500+ people who found their home through ReservEase</p>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-border">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <p className="text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up free</Link>
          </p>
        </header>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your ReservEase account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-border text-sm" disabled={loading} autoFocus />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password</Label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-11 h-11 rounded-xl border-border text-sm" disabled={loading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl text-sm font-semibold" disabled={loading}>
                {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Signing in…</> : "Sign in"}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-8">
              Don't have an account?{" "}
              <Link to={`/signup${returnUrl !== "/dashboard" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
                className="text-primary font-semibold hover:underline">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}