import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, Globe, Shield, Moon, Sun, Users, Database, Plane } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const SettingsTab = () => {
  const { toast } = useToast();

  // Query to check Supabase connection
  const { data: supabaseStatus, isLoading: supabaseLoading } = useQuery({
    queryKey: ['supabase-status'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('airports').select('id').limit(1);
        return error ? 'error' : 'connected';
      } catch {
        return 'error';
      }
    }
  });

  // Query to check Duffel API connection
  const { data: duffelStatus, isLoading: duffelLoading } = useQuery({
    queryKey: ['duffel-status'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('api_credentials')
          .select('*')
          .eq('provider', 'duffel')
          .single();
        return data ? 'connected' : 'not configured';
      } catch {
        return 'error';
      }
    }
  });

  const handleSave = () => {
    toast({
      title: "Settings Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">General Settings</h2>
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
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Time Zone</label>
              <Select>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">EST</SelectItem>
                  <SelectItem value="pst">PST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Language</label>
              <Select>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">Preferences</h2>
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
              <Moon className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-gray-200">Dark Mode</p>
                <p className="text-sm text-gray-400">Toggle between light and dark themes</p>
              </div>
            </div>
            <Switch defaultChecked />
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
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">API Settings</h2>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-gray-200">Supabase Connection</p>
                  <p className="text-sm text-gray-400">Database and authentication service</p>
                </div>
              </div>
              {supabaseLoading ? (
                <Badge className="bg-gray-500/20 text-gray-400">Checking...</Badge>
              ) : (
                <Badge className={
                  supabaseStatus === 'connected' 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }>
                  {supabaseStatus === 'connected' ? 'Connected' : 'Error'}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Plane className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-gray-200">Duffel API</p>
                  <p className="text-sm text-gray-400">Flight booking service</p>
                </div>
              </div>
              {duffelLoading ? (
                <Badge className="bg-gray-500/20 text-gray-400">Checking...</Badge>
              ) : (
                <Badge className={
                  duffelStatus === 'connected'
                    ? 'bg-green-500/20 text-green-400'
                    : duffelStatus === 'not configured'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }>
                  {duffelStatus === 'connected' 
                    ? 'Connected' 
                    : duffelStatus === 'not configured'
                    ? 'Not Configured'
                    : 'Error'}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">API Key</label>
            <div className="flex gap-2">
              <Input defaultValue="sk_test_123456789" type="password" className="bg-gray-700/50 border-gray-600 text-gray-200" />
              <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-200">
                Regenerate
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Webhook URL</label>
            <Input defaultValue="https://api.opustravels.com/webhook" className="bg-gray-700/50 border-gray-600 text-gray-200" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-200">
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
