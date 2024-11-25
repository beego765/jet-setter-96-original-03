import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Server, Database, Cpu } from "lucide-react";

export const SystemHealth = () => (
  <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 mt-6">
    <h2 className="text-xl font-semibold text-gray-100 mb-6">System Health</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-blue-400" />
          <span className="text-gray-200">Server Status</span>
        </div>
        <Progress value={92} className="bg-gray-700 [&>div]:bg-blue-500" />
        <p className="text-sm text-gray-300">92% Uptime</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-green-400" />
          <span className="text-gray-200">Database Health</span>
        </div>
        <Progress value={88} className="bg-gray-700 [&>div]:bg-green-500" />
        <p className="text-sm text-gray-300">88% Performance</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-purple-400" />
          <span className="text-gray-200">CPU Usage</span>
        </div>
        <Progress value={45} className="bg-gray-700 [&>div]:bg-purple-500" />
        <p className="text-sm text-gray-300">45% Utilized</p>
      </div>
    </div>
  </Card>
);