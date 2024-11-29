import { Card } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, format, subMonths } from "date-fns";
import { useEffect, useState } from "react";

interface BookingTrend {
  x: string;
  y: number;
}

interface DestinationData {
  id: string;
  value: number;
}

const useBookingStats = () => {
  const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([]);
  const [destinationStats, setDestinationStats] = useState<DestinationData[]>([]);

  const { data: initialData } = useQuery({
    queryKey: ['booking-stats'],
    queryFn: async () => {
      // Get the last 5 months
      const months = Array.from({ length: 5 }, (_, i) => {
        const date = subMonths(new Date(), i);
        return startOfMonth(date);
      }).reverse();

      const { data: bookings } = await supabase
        .from('bookings')
        .select('departure_date, destination')
        .gte('created_at', months[0].toISOString());

      if (!bookings) return { trends: [], destinations: [] };

      // Process booking trends
      const trends = months.map(month => {
        const count = bookings.filter(booking => 
          startOfMonth(new Date(booking.departure_date)).getTime() === month.getTime()
        ).length;

        return {
          x: format(month, 'MMM'),
          y: count
        };
      });

      // Process destination stats
      const destinationCounts = bookings.reduce((acc: Record<string, number>, booking) => {
        acc[booking.destination] = (acc[booking.destination] || 0) + 1;
        return acc;
      }, {});

      const destinations = Object.entries(destinationCounts)
        .map(([id, value]) => ({ id, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      return { trends, destinations };
    }
  });

  useEffect(() => {
    if (initialData) {
      setBookingTrends(initialData.trends);
      setDestinationStats(initialData.destinations);
    }

    // Subscribe to booking changes
    const channel = supabase
      .channel('booking-stats')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        async () => {
          // Refetch data when bookings change
          const { data: refreshedData } = await supabase.rpc('get_booking_stats');
          if (refreshedData) {
            setBookingTrends(refreshedData.trends);
            setDestinationStats(refreshedData.destinations);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [initialData]);

  return {
    bookingTrends,
    destinationStats
  };
};

export const DashboardCharts = () => {
  const { bookingTrends, destinationStats } = useBookingStats();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Booking Trends</h3>
        <div className="h-80">
          <ResponsiveLine
            data={[{ id: "bookings", data: bookingTrends }]}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: "auto" }}
            curve="cardinal"
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Month",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Bookings",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            colors={{ scheme: "category10" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            theme={{
              axis: { ticks: { text: { fill: "#9CA3AF" } } },
              grid: { line: { stroke: "#374151" } },
            }}
          />
        </div>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Popular Destinations</h3>
        <div className="h-80">
          <ResponsivePie
            data={destinationStats}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: "category10" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLabelsSkipAngle={10}
            arcLinkLabelsTextOffset={6}
            arcLinkLabelsTextColor="#9CA3AF"
            arcLinkLabelsOffset={0}
            arcLinkLabelsDiagonalLength={16}
            arcLinkLabelsStraightLength={24}
            arcLinkLabelsThickness={1}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsTextColor="#9CA3AF"
          />
        </div>
      </Card>
    </div>
  );
};