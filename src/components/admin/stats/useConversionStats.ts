import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { subMonths, startOfMonth } from "date-fns";

export const useConversionStats = () => {
  const { toast } = useToast();
  const [realtimeStats, setRealtimeStats] = useState<{
    conversionRate: string;
    conversionChange: string;
  } | null>(null);

  const { data: queryStats, refetch } = useQuery({
    queryKey: ['admin-conversion-stats'],
    queryFn: async () => {
      try {
        const startDate = subMonths(startOfMonth(new Date()), 1);
        const prevStartDate = subMonths(startDate, 1);

        const [currentBookings, prevBookings, currentSearches, prevSearches] = await Promise.all([
          supabase
            .from('bookings')
            .select('id')
            .eq('status', 'confirmed')
            .gte('created_at', startDate.toISOString()),
          supabase
            .from('bookings')
            .select('id')
            .eq('status', 'confirmed')
            .gte('created_at', prevStartDate.toISOString())
            .lt('created_at', startDate.toISOString()),
          supabase
            .from('system_metrics')
            .select('value')
            .eq('metric_type', 'server')
            .gte('created_at', startDate.toISOString()),
          supabase
            .from('system_metrics')
            .select('value')
            .eq('metric_type', 'server')
            .gte('created_at', prevStartDate.toISOString())
            .lt('created_at', startDate.toISOString())
        ]);

        if (currentBookings.error || prevBookings.error || currentSearches.error || prevSearches.error) {
          throw new Error('Error fetching stats data');
        }

        const currentBookingsCount = currentBookings.data?.length || 0;
        const prevBookingsCount = prevBookings.data?.length || 0;
        const currentSearchesCount = currentSearches.data?.reduce((sum, metric) => sum + metric.value, 0) || 0;
        const prevSearchesCount = prevSearches.data?.reduce((sum, metric) => sum + metric.value, 0) || 0;

        const currentConversionRate = currentSearchesCount > 0 
          ? (currentBookingsCount / currentSearchesCount) * 100 
          : 0;
        const prevConversionRate = prevSearchesCount > 0 
          ? (prevBookingsCount / prevSearchesCount) * 100 
          : 0;

        const conversionChange = prevConversionRate > 0 
          ? ((currentConversionRate - prevConversionRate) / prevConversionRate) * 100 
          : 0;

        return {
          conversionRate: `${currentConversionRate.toFixed(1)}%`,
          conversionChange: `${conversionChange >= 0 ? '+' : ''}${conversionChange.toFixed(1)}%`,
        };
      } catch (error) {
        toast({
          title: "Error fetching stats",
          description: "Failed to fetch conversion stats",
          variant: "destructive",
        });
        return {
          conversionRate: "0%",
          conversionChange: "+0%",
        };
      }
    },
    staleTime: 30000,
    gcTime: 60000,
  });

  return {
    conversionStats: realtimeStats || queryStats,
    refetch,
  };
};