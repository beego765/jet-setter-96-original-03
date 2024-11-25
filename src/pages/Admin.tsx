import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart,
  Users,
  Plane,
  PoundSterling,
  Settings,
  Calendar,
  TrendingUp,
  Map,
  Bell,
  Shield,
} from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const [stats] = useState({
    totalBookings: 1234,
    totalRevenue: 456789,
    activeUsers: 789,
    upcomingFlights: 56,
    monthlyGrowth: "+12.5%",
    customerSatisfaction: "4.8/5",
    topDestination: "London",
    avgTicketPrice: "£350",
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            OpusTravels Admin
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-gray-700 hover:bg-gray-700">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" className="border-gray-700 hover:bg-gray-700">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Plane className="w-6 h-6 text-purple-400" />
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
                <PoundSterling className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold">£{stats.totalRevenue}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400">Monthly Growth</p>
                <p className="text-2xl font-bold">{stats.monthlyGrowth}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Map className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400">Top Destination</p>
                <p className="text-2xl font-bold">{stats.topDestination}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  <Button 
                    onClick={handleExportData}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Export Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-700 hover:bg-gray-700"
                  >
                    Manage Flights
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
                        <p className="text-sm font-medium">New Booking #{i}</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
              <div className="space-y-4">
                {/* Add booking list here */}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Management</h2>
              <div className="space-y-4">
                {/* Add customer management UI here */}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">System Settings</h2>
              <div className="space-y-4">
                {/* Add settings UI here */}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;