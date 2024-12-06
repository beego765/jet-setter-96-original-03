import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { FlightPricing } from "./FlightPricing";
import { AirlineInfo } from "./AirlineInfo";
import { FlightDetails } from "./FlightDetails";
import type { Flight } from "./types";

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
  isLoading?: boolean;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
}

export const FlightCard = ({ flight, onSelect, isLoading = false, passengers }: FlightCardProps) => {
  const navigate = useNavigate();
  
  const handleSelect = () => {
    onSelect(flight);
    navigate('/flight-summary', { 
      state: { 
        flight,
        passengers 
      } 
    });
  };

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/60 transition-colors">
      <div className="space-y-6">
        {/* Airline Information */}
        <AirlineInfo 
          name={flight.airline}
          logoUrl={flight.airlineLogoUrl}
          iataCode={flight.airlineCode}
        />

        {/* Flight Details */}
        <FlightDetails flight={flight} />

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <span className="block font-medium">Flight Number</span>
            <span>{flight.flightNumber}</span>
          </div>
          <div>
            <span className="block font-medium">Aircraft</span>
            <span>{flight.aircraft || 'N/A'}</span>
          </div>
          <div>
            <span className="block font-medium">Class</span>
            <span>{flight.cabinClass}</span>
          </div>
          <div>
            <span className="block font-medium">Operated by</span>
            <span>{flight.operatingCarrier}</span>
          </div>
        </div>

        {/* Pricing and Action */}
        <FlightPricing 
          price={flight.price} 
          onSelect={handleSelect}
          isLoading={isLoading} 
        />
      </div>
    </Card>
  );
};