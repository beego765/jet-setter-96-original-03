import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface FlightCardProps {
  flight: {
    flightNumber: string;
    origin: string;
    destination: string;
    departureDate: string;
    duration: string;
  };
  onSelect: (flight: any) => void;
}

export const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Plane className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-300">Flight {flight.flightNumber}</span>
          </div>
          
          <div className="flex items-center gap-8">
            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </div>
              <p className="text-lg font-semibold">{formatDate(flight.departureDate)}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
              <span>Duration: {flight.duration}</span>
            </div>
          </div>
        </div>
        
        <Button onClick={() => onSelect(flight)} className="mt-4 md:mt-0">Select</Button>
      </div>
    </Card>
  );
};
