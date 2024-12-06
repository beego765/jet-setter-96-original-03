import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { FlightPricing } from "./FlightPricing";
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

  const price = flight.price; // Assuming flight object has a price property

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/60 transition-colors">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">{flight.origin} to {flight.destination}</h2>
        <p className="text-gray-400">{flight.departureDate}</p>
        <p className="text-gray-400">Duration: {flight.duration}</p>
      </div>
      <FlightPricing 
        price={price} 
        onSelect={handleSelect}
        isLoading={isLoading} 
      />
    </Card>
  );
};