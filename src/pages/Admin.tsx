import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemTab } from "@/components/admin/SystemTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import { BookingsTab } from "@/components/admin/BookingsTab";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const { toast } = useToast();
  const [realtimeStats, setRealtimeStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    bookingsChange: "+0%",
    revenueChange: "+0%",
    userChange: "+0%",
    topDestination: "Loading..."
  });

  // Fetch initial stats
  const { data: initialStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [bookingsResult, paymentsResult, usersResult] = await Promise.all([
        supabase.from('bookings').select('*'),
        supabase.from('booking_payments').select('amount'),
        supabase.from('profiles').select('*').eq('status', 'active')
      ]);

      if (bookingsResult.error) throw bookingsResult.error;
      if (paymentsResult.error) throw paymentsResult.error;
      if (usersResult.error) throw usersResult.error;

      // Calculate top destination
      const destinations = bookingsResult.data.reduce((acc, booking) => {
        acc[booking.destination] = (acc[booking.destination] || 0) + 1;
        return acc;
      }, {});
      const topDestination = Object.entries(destinations)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

      const totalRevenue = paymentsResult.data.reduce((sum, payment) => sum + (payment.amount || 0), 0);

      return {
        totalBookings: bookingsResult.data.length,
        totalRevenue,
        activeUsers: usersResult.data.length,
        topDestination,
        bookingsChange: "+15%", // You might want to calculate this based on historical data
        revenueChange: "+8.3%",
        userChange: "+5.2%"
      };
    }
  });

  useEffect(() => {
    if (initialStats) {
      setRealtimeStats(initialStats);
    }
  }, [initialStats]);

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to bookings changes
    const bookingsSubscription = supabase
      .channel('bookings-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        async (payload) => {
          // Fetch updated stats after any booking change
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select('*');
          
          if (bookingsError) {
            toast({
              title: "Error updating bookings data",
              variant: "destructive"
            });
            return;
          }

          setRealtimeStats(prev => ({
            ...prev,
            totalBookings: bookingsData.length
          }));
        }
      )
      .subscribe();

    // Subscribe to payment changes
    const paymentsSubscription = supabase
      .channel('payments-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'booking_payments' },
        async (payload) => {
          const { data: paymentsData, error: paymentsError } = await supabase
            .from('booking_payments')
            .select('amount');
          
          if (paymentsError) {
            toast({
              title: "Error updating revenue data",
              variant: "destructive"
            });
            return;
          }

          const totalRevenue = paymentsData.reduce((sum, payment) => sum + (payment.amount || 0), 0);
          setRealtimeStats(prev => ({
            ...prev,
            totalRevenue
          }));
        }
      )
      .subscribe();

    // Subscribe to profile changes
    const profilesSubscription = supabase
      .channel('profiles-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async (payload) => {
          const { data: usersData, error: usersError } = await supabase
            .from('profiles')
            .select('*')
            .eq('status', 'active');
          
          if (usersError) {
            toast({
              title: "Error updating users data",
              variant: "destructive"
            });
            return;
          }

          setRealtimeStats(prev => ({
            ...prev,
            activeUsers: usersData.length
          }));
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      bookingsSubscription.unsubscribe();
      paymentsSubscription.unsubscribe();
      profilesSubscription.unsubscribe();
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
        <AdminHeader />
        <StatsGrid stats={realtimeStats} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-gray-700 w-full justify-start overflow-x-auto">
            <TabsTrigger 
              value="overview" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              System
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardCharts />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <ActivityLog />
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsTab />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="system">
            <SystemTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;