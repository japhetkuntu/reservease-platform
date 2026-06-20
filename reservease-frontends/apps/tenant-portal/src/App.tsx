import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequestProvider } from "@/contexts/RequestContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Search from "./pages/Search";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import RequestDetail from "./pages/RequestDetail";
import HowItWorks from "./pages/HowItWorks";
import Support from "./pages/Support";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import Notifications from "./pages/Notifications";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Install from "./pages/Install";
import EditProfile from "./pages/EditProfile";
import Security from "./pages/Security";
import ForgotPassword from "./pages/ForgotPassword";
import Explore from "./pages/Explore";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RequestProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/search" element={<Search />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/request" element={<Search />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/request/:id" element={<RequestDetail />} />
              <Route path="/requests/:id" element={<RequestDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/support" element={<Support />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/install" element={<Install />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/security" element={<Security />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/explore" element={<Explore />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RequestProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
