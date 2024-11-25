import { useState } from "react";
import { SearchForm, type SearchFormData } from "@/components/flight-search/SearchForm";
import { FlightCard, type Flight } from "@/components/flight-search/FlightCard";
import { useToast } from "@/components/ui/use-toast";

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
    // Simulate API call
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
    <div className="min-h-screen bg-gradient-to-b from-flight-surface to-white">
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-flight-primary mb-4">Find Your Perfect Flight</h1>
          <p className="text-flight-secondary">Search through thousands of flights to find the best deals</p>
        </div>

        <SearchForm onSearch={handleSearch} />

        {isSearching ? (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-white/50 animate-pulse rounded-2xl"></div>
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