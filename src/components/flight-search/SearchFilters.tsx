import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Plane } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface FilterValues {
  priceRange: [number, number];
  stops: string[];
  airlines: string[];
  departureTime: string[];
  arrivalTime: string[];
}

interface SearchFiltersProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  minPrice: number;
  maxPrice: number;
  availableAirlines: { code: string; name: string }[];
}

export const SearchFilters = ({
  filters,
  onFilterChange,
  minPrice,
  maxPrice,
  availableAirlines,
}: SearchFiltersProps) => {
  const handlePriceChange = (value: number[]) => {
    onFilterChange({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number],
    });
  };

  const timeSlots = [
    { label: "Morning (6AM-12PM)", value: "morning" },
    { label: "Afternoon (12PM-6PM)", value: "afternoon" },
    { label: "Evening (6PM-12AM)", value: "evening" },
    { label: "Night (12AM-6AM)", value: "night" },
  ];

  const stopOptions = [
    { label: "Non-stop", value: "0" },
    { label: "1 stop", value: "1" },
    { label: "2+ stops", value: "2+" },
  ];

  return (
    <div className="space-y-6 bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 p-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[minPrice, maxPrice]}
                max={maxPrice}
                min={minPrice}
                step={10}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>£{filters.priceRange[0]}</span>
                <span>£{filters.priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stops">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Stops
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {stopOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`stops-${option.value}`}
                    checked={filters.stops.includes(option.value)}
                    onCheckedChange={(checked) => {
                      onFilterChange({
                        ...filters,
                        stops: checked
                          ? [...filters.stops, option.value]
                          : filters.stops.filter((s) => s !== option.value),
                      });
                    }}
                  />
                  <Label htmlFor={`stops-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="departure">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Departure Time
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {timeSlots.map((slot) => (
                <div key={slot.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`departure-${slot.value}`}
                    checked={filters.departureTime.includes(slot.value)}
                    onCheckedChange={(checked) => {
                      onFilterChange({
                        ...filters,
                        departureTime: checked
                          ? [...filters.departureTime, slot.value]
                          : filters.departureTime.filter((t) => t !== slot.value),
                      });
                    }}
                  />
                  <Label htmlFor={`departure-${slot.value}`}>{slot.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="arrival">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Arrival Time
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {timeSlots.map((slot) => (
                <div key={slot.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`arrival-${slot.value}`}
                    checked={filters.arrivalTime.includes(slot.value)}
                    onCheckedChange={(checked) => {
                      onFilterChange({
                        ...filters,
                        arrivalTime: checked
                          ? [...filters.arrivalTime, slot.value]
                          : filters.arrivalTime.filter((t) => t !== slot.value),
                      });
                    }}
                  />
                  <Label htmlFor={`arrival-${slot.value}`}>{slot.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="airlines">
          <AccordionTrigger className="text-sm font-medium">Airlines</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availableAirlines.map((airline) => (
                <div key={airline.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`airline-${airline.code}`}
                    checked={filters.airlines.includes(airline.code)}
                    onCheckedChange={(checked) => {
                      onFilterChange({
                        ...filters,
                        airlines: checked
                          ? [...filters.airlines, airline.code]
                          : filters.airlines.filter((a) => a !== airline.code),
                      });
                    }}
                  />
                  <Label htmlFor={`airline-${airline.code}`}>{airline.name}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};