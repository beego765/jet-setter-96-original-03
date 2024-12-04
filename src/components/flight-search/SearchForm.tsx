import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AirportSelector } from "./AirportSelector";
import { PassengerSelector, PassengerCount } from "./PassengerSelector";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TripTypeSelector } from "./TripTypeSelector";
import { DateSelector } from "./DateSelector";
import { ClassSelector } from "./ClassSelector";
import { SearchFilters } from "./SearchFilters";
import { FlightExtras, FlightExtrasType } from "./FlightExtras";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface SearchFormData {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: PassengerCount;
  class: "economy" | "business" | "first";
  tripType: "oneWay" | "roundTrip";
  extras: FlightExtrasType;
}

interface SearchFormProps {
  onSearch?: (data: SearchFormData) => void;
}

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [passengers, setPassengers] = useState<PassengerCount>({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [flightClass, setFlightClass] = useState<"economy" | "business" | "first">("economy");
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("oneWay");
  const [showFilters, setShowFilters] = useState(false);
  const [extras, setExtras] = useState<FlightExtrasType>({
    bags: false,
    meals: false,
    wifi: false,
    flexibleTicket: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      const searchData = {
        origin,
        destination,
        departureDate,
        returnDate: tripType === "roundTrip" ? returnDate : undefined,
        passengers,
        class: flightClass,
        tripType,
        extras,
      };
      localStorage.setItem('pendingFlightSearch', JSON.stringify(searchData));
      navigate('/auth');
      return;
    }

    if (!departureDate || !origin || !destination) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const searchData = {
      origin,
      destination,
      departureDate,
      returnDate: tripType === "roundTrip" ? returnDate : undefined,
      passengers,
      class: flightClass,
      tripType,
      extras,
    };

    if (onSearch) {
      onSearch(searchData);
    }

    navigate('/search', { state: searchData });
  };

  return (
    <Card className="p-8 bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-8">
        <TripTypeSelector tripType={tripType} setTripType={setTripType} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AirportSelector
            value={origin}
            onChange={setOrigin}
            placeholder="Select departure airport"
            label="From"
          />
          <AirportSelector
            value={destination}
            onChange={setDestination}
            placeholder="Select arrival airport"
            label="To"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DateSelector
            label="Departure"
            date={departureDate}
            onSelect={setDepartureDate}
          />

          {tripType === "roundTrip" && (
            <DateSelector
              label="Return"
              date={returnDate}
              onSelect={setReturnDate}
            />
          )}

          <PassengerSelector 
            value={passengers} 
            onChange={setPassengers} 
          />

          <ClassSelector
            value={flightClass}
            onChange={setFlightClass}
          />
        </div>

        <Separator className="bg-gray-700" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Options</h3>
          <FlightExtras value={extras} onChange={setExtras} />
        </div>

        <Separator className="bg-gray-700" />

        <div className="flex flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium text-lg"
          >
            Search Flights
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-400 hover:text-white"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </form>

      {showFilters && (
        <div className="mt-6">
          <SearchFilters
            filters={{
              priceRange: [0, 5000],
              stops: [],
              airlines: [],
              departureTime: [],
              arrivalTime: [],
            }}
            onFilterChange={() => {}}
            minPrice={0}
            maxPrice={5000}
            availableAirlines={[
              { code: "BA", name: "British Airways" },
              { code: "LH", name: "Lufthansa" },
              { code: "AF", name: "Air France" },
            ]}
          />
        </div>
      )}
    </Card>
  );
};
