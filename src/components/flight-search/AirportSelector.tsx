import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
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
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { useAirportSearch } from "./FlightSearchService";

interface AirportSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

export const AirportSelector = ({ 
  value, 
  onChange, 
  placeholder,
  label 
}: AirportSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: airports, isLoading } = useAirportSearch(query);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
        <Plane className={`w-4 h-4 ${label === "From" ? "rotate-45" : "-rotate-45"}`} />
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-12 bg-gray-700/50 border-gray-600 text-white"
          >
            {value || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 bg-gray-800 border-gray-700">
          <Command>
            <CommandInput 
              placeholder="Search airports..." 
              className="h-12 bg-gray-700/50"
              onValueChange={setQuery}
            />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Loading...</CommandEmpty>
              ) : !airports?.length ? (
                <CommandEmpty>No airports found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {airports.map((airport: any) => (
                    <CommandItem
                      key={airport.iata_code}
                      onSelect={() => {
                        onChange(airport.iata_code);
                        setOpen(false);
                      }}
                      className="hover:bg-gray-700"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{airport.name}</span>
                        <span className="text-sm text-gray-400">
                          {airport.city}, {airport.country} ({airport.iata_code})
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};