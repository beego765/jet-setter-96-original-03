import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationBubble } from "@/components/admin/NotificationBubble";

interface AdminTabsProps {
  unreadCount: number;
}

export const AdminTabs = ({ unreadCount }: AdminTabsProps) => {
  return (
    <TabsList className="bg-gray-800/50 border-gray-700 w-full justify-start overflow-x-auto">
      <TabsTrigger value="overview" className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700">
        Overview
      </TabsTrigger>
      <TabsTrigger value="bookings" className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700">
        Bookings
      </TabsTrigger>
      <TabsTrigger value="users" className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700">
        Users
      </TabsTrigger>
      <TabsTrigger value="support" className="relative flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700">
        Support
        <NotificationBubble count={unreadCount} />
      </TabsTrigger>
      <TabsTrigger value="system" className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700">
        System
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex-1 text-gray-100 data-[state=active]:text-white data-[state=active]:bg-gray-700">
        Settings
      </TabsTrigger>
    </TabsList>
  );
};