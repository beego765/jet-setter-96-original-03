import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ResponsivePie } from "@nivo/pie";
import { DestinationData } from "./types";

interface DestinationsChartProps {
  destinationStats: DestinationData[];
}

export const DestinationsChart = ({ destinationStats }: DestinationsChartProps) => {
  const chartData = useMemo(() => destinationStats, [destinationStats]);

  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Popular Destinations</h3>
      <div className="h-80">
        <ResponsivePie
          data={chartData}
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
  );
};