import { Users, Building2, MessageSquare, TrendingUp, ArrowUpRight, ArrowDownRight, Bell, Zap, ShieldCheck, History } from "lucide-react";
import { MOCK_USERS } from "@/data/users";
import { MOCK_PROPERTIES } from "@/data/properties";
import { MOCK_REQUESTS } from "@/data/requests";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PulseBackground } from "@/components/layout/PulseBackground";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { dashboardApi, DashboardStats, SystemLog } from "@/api/dashboard";

export function DashboardPage() {
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, systemLogs] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getSystemLogs()
        ]);
        setStatsData(stats);
        setLogs(systemLogs);
      } catch (error) {
        console.error("Neural telemetry failure:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center font-black uppercase tracking-[0.5em] animate-pulse">
        Accessing Command Stream...
      </div>
    );
  }

  const stats = [
    { label: "Total Users", value: statsData?.totalUsers || 0, icon: Users, change: "+12%", trend: "up", color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Active Listings", value: statsData?.activeListings || 0, icon: Building2, change: "+5%", trend: "up", color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { label: "Pending Requests", value: statsData?.pendingRequests || 0, icon: MessageSquare, change: "-2%", trend: "down", color: "text-amber-600", bg: "bg-amber-500/10" },
    { label: "Monthly Revenue", value: `₵${(statsData?.monthlyRevenue || 0).toLocaleString()}`, icon: TrendingUp, change: "+18%", trend: "up", color: "text-emerald-600", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 pointer-events-none z-0 bg-background" />
      
      <div className="relative z-10 space-y-8 pb-20">
        <div 
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-none">
              Platform Overview
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-3">
              Real-time system status and administrative metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-lg h-12 px-6 border-border bg-card font-semibold uppercase tracking-wide text-xs transition-all">
                <Bell className="mr-2 h-4 w-4" /> System Alerts
             </Button>
             <Button className="rounded-lg h-12 px-6 font-semibold uppercase tracking-wide text-xs transition-all">
                <Zap className="mr-2 h-4 w-4" /> Analytics
             </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div 
              key={stat.label}
              className="p-6 border border-border/50 rounded-lg bg-card hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className="h-6 w-6 text-foreground" />
                </div>
                <div className={`flex items-center text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                  {stat.change}
                  {stat.trend === 'up' ? <ArrowUpRight className="ml-1 h-3 w-3" /> : <ArrowDownRight className="ml-1 h-3 w-3" />}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold tracking-tight text-foreground leading-none">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          <div 
            className="md:col-span-8 p-6 border border-border/50 rounded-lg bg-card"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-3">
                 <History className="h-5 w-5 text-muted-foreground" /> Activity Log
              </h3>
              <Button variant="ghost" className="rounded-lg font-semibold uppercase tracking-wide text-xs text-primary">View All</Button>
            </div>
            <div className="space-y-6">
              {logs.map((log) => (
                <ActivityItem
                  key={log.id}
                  user={log.user}
                  action={log.action}
                  time={log.timestamp}
                  initials={log.initials}
                  color={log.category === 'property' ? 'bg-amber-500/10 text-amber-700' : log.category === 'engine' ? 'bg-emerald-500/10 text-emerald-700' : undefined}
                />
              ))}
            </div>
          </div>

          <div 
            className="md:col-span-4 p-6 border border-border/50 rounded-lg bg-card"
          >
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" /> Pending
              </h3>
              <Badge variant="secondary" className="rounded-full px-3 py-1 font-semibold uppercase text-xs tracking-wide bg-primary/10 text-primary border-0">
                {MOCK_PROPERTIES.filter(p => p.listingStatus === 'Pending').length}
              </Badge>
            </div>
            
            <div className="space-y-3 relative z-10">
              {MOCK_PROPERTIES.filter(p => p.listingStatus === 'Pending').map(prop => (
                 <div 
                    key={prop.id} 
                    className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold truncate max-w-[120px]">{prop.title}</p>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">By {prop.ownerName}</p>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-lg font-semibold text-primary hover:bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Link to={`/properties/${prop.id}`}>
                        <ArrowUpRight className="h-5 w-5" />
                      </Link>
                    </Button>
                 </div>
              ))}
              {MOCK_PROPERTIES.filter(p => p.listingStatus === 'Pending').length === 0 && (
                <div className="text-center py-12 space-y-4">
                  <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-600 rounded-lg">
                     <ShieldCheck className="h-6 w-6" />
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">All clear.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ user, action, time, initials, color = "bg-primary/10 text-primary" }: any) {
  return (
    <div className="flex items-start gap-6">
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center font-semibold text-xs flex-shrink-0 ${color}`}>
        {initials}
      </div>
      <div className="space-y-1 py-1 min-w-0">
        <p className="text-sm leading-relaxed font-medium">
          <span className="font-semibold text-foreground">{user}</span> <span className="text-muted-foreground">{action}</span>
        </p>
        <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide">{time}</p>
      </div>
    </div>
  );
}
