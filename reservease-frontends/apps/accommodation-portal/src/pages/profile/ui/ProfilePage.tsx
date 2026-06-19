import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Camera, Shield, CheckCircle2, Clock,
  Lock, Eye, EyeOff, AlertTriangle, Info, HelpCircle,
  ImagePlus, Trash2, ArrowRight, Sparkles, LogOut,
  ChevronRight, BadgeCheck, Zap, CreditCard,
  Settings, Key, Fingerprint, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { authApi } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";

// ── Activation progress ────────────────────────────────────────────────────────
const STEPS_REQUIRED = 2; // photo + admin

export function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Profile state ─────────────────────────────────────────────────────────
  const { user, updateUser, logout } = useAuth();
  const [name, setName]         = useState(user?.name || "");
  const [email]                 = useState(user?.email || "");
  const [phone, setPhone]       = useState(user?.mobileNumber || "");
  const [location, setLocation] = useState(user?.city || "");
  const [bio, setBio]           = useState(user?.bio || "");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // ── Profile photo ─────────────────────────────────────────────────────────
  const [photoUrl, setPhotoUrl] = useState<string | null>(user?.profilePicture || null);
  const [photoUploading, setPhotoUploading] = useState(false);

  // ── Admin approval (mock: not yet approved) ───────────────────────────────
  const adminApproved = user?.isVerified ?? false;
  const photoComplete = !!photoUrl;
  const activationProgress = [photoComplete, adminApproved].filter(Boolean).length;
  const isFullyActivated = photoComplete && adminApproved;

  // ── Password state ────────────────────────────────────────────────────────
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw]         = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [currentPw, setCurrentPw]         = useState("");
  const [newPw, setNewPw]                 = useState("");
  const [confirmPw, setConfirmPw]         = useState("");

  // ── Dialogs ───────────────────────────────────────────────────────────────
  const [showSaveDialog, setShowSaveDialog]     = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [saveSuccess, setSaveSuccess]           = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const updatedUser = await authApi.uploadProfilePhoto(file);
      setPhotoUrl(updatedUser.profilePicture || null);
      updateUser({ profilePicture: updatedUser.profilePicture });
    } catch (err: unknown) {
      console.error(err);
      alert((err as Error).message || "Failed to upload photo");
    } finally {
      setPhotoUploading(false);
    }
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setShowSaveDialog(true);
  }

  async function confirmSave() {
    setShowSaveDialog(false);
    setIsLoading(true);
    try {
      const parts = name.split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");

      const updatedProfile = await authApi.updateProfile({
        firstName,
        lastName: lastName || firstName,
        mobileNumber: phone,
        city: location,
        bio: bio
      });

      updateUser({
        name: updatedProfile.fullName || `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim(),
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        mobileNumber: phone,
        city: location,
        bio: bio
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      console.error(err);
      alert((err as Error).message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordLoading(true);

    try {
      await authApi.changePassword({
        currentPassword: currentPw,
        newPassword: newPw,
        confirmNewPassword: confirmPw
      });

      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      alert("Password updated successfully!");
    } catch (err: unknown) {
      console.error(err);
      setPasswordError((err as Error).message || "Failed to change password. Please check your current password.");
    } finally {
      setPasswordLoading(false);
    }
  }

  const pwMatch = newPw.length > 0 && confirmPw.length > 0 && newPw === confirmPw;
  const pwStrength = newPw.length >= 12 ? "strong" : newPw.length >= 8 ? "medium" : "weak";

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex-1 flex flex-col min-h-screen bg-background">

        {/* ── Fixed Gradient Background ─────────────────────── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* ── Top Hero Bar ──────────────────────────────────── */}
        <div className="relative border-b bg-background/50 backdrop-blur-xl z-10 transition-all duration-500">
          <div className="max-w-6xl mx-auto px-6 py-10 sm:py-16">
            <div className="flex flex-col sm:flex-row sm:items-center gap-8">

              {/* Profile Photo with Pulse Effect */}
              <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-700 animate-pulse-slow scale-110" />
                <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full p-1.5 bg-gradient-to-tr from-primary/50 via-primary/20 to-transparent shadow-2xl overflow-hidden ring-4 ring-background">
                  <Avatar className="h-full w-full rounded-full border-0">
                    <AvatarImage src={photoUrl || undefined} alt={name} className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <AvatarFallback className="bg-muted text-3xl font-black text-primary/40">
                      {name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 w-9 h-9 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-background hover:scale-110 transition-all active:scale-95 group-hover:rotate-12"
                >
                  {photoUploading ? <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </div>

              {/* Identity Info */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 rounded-full font-black uppercase tracking-widest text-[10px]">Portal Owner</Badge>
                    <StatusBadge isActivated={isFullyActivated} adminApproved={adminApproved} photoComplete={photoComplete} />
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-glow truncate">{name || "User Profile"}</h1>
                  <p className="text-lg font-medium text-muted-foreground/60 tracking-tight">{email}</p>
                </div>

                {/* Account completeness bar */}
                {!isFullyActivated && (
                  <div className="space-y-2 max-w-sm">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Readiness</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary">{Math.round((activationProgress / STEPS_REQUIRED) * 100)}% Complete</p>
                    </div>
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden border border-border/50">
                      <div
                        className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary),0.4)] transition-all duration-1000 ease-out"
                        style={{ width: `${(activationProgress / STEPS_REQUIRED) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Action */}
              <div className="hidden lg:flex items-center gap-3">
                 <div className="p-4 rounded-[2rem] bg-card border border-border/50 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                       <BadgeCheck className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification</p>
                       <p className="text-sm font-bold">{isFullyActivated ? "Verified Owner" : "In Progress"}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Layout ────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto w-full px-6 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

            {/* Sidebar Navigation */}
            <aside className="space-y-8">
              <Tabs defaultValue="info" className="w-full">
                <div className="flex flex-col gap-1">
                  <TabNavItem value="info" icon={User} label="Personal Profile" />
                  <TabNavItem value="verification" icon={Shield} label="Account Trust" badge={!isFullyActivated} />
                  <TabNavItem value="security" icon={Lock} label="Security & Access" />
                  <TabNavItem value="billing" icon={CreditCard} label="Payout Methods" disabled />
                  <TabNavItem value="history" icon={History} label="Activity Log" disabled />
                </div>

                <div className="pt-8 space-y-4">
                   <div className="h-px bg-border/50" />
                   <Button
                     variant="ghost"
                     className="w-full justify-start h-12 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-bold gap-3 transition-all"
                     onClick={() => setShowLogoutDialog(true)}
                   >
                     <LogOut className="w-4 h-4" /> Sign Out
                   </Button>
                </div>
              </Tabs>

              {/* Premium Support Card */}
              <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 relative overflow-hidden group">
                 <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                 <Zap className="w-8 h-8 text-primary mb-4 animate-pulse" />
                 <p className="font-black text-sm tracking-tight mb-1 uppercase">Owner Priority</p>
                 <p className="text-xs text-muted-foreground leading-relaxed">Dedicated support for premium accommodation owners. Available 24/7.</p>
                 <Button variant="link" className="p-0 h-auto text-primary text-[10px] font-black uppercase tracking-widest mt-4">Contact Specialist <ChevronRight className="w-3 h-3 ml-1" /></Button>
              </div>
            </aside>

            {/* Content Area */}
            <main className="space-y-8">

              <Tabs defaultValue="info" className="w-full">
                <TabsContent value="info" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
                  <SectionHeader title="Personal Profile" description="Manage how you appear to tenants and potential renters." />

                  <Card className="glass border-border/50 overflow-hidden rounded-[3rem]">
                    <CardContent className="p-8 sm:p-12">
                      <form onSubmit={handleSaveProfile} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

                          <PulseField
                            label="DISPLAY NAME" icon={User} htmlFor="name"
                            help="How your name appears on all your property listings."
                          >
                            <Input
                              id="name" value={name}
                              onChange={e => setName(e.target.value)}
                              className="bg-muted/30 border-border/50 h-14 rounded-2xl px-5 font-bold tabular-nums"
                              placeholder="Your professional name"
                            />
                          </PulseField>

                          <PulseField
                            label="EMAIL ADDRESS" icon={Mail} htmlFor="email"
                            help="Locked to protect your identity. Contact support to update."
                          >
                            <div className="relative">
                              <Input
                                id="email" value={email} disabled
                                className="bg-muted cursor-not-allowed text-muted-foreground/60 h-14 rounded-2xl px-5 font-bold"
                              />
                              <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                            </div>
                          </PulseField>

                          <PulseField
                            label="MOBILE CONTACT" icon={Phone} htmlFor="phone"
                            help="The primary number tenants will use for inquiries."
                          >
                            <Input
                              id="phone" value={phone}
                              onChange={e => setPhone(e.target.value)}
                              className="bg-muted/30 border-border/50 h-14 rounded-2xl px-5 font-bold tabular-nums"
                              placeholder="+233 XX XXX XXXX"
                            />
                          </PulseField>

                          <PulseField
                            label="BASE LOCATION" icon={MapPin} htmlFor="location"
                            help="The city where you are primarily based."
                          >
                            <Input
                              id="location" value={location}
                              onChange={e => setLocation(e.target.value)}
                              className="bg-muted/30 border-border/50 h-14 rounded-2xl px-5 font-bold"
                              placeholder="e.g. Kumasi, Ghana"
                            />
                          </PulseField>

                          <div className="sm:col-span-2 space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">PROFESSIONAL BIO</Label>
                              <span className="text-[10px] font-black text-muted-foreground/40 tabular-nums">{bio.length}/300</span>
                            </div>
                            <textarea
                              id="bio" rows={4}
                              value={bio} onChange={e => setBio(e.target.value.slice(0, 300))}
                              placeholder="Explain your approach to property management. A good bio increases tenant trust..."
                              className="flex min-h-[120px] w-full rounded-[2rem] border border-border/50 bg-muted/30 px-6 py-4 text-sm font-medium ring-offset-background placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all resize-none shadow-inner"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end pt-4">
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-14 px-10 rounded-full font-black uppercase tracking-widest gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                          >
                            {isLoading ? <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Save Identity</>}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="verification" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
                   <SectionHeader title="Trust & Verification" description="Verified accounts receive 3x more viewing requests." />

                   <div className="grid grid-cols-1 gap-6">
                      <Card className={cn("glass border-border/50 rounded-[3rem] overflow-hidden group hover:border-primary/20 transition-all duration-500", photoComplete && "bg-emerald-500/5 border-emerald-500/20")}>
                        <CardContent className="p-8 sm:p-12 flex flex-col md:flex-row items-center gap-10">
                           <div className={cn("h-24 w-24 rounded-[2rem] flex items-center justify-center shrink-0 border-4 transition-all duration-500",
                             photoComplete ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] rotate-3" : "bg-muted border-border/50 text-muted-foreground/40")}>
                              {photoComplete ? <CheckCircle2 className="w-12 h-12" /> : <Camera className="w-10 h-10" />}
                           </div>
                           <div className="flex-1 text-center md:text-left space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Requirement 01</p>
                              <h3 className="text-2xl font-black">Profile Identity Photo</h3>
                              <p className="text-sm text-muted-foreground/60 leading-relaxed font-medium">A clear, professional face photo. This builds immediate trust with tenants and is required for platform visibility.</p>
                              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                                 <Badge variant="secondary" className="bg-muted/50 rounded-lg py-1 px-3 text-[10px] uppercase font-black tabular-nums">1,024 x 1,024 px recommended</Badge>
                                 {photoComplete && <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 bg-emerald-500/10 rounded-lg py-1 px-3 text-[10px] uppercase font-black">Photo Uploaded</Badge>}
                              </div>
                           </div>
                           <Button
                             onClick={() => fileInputRef.current?.click()}
                             variant={photoComplete ? "outline" : "default"}
                             className="h-14 px-8 rounded-full font-black uppercase tracking-widest shrink-0"
                           >
                              {photoComplete ? "Update Photo" : "Upload Image"}
                           </Button>
                        </CardContent>
                      </Card>

                      <Card className={cn("glass border-border/50 rounded-[3rem] overflow-hidden group hover:border-primary/20 transition-all duration-500", adminApproved && "bg-emerald-500/5 border-emerald-500/20", !photoComplete && "opacity-60")}>
                        <CardContent className="p-8 sm:p-12 flex flex-col md:flex-row items-center gap-10">
                           <div className={cn("h-24 w-24 rounded-[2rem] flex items-center justify-center shrink-0 border-4 transition-all duration-500",
                             adminApproved ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] rotate-3" : "bg-muted border-border/50 text-muted-foreground/40")}>
                              {adminApproved ? <BadgeCheck className="w-12 h-12" /> : <Shield className="w-10 h-10" />}
                           </div>
                           <div className="flex-1 text-center md:text-left space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Requirement 02</p>
                              <h3 className="text-2xl font-black">Administrative Review</h3>
                              <p className="text-sm text-muted-foreground/60 leading-relaxed font-medium">Our moderation team reviews your account details to ensure high quality standards across the portal.</p>
                              {!photoComplete ? (
                                <p className="text-xs text-amber-600 font-black uppercase tracking-widest animate-pulse mt-2">Complete Step 01 to unlock review</p>
                              ) : adminApproved ? (
                                <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 bg-emerald-500/10 rounded-lg py-1 px-3 text-[10px] uppercase font-black mt-2">Account Approved</Badge>
                              ) : (
                                <div className="flex items-center gap-2 mt-4 text-sky-600">
                                   <Clock className="w-4 h-4 animate-spin-slow" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">In Review (Expect 24-48h)</span>
                                </div>
                              )}
                           </div>
                        </CardContent>
                      </Card>
                   </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
                   <SectionHeader title="Security & Governance" description="Protect your account and managed listings." />

                   <div className="space-y-8">
                     <Card className="glass border-border/50 rounded-[3rem] overflow-hidden">
                       <CardHeader className="px-8 sm:px-12 pt-8 sm:pt-12">
                          <CardTitle className="text-2xl font-black">Update Access Credentials</CardTitle>
                          <CardDescription className="text-sm font-medium">Passwords must be at least 12 characters with varied symbols.</CardDescription>
                       </CardHeader>
                       <CardContent className="px-8 sm:px-12 pb-8 sm:pb-12">
                         <form onSubmit={handlePasswordChange} className="space-y-8 max-w-md">
                           {passwordError && (
                             <div className="p-5 bg-destructive/5 border border-destructive/20 text-destructive text-xs font-bold rounded-2xl flex flex-col gap-2">
                               <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 shrink-0" /> SECURITY ERROR
                               </div>
                               <span>{passwordError}</span>
                             </div>
                           )}

                           <PulseField label="CURRENT PASSWORD" icon={Key} htmlFor="current-pw">
                             <PwInput id="current-pw" value={currentPw} onChange={setCurrentPw} show={showCurrentPw} onToggle={() => setShowCurrentPw(v => !v)} placeholder="••••••••••••" />
                           </PulseField>

                           <PulseField label="NEW PASS-PHRASE" icon={Fingerprint} htmlFor="new-pw">
                             <PwInput id="new-pw" value={newPw} onChange={setNewPw} show={showNewPw} onToggle={() => setShowNewPw(v => !v)} placeholder="Create a strong key" />
                             {newPw.length > 0 && (
                               <div className="mt-3 space-y-2">
                                 <div className="flex gap-1.5">
                                   {[1, 2, 3].map((i) => (
                                     <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-500",
                                       pwStrength === "weak"   && i <= 1 ? "bg-destructive shadow-[0_0_8px_rgba(ef,68,68,0.4)]" :
                                       pwStrength === "medium" && i <= 2 ? "bg-amber-500 shadow-[0_0_8px_rgba(f5,158,11,0.4)]" :
                                       pwStrength === "strong" && i <= 3 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-muted"
                                     )} />
                                   ))}
                                 </div>
                                 <p className={cn("text-[10px] uppercase font-black tracking-widest",
                                   pwStrength === "weak"   && "text-destructive",
                                   pwStrength === "medium" && "text-amber-600",
                                   pwStrength === "strong" && "text-emerald-600"
                                 )}>
                                   Security level: {pwStrength}
                                 </p>
                               </div>
                             )}
                           </PulseField>

                           <PulseField label="CONFIRM IDENTITY KEY" icon={Key} htmlFor="confirm-pw">
                             <PwInput id="confirm-pw" value={confirmPw} onChange={setConfirmPw} show={showConfirmPw} onToggle={() => setShowConfirmPw(v => !v)} placeholder="Repeat pass-phrase" />
                             {confirmPw.length > 0 && (
                               <div className={cn("mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", pwMatch ? "text-emerald-500" : "text-destructive")}>
                                 {pwMatch ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                 {pwMatch ? "Keys Match" : "Keys Mismatch"}
                               </div>
                             )}
                           </PulseField>

                           <Button
                             type="submit"
                             className="w-full h-14 rounded-full font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                             disabled={!pwMatch || pwStrength === "weak" || !currentPw || passwordLoading}
                           >
                             {passwordLoading ? <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" /> : "Update Credentials"}
                           </Button>
                         </form>
                       </CardContent>
                     </Card>

                     {/* Danger Zone */}
                     <div className="p-8 rounded-[3rem] border border-destructive/20 bg-destructive/5 space-y-6">
                        <div className="space-y-1">
                           <h3 className="text-xl font-black text-destructive">Danger Zone</h3>
                           <p className="text-sm font-medium text-destructive/60">Destructive actions related to your account authority.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                           <Button
                             variant="outline"
                             className="h-12 px-6 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all font-black uppercase tracking-widest text-[10px] gap-2"
                             onClick={() => setShowDeleteDialog(true)}
                           >
                             <Trash2 className="w-4 h-4" /> Permanently Delete Account
                           </Button>
                           <p className="text-xs text-muted-foreground/60 italic">This cannot be reversed once initiated.</p>
                        </div>
                     </div>
                   </div>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>

        {/* ── Toasts & Dialogs ────────────────────────────────── */}
        {saveSuccess && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-full shadow-2xl text-xs font-black uppercase tracking-[0.2em] animate-in slide-in-from-bottom-6 duration-500 ring-8 ring-emerald-600/10">
            <BadgeCheck className="w-5 h-5" />
            Profile Synced Successfully
          </div>
        )}

        <LogoutDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} onConfirm={() => {
          logout();
          navigate("/login");
        }} />

        <DeleteAccountDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} name={name} onConfirm={() => {
           // Mock delete
           navigate("/login");
        }} />

        <ConfirmDialog
          open={showSaveDialog} onOpenChange={setShowSaveDialog}
          title="Update Identity?"
          description="Your changes will be visible to all tenants and updated across the portal instantly."
          confirmLabel="Confirm Changes"
          onConfirm={confirmSave}
        />

      </div>
    </TooltipProvider>
  );
}

// ── Shared Sub-Components ────────────────────────────────────────────────────────────

function TabNavItem({ value, icon: Icon, label, badge, disabled }: { value: string; icon: any; label: string; badge?: boolean; disabled?: boolean }) {
  return (
    <TabsTrigger
      value={value}
      disabled={disabled}
      className={cn(
        "w-full justify-start h-12 rounded-2xl font-bold gap-3 px-4 border-l-4 border-transparent transition-all",
        "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:shadow-[0_4px_12px_rgba(var(--primary),0.05)]",
        "disabled:opacity-40"
      )}
    >
      <Icon className="w-4.5 h-4.5 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {badge && <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.6)]" />}
      {disabled && <Badge variant="secondary" className="text-[8px] font-black uppercase leading-none py-0.5 px-1.5 rounded-sm opacity-60">Soon</Badge>}
    </TabsTrigger>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-1 mb-8">
      <h2 className="text-4xl font-black tracking-tight leading-none">{title}</h2>
      <p className="text-muted-foreground font-medium">{description}</p>
    </div>
  );
}

function PulseField({ label, icon: Icon, help, children, htmlFor }: { label: string; icon: any; help?: string; children: any; htmlFor?: string }) {
  return (
    <div className="space-y-3 group/field">
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
           <Icon className="w-3 h-3 text-primary/40 group-focus-within/field:text-primary transition-colors" /> {label}
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="text-muted-foreground/40 hover:text-primary transition-colors"><HelpCircle className="w-3.5 h-3.5" /></button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-[11px] font-medium leading-relaxed">{help}</TooltipContent>
        </Tooltip>
      </div>
      {children}
    </div>
  );
}

function PwInput({ id, value, onChange, show, onToggle, placeholder }: {
  id: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; placeholder?: string;
}) {
  return (
    <div className="relative group/pw">
      <Input
        id={id} type={show ? "text" : "password"}
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-muted/30 border-border/50 h-14 rounded-2xl pl-5 pr-12 font-black tracking-widest tabular-nums focus:bg-background transition-all"
      />
      <button
        type="button" onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}

function StatusBadge({ isActivated, adminApproved, photoComplete }: { isActivated: boolean; adminApproved: boolean; photoComplete: boolean }) {
  if (isActivated) return (
    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-full py-1 px-3 text-[10px] font-black uppercase tracking-widest gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Fully Verified
    </Badge>
  );
  if (photoComplete) return (
    <Badge className="bg-sky-500/10 text-sky-600 border-sky-500/20 rounded-full py-1 px-3 text-[10px] font-black uppercase tracking-widest gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" /> Final Review
    </Badge>
  );
  return (
    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-full py-1 px-3 text-[10px] font-black uppercase tracking-widest gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Pending Uploads
    </Badge>
  );
}

function LogoutDialog({ open, onOpenChange, onConfirm }: { open: boolean; onOpenChange: (o: boolean) => void; onConfirm: () => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[2.5rem] p-8 max-w-sm">
        <div className="flex flex-col items-center text-center gap-6">
           <div className="h-20 w-20 rounded-[2rem] bg-primary/5 text-primary flex items-center justify-center">
              <LogOut className="w-10 h-10" />
           </div>
           <div className="space-y-2">
              <AlertDialogTitle className="text-2xl font-black">Ending Session?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-medium">You will be required to authenticate with your credentials the next time you access the portal.</AlertDialogDescription>
           </div>
           <div className="flex flex-col w-full gap-3 mt-2">
              <AlertDialogAction onClick={onConfirm} className="h-14 rounded-full font-black uppercase tracking-widest bg-zinc-900 dark:bg-zinc-100 text-background">Sign Out</AlertDialogAction>
              <AlertDialogCancel className="h-14 rounded-full font-black uppercase tracking-widest border-0 hover:bg-muted">Stay Logged In</AlertDialogCancel>
           </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteAccountDialog({ open, onOpenChange, name, onConfirm }: { open: boolean; onOpenChange: (o: boolean) => void; name: string; onConfirm: () => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[2.5rem] border-destructive/20 p-10">
        <AlertDialogHeader className="space-y-4">
          <div className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2 mx-auto sm:mx-0">
             <AlertTriangle className="w-10 h-10" />
          </div>
          <AlertDialogTitle className="text-3xl font-black text-glow-red truncate">Permanently Delete Account?</AlertDialogTitle>
          <AlertDialogDescription className="text-base font-medium space-y-4">
            <p>This will permanently erase the identity of <strong className="text-foreground">{name}</strong> from our systems.</p>
            <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10">
               <ul className="space-y-2 text-xs text-destructive/70 font-bold uppercase tracking-wider">
                  <li className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> All property listings removed</li>
                  <li className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> All history and requests wiped</li>
                  <li className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Access credentials invalidated</li>
               </ul>
            </div>
            <p className="text-xs italic">By continuing, you acknowledge that this action is irreversible.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
          <AlertDialogCancel className="h-14 rounded-full font-black uppercase tracking-widest flex-1 sm:flex-none">Keep My Account</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="h-14 rounded-full font-black uppercase tracking-widest bg-destructive text-white hover:bg-destructive shadow-2xl shadow-destructive/20 flex-1 sm:flex-none">Confirm Deletion</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, onConfirm }: {
  open: boolean; onOpenChange: (o: boolean) => void;
  title: string; description: string; confirmLabel: string; onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[2.5rem] p-10">
        <div className="space-y-6">
           <div className="space-y-2">
              <AlertDialogTitle className="text-3xl font-black">{title}</AlertDialogTitle>
              <AlertDialogDescription className="text-base font-medium leading-relaxed">{description}</AlertDialogDescription>
           </div>
           <div className="flex items-center gap-4 pt-4">
              <AlertDialogCancel className="h-14 flex-1 rounded-full font-black uppercase tracking-widest border-0 hover:bg-muted">No, Go Back</AlertDialogCancel>
              <AlertDialogAction onClick={onConfirm} className="h-14 flex-1 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-primary/20">{confirmLabel}</AlertDialogAction>
           </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
