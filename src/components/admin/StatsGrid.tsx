import { Card } from "@/components/ui/card";
import { ArrowUpRight, Plane, PoundSterling, Users, Map } from "lucide-react";

interface StatsGridProps {
  stats: {
    totalBookings: number;
    totalRevenue: number;
    activeUsers: number;
    bookingsChange: string;
    revenueChange: string;
    userChange: string;
    topDestination: string;
  };
}

export const StatsGrid = ({ stats }: StatsGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-purple-500/20 rounded-xl">
          <Plane className="w-6 h-6 text-purple-400" />
        </div>
        <span className="flex items-center text-green-400 text-sm">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {stats.bookingsChange}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Total Bookings</p>
        <p className="text-2xl font-bold">{stats.totalBookings}</p>
      </div>
    </Card>

    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-green-500/20 rounded-xl">
          <PoundSterling className="w-6 h-6 text-green-400" />
        </div>
        <span className="flex items-center text-green-400 text-sm">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {stats.revenueChange}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Total Revenue</p>
        <p className="text-2xl font-bold">£{stats.totalRevenue.toLocaleString()}</p>
      </div>
    </Card>

    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-blue-500/20 rounded-xl">
          <Users className="w-6 h-6 text-blue-400" />
        </div>
        <span className="flex items-center text-green-400 text-sm">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {stats.userChange}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Active Users</p>
        <p className="text-2xl font-bold">{stats.activeUsers}</p>
      </div>
    </Card>

    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-orange-500/20 rounded-xl">
          <Map className="w-6 h-6 text-orange-400" />
        </div>
        <span className="text-sm text-gray-400">Most Popular</span>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Top Destination</p>
        <p className="text-2xl font-bold">{stats.topDestination}</p>
      </div>
    </Card>
  </div>
);