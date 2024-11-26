import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plane, Tag, BookOpen, HelpCircle, User, Settings, Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        checkAdminRole(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (data && data.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
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

          <div className="hidden md:flex items-center gap-6">
            <Link to="/deals" className="text-gray-300 hover:text-white flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Deals
            </Link>
            {session && (
              <Link to="/my-bookings" className="text-gray-300 hover:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                My Bookings
              </Link>
            )}
            <Link to="/support" className="text-gray-300 hover:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Support
            </Link>
            {isAdmin && (
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white flex items-center gap-2"
                onClick={() => handleNavigation('/admin')}
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="hidden md:flex gap-2">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                  onClick={() => handleNavigation('/auth')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="hidden md:flex text-gray-300 hover:text-white"
                onClick={() => handleNavigation('/auth')}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-gray-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-gray-900/95 border-gray-700">
                <div className="flex flex-col gap-4 mt-8">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white flex items-center gap-2 justify-start"
                    onClick={() => handleNavigation('/deals')}
                  >
                    <Tag className="w-4 h-4" />
                    Deals
                  </Button>
                  {session && (
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-white flex items-center gap-2 justify-start"
                      onClick={() => handleNavigation('/my-bookings')}
                    >
                      <BookOpen className="w-4 h-4" />
                      My Bookings
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white flex items-center gap-2 justify-start"
                    onClick={() => handleNavigation('/support')}
                  >
                    <HelpCircle className="w-4 h-4" />
                    Support
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-white flex items-center gap-2 justify-start"
                      onClick={() => handleNavigation('/admin')}
                    >
                      <Settings className="w-4 h-4" />
                      Admin
                    </Button>
                  )}
                  {session ? (
                    <>
                      <Button
                        variant="ghost"
                        className="text-gray-300 hover:text-white flex items-center gap-2 justify-start"
                        onClick={() => handleNavigation('/auth')}
                      >
                        <User className="w-4 h-4" />
                        Account
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-gray-300 hover:text-white flex items-center gap-2 justify-start"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-white flex items-center gap-2 justify-start"
                      onClick={() => handleNavigation('/auth')}
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};