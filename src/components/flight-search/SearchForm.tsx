import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchFormData {
  origin: string;
  destination: string;
  date: Date;
  passengers: number;
  class: "economy" | "business" | "first";
}

interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
}

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [date, setDate] = useState<Date>();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState<"economy" | "business" | "first">("economy");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !origin || !destination) return;

    onSearch({
      origin,
      destination,
      date,
      passengers,
      class: flightClass,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10 space-y-6 w-full max-w-4xl mx-auto p-8 bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Plane className="w-4 h-4 rotate-45" />
            From
          </label>
          <Input
            placeholder="Origin airport"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="h-12 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Plane className="w-4 h-4 -rotate-45" />
            To
          </label>
          <Input
            placeholder="Destination airport"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="h-12 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700",
                  !date && "text-gray-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="rounded-md border border-gray-700 bg-gray-800"
              />
            </PopoverContent>
          </Popover>
        </div>

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
            className="w-full h-12 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First</option>
          </select>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium text-lg"
      >
        Search Flights
      </Button>
    </form>
  );
};