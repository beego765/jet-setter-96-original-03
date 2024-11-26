import React, { useState, useCallback, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Plane } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
  const [displayValue, setDisplayValue] = useState("");
  
  const debouncedQuery = useCallback((input: string) => {
    return input.length >= 2 ? input : '';
  }, []);

  const { data: airports, isLoading } = useAirportSearch(debouncedQuery(query));

  const filteredAirports = useMemo(() => {
    return airports || [];
  }, [airports]);

  const handleSelect = (airport: any) => {
    onChange(airport.iata_code);
    setDisplayValue(`${airport.city} (${airport.iata_code})`);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="relative w-full space-y-2">
      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
        <Plane className={`w-4 h-4 ${label === "From" ? "rotate-45" : "-rotate-45"}`} />
        {label}
      </label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start h-12 bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700"
          >
            {displayValue || value || placeholder}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="p-0 bg-gray-800 border-gray-700 w-[400px]" 
          align="start"
          sideOffset={5}
          style={{ zIndex: 100 }}
        >
          <Command>
            <CommandInput 
              placeholder="Search airports..." 
              value={query}
              onValueChange={setQuery}
              className="h-12 bg-transparent border-b border-gray-600 focus:outline-none focus:ring-0 placeholder-gray-400"
            />
            
            <CommandList className="max-h-[300px] overflow-auto">
              {isLoading ? (
                <CommandEmpty>Loading...</CommandEmpty>
              ) : filteredAirports.length === 0 ? (
                <CommandEmpty>No airports found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredAirports.map((airport: any) => (
                    <CommandItem
                      key={airport.iata_code}
                      value={`${airport.name} ${airport.city} ${airport.iata_code}`}
                      onSelect={() => handleSelect(airport)}
                      className="hover:bg-gray-700 cursor-pointer py-2"
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