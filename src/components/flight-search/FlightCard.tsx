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
    <Card className="p-6 hover:shadow-xl transition-all duration-300 animate-fadeIn bg-white/90 backdrop-blur-sm border-transparent hover:border-flight-accent/20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-flight-accent/10 text-flight-accent">
              {flight.airline}
            </span>
            <span className="text-xs text-flight-secondary">•</span>
            <span className="text-sm text-flight-secondary font-mono">{flight.flightNumber}</span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-flight-primary mb-1">{flight.departureTime}</p>
              <p className="text-sm font-medium text-flight-secondary bg-gray-100 px-3 py-1 rounded-full">
                {flight.origin}
              </p>
            </div>
            
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-center gap-2">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-flight-accent/20 to-flight-accent"></div>
                <div className="w-8 h-8 rounded-full bg-flight-accent/10 flex items-center justify-center">
                  <Plane className="w-4 h-4 text-flight-accent rotate-90" />
                </div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-flight-accent to-flight-accent/20"></div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-4 h-4 text-flight-secondary" />
                <span className="text-sm font-medium text-flight-secondary">{flight.duration}</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-flight-primary mb-1">{flight.arrivalTime}</p>
              <p className="text-sm font-medium text-flight-secondary bg-gray-100 px-3 py-1 rounded-full">
                {flight.destination}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <p className="text-3xl font-bold text-flight-accent">${flight.price}</p>
          <Button 
            onClick={() => onSelect(flight)}
            className="w-full md:w-auto bg-gradient-to-r from-flight-accent to-blue-600 hover:from-flight-accent/90 hover:to-blue-600/90 text-white px-8"
          >
            Select
          </Button>
        </div>
      </div>
    </Card>
  );
};