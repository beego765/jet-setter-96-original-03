import { Card } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";

const bookingsData = [
  { x: "Jan", y: 120 },
  { x: "Feb", y: 140 },
  { x: "Mar", y: 180 },
  { x: "Apr", y: 160 },
  { x: "May", y: 200 },
].map(point => ({ x: point.x, y: point.y }));

const destinationsData = [
  { id: "London", value: 35 },
  { id: "Paris", value: 25 },
  { id: "New York", value: 20 },
  { id: "Tokyo", value: 15 },
  { id: "Dubai", value: 5 },
];

export const DashboardCharts = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Booking Trends</h3>
      <div className="h-80">
        <ResponsiveLine
          data={[{ id: "bookings", data: bookingsData }]}
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
          data={destinationsData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: "category10" }}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextXOffset={6}
          radialLabelsTextColor="#9CA3AF"
          radialLabelsLinkOffset={0}
          radialLabelsLinkDiagonalLength={16}
          radialLabelsLinkHorizontalLength={24}
          radialLabelsLinkStrokeWidth={1}
          radialLabelsLinkColor={{ from: "color" }}
          slicesLabelsSkipAngle={10}
          slicesLabelsTextColor="#9CA3AF"
        />
      </div>
    </Card>
  </div>
);