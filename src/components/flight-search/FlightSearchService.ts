import { useQuery, useMutation } from '@tanstack/react-query';
import airportsData from '../../../airports.json';
import { supabase } from '@/integrations/supabase/client';

// Enhanced type definitions
interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: 'economy' | 'business' | 'first';
}

interface Airport {
  iata_code: string;
  name: string;
  city: string;
  country: string;
  _geoloc?: {
    lat: number;
    lng: number;
  };
}

interface CreateBookingParams {
  offerId: string;
  passengers: any[];
}

// Centralized error logging utility
const logError = (context: string, error: any, additionalInfo?: any) => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: error.stack,
    additionalInfo: additionalInfo || {}
  });
};

export const useAirportSearch = (query: string) => {
  const queryOptions = {
    queryKey: ['airports', query],
    queryFn: async () => {
      if (query.length < 2) return [];

      try {
        const filteredAirports = airportsData.filter(airport => 
          airport.iata_code.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase()) ||
          airport.city.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);

        console.debug('Airport Search Results:', {
          query,
          resultsCount: filteredAirports.length,
          firstResult: filteredAirports[0]
        });

        return filteredAirports;
      } catch (error) {
        logError('Airport Search', error, { query });
        throw error;
      }
    },
    enabled: query.length > 1,
    staleTime: 1000 * 60 * 5,
  };

  return useQuery(queryOptions);
};

export const useFlightSearch = (searchParams?: FlightSearchParams) => {
  const queryOptions = {
    queryKey: ['flights', searchParams],
    queryFn: async () => {
      if (!searchParams) {
        throw new Error('Search parameters are required');
      }

      const requiredFields: (keyof FlightSearchParams)[] = [
        'origin', 'destination', 'departureDate', 
        'passengers', 'cabinClass'
      ];

      const missingFields = requiredFields.filter(field => 
        !searchParams[field]
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      try {
        console.debug('Flight Search Parameters:', searchParams);

        // Map passengers to Duffel's format
        const mappedPassengers = [];
        for (let i = 0; i < searchParams.passengers.adults; i++) {
          mappedPassengers.push({ type: 'adult' });
        }
        for (let i = 0; i < searchParams.passengers.children; i++) {
          mappedPassengers.push({ type: 'child' });
        }
        for (let i = 0; i < searchParams.passengers.infants; i++) {
          mappedPassengers.push({ type: 'infant_without_seat' });
        }

        const requestBody = {
          slices: [
            {
              origin: searchParams.origin,
              destination: searchParams.destination,
              departure_date: searchParams.departureDate,
            },
            ...(searchParams.returnDate ? [{
              origin: searchParams.destination,
              destination: searchParams.origin,
              departure_date: searchParams.returnDate,
            }] : []),
          ],
          passengers: mappedPassengers,
          cabin_class: searchParams.cabinClass.toLowerCase(),
        };

        console.debug('Duffel API Request:', requestBody);

        const { data: response, error } = await supabase.functions.invoke('duffel-proxy', {
          body: {
            path: '/air/offers',
            method: 'GET',
            body: requestBody
          }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error('Failed to connect to flight search service');
        }

        console.debug('Flight Search Response:', {
          status: response?.status,
          offerCount: response?.data?.length || 0
        });

        if (!response?.data?.offers || !Array.isArray(response.data.offers)) {
          throw new Error('Invalid response format from flight search service');
        }

        return response.data.offers;
      } catch (error) {
        logError('Flight Search', error, { searchParams });
        throw error;
      }
    },
    enabled: !!searchParams,
    staleTime: 1000 * 60 * 5,
  };

  return useQuery(queryOptions);
};

export const useCreateBooking = (offerId: string) => {
  return useMutation({
    mutationFn: async ({ passengers }: CreateBookingParams) => {
      if (!offerId) {
        throw new Error('Offer ID is required for booking');
      }

      if (!passengers || passengers.length === 0) {
        throw new Error('At least one passenger is required');
      }

      try {
        console.debug('Creating Booking:', { 
          offerId, 
          passengerCount: passengers.length 
        });

        const { data: response, error } = await supabase.functions.invoke('duffel-proxy', {
          body: {
            path: '/air/orders',
            method: 'POST',
            body: {
              data: {
                offer_id: offerId,
                passengers
              }
            }
          }
        });

        if (error) {
          throw error;
        }

        if (!response?.data) {
          throw new Error('Booking creation failed');
        }

        return response.data;
      } catch (error) {
        logError('Create Booking', error, { offerId, passengers });
        throw error;
      }
    }
  });
};

// Utility function to get airport by code
export const getAirportByCode = (iataCode: string): Airport | undefined => {
  return airportsData.find(
    airport => airport.iata_code.toLowerCase() === iataCode.toLowerCase()
  );
};