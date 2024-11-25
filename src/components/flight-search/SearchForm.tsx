import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock airport data - in real app, this would come from an API
const airports = [
  { code: "LHR", name: "London Heathrow", city: "London" },
  { code: "LGW", name: "London Gatwick", city: "London" },
  { code: "MAN", name: "Manchester Airport", city: "Manchester" },
  { code: "BHX", name: "Birmingham Airport", city: "Birmingham" },
  // Add more UK airports as needed
];

export interface SearchFormData {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
  class: "economy" | "business" | "first";
  tripType: "oneWay" | "roundTrip";
}

interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
}

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState<"economy" | "business" | "first">("economy");
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("oneWay");
  const [openOrigin, setOpenOrigin] = useState(false);
  const [openDestination, setOpenDestination] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departureDate || !origin || !destination) return;

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
    <form onSubmit={handleSubmit} className="relative z-10 space-y-6 w-full max-w-4xl mx-auto p-8 bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Plane className="w-4 h-4 rotate-45" />
            From
          </label>
          <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start h-12 bg-gray-700/50 border-gray-600 text-white"
              >
                {origin ? airports.find(a => a.code === origin)?.name : "Select airport"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-gray-800 border-gray-700">
              <Command>
                <CommandInput placeholder="Search airports..." className="h-12 bg-gray-700/50" />
                <CommandEmpty>No airports found.</CommandEmpty>
                <CommandGroup>
                  {airports.map((airport) => (
                    <CommandItem
                      key={airport.code}
                      onSelect={() => {
                        setOrigin(airport.code);
                        setOpenOrigin(false);
                      }}
                      className="hover:bg-gray-700"
                    >
                      <span>{airport.name}</span>
                      <span className="ml-2 text-gray-400">({airport.code})</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Plane className="w-4 h-4 -rotate-45" />
            To
          </label>
          <Popover open={openDestination} onOpenChange={setOpenDestination}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start h-12 bg-gray-700/50 border-gray-600 text-white"
              >
                {destination ? airports.find(a => a.code === destination)?.name : "Select airport"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-gray-800 border-gray-700">
              <Command>
                <CommandInput placeholder="Search airports..." className="h-12 bg-gray-700/50" />
                <CommandEmpty>No airports found.</CommandEmpty>
                <CommandGroup>
                  {airports.map((airport) => (
                    <CommandItem
                      key={airport.code}
                      onSelect={() => {
                        setDestination(airport.code);
                        setOpenDestination(false);
                      }}
                      className="hover:bg-gray-700"
                    >
                      <span>{airport.name}</span>
                      <span className="ml-2 text-gray-400">({airport.code})</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Departure Date
          </label>
          <Popover>
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
                onSelect={setDepartureDate}
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
            <Popover>
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
                  onSelect={setReturnDate}
                  initialFocus
                  className="rounded-md border border-gray-700 bg-gray-800"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Passengers
          </label>
          <Input
            type="number"
            min={1}
            max={9}
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value))}
            className="h-12 bg-gray-700/50 border-gray-600 text-white"
          />
        </div>

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
        className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium text-lg"
      >
        Search Flights
      </Button>
    </form>
  );
};