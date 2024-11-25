import { LoyaltyCard } from "@/components/bookings/LoyaltyCard";
import { BookingCard } from "@/components/bookings/BookingCard";
import { TravelStats } from "@/components/bookings/TravelStats";
import { BoardingPass } from "@/components/bookings/BoardingPass";
import { BookingsCalendar } from "@/components/bookings/BookingsCalendar";

const MyBookings = () => {
  const loyaltyInfo = {
    points: 750,
    tier: "Gold",
    nextTierPoints: 1000
  };

  const travelStats = {
    totalMiles: 24500,
    visitedDestinations: 8,
    totalBookings: 12
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

  const upcomingBoardingPass = {
    flightNumber: "FL123",
    seat: "12A",
    gate: "B22",
    boardingTime: "10:30",
    departureTime: "2024-04-15T11:30:00",
    terminal: "T2",
    qrCode: "boarding-pass-qr"
  };

  const flights = bookings.map(booking => ({
    date: new Date(booking.date),
    flightNumber: booking.flightNumber,
    destination: booking.to
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            My Bookings
          </h1>
          <p className="text-gray-300">Manage your flight bookings and travel details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <TravelStats {...travelStats} />
            <LoyaltyCard {...loyaltyInfo} />
          </div>
          <div>
            <BookingsCalendar flights={flights} />
          </div>
        </div>

        {bookings.some(b => b.status === "Upcoming") && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Digital Boarding Pass</h2>
            <BoardingPass {...upcomingBoardingPass} />
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;