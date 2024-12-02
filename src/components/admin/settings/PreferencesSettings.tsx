import { Switch } from "@/components/ui/switch";
import { Bell, Shield } from "lucide-react";

export const PreferencesSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-purple-400" />
          <div>
            <p className="text-gray-200">Email Notifications</p>
            <p className="text-sm text-gray-400">Receive email updates about system events</p>
          </div>
        </div>
        <Switch />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-purple-400" />
          <div>
            <p className="text-gray-200">Two-Factor Authentication</p>
            <p className="text-sm text-gray-400">Enable additional security layer</p>
          </div>
        </div>
        <Switch />
      </div>
    </div>
  );
};