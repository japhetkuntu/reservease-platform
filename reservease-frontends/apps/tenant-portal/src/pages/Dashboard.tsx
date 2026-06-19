import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  FileText,
  ArrowRight,
  Zap,
  MapPin,
  Calendar,
  ChevronRight,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Construction
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { useRequest, RequestStatus } from "@/contexts/RequestContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/ui/PageLoader";

const statusConfig: Record<RequestStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof FileText;
  glowColor: string;
}> = {
  draft: {
    label: "Draft", color: "text-muted-foreground", bgColor: "bg-muted/50",
    borderColor: "border-border/50", icon: FileText, glowColor: "group-hover:border-border/50/20"
  },
  "pending-payment": {
    label: "Action Required", color: "text-amber-500", bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20", icon: Clock, glowColor: "group-hover:border-border/50-500/20"
  },
  "waiting-payment-confirmation": {
    label: "Verifying", color: "text-blue-500", bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20", icon: Loader2, glowColor: "group-hover:border-border/50-500/20"
  },
  "payment-failed": {
    label: "Payment Failed", color: "text-destructive", bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20", icon: AlertCircle, glowColor: "group-hover:border-border/50/20"
  },
  paid: {
    label: "Paid", color: "text-emerald-500", bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20", icon: CheckCircle2, glowColor: "group-hover:border-border/50-500/20"
  },
  processing: {
    label: "Searching", color: "text-primary", bgColor: "bg-primary/10",
    borderColor: "border-primary/20", icon: Search, glowColor: "group-hover:border-border/50/20"
  },
  "matches-found": {
    label: "Matches Found", color: "text-emerald-500", bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20", icon: CheckCircle2, glowColor: "group-hover:border-border/50-500/20"
  },
  "no-matches-found": {
    label: "No Matches", color: "text-destructive", bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20", icon: Search, glowColor: "group-hover:border-border/50/20"
  },
  "alternatives-suggested": {
    label: "Alternatives", color: "text-amber-500", bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20", icon: AlertCircle, glowColor: "group-hover:border-border/50-500/20"
  },
  "assigned-to-agent": {
    label: "Agent Active", color: "text-primary", bgColor: "bg-primary/10",
    borderColor: "border-primary/20", icon: Zap, glowColor: "group-hover:border-border/50/20"
  },
  completed: {
    label: "Completed", color: "text-emerald-500", bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20", icon: CheckCircle2, glowColor: "group-hover:border-border/50-500/20"
  },
  cancelled: {
    label: "Cancelled", color: "text-muted-foreground", bgColor: "bg-muted/50",
    borderColor: "border-border/50", icon: AlertCircle, glowColor: "group-hover:border-border/50/20"
  },
};

