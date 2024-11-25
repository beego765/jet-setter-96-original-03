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
  ArrowUpRight,
  ArrowDownRight,
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
    bookingsChange: "+15%",
    revenueChange: "+8.3%",
    userChange: "+5.2%",
  });

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data export will be ready shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              OpusTravels Admin
            </h1>
            <p className="text-gray-400 mt-2">Manage your business operations</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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

        {/* Stats Grid */}
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-gray-700 w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-700 hover:bg-gray-700"
                  >
                    View Reports
                  </Button>
                </div>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "New Booking #1234", time: "2 hours ago", icon: Plane },
                    { title: "Revenue Report Generated", time: "4 hours ago", icon: BarChart },
                    { title: "New User Registration", time: "5 hours ago", icon: Users },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className="p-2 bg-gray-700 rounded-full">
                        <activity.icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold">Recent Bookings</h2>
                <div className="flex items-center gap-3">
                  <Input 
                    placeholder="Search bookings..." 
                    className="bg-gray-700/50 border-gray-600 text-white w-full md:w-auto"
                  />
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-700">
                    Filter
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((booking) => (
                  <div key={booking} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="font-medium">Booking #{booking}234</p>
                      <p className="text-sm text-gray-400">London → Paris</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        Confirmed
                      </span>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Other tab contents would follow the same pattern */}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
