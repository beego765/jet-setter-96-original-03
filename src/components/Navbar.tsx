import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plane, Tag, BookOpen, HelpCircle, User, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

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
            {session?.user?.email === 'admin@opustravels.com' && (
              <Link to="/admin" className="text-gray-300 hover:text-white flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/auth" className="hidden md:block">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <User className="w-4 h-4 mr-2" />
                {session ? 'Account' : 'Sign In'}
              </Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-gray-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-gray-900/95 border-gray-700">
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/deals" className="text-gray-300 hover:text-white flex items-center gap-2 p-2">
                    <Tag className="w-4 h-4" />
                    Deals
                  </Link>
                  {session && (
                    <Link to="/my-bookings" className="text-gray-300 hover:text-white flex items-center gap-2 p-2">
                      <BookOpen className="w-4 h-4" />
                      My Bookings
                    </Link>
                  )}
                  <Link to="/support" className="text-gray-300 hover:text-white flex items-center gap-2 p-2">
                    <HelpCircle className="w-4 h-4" />
                    Support
                  </Link>
                  {session?.user?.email === 'admin@opustravels.com' && (
                    <Link to="/admin" className="text-gray-300 hover:text-white flex items-center gap-2 p-2">
                      <Settings className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  <Link to="/auth" className="text-gray-300 hover:text-white flex items-center gap-2 p-2">
                    <User className="w-4 h-4" />
                    {session ? 'Account' : 'Sign In'}
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};