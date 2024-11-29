import { BookingCard } from "./BookingCard";

interface PendingBookingsProps {
  bookings: any[];
}

export const PendingBookings = ({ bookings }: PendingBookingsProps) => {
  if (bookings.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Pending Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={{
              id: booking.id,
              flightNumber: booking.booking_reference || 'N/A',
              from: booking.origin,
              to: booking.destination,
              date: booking.departure_date,
              status: booking.status
            }}
          />
        ))}
      </div>
    </div>
  );
};