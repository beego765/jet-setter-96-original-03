import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Plane, 
  Luggage, 
  CreditCard, 
  Building2, 
  Calendar, 
  Users,
  Leaf,
  UtensilsCrossed,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AirlineInfo } from "./AirlineInfo";
import { FlightDetails } from "./FlightDetails";
import { FlightPricing } from "./FlightPricing";
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
  baggageAllowance?: string;
  fareConditions?: string;
  cabinClass?: string;
  operatingCarrier?: string;
  departureDate?: string;
  passengers?: number;
  carbonEmissions?: {
    amount: number;
    unit: string;
  };
  segments?: Array<{
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    layoverDuration?: string;
  }>;
  conditions?: {
    refundable: boolean;
    changeable: boolean;
    penaltyAmount?: number;
  };
  amenities?: {
    seatSelection?: boolean;
    meals?: string[];
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {flight.aircraft && (
            <div className="flex items-center gap-2 text-gray-400">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">{flight.aircraft}</span>
            </div>
          )}
          {flight.baggageAllowance && (
            <div className="flex items-center gap-2 text-gray-400">
              <Luggage className="w-4 h-4" />
              <span className="text-sm">{flight.baggageAllowance}</span>
            </div>
          )}
          {flight.cabinClass && (
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <Badge variant="outline" className="text-sm">
                {flight.cabinClass}
              </Badge>
            </div>
          )}
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              Show more details
              <ArrowRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {flight.carbonEmissions && (
              <div className="flex items-center gap-2 text-gray-400">
                <Leaf className="w-4 h-4 text-green-400" />
                <span className="text-sm">
                  Carbon emissions: {flight.carbonEmissions.amount} {flight.carbonEmissions.unit}
                </span>
              </div>
            )}

            {flight.segments && flight.segments.length > 1 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Flight Connections</h4>
                {flight.segments.map((segment, index) => (
                  <div key={index} className="text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4" />
                      {segment.origin} → {segment.destination}
                    </div>
                    {segment.layoverDuration && (
                      <div className="ml-6 text-amber-400">
                        Layover: {segment.layoverDuration}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {flight.conditions && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Fare Conditions</h4>
                <div className="flex items-center gap-2 text-gray-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">
                    {flight.conditions.refundable ? 'Refundable' : 'Non-refundable'}
                    {flight.conditions.penaltyAmount && ` (Fee: £${flight.conditions.penaltyAmount})`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {flight.conditions.changeable ? 'Changes allowed' : 'Changes not allowed'}
                  </span>
                </div>
              </div>
            )}

            {flight.amenities && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Amenities</h4>
                {flight.amenities.seatSelection !== undefined && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {flight.amenities.seatSelection ? 'Seat selection available' : 'No seat selection'}
                    </span>
                  </div>
                )}
                {flight.amenities.meals && flight.amenities.meals.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <UtensilsCrossed className="w-4 h-4" />
                    <span className="text-sm">
                      Meals: {flight.amenities.meals.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-gray-700" />

        <FlightPricing price={flight.price} onSelect={handleSelect} isLoading={isLoading} />
      </div>
    </Card>
  );
};