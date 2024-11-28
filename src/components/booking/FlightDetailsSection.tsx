import { Building2, Timer, Clock, Users, Plane, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface FlightDetailsSectionProps {
  flightDetails: any;
  formatDateTime: (date: string) => string;
  formatDuration: (minutes: number) => string;
}

export const FlightDetailsSection = ({ flightDetails, formatDateTime, formatDuration }: FlightDetailsSectionProps) => {
  const segments = flightDetails.data?.slices?.[0]?.segments || [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Flight Details</h3>
      
      {/* Carrier Info */}
      <div className="flex items-center gap-2 text-gray-400">
        <Building2 className="w-4 h-4" />
        <span>Carrier: {flightDetails.data?.owner?.name || 'N/A'}</span>
      </div>

      {/* Flight Route */}
      <div className="space-y-4">
        {segments.map((segment: any, index: number) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xl font-bold">{new Date(segment.departing_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                <Badge variant="outline" className="text-lg">{segment.origin.iata_code}</Badge>
                <p className="text-sm text-gray-400 mt-1">{segment.origin.city?.name}</p>
              </div>
              
              <div className="flex-1 flex flex-col items-center mx-4">
                <div className="text-sm text-gray-400">{formatDuration(segment.duration)}</div>
                <div className="w-full flex items-center gap-2">
                  <div className="h-[2px] flex-1 bg-gray-700"></div>
                  <Plane className="w-4 h-4 text-gray-400" />
                  <div className="h-[2px] flex-1 bg-gray-700"></div>
                </div>
                {segment.operating_carrier && (
                  <span className="text-xs text-gray-500">Operated by {segment.operating_carrier.name}</span>
                )}
                {index < segments.length - 1 && (
                  <Badge variant="secondary" className="mt-2">
                    Stop at {segment.destination.city?.name}
                  </Badge>
                )}
              </div>

              <div className="text-center">
                <p className="text-xl font-bold">{new Date(segment.arriving_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                <Badge variant="outline" className="text-lg">{segment.destination.iata_code}</Badge>
                <p className="text-sm text-gray-400 mt-1">{segment.destination.city?.name}</p>
              </div>
            </div>

            {index < segments.length - 1 && (
              <div className="ml-4 pl-4 border-l-2 border-gray-700">
                <div className="flex items-center gap-2 text-gray-400">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">
                    Layover: {formatDuration(
                      (new Date(segments[index + 1].departing_at).getTime() - 
                      new Date(segment.arriving_at).getTime()) / 60000
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Timer className="w-4 h-4" />
          <span>Total Duration: {formatDuration(flightDetails.data?.slices?.[0]?.duration || 0)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-400">
          <Users className="w-4 h-4" />
          <span>Passengers: {flightDetails.data?.passengers?.length || 1}</span>
        </div>
      </div>

      {/* Flight Numbers */}
      <div className="text-sm text-gray-400">
        Flight Numbers: {segments.map((segment: any) => 
          `${segment.operating_carrier_flight_number}`
        ).join(', ')}
      </div>

      {/* Hold Time Info */}
      {flightDetails.data?.payment_requirements?.requires_instant_payment === false && (
        <div className="mt-4 p-4 bg-purple-500/20 rounded-lg">
          <p className="text-purple-300">
            Hold space available until {format(
              new Date(flightDetails.data?.payment_requirements?.payment_required_by),
              'dd/MM/yyyy'
            )}
          </p>
        </div>
      )}
    </div>
  );
};