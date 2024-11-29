import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MetricType = 'server' | 'database' | 'cpu';
export type Metrics = Record<MetricType, number>;

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    server: 0,
    database: 0,
    cpu: 0
  });

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

  return metrics;
};