function PulseBackground() {
  return null;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
      <div className={cn("p-3 rounded-lg bg-background", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground tracking-tight">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [localSearch, setLocalSearch] = useState("");
  const observerTarget = useRef<HTMLDivElement>(null);

  const { requests, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, setSearchQuery, totalRequests } = useRequest();
  const { isLoggedIn } = useAuth();

  const stats = useMemo(() => {
    const active = requests.filter(r => !["completed", "cancelled", "draft"].includes(r.status)).length;
    const completed = requests.filter(r => r.status === "completed").length;
    const itemsWithMatches = requests.filter(r => r.status === "matches-found" || r.status === "alternatives-suggested").length;

    return { active, completed, itemsWithMatches };
  }, [requests]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, setSearchQuery]);

  useEffect(() => {
    return () => setSearchQuery("");
  }, [setSearchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!isLoggedIn) {
    return (
      <Layout>
        <PulseBackground />
        <div className="container py-20 text-center max-w-md mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="w-32 h-32 rounded-lg bg-primary/10 flex items-center justify-center border border-border">
                <FileText className="h-14 w-14 text-primary" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-lg bg-primary flex items-center justify-center border border-background"
              >
                <FileText className="h-5 w-5 text-primary-foreground" />
              </motion.div>
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">Track Your Search</h1>
            <p className="text-lg text-muted-foreground mb-12 font-medium leading-relaxed">
              Sign in to manage your active accommodation requests and see your latest matches.
            </p>

            <div className="space-y-4">
              <Button className="w-full rounded-lg h-14 text-lg font-bold" asChild>
                <Link to="/signup">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button variant="outline" className="w-full h-14 text-lg font-bold" asChild>
                <Link to="/login">Already have an account? Sign In</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <PulseBackground />
        <PageLoader message="Loading..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <PulseBackground />
      <div className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4.5rem)] pb-24">
        <div className="container py-8 md:py-16 max-w-5xl mx-auto px-4 relative z-10">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-foreground mb-1">My Requests</h1>
                <p className="text-muted-foreground text-sm">
                  Track status, review matches, and manage your accommodation requests.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-5 grid grid-cols-2 gap-3"
            >
              <div className="col-span-2">
                <StatCard label="Total Requests" value={totalRequests} icon={FileText} color="text-primary" />
              </div>
              <StatCard label="Active Searches" value={stats.active} icon={Zap} color="text-amber-500" />
              <StatCard label="With Matches" value={stats.itemsWithMatches} icon={CheckCircle2} color="text-emerald-500" />
            </motion.div>
          </div>

          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8"
          >
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <Input
                placeholder="Search by location, room type, or request ID..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-12 h-12 bg-background border border-border hover:border-primary/50 focus:border-primary transition-all text-sm rounded-lg w-full"
              />
            </div>

            <Button asChild size="lg" className="rounded-lg h-12 px-6 font-bold shrink-0">
              <Link to="/search">
                <Plus className="mr-2 h-5 w-5" />
                New Request
              </Link>
            </Button>
          </motion.div>

          {/* List Section */}
          <div className="space-y-6">
            {requests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-muted/20 border border-border rounded-lg"
              >
                <div className="w-24 h-24 rounded-lg bg-background flex items-center justify-center mx-auto mb-8 border border-border">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">No requests found</h2>
                <p className="text-muted-foreground mb-8 text-base max-w-sm mx-auto">
                  {localSearch ? "Try a different search term to find what you're looking for." : "You haven\'t made any requests yet. Start your journey today!"}
                </p>
                {!localSearch && (
                  <Button asChild size="lg" className="rounded-lg px-8 h-12 font-bold">
                    <Link to="/search">
                      <Zap className="mr-3 h-6 w-6 fill-primary-foreground" />
                      Start a Search
                    </Link>
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                  {requests.map((request, index) => {
                    const status = statusConfig[request.status as RequestStatus] || {
                      label: request.status || "Unknown", color: "text-muted-foreground", bgColor: "bg-muted", borderColor: "border-border", icon: AlertCircle, glowColor: "border-border/50"
                    };
                    const isCheckoutPath = ["pending-payment", "waiting-payment-confirmation", "payment-failed"].includes(request.status);

                    return (
                      <motion.div
                        key={request.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        transition={{
                          type: "spring", stiffness: 300, damping: 25,
                          delay: Math.min(index * 0.05, 0.3)
                        }}
                      >
          <Link
                          to={isCheckoutPath ? `/checkout/${request.id}` : `/request/${request.id}`}
                          className="group block bg-card border border-border hover:border-border/80 hover:bg-muted/20 rounded-lg p-5 transition-colors cursor-pointer"
                        >

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            {/* Left Block: Icon & Core Details */}
                            <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                                status.bgColor,
                                status.borderColor
                              )}>
                                <status.icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors leading-none mb-2">
                                  {(() => {
                                    const roomTypes = request.roomType || [];
                                    const locations = request.location || [];
                                    const roomLabel = roomTypes.length > 1
                                      ? `${roomTypes[0].replace(/-/g, " ")} +${roomTypes.length - 1}`
                                      : (roomTypes[0]?.replace(/-/g, " ") ?? "Accommodation");
                                    const locLabel = locations.length > 1
                                      ? `${locations[0]} +${locations.length - 1}`
                                      : (locations[0] ?? "Anywhere");
                                    return <>{roomLabel} <span className="text-muted-foreground font-normal text-sm">in</span> {locLabel}</>;
                                  })()}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                     <Calendar className="h-3 w-3" />
                                     {new Date(request.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                  <span className="text-muted-foreground/40">·</span>
                                  <div className="text-xs text-muted-foreground/60">
                                     #{request.id.substring(0,8)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Block: Status & Action */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:pl-6 sm:border-l border-border/50">
                              <div className={cn(
                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm",
                                status.bgColor,
                                status.borderColor
                              )}>
                                <div className={cn("w-1.5 h-1.5 rounded-full", status.color.replace("text-", "bg-"))} />
                                <span className={cn("text-xs font-medium", status.color)}>
                                  {status.label}
                                </span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Infinite Scroll Loader Target */}
            {hasNextPage && requests.length > 0 && (
              <div ref={observerTarget} className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading more...</span>
                </div>
              </div>
            )}

            {!hasNextPage && requests.length > 0 && (
               <div className="flex items-center justify-center py-8">
                 <p className="text-xs text-muted-foreground/50">All caught up</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
