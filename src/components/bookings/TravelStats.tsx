import { Card } from "@/components/ui/card";
import { Plane, MapPin, Calendar } from "lucide-react";

interface TravelStatsProps {
  totalMiles: number;
  visitedDestinations: number;
  totalBookings: number;
}

export const TravelStats = ({ totalMiles, visitedDestinations, totalBookings }: TravelStatsProps) => (
  <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg border-gray-700 p-6 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/20 rounded-full">
          <Plane className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Total Miles Flown</p>
          <p className="text-2xl font-bold text-white">{totalMiles.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-500/20 rounded-full">
          <MapPin className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Destinations</p>
          <p className="text-2xl font-bold text-white">{visitedDestinations}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="p-3 bg-green-500/20 rounded-full">
          <Calendar className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Total Bookings</p>
          <p className="text-2xl font-bold text-white">{totalBookings}</p>
        </div>
      </div>
    </div>
  </Card>
);