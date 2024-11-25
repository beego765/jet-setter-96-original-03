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
import { Calendar as CalendarIcon } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-4xl mx-auto p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-flight-primary">From</label>
          <Input
            placeholder="Origin airport"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-flight-primary">To</label>
          <Input
            placeholder="Destination airport"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-flight-primary">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
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
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-flight-primary">Passengers</label>
          <Input
            type="number"
            min={1}
            max={9}
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value))}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-flight-primary">Class</label>
          <select
            value={flightClass}
            onChange={(e) => setFlightClass(e.target.value as "economy" | "business" | "first")}
            className="w-full h-12 px-3 py-2 bg-white border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 bg-flight-accent hover:bg-flight-accent/90 text-white">
        Search Flights
      </Button>
    </form>
  );
};