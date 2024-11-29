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
    totalSearches: 0,
    searchesChange: "+0%",
    uniqueUsers: 0,
    usersChange: "+0%",
    conversionRate: "0%",
    conversionChange: "+0%",
    topSearchedRoute: "Loading..."
  });

  // Fetch initial stats
  const { data: initialStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [searchesResult, uniqueUsersResult] = await Promise.all([
        supabase.from('bookings').select('origin, destination').gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString()),
        supabase.from('profiles').select('*').eq('status', 'active')
      ]);

      if (searchesResult.error) throw searchesResult.error;
      if (uniqueUsersResult.error) throw uniqueUsersResult.error;

      // Calculate top searched route
      const routes = searchesResult.data.reduce<Record<string, number>>((acc, search) => {
        const route = `${search.origin}-${search.destination}`;
        acc[route] = (acc[route] || 0) + 1;
        return acc;
      }, {});
      
      const topSearchedRoute = Object.entries(routes)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

      const totalSearches = searchesResult.data.length;
      const uniqueUsers = uniqueUsersResult.data.length;
      const conversionRate = totalSearches > 0 
        ? ((searchesResult.data.length / totalSearches) * 100).toFixed(1) + '%'
        : '0%';

      return {
        totalSearches,
        searchesChange: "+15%", // You might want to calculate this based on historical data
        uniqueUsers,
        usersChange: "+5.2%",
        conversionRate,
        conversionChange: "+8.3%",
        topSearchedRoute
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
    // Subscribe to search changes
    const searchesSubscription = supabase
      .channel('searches-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        async () => {
          const { data: searchesData, error: searchesError } = await supabase
            .from('bookings')
            .select('*')
            .gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString());
          
          if (searchesError) {
            toast({
              title: "Error updating searches data",
              variant: "destructive"
            });
            return;
          }

          setRealtimeStats(prev => ({
            ...prev,
            totalSearches: searchesData.length
          }));
        }
      )
      .subscribe();

    // Subscribe to profile changes
    const profilesSubscription = supabase
      .channel('profiles-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async () => {
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
            uniqueUsers: usersData.length
          }));
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      searchesSubscription.unsubscribe();
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