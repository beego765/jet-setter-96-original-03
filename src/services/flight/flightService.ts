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
    console.debug('Flight Search Parameters:', JSON.stringify(params, null, 2));

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

    // Format the departure date, ensuring it's in YYYY-MM-DD format
    const formattedDepartureDate = typeof params.departureDate === 'string' 
      ? params.departureDate 
      : new Date(params.departureDate).toISOString().split('T')[0];

    console.debug('Formatted departure date:', formattedDepartureDate);

    // Ensure cabin class is properly formatted
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

    console.debug('Duffel API Request:', JSON.stringify(requestBody, null, 2));

    // Create an offer request first
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

    console.debug('Duffel API Offer Request Response:', JSON.stringify(response, null, 2));

    if (!response?.data?.id) {
      console.error('Invalid offer request response:', response);
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
      console.error('Offers fetch error:', offersError);
      throw offersError;
    }

    console.debug('Duffel API Offers Response:', {
      status: offersResponse?.status,
      offerCount: offersResponse?.data?.length || 0,
      offers: offersResponse?.data?.offers || [],
      meta: offersResponse?.meta,
      error: offersResponse?.error
    });

    // Validate the offers response structure
    if (!offersResponse?.data?.offers) {
      console.error('Invalid offers response structure:', offersResponse);
      throw new Error('Invalid response format from flight search service');
    }

    // Map the offers to a more friendly format
    const mappedOffers = offersResponse.data.offers.map(offer => ({
      id: offer.id,
      airline: offer.owner.name,
      airlineLogoUrl: offer.owner.logo_symbol_url,
      airlineCode: offer.owner.iata_code,
      flightNumber: offer.slices[0].segments[0].operating_carrier_flight_number,
      departureTime: new Date(offer.slices[0].segments[0].departing_at).toLocaleTimeString(),
      arrivalTime: new Date(offer.slices[0].segments[offer.slices[0].segments.length - 1].arriving_at).toLocaleTimeString(),
      duration: offer.slices[0].duration,
      price: offer.total_amount,
      origin: offer.slices[0].origin.iata_code,
      destination: offer.slices[0].destination.iata_code,
      aircraft: offer.slices[0].segments[0].aircraft.name,
      cabinClass: offer.passenger_identity_documents_required ? 'First/Business' : 'Economy',
      operatingCarrier: offer.slices[0].segments[0].operating_carrier.name,
      departureDate: offer.slices[0].segments[0].departing_at,
      segments: offer.slices[0].segments.map(segment => ({
        origin: segment.origin.iata_code,
        destination: segment.destination.iata_code,
        departureTime: new Date(segment.departing_at).toLocaleTimeString(),
        arrivalTime: new Date(segment.arriving_at).toLocaleTimeString(),
        duration: segment.duration
      })),
      services: {
        seatSelection: offer.passenger_identity_documents_required,
        meals: offer.slices[0].segments.map(s => s.meal_service || []).flat(),
        baggage: {
          included: offer.passengers[0].baggages && offer.passengers[0].baggages.length > 0,
          details: `${offer.passengers[0].baggages?.[0]?.quantity || 0} bags included`
        },
        refund: {
          allowed: offer.conditions?.refund_before_departure?.allowed || false,
          penalty: offer.conditions?.refund_before_departure?.penalty_amount
        },
        changes: {
          allowed: offer.conditions?.change_before_departure?.allowed || false,
          penalty: offer.conditions?.change_before_departure?.penalty_amount
        }
      },
      carbonEmissions: offer.total_emissions_kg ? {
        amount: parseInt(offer.total_emissions_kg),
        unit: 'kg CO2e'
      } : undefined
    }));

    console.debug('Mapped offers:', mappedOffers);

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