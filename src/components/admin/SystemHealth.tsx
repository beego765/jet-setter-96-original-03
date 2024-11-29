import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Server, Database, Cpu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type MetricType = 'server' | 'database' | 'cpu';
type Metrics = Record<MetricType, number>;

export const SystemHealth = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    server: 0,
    database: 0,
    cpu: 0
  });

  // Fetch initial metrics
  const { data: initialMetrics } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      const metricsMap: Metrics = {
        server: 0,
        database: 0,
        cpu: 0
      };

      data.forEach(metric => {
        metricsMap[metric.metric_type as MetricType] = metric.value;
      });

      return metricsMap;
    }
  });

  useEffect(() => {
    if (initialMetrics) {
      setMetrics(initialMetrics);
    }
  }, [initialMetrics]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('system-metrics')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'system_metrics' },
        payload => {
          if (payload.new) {
            const newMetric = payload.new as { metric_type: MetricType; value: number };
            setMetrics(prev => ({
              ...prev,
              [newMetric.metric_type]: newMetric.value
            }));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-6">System Health</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-blue-400" />
            <span className="text-gray-200">Server Status</span>
          </div>
          <Progress value={metrics.server} className="bg-gray-700 [&>div]:bg-blue-500" />
          <p className="text-sm text-gray-300">{metrics.server}% Uptime</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-green-400" />
            <span className="text-gray-200">Database Health</span>
          </div>
          <Progress value={metrics.database} className="bg-gray-700 [&>div]:bg-green-500" />
          <p className="text-sm text-gray-300">{metrics.database}% Performance</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-purple-400" />
            <span className="text-gray-200">CPU Usage</span>
          </div>
          <Progress value={metrics.cpu} className="bg-gray-700 [&>div]:bg-purple-500" />
          <p className="text-sm text-gray-300">{metrics.cpu}% Utilized</p>
        </div>
      </div>
    </Card>
  );
};