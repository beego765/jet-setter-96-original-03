import { useState } from "react";
import { SearchForm, type SearchFormData } from "@/components/flight-search/SearchForm";
import { FlightCard, type Flight } from "@/components/flight-search/FlightCard";
import { useToast } from "@/components/ui/use-toast";
import { Plane } from "lucide-react";

const mockFlights: Flight[] = [
  {
    id: "1",
    airline: "SkyWings",
    flightNumber: "SW123",
    departureTime: "08:00",
    arrivalTime: "10:30",
    duration: "2h 30m",
    price: 299,
    origin: "LAX",
    destination: "SFO",
  },
  {
    id: "2",
    airline: "AirGlobe",
    flightNumber: "AG456",
    departureTime: "10:15",
    arrivalTime: "12:45",
    duration: "2h 30m",
    price: 329,
    origin: "LAX",
    destination: "SFO",
  },
  {
    id: "3",
    airline: "CloudLines",
    flightNumber: "CL789",
    departureTime: "14:30",
    arrivalTime: "17:00",
    duration: "2h 30m",
    price: 279,
    origin: "LAX",
    destination: "SFO",
  },
];

const Index = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (data: SearchFormData) => {
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFlights(mockFlights);
    setIsSearching(false);
    
    toast({
      title: "Flights found!",
      description: `Found ${mockFlights.length} flights matching your criteria.`,
    });
  };

  const handleSelectFlight = (flight: Flight) => {
    toast({
      title: "Flight selected!",
      description: `You selected ${flight.airline} flight ${flight.flightNumber}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <Plane className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Find Your Perfect Flight
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Search through thousands of flights to find the best deals. Book with confidence and take off to your next adventure.
          </p>
        </div>

        <SearchForm onSearch={handleSearch} />

        {isSearching ? (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-40 bg-gray-800/50 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : flights.length > 0 ? (
          <div className="mt-8 space-y-4">
            {flights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onSelect={handleSelectFlight}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Index;