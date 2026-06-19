import { useState } from "react";
import {
  User,
  Mail,
  School,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Clock,
  ShieldCheck,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications";

function VerificationBadge({ status }: { status: "verified" | "pending" | "unverified" }) {
  if (status === "verified") {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <ShieldCheck className="h-3 w-3" />
        Verified
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-600 dark:text-amber-400">
        <Clock className="h-3 w-3" />
        Pending verification
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border/50 text-xs font-medium text-muted-foreground">
      Unverified
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isVerified, isLoggedIn, logout } = useAuth();

  const { data: unreadData } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: notificationsApi.getUnreadCount,
    enabled: isLoggedIn,
  });

  const unreadCount = unreadData?.count || 0;

  const displayUser = user || { name: "Guest User", email: "", school: "" };

  const menuItems = [
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage alerts and activity history",
      href: "/notifications",
      badge: unreadCount > 0 ? unreadCount : undefined,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Shield,
      label: "Security & Privacy",
      description: "Password and account protection",
      href: "/security",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get assistance and view FAQ",
      href: "/support",
      color: "text-muted-foreground",
      bgColor: "bg-muted"
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] pb-24">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container h-14 flex items-center justify-between max-w-2xl mx-auto px-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
            <h1 className="font-semibold text-sm">Profile</h1>
            <div className="w-16" />
          </div>
        </header>

        <main className="container py-8 md:py-12 max-w-2xl mx-auto px-4">
          {/* User Hero Section */}
          <div className="relative bg-card border border-border rounded-xl p-6 mb-6 overflow-hidden">

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-full bg-muted border border-border flex items-center justify-center">
                  <User className="h-9 w-9 text-muted-foreground/40" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left min-w-0 pt-2">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                   <h2 className="text-2xl font-bold text-foreground tracking-tight truncate leading-none">
                     {displayUser.name}
                   </h2>
                   <VerificationBadge status={isVerified ? "verified" : "pending"} />
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-sm truncate">{displayUser.email || "No email linked"}</span>
                  </div>
                  {displayUser.school && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                      <School className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-sm truncate">{displayUser.school}</span>
                    </div>
                  )}
                </div>

                <Button size="lg" className="rounded-lg font-semibold px-8 h-12" asChild>
                  <Link to="/edit-profile">
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Verification Status - Urgent if not verified */}
          {!isVerified && (
            <div
              className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-5 mb-6 flex flex-col md:flex-row items-center gap-5"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-semibold text-foreground mb-1">Verify your account</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 md:mb-0">
                  Complete verification to unlock full search and booking features.
                </p>
              </div>
              <Button variant="outline" className="border border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500 font-medium shrink-0" asChild>
                <Link to="/verify">Verify Now</Link>
              </Button>
            </div>
          )}

          {/* Settings Menu */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Settings</h3>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex flex-col divide-y divide-border/30">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        item.bgColor,
                        item.color
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm leading-none mb-0.5">{item.label}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.badge && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Support & Logout */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 font-medium px-8 h-11"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </main>
      </div>
    </Layout>
  );
}
