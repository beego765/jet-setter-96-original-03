import { ArrowUpRight, Search, Users, Map, TrendingUp } from "lucide-react";
import { StatCard } from "./stats/StatCard";
import { useConversionStats } from "./stats/useConversionStats";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StatsGridProps {
  stats: {
    totalSearches: number;
    searchesChange: string;
    uniqueUsers: number;
    usersChange: string;
    topSearchedRoute: string;
  };
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const { conversionStats, refetch } = useConversionStats();

  useEffect(() => {
    const bookingsChannel = supabase
      .channel('bookings-stats')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings' 
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      bookingsChannel.unsubscribe();
    };
  }, [refetch]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Search}
        iconBgColor="bg-blue-500/20"
        iconColor="text-blue-400"
        label="Daily Searches"
        value={stats.totalSearches}
        change={stats.searchesChange}
      />

      <StatCard
        icon={Users}
        iconBgColor="bg-purple-500/20"
        iconColor="text-purple-400"
        label="Unique Users"
        value={stats.uniqueUsers}
        change={stats.usersChange}
      />

      <StatCard
        icon={TrendingUp}
        iconBgColor="bg-green-500/20"
        iconColor="text-green-400"
        label="Conversion Rate"
        value={conversionStats?.conversionRate || "0%"}
        change={conversionStats?.conversionChange || "+0%"}
      />

      <StatCard
        icon={Map}
        iconBgColor="bg-orange-500/20"
        iconColor="text-orange-400"
        label="Popular Route"
        value={stats.topSearchedRoute}
        additionalLabel="Most Searched"
      />
    </div>
  );
};