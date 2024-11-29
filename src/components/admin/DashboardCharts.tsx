import { BookingTrendsChart } from "./dashboard/BookingTrendsChart";
import { DestinationsChart } from "./dashboard/DestinationsChart";
import { useBookingStats } from "./dashboard/useBookingStats";

export const DashboardCharts = () => {
  const { bookingTrends, destinationStats } = useBookingStats();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <BookingTrendsChart bookingTrends={bookingTrends} />
      <DestinationsChart destinationStats={destinationStats} />
    </div>
  );
};