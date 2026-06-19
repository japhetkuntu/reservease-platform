import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/api/auth";

export default function Security() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword) {
      toast({ title: "Missing fields", description: "Please fill in all password fields", variant: "destructive" });
      return;
    }
    if (form.newPassword.length < 6) {
      toast({ title: "Password too short", description: "New password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (form.newPassword !== form.confirmNewPassword) {
      toast({ title: "Passwords don't match", description: "New password and confirmation must match", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      });
      toast({ title: "Password changed", description: "Your password has been updated successfully" });
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      navigate("/profile");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to change password";
      toast({ title: "Change failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 md:p-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="text-lg font-semibold text-foreground">Security &amp; Privacy</h1>
      </header>

      <main className="flex-1 px-6 py-4 max-w-sm mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Section header */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">Change Password</h2>
            <p className="text-sm text-muted-foreground text-center">Keep your account safe with a strong password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm text-muted-foreground">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-8 pr-10 h-12 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm text-muted-foreground">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-8 pr-10 h-12 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground pl-8">At least 6 characters</p>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword" className="text-sm text-muted-foreground">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-8 h-12 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base mt-4" disabled={loading}>
              {loading ? (
                <><Loader2 className="animate-spin mr-2 h-4 w-4" />Changing password...</>
              ) : (
                <>Change Password</>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot your current password?
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
