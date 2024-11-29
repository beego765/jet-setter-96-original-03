import { BookingTrendsChart } from "./dashboard/BookingTrendsChart";
import { DestinationsChart } from "./dashboard/DestinationsChart";
import { useBookingStats } from "./dashboard/useBookingStats";

export const DashboardCharts = () => {
  const { bookingTrends, destinationStats } = useBookingStats();

  if (!bookingTrends.length && !destinationStats.length) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="h-80 bg-gray-800/50 backdrop-blur-lg border-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Loading chart data...</p>
        </div>
        <div className="h-80 bg-gray-800/50 backdrop-blur-lg border-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <BookingTrendsChart bookingTrends={bookingTrends} />
      <DestinationsChart destinationStats={destinationStats} />
    </div>
  );
};