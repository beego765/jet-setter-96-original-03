import { LoyaltyCard } from "@/components/bookings/LoyaltyCard";
import { BookingCard } from "@/components/bookings/BookingCard";

const MyBookings = () => {
  const loyaltyInfo = {
    points: 750,
    tier: "Gold",
    nextTierPoints: 1000
  };

  const bookings = [
    {
      id: 1,
      flightNumber: "FL123",
      from: "New York",
      to: "London",
      date: "2024-04-15",
      status: "Upcoming",
    },
    {
      id: 2,
      flightNumber: "FL456",
      from: "Paris",
      to: "Tokyo",
      date: "2024-05-20",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            My Bookings
          </h1>
          <p className="text-gray-300">Manage your flight bookings</p>
        </div>

        <LoyaltyCard {...loyaltyInfo} />

        <div className="space-y-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;