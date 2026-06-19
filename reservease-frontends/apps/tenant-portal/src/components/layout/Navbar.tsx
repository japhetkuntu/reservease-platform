import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  HelpCircle,
  Headphones,
  User,
  CreditCard,
  LayoutDashboard,
  Bell,
  LogOut,
  FileText,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications";

const publicNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/how-it-works", label: "How it Works", icon: HelpCircle },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/support", label: "Support", icon: Headphones },
];

const loggedInNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "My Requests", icon: FileText },
  { href: "/how-it-works", label: "How it Works", icon: HelpCircle },
  { href: "/support", label: "Support", icon: Headphones },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const { data: unreadData } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: notificationsApi.getUnreadCount,
    enabled: isLoggedIn,
  });

  const unreadCount = unreadData?.count || 0;
  const navLinks = isLoggedIn ? loggedInNavLinks : publicNavLinks;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 border-b border-border">
      <div className="container-px max-w-7xl mx-auto flex h-14 md:h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 transition-shadow">
            <span className="text-sm font-bold text-primary-foreground">R</span>
          </div>
          <span className="text-base md:text-lg font-600 text-foreground hidden sm:inline">
            ReservEase
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-3 py-2 text-sm font-500 rounded-md transition-all duration-200",
                location.pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth / User Menu */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors duration-200 group"
              >
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center relative group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                  <User className="h-4 w-4 text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  showUserMenu && "rotate-180"
                )} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-1 w-52 rounded-xl bg-card border border-border overflow-hidden"
                  >
                    <div className="px-3 py-2.5 border-b border-border/50">
                      <p className="text-xs font-600 text-foreground">
                        {user?.name || "My Account"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {user?.email || ""}
                      </p>
                    </div>
                    <div className="p-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors duration-150"
                      >
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors duration-150"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Profile Settings
                      </Link>
                      <Link
                        to="/notifications"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors duration-150"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          Notifications
                        </div>
                        {unreadCount > 0 && (
                          <span className="bg-destructive/20 text-destructive text-[10px] font-600 px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    </div>
                    <div className="p-1 border-t border-border/50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150 w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="h-8">
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="h-8">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {isLoggedIn && unreadCount > 0 && (
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <nav className="container-px max-w-7xl mx-auto py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 transition-colors duration-150",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}

              {isLoggedIn && (
                <>
                  <div className="h-px bg-border my-2" />
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <User size={18} />
                    My Profile
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-500 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <Bell size={18} />
                      Notifications
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-destructive/20 text-destructive text-[10px] font-600 px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 text-destructive hover:bg-destructive/10 transition-colors duration-150 w-full"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              )}

              {!isLoggedIn && (
                <>
                  <div className="h-px bg-border my-2" />
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <User size={18} />
                    Login
                  </Link>
                  <Button className="mt-1 w-full" size="sm" asChild>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      Get Started Free
                    </Link>
                  </Button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
