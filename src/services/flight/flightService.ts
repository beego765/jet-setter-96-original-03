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

    logDebug('Flight Search', 'Duffel API Offer Request Response:', response);

    if (!response?.data?.id) {
      console.error('Invalid offer request response:', response);
      throw new Error('Failed to create offer request');
    }

    const { data: offersResponse, error: offersError } = await supabase.functions.invoke('duffel-proxy', {
      body: {
        path: `/air/offers?offer_request_id=${response.data.id}`,
        method: 'GET'
      }
    });

    if (offersError) {
      console.error('Offers fetch error:', offersError);
      throw offersError;
    }

    logDebug('Flight Search', 'Duffel API Offers Response:', {
      status: offersResponse?.status,
      offerCount: offersResponse?.data?.offers?.length || 0,
      meta: offersResponse?.meta
    });

    if (!offersResponse?.data?.offers) {
      console.error('Invalid offers response structure:', offersResponse);
      throw new Error('Invalid response format from flight search service');
    }

    const mappedOffers = offersResponse.data.offers.map(mapDuffelOfferToFlight);

    logDebug('Flight Search', 'Mapped offers count:', mappedOffers.length);

    if (mappedOffers.length === 0) {
      console.warn('No flights found for search params:', params);
      throw new Error('No flights found for the specified route and dates');
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