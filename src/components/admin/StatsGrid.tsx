import { Card } from "@/components/ui/card";
import { ArrowUpRight, Search, Users, Map, TrendingUp } from "lucide-react";

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

export const StatsGrid = ({ stats }: StatsGridProps) => (
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
          {stats.conversionChange}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Conversion Rate</p>
        <p className="text-2xl font-bold">{stats.conversionRate}</p>
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