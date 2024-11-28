import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Plane } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
}

export const FlightCard = ({ flight, onSelect, passengers }: FlightCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a flight.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a booking record in our database first
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: session.user.id,
          origin: flight.origin,
          destination: flight.destination,
          departure_date: new Date().toISOString().split('T')[0], // You might want to get this from flight data
          passengers: passengers.adults + passengers.children + passengers.infants,
          cabin_class: 'economy', // Default to economy, adjust if you have this info
          total_price: flight.price,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      if (booking) {
        navigate(`/booking/${booking.id}`);
        toast({
          title: "Booking Started",
          description: "Please complete your passenger details to confirm your booking."
        });
        onSelect(flight);
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
            className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8"
          >
            {isLoading ? "Processing..." : "Select"}
          </Button>
        </div>
      </div>
    </Card>
  );
};