import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/api/auth';
import { Eye, EyeOff } from 'lucide-react';

type Stage = 'enter-email' | 'enter-otp' | 'success';

export function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [stage, setStage]     = useState<Stage>('enter-email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [otp, setOtp] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [showPw, setShowPw] = useState(false);

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.forgotPassword(email);
      setUniqueId(res.uniqueId || '');
      setStage('enter-otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.resetPassword({
        uniqueId,
        otpCode: otp,
        password: newPw,
        confirmPassword: confirmPw,
      });
      setStage('success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please check your code.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="border-b h-14 flex items-center px-4 sm:px-8">
        <Link to="/login" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm">ReservEase</span>
        </Link>
      </header>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-8">

          {stage === 'enter-email' ? (
            <>
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />Back to sign in
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Enter the email address linked to your account. We'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-5">
                {error && <div className="text-sm font-medium text-destructive">{error}</div>}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="owner@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="pl-9 h-11"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 gap-2"
                  disabled={loading || !email}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending reset link…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Reset Link <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Sign up free
                </Link>
              </p>
            </>
          ) : stage === 'enter-otp' ? (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>.
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-5">
                {error && <div className="text-sm font-medium text-destructive">{error}</div>}

                <div className="space-y-2">
                  <Label>Reset Code</Label>
                  <Input
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="h-11 tracking-widest text-center text-lg"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPw ? "text" : "password"}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      className="h-11 pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type={showPw ? "text" : "password"}
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    className="h-11"
                    required
                    minLength={8}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={loading || otp.length < 6 || !newPw || !confirmPw}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>

              <div className="text-center">
                 <button
                    type="button"
                    onClick={handleSendEmail}
                    className="text-primary text-sm font-medium hover:underline"
                    disabled={loading}
                  >
                    Resend Code
                  </button>
              </div>
            </>
          ) : (
            /* ── Success state ── */
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Password Reset</h1>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  Your password has been successfully updated. You can now log in with your new password.
                </p>
              </div>

              <Button asChild className="w-full h-11">
                <Link to="/login">Back to Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
