import { supabase } from '@/integrations/supabase/client';
import { FlightSearchParams, CreateBookingParams } from './types';

const logError = (context: string, error: any, additionalInfo?: any) => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: error.stack,
    additionalInfo: additionalInfo || {}
  });
};

export const searchFlights = async (params: FlightSearchParams) => {
  try {
    console.debug('Flight Search Parameters:', params);

    const mappedPassengers = [];
    for (let i = 0; i < params.passengers.adults; i++) {
      mappedPassengers.push({ type: 'adult' });
    }
    for (let i = 0; i < params.passengers.children; i++) {
      mappedPassengers.push({ type: 'child' });
    }
    for (let i = 0; i < params.passengers.infants; i++) {
      mappedPassengers.push({ type: 'infant_without_seat' });
    }

    // Create an offer request first
    const { data: response, error } = await supabase.functions.invoke('duffel-proxy', {
      body: {
        path: '/air/offer_requests',
        method: 'POST',
        body: {
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
            cabin_class: params.cabinClass.toLowerCase()
          }
        }
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error('Failed to connect to flight search service');
    }

    if (!response?.data?.id) {
      throw new Error('Failed to create offer request');
    }

    // Get the offers using the offer request ID
    const { data: offersResponse, error: offersError } = await supabase.functions.invoke('duffel-proxy', {
      body: {
        path: `/air/offers?offer_request_id=${response.data.id}`,
        method: 'GET'
      }
    });

    if (offersError) {
      throw offersError;
    }

    console.debug('Flight Search Response:', {
      status: offersResponse?.status,
      offerCount: offersResponse?.data?.offers?.length || 0
    });

    if (!offersResponse?.data?.offers) {
      throw new Error('No flights found');
    }

    return offersResponse.data.offers;
  } catch (error) {
    logError('Flight Search', error, { params });
    throw error;
  }
};

export const createBooking = async ({ offerId, passengers }: CreateBookingParams) => {
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
};