import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Building2, Eye, EyeOff, KeyRound, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/api/auth';

// Real property photo for the panel
const PANEL_PHOTO = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85';

const SOCIAL_PROOF = [
  { stat: '500+', label: 'Active owners' },
  { stat: '12k+', label: 'Tenant requests' },
  { stat: '3 cities', label: 'Coverage area' },
  { stat: 'Free',   label: 'Always' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ email, password });
      login(response.user, response.token, response.refreshToken);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left: Form ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-background">

        {/* Logo bar */}
        <div className="flex items-center gap-2.5 px-8 py-6 shrink-0">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm leading-none">ReservEase</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Owner Portal</p>
          </div>
        </div>

        {/* Form area — vertically centred */}
        <div className="flex-1 flex items-center justify-center px-8 pb-8">
          <div className="w-full max-w-[360px] space-y-7">

            <div className="space-y-1.5">
              <h1 className="text-[28px] font-bold tracking-tight leading-none">Sign in</h1>
              <p className="text-muted-foreground text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Sign up free
                </Link>
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-destructive leading-tight">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="owner@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-9 h-11 bg-muted/40 border-border/60 focus:bg-background"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-9 pr-10 h-11 bg-muted/40 border-border/60 focus:bg-background"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-semibold gap-2 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Trust line */}
            <div className="flex items-center gap-2 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Secure sign in · Your data is encrypted end-to-end
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="px-8 py-5 text-xs text-muted-foreground shrink-0">
          &copy; {new Date().getFullYear()} ReservEase
        </p>
      </div>

      {/* ── Right: Photo Panel (desktop only) ─────────────── */}
      <div className="hidden lg:flex w-[520px] xl:w-[600px] shrink-0 relative overflow-hidden">
        {/* Background photo */}
        <img
          src={PANEL_PHOTO}
          alt="Premium accommodation in Ghana"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay — stronger at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

        {/* Content pinned to bottom */}
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          {/* Top left tag */}
          <div className="self-end">
            <span className="text-xs font-semibold bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full">
              Ghana's #1 Owner Portal
            </span>
          </div>

          {/* Bottom copy + stats */}
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Trusted by property owners
              </p>
              <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
                List your property.<br />Find great tenants.
              </h2>
              <p className="text-white/70 text-base leading-relaxed max-w-xs">
                The simplest way to manage your properties in Ghana — from listing to approval.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-3">
              {SOCIAL_PROOF.map(({ stat, label }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold leading-none">{stat}</p>
                  <p className="text-white/60 text-[10px] mt-1.5 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
