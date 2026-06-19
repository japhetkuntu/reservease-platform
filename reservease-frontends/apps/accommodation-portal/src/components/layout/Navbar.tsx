import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LayoutDashboard, PlusCircle, User, LogOut, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/api/notifications";
import type { Notification } from "@/data/notifications";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const NAV_ITEMS = [
  { to: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { to: "/add-property", label: "Add Property", icon: PlusCircle      },
  { to: "/profile",      label: "My Profile",   icon: User            },
];

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function fetchNotifs() {
    try {
      const data = await getNotifications('owner');
      setNotifications(data);
    } catch (err) {
      console.error("Notif fetch failed", err);
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 30000); // 30s poll
      return () => clearInterval(interval);
    }
  }, [user]);

  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";
  const unreadCount = (notifications || []).filter(n => !n.read).length;

  async function markAllRead() {
    try {
      await markAllNotificationsRead('owner');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Link mark failed", err);
    }
  }

  async function markRead(id: string) {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Mark read failed", err);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full glass border-b shadow-xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-screen-2xl mx-auto">

        {/* ── Logo ─────────────────────────────────────── */}
        <div className="flex items-center gap-6">
          {/* Mobile hamburger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="p-5 border-b">
                <SheetTitle asChild>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-base leading-none">ReservEase</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Owner Portal</p>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              {/* User info in drawer */}
              <div className="flex items-center gap-3 p-5 border-b bg-muted/30">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm leading-none">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
                  {!user?.isVerified && <Badge variant="secondary" className="mt-1 text-[10px] py-0 px-1.5">Pending Preview</Badge>}
                </div>
              </div>
              {/* Nav links in drawer */}
              <nav className="flex flex-col p-3 gap-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              {/* Logout at bottom of drawer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); navigate("/login"); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-base leading-none tracking-tight">ReservEase</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Owner Portal</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.to === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.to);
              return (
                <Link key={item.to} to={item.to}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Right Side ─────────────────────────────────── */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Notification Bell — Sheet trigger */}
          <NotificationPanel
            notifications={notifications}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
          >
            <Link to="/notifications" className="relative p-2.5 rounded-2xl bg-muted/40 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background ring-4 ring-primary/5 group-hover:animate-ping" />
              )}
            </Link>
          </NotificationPanel>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end">
              <DropdownMenuLabel className="font-normal py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold leading-none">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
                    {!user?.isVerified && <Badge variant="secondary" className="mt-1.5 text-[10px] py-0 px-1.5">Pending Preview</Badge>}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/add-property" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />New Listing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                onClick={() => { logout(); navigate("/login"); }}
              >
                <LogOut className="mr-2 h-4 w-4" />Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
