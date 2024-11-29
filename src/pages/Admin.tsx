import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemTab } from "@/components/admin/SystemTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import { BookingsTab } from "@/components/admin/BookingsTab";
import { SupportMessagesTab } from "@/components/admin/SupportMessagesTab";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useSupportNotifications } from "@/hooks/useSupportNotifications";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { realtimeStats } = useAdminStats();
  const { unreadCount, resetUnreadCount } = useSupportNotifications();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'support') {
      resetUnreadCount();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
        <AdminHeader />
        <StatsGrid stats={realtimeStats} />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <AdminTabs unreadCount={unreadCount} />

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

          <TabsContent value="support">
            <SupportMessagesTab />
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