import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SystemHealth } from "./SystemHealth";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Database, HardDrive, Network, Settings, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const SystemTab = () => {
  return (
    <div className="space-y-6">
      <SystemHealth />
      
      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">System Maintenance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-400" />
              <span className="text-gray-200">Database Backup</span>
            </div>
            <p className="text-sm text-gray-400">Last backup: 2 hours ago</p>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              Run Backup Now
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-green-400" />
              <span className="text-gray-200">Storage Usage</span>
            </div>
            <Progress value={65} className="bg-gray-700 [&>div]:bg-green-500" />
            <p className="text-sm text-gray-300">65% used (650GB/1TB)</p>
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">Security Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-gray-200">Firewall Status</span>
            </div>
            <Badge className="bg-green-500/20 text-green-400">Active</Badge>
          </div>
          
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Network className="w-5 h-5 text-blue-400" />
              <span className="text-gray-200">SSL Certificate</span>
            </div>
            <Badge className="bg-green-500/20 text-green-400">Valid (expires in 240 days)</Badge>
          </div>
          
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-200">Security Updates</span>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-400">3 updates available</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};