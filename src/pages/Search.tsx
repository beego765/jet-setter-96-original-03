import { useLocation } from 'react-router-dom';
import { useFlightSearch } from '@/components/flight-search/FlightSearchService';
import { FlightCard } from '@/components/flight-search/FlightCard';
import { SearchFilters } from '@/components/flight-search/SearchFilters';
import { Card } from '@/components/ui/card';

const Search = () => {
  const location = useLocation();
  const searchParams = location.state;

  const { data: flights, isLoading, error } = useFlightSearch(searchParams);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading flights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">Error loading flights</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 p-4">
          <SearchFilters
            filters={{
              priceRange: [0, 5000],
              stops: [],
              airlines: [],
              departureTime: [],
              arrivalTime: [],
            }}
            onFilterChange={() => {}}
            minPrice={0}
            maxPrice={5000}
            availableAirlines={[]}
          />
        </Card>
        
        <div className="lg:col-span-3 space-y-4">
          {flights?.map((flight: any) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
          
          {flights?.length === 0 && (
            <div className="text-center p-6">
              No flights found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;