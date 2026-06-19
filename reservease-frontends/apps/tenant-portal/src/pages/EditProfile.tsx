import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, Loader2, CheckCircle2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/api/auth";
import { useRef } from "react";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    mobileNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hydrate from the real profile on mount
  useEffect(() => {
    authApi
      .getProfile()
      .then((profile) => {
        setForm({
          firstName: profile.firstName ?? "",
          lastName: profile.lastName ?? "",
          email: profile.email ?? "",
          mobileNumber: profile.mobileNumber ?? "",
        });
      })
      .catch(() => {
        // Fall back to cached context values — no toast needed
      })
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image smaller than 5MB", variant: "destructive" });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email) {
      toast({ title: "Missing fields", description: "First name and email are required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      let updated;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("firstName", form.firstName);
        formData.append("lastName", form.lastName);
        formData.append("email", form.email);
        if (form.mobileNumber) formData.append("mobileNumber", form.mobileNumber);
        formData.append("profilePicture", selectedFile);

        // Use a generic update call with FormData
        updated = await authApi.updateProfile(formData as any);
      } else {
        updated = await authApi.updateProfile({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          mobileNumber: form.mobileNumber || undefined,
        });
      }

      updateUser({
        name: updated?.fullName ?? updated?.name ?? `${form.firstName} ${form.lastName}`.trim(),
        firstName: updated?.firstName ?? form.firstName,
        lastName: updated?.lastName ?? form.lastName,
        email: updated?.email ?? form.email,
        mobileNumber: updated?.mobileNumber ?? form.mobileNumber ?? undefined,
        // @ts-ignore - profilePicture might not be in the mock ApiUser yet but we want to store it
        profilePicture: updated?.profilePicture ?? imagePreview ?? undefined,
      });
      toast({ title: "Profile updated", description: "Your changes have been saved" });
      navigate("/profile");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      toast({ title: "Update failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 md:p-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="text-lg font-semibold text-foreground">Edit Profile</h1>
      </header>

      <main className="flex-1 px-6 py-4 max-w-sm mx-auto w-full">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Avatar upload */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-28 w-28 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-background group-hover:bg-primary/20 transition-all duration-500\">
                {imagePreview || (user as any)?.profilePicture ? (
                  <img
                    src={imagePreview || (user as any)?.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-primary" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white h-7 w-7" />
                </div>
              </div>

              <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center border-4 border-background group-hover:scale-110 transition-transform\">
                <Camera size={18} />
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />

            <p className="text-xs font-bold text-muted-foreground mt-6 uppercase tracking-widest">
              Tap to change picture
            </p>
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm text-muted-foreground">First Name</Label>
            <div className="relative">
              <User className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Your first name"
                className="pl-8 h-12 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm text-muted-foreground">Last Name</Label>
            <div className="relative">
              <User className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Your last name"
                className="pl-8 h-12 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="pl-8 h-12 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="mobileNumber" className="text-sm text-muted-foreground">
              Phone <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                value={form.mobileNumber}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                className="pl-8 h-12 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-base"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base mt-4" disabled={loading}>
            {loading ? (
              <><Loader2 className="animate-spin mr-2 h-4 w-4" />Saving...</>
            ) : (
              <><CheckCircle2 className="h-4 w-4 mr-2" />Save Changes</>
            )}
          </Button>
        </motion.form>
      </main>
    </div>
  );
}
