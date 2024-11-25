import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart,
  Users,
  Plane,
  DollarSign,
  Settings,
  Calendar,
} from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const [stats] = useState({
    totalBookings: 1234,
    totalRevenue: 456789,
    activeUsers: 789,
    upcomingFlights: 56,
  });

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data export will be ready shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Plane className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400">Active Users</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400">Upcoming Flights</p>
                <p className="text-2xl font-bold">{stats.upcomingFlights}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Button 
                onClick={handleExportData}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Export Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-gray-700 hover:bg-gray-700"
              >
                System Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-gray-700 hover:bg-gray-700"
              >
                User Management
              </Button>
            </div>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                  <div className="p-2 bg-gray-700 rounded-full">
                    <Settings className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">System Update {i}</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;