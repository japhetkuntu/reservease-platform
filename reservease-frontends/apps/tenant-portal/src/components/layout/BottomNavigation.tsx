import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, FileText, User, Lock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/", label: "Home", icon: Home, requiresAuth: false },
  { href: "/search", label: "Search", icon: Search, requiresAuth: false },
  { href: "/dashboard", label: "Requests", icon: FileText, requiresAuth: true },
  { href: "/profile", label: "Profile", icon: User, requiresAuth: true },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();

  const handleNavClick = (e: React.MouseEvent, item: (typeof navItems)[0]) => {
    if (item.requiresAuth && !isLoggedIn) {
      e.preventDefault();
      toast({
        title: "Sign in required",
        description: "Please sign in to access this feature",
      });
      navigate("/login?returnUrl=" + item.href);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 border-t border-border safe-area-bottom">
      <div className="flex items-stretch h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href === "/dashboard" && location.pathname.includes("/request/")) ||
            (item.href === "/dashboard" && location.pathname.includes("/checkout/")) ||
            (item.href === "/search" && location.pathname === "/search");

          const isLocked = item.requiresAuth && !isLoggedIn;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 rounded-lg transition-all duration-200 relative group",
                isActive
                  ? "text-primary"
                  : isLocked
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Background highlight for active */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavBg"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-1">
                <item.icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    "transition-all duration-200",
                    isActive && "scale-110"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-500 transition-all duration-200",
                    isActive && "font-600 text-[11px]"
                  )}
                >
                  {item.label}
                </span>
              </div>

              {/* Lock icon for auth-required items */}
              {isLocked && (
                <Lock className="absolute top-1 right-0.5 h-3 w-3 text-muted-foreground/50" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
