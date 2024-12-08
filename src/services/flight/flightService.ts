import { supabase } from '@/integrations/supabase/client';
import { FlightSearchParams, CreateBookingParams } from './types';
import { logError, logDebug } from './utils/logger';
import { mapDuffelOfferToFlight } from './utils/duffelMapper';
import type { DuffelApiResponse } from './types/duffel';

export const searchFlights = async (params: FlightSearchParams) => {
  try {
    logDebug('Flight Search', 'Search Parameters:', params);

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

    const formattedDepartureDate = typeof params.departureDate === 'string' 
      ? params.departureDate 
      : new Date(params.departureDate).toISOString().split('T')[0];

    logDebug('Flight Search', 'Formatted departure date:', formattedDepartureDate);

    const cabinClass = params.cabinClass ? params.cabinClass.toLowerCase() : 'economy';

    const requestBody = {
      data: {
        slices: [
          {
            origin: params.origin,
            destination: params.destination,
            departure_date: formattedDepartureDate,
          },
          ...(params.returnDate ? [{
            origin: params.destination,
            destination: params.origin,
            departure_date: typeof params.returnDate === 'string'
              ? params.returnDate
              : new Date(params.returnDate).toISOString().split('T')[0],
          }] : []),
        ],
        passengers: mappedPassengers,
        cabin_class: cabinClass
      }
    };

    logDebug('Flight Search', 'Duffel API Request:', requestBody);

    const { data: response, error } = await supabase.functions.invoke('duffel-proxy', {
      body: {
        path: '/air/offer_requests',
        method: 'POST',
        body: requestBody
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error('Failed to connect to flight search service');
    }

    logDebug('Flight Search', 'Duffel API Response:', response);

    // Check if response has the expected structure
    if (!response?.data || !Array.isArray(response.data)) {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid response format from flight search service');
    }

    const offers = response.data;
    const mappedOffers = offers.map(mapDuffelOfferToFlight);

    logDebug('Flight Search', 'Mapped offers count:', mappedOffers.length);

    if (mappedOffers.length === 0) {
      console.warn('No flights found for search params:', params);
      return [];
    }

    return mappedOffers;
  } catch (error) {
    logError('Flight Search', error, { params });
    throw error;
  }
};

export const createBooking = async ({ offerId, passengers }: CreateBookingParams) => {
  try {
    logDebug('Create Booking', 'Creating booking:', { 
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