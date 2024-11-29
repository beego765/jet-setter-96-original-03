import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

export const useAdminStats = () => {
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
        searchesChange: "+15%",
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

    return () => {
      searchesSubscription.unsubscribe();
      profilesSubscription.unsubscribe();
    };
  }, [toast]);

  return { realtimeStats };
};