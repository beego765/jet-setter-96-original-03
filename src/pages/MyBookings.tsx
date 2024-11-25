import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, MapPin } from "lucide-react";

const MyBookings = () => {
  const bookings = [
    {
      id: 1,
      flightNumber: "FL123",
      from: "New York",
      to: "London",
      date: "2024-04-15",
      status: "Upcoming",
    },
    {
      id: 2,
      flightNumber: "FL456",
      from: "Paris",
      to: "Tokyo",
      date: "2024-05-20",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            My Bookings
          </h1>
          <p className="text-gray-300">Manage your flight bookings</p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Plane className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">Flight {booking.flightNumber}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === "Upcoming" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>From</span>
                      </div>
                      <p className="text-lg font-semibold">{booking.from}</p>
                    </div>
                    <Plane className="w-5 h-5 text-gray-400 rotate-90" />
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>To</span>
                      </div>
                      <p className="text-lg font-semibold">{booking.to}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{booking.date}</span>
                  </div>
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-700">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;