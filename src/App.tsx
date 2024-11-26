import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Deals from "./pages/Deals";
import MyBookings from "./pages/MyBookings";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import { Navbar } from "./components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./components/ui/use-toast";
import { useAdminCheck } from "./hooks/useAdminCheck";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin, isLoading: isAdminLoading } = useAdminCheck(session?.user?.id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading || isAdminLoading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/auth" />;
  }

  if (adminOnly && !isAdmin) {
    // Only show toast when actually trying to access admin route
    toast({
      title: "Access Denied",
      description: "You need admin privileges to access this page",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="/support" element={<Support />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;