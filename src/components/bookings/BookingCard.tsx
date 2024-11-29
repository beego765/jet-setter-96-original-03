import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, MapPin } from "lucide-react";

interface BookingCardProps {
  booking: {
    id: number;
    flightNumber: string;
    from: string;
    to: string;
    date: string;
    status: string;
  };
}

export const BookingCard = ({ booking }: BookingCardProps) => (
  <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-4">
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/20 rounded-lg">
            <Plane className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-300">{booking.flightNumber}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          booking.status === "Upcoming" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
        }`}>
          {booking.status}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5">
            <MapPin className="w-3 h-3" />
            <span>From</span>
          </div>
          <p className="text-sm font-medium">{booking.from}</p>
        </div>
        <Plane className="w-4 h-4 text-gray-400 rotate-90" />
        <div>
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5">
            <MapPin className="w-3 h-3" />
            <span>To</span>
          </div>
          <p className="text-sm font-medium">{booking.to}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{booking.date}</span>
        </div>
        <Button variant="outline" size="sm" className="text-xs h-7 border-gray-700 hover:bg-gray-700">
          View
        </Button>
      </div>
    </div>
  </Card>
);