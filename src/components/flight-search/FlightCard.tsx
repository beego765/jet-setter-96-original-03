import { Badge } from "@/components/ui/badge";
import { Building2, Clock } from "lucide-react";
import { FlightPricing } from "./FlightPricing";
import { FlightDetails } from "./FlightDetails";
import { FlightServices } from "./FlightServices";
import { FlightExtras } from "./FlightExtras";
import { Card } from "@/components/ui/card";

export interface Flight {
  id: string;
  airline: string;
  airlineLogoUrl?: string;
  airlineCode?: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  origin: string;
  destination: string;
  aircraft: string;
  cabinClass: string;
  operatingCarrier: string;
  departureDate: string;
  segments: {
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
  }[];
  services: {
    seatSelection: boolean;
    meals: string[];
    baggage: {
      included: boolean;
      details: string;
    };
    refund: {
      allowed: boolean;
      penalty?: number;
    };
    changes: {
      allowed: boolean;
      penalty?: number;
    };
  };
  carbonEmissions?: {
    amount: number;
    unit: string;
  };
}

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
  isLoading?: boolean;
}

export const FlightCard = ({ flight, onSelect, isLoading = false }: FlightCardProps) => {
  // Ensure price is a number
  const price = typeof flight.price === 'number' ? flight.price : 0;

  return (
    <Card className="p-4 space-y-4 bg-gray-800/40 backdrop-blur-sm border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {flight.airlineLogoUrl ? (
            <img 
              src={flight.airlineLogoUrl} 
              alt={flight.airline} 
              className="w-8 h-8 object-contain"
            />
          ) : (
            <Building2 className="w-8 h-8" />
          )}
          <div>
            <p className="font-semibold">{flight.airline}</p>
            <p className="text-sm text-gray-400">Flight {flight.flightNumber}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {flight.cabinClass}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-2xl font-bold">{flight.departureTime}</p>
          <Badge variant="outline">{flight.origin}</Badge>
        </div>
        
        <div className="flex-1 flex flex-col items-center px-4">
          <p className="text-sm text-gray-400">{flight.duration}</p>
          <div className="w-full flex items-center gap-2">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/20 to-blue-400"></div>
            <Clock className="w-4 h-4 text-blue-400" />
            <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-400 to-blue-500/20"></div>
          </div>
          {flight.segments.length > 1 && (
            <Badge variant="secondary" className="mt-2">
              {flight.segments.length - 1} stop{flight.segments.length - 1 > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold">{flight.arrivalTime}</p>
          <Badge variant="outline">{flight.destination}</Badge>
        </div>
      </div>

      <FlightPricing 
        price={price}
        onSelect={() => onSelect(flight)}
        isLoading={isLoading}
      />
    </Card>
  );
};