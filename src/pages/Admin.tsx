import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { ActivityLog } from "@/components/admin/ActivityLog";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
        <AdminHeader />
        <StatsGrid stats={stats} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-gray-700 w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="text-gray-200 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="bookings" className="text-gray-200 data-[state=active]:text-white">Bookings</TabsTrigger>
            <TabsTrigger value="customers" className="text-gray-200 data-[state=active]:text-white">Customers</TabsTrigger>
            <TabsTrigger value="flights" className="text-gray-200 data-[state=active]:text-white">Flights</TabsTrigger>
            <TabsTrigger value="reports" className="text-gray-200 data-[state=active]:text-white">Reports</TabsTrigger>
            <TabsTrigger value="settings" className="text-gray-200 data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    onClick={handleExportData}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    Export Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white"
                  >
                    Manage Flights
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white"
                  >
                    User Management
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white"
                  >
                    View Reports
                  </Button>
                </div>
              </Card>
              <ActivityLog />
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Recent Bookings</h2>
                <div className="flex items-center gap-3">
                  <Input 
                    placeholder="Search bookings..." 
                    className="bg-gray-700/50 border-gray-600 text-gray-200 placeholder:text-gray-400 w-full md:w-auto"
                  />
                  <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white">
                    Filter
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((booking) => (
                  <div key={booking} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-100">Booking #{booking}234</p>
                      <p className="text-sm text-gray-300">London → Paris</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                        Confirmed
                      </span>
                      <Button variant="ghost" size="sm" className="text-gray-200 hover:text-white hover:bg-gray-700">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;