import { useState } from "react";
import { SearchForm, type SearchFormData } from "@/components/flight-search/SearchForm";
import { FlightCard, type Flight } from "@/components/flight-search/FlightCard";
import { useToast } from "@/components/ui/use-toast";
import { Plane, MapPin, Clock, CreditCard, Shield, Award } from "lucide-react";
import { searchFlights } from "@/server/duffelService";
import { SearchFilters, type FilterValues } from "@/components/flight-search/SearchFilters";

const Index = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPassengers, setCurrentPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  
  const [filters, setFilters] = useState<FilterValues>({
    priceRange: [0, 10000],
    stops: [],
    airlines: [],
    departureTime: [],
    arrivalTime: [],
  });

  const { toast } = useToast();

  const handleSearch = async (data: SearchFormData) => {
    setIsSearching(true);
    setCurrentPassengers(data.passengers);
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

      if (!results || !Array.isArray(results)) {
        throw new Error('Invalid response format from API');
      }

      const transformedFlights = results.map((offer: any) => {
        if (!offer?.slices?.[0]?.segments?.[0]) {
          console.warn('Invalid offer structure:', offer);
          return null;
        }

        const segments = offer.slices[0].segments.map((segment: any, index: number, arr: any[]) => ({
          origin: segment.origin.iata_code,
          destination: segment.destination.iata_code,
          departureTime: new Date(segment.departing_at)
            .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          arrivalTime: new Date(segment.arriving_at)
            .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          duration: `${Math.floor(segment.duration / 60)}h ${segment.duration % 60}m`,
          layoverDuration: index < arr.length - 1 
            ? `${Math.floor((new Date(arr[index + 1].departing_at).getTime() - new Date(segment.arriving_at).getTime()) / (1000 * 60))}m`
            : undefined
        }));

        // Enhanced data transformation for services and conditions
        const services = {
          seatSelection: true, // Always available in our app
          meals: offer.slices[0].segments[0].meal_service || [],
          baggage: {
            included: offer.passengers?.[0]?.baggages?.length > 0,
            details: offer.passengers?.[0]?.baggages?.[0]?.quantity 
              ? `${offer.passengers[0].baggages[0].quantity} checked bags included` 
              : 'No checked bags included'
          },
          refund: {
            allowed: offer.conditions?.refund_before_departure?.allowed || false,
            penalty: offer.conditions?.refund_before_departure?.penalty_amount
          },
          changes: {
            allowed: offer.conditions?.change_before_departure?.allowed || false,
            penalty: offer.conditions?.change_before_departure?.penalty_amount
          }
        };

        const carbonEmissions = offer.slices[0].segments[0].carbon_emissions
          ? {
              amount: Math.round(offer.slices[0].segments[0].carbon_emissions.amount),
              unit: offer.slices[0].segments[0].carbon_emissions.unit
            }
          : undefined;

        return {
          id: offer.id,
          airline: offer.owner?.name || 'Unknown Airline',
          airlineLogoUrl: offer.owner?.logo_symbol_url || offer.owner?.logo_url,
          airlineCode: offer.owner?.iata_code,
          flightNumber: offer.slices[0].segments[0].operating_carrier_flight_number,
          departureTime: segments[0].departureTime,
          arrivalTime: segments[segments.length - 1].arrivalTime,
          duration: `${Math.floor(offer.slices[0].duration / 60)}h ${offer.slices[0].duration % 60}m`,
          price: parseFloat(offer.total_amount),
          origin: offer.slices[0].origin.iata_code,
          destination: offer.slices[0].destination.iata_code,
          aircraft: offer.slices[0].segments[0].aircraft?.name,
          services,
          carbonEmissions,
          cabinClass: offer.cabin_class?.replace('_', ' '),
          operatingCarrier: offer.slices[0].segments[0].operating_carrier?.name !== offer.owner?.name 
            ? offer.slices[0].segments[0].operating_carrier?.name 
            : undefined,
          departureDate: new Date(offer.slices[0].segments[0].departing_at).toISOString().split('T')[0],
          segments
        };
      }).filter(Boolean);

      setFlights(transformedFlights);
      applyFilters(transformedFlights, filters);
      
      if (transformedFlights.length === 0) {
        toast({
          title: "No flights found",
          description: "No flights available for your search criteria. Please try different dates or destinations.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Flights found!",
          description: `Found ${transformedFlights.length} flights matching your criteria.`,
        });
      }
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

  const applyFilters = (flightsToFilter: Flight[], currentFilters: FilterValues) => {
    const filtered = flightsToFilter.filter((flight) => {
      // Price filter
      if (flight.price < currentFilters.priceRange[0] || flight.price > currentFilters.priceRange[1]) {
        return false;
      }

      // Airline filter
      if (currentFilters.airlines.length > 0 && !currentFilters.airlines.includes(flight.airlineCode || '')) {
        return false;
      }

      // Stops filter
      const stopCount = (flight.segments?.length || 1) - 1;
      const stopFilter = currentFilters.stops.map(stop => stop === '2+' ? '2' : stop);
      if (currentFilters.stops.length > 0 && !stopFilter.includes(stopCount.toString())) {
        return false;
      }

      // Time filters
      const departureHour = parseInt(flight.departureTime.split(':')[0]);
      const arrivalHour = parseInt(flight.arrivalTime.split(':')[0]);

      const getTimeSlot = (hour: number) => {
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 24) return 'evening';
        return 'night';
      };

      if (currentFilters.departureTime.length > 0 && 
          !currentFilters.departureTime.includes(getTimeSlot(departureHour))) {
        return false;
      }

      if (currentFilters.arrivalTime.length > 0 && 
          !currentFilters.arrivalTime.includes(getTimeSlot(arrivalHour))) {
        return false;
      }

      return true;
    });

    setFilteredFlights(filtered);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    applyFilters(flights, newFilters);
  };

  const getAvailableAirlines = () => {
    const airlines = new Set<string>();
    flights.forEach(flight => {
      if (flight.airlineCode && flight.airline) {
        airlines.add(JSON.stringify({ code: flight.airlineCode, name: flight.airline }));
      }
    });
    return Array.from(airlines).map(airline => JSON.parse(airline));
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
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
              <div className="p-3 bg-amber-500/20 rounded-lg w-fit mb-4">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ATOL Protected</h3>
              <p className="text-gray-400">Your holiday is protected under the ATOL scheme, ensuring complete financial security.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
              <div className="p-3 bg-indigo-500/20 rounded-lg w-fit mb-4">
                <Award className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">IATA Accredited</h3>
              <p className="text-gray-400">We're an IATA accredited travel provider, meeting international standards for airline ticket sales.</p>
            </div>
          </div>
        )}

        {flights.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                minPrice={Math.min(...flights.map(f => f.price))}
                maxPrice={Math.max(...flights.map(f => f.price))}
                availableAirlines={getAvailableAirlines()}
              />
            </div>
            <div className="lg:col-span-3 space-y-4">
              {isSearching ? (
                [1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="h-40 bg-gray-800/50 animate-pulse rounded-2xl"
                  />
                ))
              ) : (
                filteredFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onSelect={handleSelectFlight}
                    passengers={currentPassengers}
                  />
                ))
              )}
              {!isSearching && filteredFlights.length === 0 && (
                <div className="text-center py-8 bg-gray-800/50 rounded-xl">
                  <p className="text-gray-400">No flights match your filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;