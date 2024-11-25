import { Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AdminHeader = () => (
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
);