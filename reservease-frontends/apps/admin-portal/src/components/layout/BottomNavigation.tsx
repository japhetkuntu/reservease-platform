import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  MessageSquare,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: Users },
  { to: "/properties", label: "Properties", icon: Building2 },
  { to: "/requests", label: "Requests", icon: MessageSquare },
  { to: "/payments", label: "Wallet", icon: CreditCard },
];

export function BottomNavigation() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/reset-password";

  if (isAuthPage) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t safe-area-bottom">
      <div className="flex items-stretch h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(tab.to);

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-medium transition-all",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all",
                active ? "bg-primary/10" : ""
              )}>
                <Icon className={cn("h-5 w-5 transition-all", active ? "scale-110" : "")} />
              </div>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
