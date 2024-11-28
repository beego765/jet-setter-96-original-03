import { supabase } from '@/integrations/supabase/client';

interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: Passengers;
  cabinClass: string;
}

export const searchFlights = async (params: SearchParams) => {
  try {
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
            passengers: mappedPassengers,
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
              given_name: passenger.firstName,
              family_name: passenger.lastName,
              born_on: passenger.dateOfBirth,
              ...(passenger.passportNumber && {
                documents: [{
                  type: 'passport',
                  number: passenger.passportNumber
                }]
              })
            }))
          }
        }
      }
    });

    if (error) throw error;
    
    // Save booking to Supabase
    const { user } = await supabase.auth.getUser();
    if (user) {
      const bookingData = {
        user_id: user.id,
        booking_reference: data.booking_reference,
        status: 'confirmed',
        // Add other relevant booking data
      };
      
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (bookingError) throw bookingError;
    }

    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};