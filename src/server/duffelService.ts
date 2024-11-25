import { supabase } from '@/integrations/supabase/client';

const SUPABASE_PROJECT_ID = 'yqzsdhoxnkjgmdjxbyos';
const DUFFEL_PROXY = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/duffel-proxy`;

export const searchAirports = async (query: string) => {
  try {
    if (!query || query.length < 2) return [];

    const { data, error } = await supabase.functions.invoke('duffel-proxy', {
      body: { path: '/air/airports', query: { query, limit: 10 } }
    });

    if (error) {
      console.error('Error calling duffel-proxy function:', error);
      throw error;
    }
    
    return data?.data || [];
  } catch (error) {
    console.error('Error searching airports:', error);
    return [];
  }
};

export const searchFlights = async (params: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('duffel-proxy', {
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
              ...(params.returnDate
                ? [
                    {
                      origin: params.destination,
                      destination: params.origin,
                      departure_date: params.returnDate,
                    },
                  ]
                : []),
            ],
            passengers: Array(params.passengers).fill({
              type: 'adult',
            }),
            cabin_class: params.cabinClass.toLowerCase(),
          },
        }
      }
    });

    if (error) {
      console.error('Error calling duffel-proxy function:', error);
      throw error;
    }

    return data?.data || [];
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
};

export const createBooking = async (offerId: string, passengers: any[]) => {
  try {
    const { data, error } = await supabase.functions.invoke('duffel-proxy', {
      body: {
        path: '/air/orders',
        method: 'POST',
        body: {
          data: {
            type: 'instant',
            selected_offers: [offerId],
            passengers: passengers.map(passenger => ({
              type: 'adult',
              title: passenger.title,
              gender: passenger.gender,
              given_name: passenger.firstName,
              family_name: passenger.lastName,
              email: passenger.email,
              phone_number: passenger.phone,
              born_on: passenger.dateOfBirth
            }))
          }
        }
      }
    });

    if (error) {
      console.error('Error calling duffel-proxy function:', error);
      throw error;
    }

    return data?.data || null;
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
};