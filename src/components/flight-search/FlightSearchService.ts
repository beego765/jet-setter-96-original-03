import { useQuery, UseQueryOptions } from '@tanstack/react-query';
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

// Centralized error logging utility
const logError = (context: string, error: any, additionalInfo?: any) => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: error.stack,
    additionalInfo: additionalInfo || {}
  });
};

export const useAirportSearch = (query: string) => {
  const queryOptions: UseQueryOptions<Airport[], Error> = {
    queryKey: ['airports', query],
    queryFn: async () => {
      // Early return for short queries
      if (query.length < 2) return [];

      try {
        // Filter airports locally
        const filteredAirports = airportsData.filter(airport => 
          airport.iata_code.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase()) ||
          airport.city.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10); // Limit to 10 results

        // Log successful search results
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
    retry: 1, // Minimal retry
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  };

  return useQuery(queryOptions);
};

export const useFlightSearch = (searchParams?: FlightSearchParams) => {
  const queryOptions: UseQueryOptions<any, Error> = {
    queryKey: ['flights', searchParams],
    queryFn: async () => {
      // Validate input parameters
      if (!searchParams) {
        const error = new Error('Search parameters are required');
        logError('Flight Search', error);
        throw error;
      }

      // Validate required fields
      const requiredFields: (keyof FlightSearchParams)[] = [
        'origin', 'destination', 'departureDate', 
        'passengers', 'cabinClass'
      ];

      const missingFields = requiredFields.filter(field => 
        !searchParams[field]
      );

      if (missingFields.length > 0) {
        const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
        logError('Flight Search', error, { searchParams });
        throw error;
      }

      try {
        // Log search parameters for debugging
        console.debug('Flight Search Parameters:', searchParams);

        const results = await searchFlights(searchParams);

        // Log search results
        console.debug('Flight Search Results:', {
          totalOffers: results?.length || 0,
          firstOffer: results?.[0]
        });

        // Handle no results scenario
        if (!results || results.length === 0) {
          const error = new Error('No flights found matching your search criteria');
          logError('Flight Search', error, { searchParams });
          throw error;
        }

        return results;
      } catch (error) {
        logError('Flight Search', error, { searchParams });
        throw error;
      }
    },
    enabled: !!searchParams,
    retry: 1, // Minimal retry
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  };

  return useQuery(queryOptions);
};

export const useCreateBooking = (offerId: string, passengers: any[]) => {
  const queryOptions: UseQueryOptions<any, Error> = {
    queryKey: ['booking', offerId],
    queryFn: async () => {
      // Validate booking parameters
      if (!offerId) {
        const error = new Error('Offer ID is required for booking');
        logError('Create Booking', error);
        throw error;
      }

      if (!passengers || passengers.length === 0) {
        const error = new Error('At least one passenger is required');
        logError('Create Booking', error);
        throw error;
      }

      try {
        // Log booking attempt
        console.debug('Booking Attempt:', { 
          offerId, 
          passengerCount: passengers.length 
        });

        const bookingResult = await createBooking(offerId, passengers);

        // Log booking result
        console.debug('Booking Result:', bookingResult);

        if (!bookingResult) {
          const error = new Error('Booking creation failed');
          logError('Create Booking', error, { offerId, passengers });
          throw error;
        }

        return bookingResult;
      } catch (error) {
        logError('Create Booking', error, { offerId, passengers });
        throw error;
      }
    },
    enabled: false, // Manual trigger
    retry: 1,
  };

  return useQuery(queryOptions);
};

// Utility function to get airport by code
export const getAirportByCode = (iataCode: string): Airport | undefined => {
  return airportsData.find(
    airport => airport.iata_code.toLowerCase() === iataCode.toLowerCase()
  );
};
