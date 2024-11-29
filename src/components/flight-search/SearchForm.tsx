import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { AirportSelector } from "./AirportSelector";
import { PassengerSelector, PassengerCount } from "./PassengerSelector";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);

  useEffect(() => {
    checkPendingSearch();
  }, []);

  const checkPendingSearch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const pendingSearch = localStorage.getItem(SEARCH_STATE_KEY);
      if (pendingSearch) {
        const searchData = JSON.parse(pendingSearch);
        // Convert date strings back to Date objects
        searchData.departureDate = new Date(searchData.departureDate);
        if (searchData.returnDate) {
          searchData.returnDate = new Date(searchData.returnDate);
        }
        localStorage.removeItem(SEARCH_STATE_KEY);
        onSearch(searchData);
      }
    }
  };

  const handleDepartureDateSelect = (date: Date | undefined) => {
    setDepartureDate(date);
    setDepartureDateOpen(false);
  };

  const handleReturnDateSelect = (date: Date | undefined) => {
    setReturnDate(date);
    setReturnDateOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Save search state before redirecting
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
    <form onSubmit={handleSubmit} className="relative space-y-6 w-full max-w-4xl mx-auto p-8 bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700">
      <div className="flex items-center justify-center gap-4 mb-6">
        <Toggle
          pressed={tripType === "oneWay"}
          onPressedChange={() => setTripType("oneWay")}
          className="data-[state=on]:bg-purple-500"
        >
          One Way
        </Toggle>
        <Toggle
          pressed={tripType === "roundTrip"}
          onPressedChange={() => setTripType("roundTrip")}
          className="data-[state=on]:bg-purple-500"
        >
          Round Trip
        </Toggle>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Departure Date
          </label>
          <Popover open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700",
                  !departureDate && "text-gray-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={handleDepartureDateSelect}
                initialFocus
                className="rounded-md border border-gray-700 bg-gray-800"
              />
            </PopoverContent>
          </Popover>
        </div>

        {tripType === "roundTrip" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Return Date
            </label>
            <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700",
                    !returnDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={handleReturnDateSelect}
                  initialFocus
                  className="rounded-md border border-gray-700 bg-gray-800"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <PassengerSelector value={passengers} onChange={setPassengers} />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Class</label>
          <select
            value={flightClass}
            onChange={(e) => setFlightClass(e.target.value as "economy" | "business" | "first")}
            className="w-full h-12 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First</option>
          </select>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium text-lg relative z-0"
      >
        Search Flights
      </Button>
    </form>
  );
};