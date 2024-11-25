import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Plane } from "lucide-react";

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  origin: string;
  destination: string;
}

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

export const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-flight-secondary">{flight.airline}</span>
            <span className="text-xs text-flight-secondary">•</span>
            <span className="text-sm text-flight-secondary">{flight.flightNumber}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div>
              <p className="text-2xl font-semibold text-flight-primary">{flight.departureTime}</p>
              <p className="text-sm text-flight-secondary">{flight.origin}</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-center gap-2">
                <div className="h-[1px] flex-1 bg-flight-border"></div>
                <Plane className="w-4 h-4 text-flight-accent rotate-90" />
                <div className="h-[1px] flex-1 bg-flight-border"></div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-flight-secondary" />
                <span className="text-xs text-flight-secondary">{flight.duration}</span>
              </div>
            </div>
            
            <div>
              <p className="text-2xl font-semibold text-flight-primary">{flight.arrivalTime}</p>
              <p className="text-sm text-flight-secondary">{flight.destination}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <p className="text-2xl font-semibold text-flight-primary">${flight.price}</p>
          <Button 
            onClick={() => onSelect(flight)}
            className="w-full md:w-auto bg-flight-accent hover:bg-flight-accent/90 text-white"
          >
            Select
          </Button>
        </div>
      </div>
    </Card>
  );
};