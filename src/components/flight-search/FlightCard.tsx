import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Plane } from "lucide-react";
import { useCreateBooking } from "./FlightSearchService";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const createBookingMutation = useCreateBooking(flight.id, []);

  const handleSelect = async () => {
    try {
      await createBookingMutation.refetch();
      onSelect(flight);
      toast({
        title: "Booking Created",
        description: "Your flight has been successfully booked!",
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format price to GBP
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(flight.price);

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 animate-fadeIn bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/70">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
              {flight.airline}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-sm text-gray-400 font-mono">{flight.flightNumber}</span>
          </div>
          
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
        </div>
        
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <p className="text-3xl font-bold text-purple-400">{formattedPrice}</p>
          <Button 
            onClick={handleSelect}
            className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8"
          >
            Select
          </Button>
        </div>
      </div>
    </Card>
  );
};
