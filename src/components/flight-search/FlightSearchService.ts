import { useQuery, useMutation } from '@tanstack/react-query';
import { searchAirports, getAirportByCode } from '@/services/airport/airportService';
import { searchFlights, createBooking } from '@/services/flight/flightService';
import type { FlightSearchParams, CreateBookingParams } from '@/services/flight/types';

export const useAirportSearch = (query: string) => {
  return useQuery({
    queryKey: ['airports', query],
    queryFn: () => searchAirports(query),
    enabled: query.length > 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFlightSearch = (searchParams?: FlightSearchParams) => {
  return useQuery({
    queryKey: ['flights', searchParams],
    queryFn: () => {
      if (!searchParams) {
        throw new Error('Search parameters are required');
      }
      return searchFlights(searchParams);
    },
    enabled: !!searchParams,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (params: CreateBookingParams) => createBooking(params)
  });
};

// Utility function to get airport by code
export { getAirportByCode };