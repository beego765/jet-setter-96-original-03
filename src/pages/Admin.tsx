import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemHealth } from "@/components/admin/SystemHealth";

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
            <TabsTrigger 
              value="overview" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              System
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardCharts />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <ActivityLog />
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
                    Generate Report
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Booking Management</h2>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <Input 
                    placeholder="Search bookings..." 
                    className="bg-gray-700/50 border-gray-600 text-gray-200 placeholder:text-gray-400"
                  />
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    New Booking
                  </Button>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <p className="text-gray-300">Booking management interface coming soon...</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="system">
            <SystemHealth />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-6">Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Site Name</label>
                    <Input defaultValue="OpusTravels Admin" className="bg-gray-700/50 border-gray-600 text-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Contact Email</label>
                    <Input defaultValue="admin@opustravels.com" className="bg-gray-700/50 border-gray-600 text-gray-200" />
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;