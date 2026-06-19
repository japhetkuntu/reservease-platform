import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {!isAuthPage && <Navbar />}

      {/* Add pb-16 on mobile to clear the bottom nav on all non-auth pages */}
      <main className={`flex-1 flex flex-col ${!isAuthPage ? "md:pb-0 pb-16" : ""}`}>
        {children}
      </main>

      {!isAuthPage && (
        <footer className="hidden md:flex border-t h-14 items-center justify-center bg-background text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} ReservEase Property Management · All rights reserved
        </footer>
      )}

      <BottomNav />
    </div>
  );
}
