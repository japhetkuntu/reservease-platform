import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { to: "/add-property", label: "Add Listing",  icon: PlusCircle      },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile",      label: "Profile",      icon: User            },
];

export function BottomNav() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  if (isAuthPage) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t safe-area-bottom shadow-lg animate-in slide-in-from-bottom duration-500">
      <div className="flex items-stretch h-16">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.to === "/dashboard"
            ? location.pathname === "/dashboard"
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
