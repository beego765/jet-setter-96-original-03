import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemTab } from "@/components/admin/SystemTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import { BookingsTab } from "@/components/admin/BookingsTab";

const Admin = () => {
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
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsTab />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="system">
            <SystemTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;