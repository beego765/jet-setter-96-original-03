import { supabase } from '@/integrations/supabase/client';
import { SearchParams } from './types/duffel';
import { handleDuffelApiResponse, DuffelApiException } from './utils/errorHandling';

export const searchFlights = async (params: SearchParams) => {
  try {
    console.log('Searching flights with params:', params);
    
    // Map passengers to Duffel's expected format
    const mappedPassengers = [];
    
    // Add adult passengers
    for (let i = 0; i < params.passengers.adults; i++) {
      mappedPassengers.push({ type: 'adult' });
    }
    
    // Add child passengers (age 2-11)
    for (let i = 0; i < params.passengers.children; i++) {
      mappedPassengers.push({ type: 'child' });
    }
    
    // Add infant passengers (under 2)
    for (let i = 0; i < params.passengers.infants; i++) {
      mappedPassengers.push({ type: 'infant_without_seat' });
    }

    // Construct the request body according to Duffel API specifications
    const requestBody = {
      data: {
        slices: [
          {
            origin: params.origin,
            destination: params.destination,
            departure_date: params.departureDate,
          },
          ...(params.returnDate ? [{
            origin: params.destination,
            destination: params.origin,
            departure_date: params.returnDate,
          }] : []),
        ],
        passengers: mappedPassengers,
        cabin_class: params.cabinClass?.toLowerCase(),
      }
    };

    console.log('Duffel API request body:', requestBody);

    const { data: response, error } = await supabase.functions.invoke('duffel-proxy', {
      body: {
        path: '/air/offer_requests',
        method: 'POST',
        body: requestBody
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new DuffelApiException('Failed to connect to Duffel API');
    }

    console.log('Raw Duffel API response:', response);

    // Check for API errors first
    if (response.errors && response.errors.length > 0) {
      const apiError = response.errors[0];
      throw new DuffelApiException(
        `Duffel API Error: ${apiError.message || 'Unknown error'}`,
        response.errors,
        response.meta?.status
      );
    }

    // Validate response structure
    if (!response?.data?.offers || !Array.isArray(response.data.offers)) {
      console.error('Invalid response structure:', response);
      throw new DuffelApiException('Invalid response format from Duffel API');
    }

    // If we have no offers but the response was valid, return an empty array
    if (response.data.offers.length === 0) {
      console.log('No flight offers found for the given criteria');
      return [];
    }

    return response.data.offers;
  } catch (error) {
    console.error('Error searching flights:', error);
    if (error instanceof DuffelApiException) {
      throw error;
    }
    throw new DuffelApiException('Failed to search flights');
  }
};

export { createBooking, cancelBooking, getBookingServices } from './services/bookingService';