import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Calendar, MapPin } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { AuthButtons } from "./AuthButtons";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MobileMenuProps {
  session: any;
  isAdmin: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const MobileMenu = ({
  session,
  isAdmin,
  isOpen,
  onOpenChange,
  onNavigate,
  onSignIn,
  onSignOut,
}: MobileMenuProps) => {
  const { data: userStats } = useQuery({
    queryKey: ['userStats', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (bookingsError) throw bookingsError;
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      return {
        totalBookings: bookings?.length || 0,
        lastLogin: profile?.last_login ? new Date(profile.last_login).toLocaleDateString() : 'Never',
        name: profile?.first_name && profile?.last_name ? 
          `${profile.first_name} ${profile.last_name}` : 'Guest User',
      };
    },
    enabled: !!session?.user?.id
  });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6 text-gray-300" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-gray-900/95 border-gray-700">
        {session && userStats && (
          <div className="mb-8 pt-8 border-b border-gray-700 pb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Welcome back</p>
                <p className="font-medium text-gray-200">{userStats.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Last Login</span>
                </div>
                <p className="text-sm font-medium text-gray-200">{userStats.lastLogin}</p>
              </div>
              
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Bookings</span>
                </div>
                <p className="text-sm font-medium text-gray-200">{userStats.totalBookings}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          <NavLinks
            session={session}
            isAdmin={isAdmin}
            onNavigate={onNavigate}
            className="flex flex-col gap-4"
          />
          <AuthButtons
            session={session}
            onSignIn={onSignIn}
            onSignOut={onSignOut}
            className="flex flex-col gap-4"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};