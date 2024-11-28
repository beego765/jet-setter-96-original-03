import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

interface Flight {
  date: Date;
  flightNumber: string;
  destination: string;
}

interface BookingsCalendarProps {
  flights: Flight[];
}

export const BookingsCalendar = ({ flights }: BookingsCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const getDayContent = (day: Date) => {
    const flightsOnDay = flights.filter(
      (flight) => flight.date.toDateString() === day.toDateString()
    );
    
    if (flightsOnDay.length === 0) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="secondary" 
              className="absolute bottom-0 right-0 bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
            >
              {flightsOnDay.length}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {flightsOnDay.map((flight, index) => (
              <div key={index} className="text-sm">
                {flight.destination} ({flight.flightNumber}) - {format(flight.date, 'dd/MM/yyyy')}
              </div>
            ))}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card className="p-4 bg-gray-800/50 backdrop-blur-lg border-gray-700">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="text-white rounded-lg"
        components={{
          DayContent: ({ date }) => (
            <div className="relative w-full h-full flex items-center justify-center">
              <span>{date.getDate()}</span>
              {getDayContent(date)}
            </div>
          ),
        }}
      />
    </Card>
  );
};