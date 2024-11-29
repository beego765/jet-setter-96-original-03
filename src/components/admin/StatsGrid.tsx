import { Card } from "@/components/ui/card";
import { ArrowUpRight, Search, Users, Map, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, subMonths, format } from "date-fns";

interface StatsGridProps {
  stats: {
    totalSearches: number;
    searchesChange: string;
    uniqueUsers: number;
    usersChange: string;
    conversionRate: string;
    conversionChange: string;
    topSearchedRoute: string;
  };
}

const useStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const startDate = subMonths(startOfMonth(new Date()), 1);
      const prevStartDate = subMonths(startDate, 1);

      // Get confirmed bookings for current and previous month
      const { data: currentBookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('status', 'confirmed')
        .gte('created_at', startDate.toISOString());

      const { data: prevBookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('status', 'confirmed')
        .gte('created_at', prevStartDate.toISOString())
        .lt('created_at', startDate.toISOString());

      // Get total searches for current and previous month
      const { data: currentSearches } = await supabase
        .from('system_metrics')
        .select('value')
        .eq('metric_type', 'server')
        .gte('created_at', startDate.toISOString());

      const { data: prevSearches } = await supabase
        .from('system_metrics')
        .select('value')
        .eq('metric_type', 'server')
        .gte('created_at', prevStartDate.toISOString())
        .lt('created_at', startDate.toISOString());

      // Calculate totals
      const currentBookingsCount = currentBookings?.length || 0;
      const prevBookingsCount = prevBookings?.length || 0;
      const currentSearchesCount = currentSearches?.reduce((sum, metric) => sum + metric.value, 0) || 0;
      const prevSearchesCount = prevSearches?.reduce((sum, metric) => sum + metric.value, 0) || 0;

      // Calculate conversion rates
      const currentConversionRate = currentSearchesCount > 0 
        ? (currentBookingsCount / currentSearchesCount) * 100 
        : 0;
      const prevConversionRate = prevSearchesCount > 0 
        ? (prevBookingsCount / prevSearchesCount) * 100 
        : 0;

      // Calculate changes
      const conversionChange = prevConversionRate > 0 
        ? ((currentConversionRate - prevConversionRate) / prevConversionRate) * 100 
        : 0;

      return {
        conversionRate: `${currentConversionRate.toFixed(1)}%`,
        conversionChange: `${conversionChange >= 0 ? '+' : ''}${conversionChange.toFixed(1)}%`,
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const { data: conversionStats } = useStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 hover:bg-gray-800/70 transition-all">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Search className="w-6 h-6 text-blue-400" />
          </div>
          <span className="flex items-center text-green-400 text-sm">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            {stats.searchesChange}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-gray-400">Daily Searches</p>
          <p className="text-2xl font-bold">{stats.totalSearches}</p>
        </div>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 hover:bg-gray-800/70 transition-all">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <span className="flex items-center text-green-400 text-sm">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            {stats.usersChange}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-gray-400">Unique Users</p>
          <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
        </div>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 hover:bg-gray-800/70 transition-all">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <span className="flex items-center text-green-400 text-sm">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            {conversionStats?.conversionChange || stats.conversionChange}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-gray-400">Conversion Rate</p>
          <p className="text-2xl font-bold">{conversionStats?.conversionRate || stats.conversionRate}</p>
        </div>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 hover:bg-gray-800/70 transition-all">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-orange-500/20 rounded-xl">
            <Map className="w-6 h-6 text-orange-400" />
          </div>
          <span className="text-sm text-gray-400">Most Searched</span>
        </div>
        <div className="mt-4">
          <p className="text-gray-400">Popular Route</p>
          <p className="text-2xl font-bold">{stats.topSearchedRoute}</p>
        </div>
      </Card>
    </div>
  );
};