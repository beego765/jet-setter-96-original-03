import { supabase } from '@/integrations/supabase/client';

interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: string;
}

export const searchFlights = async (params: SearchParams) => {
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
              ...(params.returnDate ? [{
                origin: params.destination,
                destination: params.origin,
                departure_date: params.returnDate,
              }] : []),
            ],
            passengers: Array(params.passengers).fill({
              type: 'adult',
            }),
            cabin_class: params.cabinClass?.toLowerCase(),
          }
        }
      }
    });

    if (error) throw error;
    return data?.offers || [];
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
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
              ...passenger
            }))
          }
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};