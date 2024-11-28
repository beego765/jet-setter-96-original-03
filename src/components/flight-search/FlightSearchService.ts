import { useQuery, useMutation } from '@tanstack/react-query';
import airportsData from '../../../airports.json';
import { searchFlights, createBooking } from '../../server/duffelService';

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
        const results = await searchFlights(searchParams);

        if (!results || results.length === 0) {
          throw new Error('No flights found matching your search criteria');
        }

        return results;
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

        const bookingResult = await createBooking(offerId, passengers);

        if (!bookingResult) {
          throw new Error('Booking creation failed');
        }

        return bookingResult;
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