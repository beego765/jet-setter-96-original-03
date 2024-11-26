import { searchFlights, createBooking } from '../../server/duffelService';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAirportSearch = (query: string) => {
  return useQuery({
    queryKey: ['airports', query],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('airports')
        .select('*')
        .or(`iata_code.ilike.%${query}%,name.ilike.%${query}%,city.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      return data;
    },
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