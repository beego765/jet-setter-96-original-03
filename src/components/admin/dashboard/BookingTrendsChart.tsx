import { Card } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { BookingTrend } from "./types";

interface BookingTrendsChartProps {
  bookingTrends: BookingTrend[];
}

export const BookingTrendsChart = ({ bookingTrends }: BookingTrendsChartProps) => {
  return (
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
  );
};