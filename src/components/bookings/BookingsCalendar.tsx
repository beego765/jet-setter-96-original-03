import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

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
    
    return flightsOnDay.length > 0 ? (
      <Badge variant="secondary" className="absolute bottom-0 right-0">
        {flightsOnDay.length}
      </Badge>
    ) : null;
  };

  return (
    <Card className="p-4 bg-gray-800/50 backdrop-blur-lg border-gray-700">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="text-white"
        components={{
          DayContent: ({ date }) => (
            <div className="relative w-full h-full">
              <span>{date.getDate()}</span>
              {getDayContent(date)}
            </div>
          ),
        }}
      />
    </Card>
  );
};