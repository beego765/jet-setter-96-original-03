import { Card } from "@/components/ui/card";
import { Server, Database, Cpu } from "lucide-react";
import { MetricCard } from "./system-health/MetricCard";
import { useSystemMetrics } from "./system-health/useSystemMetrics";

export const SystemHealth = () => {
  const metrics = useSystemMetrics();

  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-6">System Health</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={Server}
          iconColor="text-blue-400"
          title="Server Status"
          value={metrics.server}
          progressColor="bg-blue-500"
          label="Uptime"
        />
        
        <MetricCard
          icon={Database}
          iconColor="text-green-400"
          title="Database Health"
          value={metrics.database}
          progressColor="bg-green-500"
          label="Performance"
        />
        
        <MetricCard
          icon={Cpu}
          iconColor="text-purple-400"
          title="CPU Usage"
          value={metrics.cpu}
          progressColor="bg-purple-500"
          label="Utilized"
        />
      </div>
    </Card>
  );
};