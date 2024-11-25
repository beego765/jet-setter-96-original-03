import { searchFlights, createBooking, searchAirports } from '../../server/duffelService';
import { useQuery } from '@tanstack/react-query';

export const useAirportSearch = (query: string) => {
  return useQuery({
    queryKey: ['airports', query],
    queryFn: () => searchAirports(query),
    enabled: query.length > 2,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const useFlightSearch = (searchParams: any) => {
  return useQuery({
    queryKey: ['flights', searchParams],
    queryFn: () => searchFlights(searchParams),
    enabled: !!searchParams,
    retry: false,
  });
};

export const useCreateBooking = (offerId: string, passengers: any[]) => {
  return useQuery({
    queryKey: ['booking', offerId],
    queryFn: () => createBooking(offerId, passengers),
    enabled: false,
    retry: false,
  });
};