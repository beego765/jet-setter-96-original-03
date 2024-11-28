import { Card } from "@/components/ui/card";

interface FlightInfoProps {
  booking: any;
}

export const FlightInfo = ({ booking }: FlightInfoProps) => {
  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-2">Flight Information</h2>
            <p className="text-gray-400">Booking Reference: {booking?.booking_reference}</p>
            <p className="text-gray-400">From: {booking?.origin}</p>
            <p className="text-gray-400">To: {booking?.destination}</p>
            <p className="text-gray-400">Date: {new Date(booking?.departure_date).toLocaleDateString()}</p>
            <p className="text-gray-400">Status: {booking?.status}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">£{booking?.total_price}</p>
            <p className="text-gray-400">{booking?.cabin_class}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};