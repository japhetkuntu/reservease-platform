import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BottomNavigation } from "./BottomNavigation";
import { VerificationBanner } from "@/components/VerificationBanner";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

// Pages where bottom nav should appear
const bottomNavPages = ["/", "/dashboard", "/favorites", "/profile", "/request/", "/checkout/", "/search"];

export function Layout({ children, showFooter = true }: LayoutProps) {
  const location = useLocation();

  // Check if current page should show bottom nav
  const showBottomNav = bottomNavPages.some(path =>
    path === location.pathname ||
    (path.endsWith("/") && location.pathname.startsWith(path))
  );

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full relative">
      <Navbar />
      <VerificationBanner />
      <main className={`flex-1 ${showBottomNav ? 'pb-[90px] md:pb-0' : ''}`}>{children}</main>
      {showFooter && <Footer className="hidden md:block" />}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
