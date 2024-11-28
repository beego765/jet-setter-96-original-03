import { Badge } from "@/components/ui/badge";
import { Plane, Calendar, Clock } from "lucide-react";

interface FlightInfoHeaderProps {
  booking: any;
  status: string;
}

export const FlightInfoHeader = ({ booking, status }: FlightInfoHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-semibold mb-2">Flight Information</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Plane className="w-4 h-4" />
            <span>From: {booking?.origin}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Plane className="w-4 h-4 rotate-90" />
            <span>To: {booking?.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Date: {new Date(booking?.departure_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Status: </span>
            <Badge variant={status === 'confirmed' ? 'secondary' : 'default'}>
              {status}
            </Badge>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold">£{booking?.total_price}</p>
        <p className="text-gray-400">{booking?.cabin_class}</p>
      </div>
    </div>
  );
};