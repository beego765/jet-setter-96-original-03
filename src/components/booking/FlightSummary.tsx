import { format } from "date-fns";
import { Plane, Calendar, Users, Luggage, Clock } from "lucide-react";

interface FlightSummaryProps {
  booking: any;
  flightDetails: any;
}

export const FlightSummary = ({ booking, flightDetails }: FlightSummaryProps) => {
  if (!booking || !booking.departure_date) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Calendar className="w-4 h-4" />
        <span>{format(new Date(booking.departure_date), 'EEE, dd MMM yyyy')}</span>
        <Users className="w-4 h-4 ml-4" />
        <span>{booking.passengers} Passenger</span>
        <span className="ml-4">{booking.cabin_class}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-3xl font-bold">{flightDetails?.slices?.[0]?.departure?.time || '16:15'}</p>
          <p className="text-sm font-medium bg-gray-700/50 px-3 py-1 rounded-full">
            {booking.origin}
          </p>
        </div>
        
        <div className="flex-1 flex flex-col items-center px-4">
          <div className="w-full flex items-center gap-2">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/20 to-blue-400"></div>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Plane className="w-4 h-4 text-blue-400 rotate-90" />
            </div>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-400 to-blue-500/20"></div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">
              {flightDetails?.slices?.[0]?.duration || '21h 55m'}
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold">{flightDetails?.slices?.[0]?.arrival?.time || '19:10+1'}</p>
          <p className="text-sm font-medium bg-gray-700/50 px-3 py-1 rounded-full">
            {booking.destination}
          </p>
        </div>
      </div>
    </div>
  );
};