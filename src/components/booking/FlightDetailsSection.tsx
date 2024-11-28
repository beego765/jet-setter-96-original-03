import { Building2, Timer, Clock, Users } from "lucide-react";

interface FlightDetailsSectionProps {
  flightDetails: any;
  formatDateTime: (date: string) => string;
  formatDuration: (minutes: number) => string;
}

export const FlightDetailsSection = ({ flightDetails, formatDateTime, formatDuration }: FlightDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Flight Details</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400">
          <Building2 className="w-4 h-4" />
          <span>Carrier: {flightDetails.data?.owner?.name || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Timer className="w-4 h-4" />
          <span>Duration: {formatDuration(flightDetails.data?.slices?.[0]?.duration || 0)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Departure: {formatDateTime(flightDetails.data?.slices?.[0]?.departing_at)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Arrival: {formatDateTime(flightDetails.data?.slices?.[0]?.arriving_at)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Users className="w-4 h-4" />
          <span>Passengers: {flightDetails.data?.passengers?.length || 1}</span>
        </div>
      </div>
    </div>
  );
};