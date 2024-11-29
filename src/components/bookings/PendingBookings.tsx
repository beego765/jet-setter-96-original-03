import { BookingCard } from "./BookingCard";

interface PendingBookingsProps {
  bookings: any[];
}

export const PendingBookings = ({ bookings }: PendingBookingsProps) => {
  if (bookings.length === 0) return null;
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Pending Bookings</h2>
        <span className="text-sm text-gray-400">{bookings.length} pending</span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {bookings.map((booking) => (
            <div key={booking.id} className="w-[300px] flex-shrink-0">
              <BookingCard
                booking={{
                  id: booking.id,
                  flightNumber: booking.booking_reference || 'N/A',
                  from: booking.origin,
                  to: booking.destination,
                  date: booking.departure_date,
                  status: booking.status
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};