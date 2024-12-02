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
    <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
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