import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AirlineInfo } from "./AirlineInfo";
import { FlightDetails } from "./FlightDetails";
import { FlightPricing } from "./FlightPricing";
import { FlightServices } from "./FlightServices";
import { Separator } from "@/components/ui/separator";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  aircraft?: string;
  cabinClass?: string;
  operatingCarrier?: string;
  departureDate?: string;
  segments?: Array<{
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    layoverDuration?: string;
  }>;
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
  const [isOpen, setIsOpen] = useState(false);

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
      
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: session.user.id,
          origin: flight.origin,
          destination: flight.destination,
          departure_date: flight.departureDate || new Date().toISOString().split('T')[0],
          passengers: passengers.adults + passengers.children + passengers.infants,
          cabin_class: flight.cabinClass || 'economy',
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

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 animate-fadeIn bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/70">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <AirlineInfo 
            name={flight.airline}
            logoUrl={flight.airlineLogoUrl}
            iataCode={flight.airlineCode}
          />
          <Badge variant="outline" className="text-sm">
            {flight.flightNumber}
          </Badge>
        </div>

        <FlightDetails flight={flight} />

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
              Show included services
              <ArrowRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <FlightServices 
              services={flight.services}
              carbonEmissions={flight.carbonEmissions}
            />
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-gray-700" />

        <FlightPricing price={flight.price} onSelect={handleSelect} isLoading={isLoading} />
      </div>
    </Card>
  );
};