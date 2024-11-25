import { supabase } from '@/integrations/supabase/client';

export const searchAirports = async (query: string) => {
  try {
    if (!query || query.length < 2) return [];

    const { data, error } = await supabase.functions.invoke('duffel-proxy', {
      body: { 
        path: '/places', 
        query: { query },
        method: 'GET'
      }
    });

    if (error) throw error;
    return data?.data || [];
  } catch (error) {
    console.error('Error searching airports:', error);
    throw error;
  }
};

export const searchFlights = async (params: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('duffel-proxy', {
      body: {
        path: '/offers/requests',
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
            cabin_class: params.cabinClass?.toLowerCase(),
          },
        }
      }
    });

    if (error) throw error;
    return data?.data || [];
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

export const createBooking = async (offerId: string, passengers: any[]) => {
  try {
    const { data, error } = await supabase.functions.invoke('duffel-proxy', {
      body: {
        path: '/orders',
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

    if (error) throw error;
    return data?.data || null;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};