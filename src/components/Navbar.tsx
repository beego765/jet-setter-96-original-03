import { Link } from "react-router-dom";
import { Plane } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { NavLinks } from "./navbar/NavLinks";
import { AuthButtons } from "./navbar/AuthButtons";
import { MobileMenu } from "./navbar/MobileMenu";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAdminCheck(session?.user?.id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSignIn = () => {
    navigate('/auth');
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
        duration: 2000,
      });
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
          >
            <Plane className="w-7 h-7 text-primary animate-pulse" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-primary to-blue-500 bg-clip-text text-transparent relative">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-primary/20 to-blue-500/20 blur-sm animate-glow-trace" />
              OpusTravels
            </span>
          </Link>

          <NavLinks
            session={session}
            isAdmin={isAdmin}
            className="hidden md:flex items-center gap-6"
          />

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthButtons
              session={session}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
              className="hidden md:flex gap-2"
            />

            <MobileMenu
              session={session}
              isAdmin={isAdmin}
              isOpen={isOpen}
              onOpenChange={setIsOpen}
              onNavigate={handleNavigation}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};