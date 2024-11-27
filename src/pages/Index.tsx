import { useState } from "react";
import { SearchForm, type SearchFormData } from "@/components/flight-search/SearchForm";
import { FlightCard, type Flight } from "@/components/flight-search/FlightCard";
import { useToast } from "@/components/ui/use-toast";
import { Plane, MapPin, Clock, CreditCard } from "lucide-react";
import { searchFlights } from "@/server/duffelService";

const Index = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (data: SearchFormData) => {
    setIsSearching(true);
    try {
      const results = await searchFlights({
        origin: data.origin,
        destination: data.destination,
        departureDate: data.departureDate.toISOString().split('T')[0],
        returnDate: data.returnDate?.toISOString().split('T')[0],
        passengers: {
          adults: data.passengers.adults,
          children: data.passengers.children,
          infants: data.passengers.infants,
        },
        cabinClass: data.class,
      });

      // Transform Duffel offers to our Flight type
      const transformedFlights = results.map((offer: any) => ({
        id: offer.id,
        airline: offer.owner.name,
        flightNumber: offer.slices[0].segments[0].operating_carrier_flight_number,
        departureTime: new Date(offer.slices[0].segments[0].departing_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        arrivalTime: new Date(offer.slices[0].segments[0].arriving_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        duration: `${Math.floor(offer.slices[0].duration / 60)}h ${offer.slices[0].duration % 60}m`,
        price: parseFloat(offer.total_amount),
        origin: offer.slices[0].origin.iata_code,
        destination: offer.slices[0].destination.iata_code,
      }));

      setFlights(transformedFlights);
      toast({
        title: "Flights found!",
        description: `Found ${transformedFlights.length} flights matching your criteria.`,
      });
    } catch (error) {
      console.error('Error fetching flights:', error);
      toast({
        title: "Error",
        description: "Failed to fetch flights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectFlight = (flight: Flight) => {
    toast({
      title: "Flight selected!",
      description: `You selected ${flight.airline} flight ${flight.flightNumber}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 space-y-4 animate-fadeIn">
          <div className="relative h-64 md:h-96 mb-8 rounded-2xl overflow-hidden">
            <img
              src="/otl1.png"
              alt="Scenic travel destination"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  Find Your Perfect Flight
                </h1>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Search through thousands of flights to find the best deals. Book with confidence and take off to your next adventure.
                </p>
              </div>
            </div>
          </div>
        </div>

        <SearchForm onSearch={handleSearch} />

        {!isSearching && !flights.length && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
              <div className="p-3 bg-blue-500/20 rounded-lg w-fit mb-4">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Destinations</h3>
              <p className="text-gray-400">Explore hundreds of destinations worldwide with our extensive network of partners.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
              <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-400">Our dedicated support team is available around the clock to assist you.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
              <div className="p-3 bg-green-500/20 rounded-lg w-fit mb-4">
                <CreditCard className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-400">Book with confidence using our secure payment system and get instant confirmation.</p>
            </div>
          </div>
        )}

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
