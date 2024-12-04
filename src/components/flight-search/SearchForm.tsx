import { useState, useEffect } from "react";
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

export interface SearchFormData {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: PassengerCount;
  class: "economy" | "business" | "first";
  tripType: "oneWay" | "roundTrip";
}

interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
}

const SEARCH_STATE_KEY = 'pendingFlightSearch';

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
  const [filters, setFilters] = useState({
    priceRange: [0, 5000] as [number, number],
    stops: [] as string[],
    airlines: [] as string[],
    departureTime: [] as string[],
    arrivalTime: [] as string[],
  });

  useEffect(() => {
    checkPendingSearch();
  }, []);

  const checkPendingSearch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const pendingSearch = localStorage.getItem(SEARCH_STATE_KEY);
      if (pendingSearch) {
        const searchData = JSON.parse(pendingSearch);
        searchData.departureDate = new Date(searchData.departureDate);
        if (searchData.returnDate) {
          searchData.returnDate = new Date(searchData.returnDate);
        }
        localStorage.removeItem(SEARCH_STATE_KEY);
        onSearch(searchData);
      }
    }
  };

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
      };
      localStorage.setItem(SEARCH_STATE_KEY, JSON.stringify(searchData));
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

    onSearch({
      origin,
      destination,
      departureDate,
      returnDate: tripType === "roundTrip" ? returnDate : undefined,
      passengers,
      class: flightClass,
      tripType,
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="relative space-y-6 w-full max-w-4xl mx-auto p-8 bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700">
        <TripTypeSelector tripType={tripType} setTripType={setTripType} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
          <AirportSelector
            value={origin}
            onChange={(value) => {
              setOrigin(value);
              // Auto-focus destination after origin selection
              if (value) {
                const destInput = document.querySelector('[placeholder="Select arrival airport"]');
                if (destInput instanceof HTMLElement) {
                  destInput.focus();
                }
              }
            }}
            placeholder="Select departure airport"
            label="From"
          />
          <AirportSelector
            value={destination}
            onChange={(value) => {
              setDestination(value);
              // Auto-focus date after destination selection
              if (value) {
                const dateButton = document.querySelector('[aria-label="Pick a date"]');
                if (dateButton instanceof HTMLElement) {
                  dateButton.click();
                }
              }
            }}
            placeholder="Select arrival airport"
            label="To"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <DateSelector
            label="Departure Date"
            date={departureDate}
            onSelect={setDepartureDate}
            onComplete={() => {
              if (tripType === "roundTrip") {
                const returnDateButton = document.querySelectorAll('[aria-label="Pick a date"]')[1];
                if (returnDateButton instanceof HTMLElement) {
                  returnDateButton.click();
                }
              }
            }}
          />

          {tripType === "roundTrip" && (
            <DateSelector
              label="Return Date"
              date={returnDate}
              onSelect={setReturnDate}
              onComplete={() => {
                const passengerButton = document.querySelector('[aria-label="Select passengers"]');
                if (passengerButton instanceof HTMLElement) {
                  passengerButton.click();
                }
              }}
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

        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium text-lg relative z-0"
        >
          Search Flights
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-white"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </form>

      {showFilters && (
        <div className="w-full max-w-4xl mx-auto">
          <SearchFilters
            filters={filters}
            onFilterChange={setFilters}
            minPrice={0}
            maxPrice={5000}
            availableAirlines={[
              { code: "BA", name: "British Airways" },
              { code: "LH", name: "Lufthansa" },
              { code: "AF", name: "Air France" },
              // Add more airlines as needed
            ]}
          />
        </div>
      )}
    </div>
  );
};