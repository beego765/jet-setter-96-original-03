import { Clock, Plane } from "lucide-react";
import type { Flight } from "./types";

interface FlightDetailsProps {
  flight: Flight;
}

export const FlightDetails = ({ flight }: FlightDetailsProps) => {
  return (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <p className="text-3xl font-bold text-white mb-1">{flight.departureTime}</p>
        <p className="text-sm font-medium text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
          {flight.origin}
        </p>
      </div>
      
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full flex items-center gap-2">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/20 to-blue-400"></div>
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Plane className="w-4 h-4 text-blue-400 rotate-90" />
          </div>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-400 to-blue-500/20"></div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-400">{flight.duration}</span>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-3xl font-bold text-white mb-1">{flight.arrivalTime}</p>
        <p className="text-sm font-medium text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
          {flight.destination}
        </p>
      </div>
    </div>
  );
};