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

  // Format duration from PT9H format to 9h 0m
  const formatDuration = (duration: string) => {
    const hours = duration.match(/(\d+)H/)?.[1] || "0";
    const minutes = duration.match(/(\d+)M/)?.[1] || "0";
    return `${hours}h ${minutes}m`;
  };

  // Get first segment details
  const firstSlice = flight.slices?.[0];
  const firstSegment = firstSlice?.segments?.[0];

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/60 transition-colors">
      <div className="space-y-6">
        <AirlineInfo 
          name={flight.owner.name}
          logoUrl={flight.owner.logo_symbol_url}
          iataCode={flight.owner.iata_code}
        />

        <FlightDetails 
          flight={{
            ...flight,
            departureTime: new Date(firstSegment?.departing_at).toLocaleTimeString(),
            arrivalTime: new Date(firstSegment?.arriving_at).toLocaleTimeString(),
            duration: formatDuration(firstSlice?.duration),
            origin: firstSlice?.origin?.iata_code,
            destination: firstSlice?.destination?.iata_code,
          }} 
        />

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <span className="block font-medium">Flight Number</span>
            <span>{firstSegment?.operating_carrier_flight_number || 'N/A'}</span>
          </div>
          <div>
            <span className="block font-medium">Aircraft</span>
            <span>{firstSegment?.aircraft?.name || 'N/A'}</span>
          </div>
          <div>
            <span className="block font-medium">Class</span>
            <span>{firstSlice?.fare_brand_name || 'Economy'}</span>
          </div>
          <div>
            <span className="block font-medium">Operated by</span>
            <span>{firstSegment?.operating_carrier?.name || flight.owner.name}</span>
          </div>
        </div>

        <FlightPricing 
          price={parseFloat(flight.total_amount)}
          onSelect={handleSelect}
          isLoading={isLoading}
          conditions={{
            refundable: flight.conditions?.refund_before_departure?.allowed || false,
            changeable: flight.conditions?.change_before_departure?.allowed || false,
            refundPenalty: flight.conditions?.refund_before_departure?.penalty_amount,
            changePenalty: flight.conditions?.change_before_departure?.penalty_amount
          }}
        />
      </div>
    </Card>
  );
};