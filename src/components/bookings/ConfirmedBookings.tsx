import { BookingCard } from "./BookingCard";
import { Card } from "@/components/ui/card";

interface ConfirmedBookingsProps {
  bookings: any[];
}

export const ConfirmedBookings = ({ bookings }: ConfirmedBookingsProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Confirmed Bookings</h2>
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
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
          ))
        ) : (
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <p className="text-gray-400 text-center">No confirmed bookings yet</p>
          </Card>
        )}
      </div>
    </div>
  );
};