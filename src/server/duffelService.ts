import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

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
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data: duffelData, error: duffelError } = await supabase.functions.invoke('duffel-proxy', {
      body: {
        path: '/air/orders',
        method: 'POST',
        body: {
          data: {
            type: 'instant',
            selected_offers: [offerId],
            passengers: passengers.map(passenger => ({
              id: passenger.id,
              title: passenger.title,
              gender: passenger.gender,
              given_name: passenger.firstName,
              family_name: passenger.lastName,
              born_on: passenger.dateOfBirth,
              email: passenger.email,
              phone_number: passenger.phoneNumber,
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

    if (duffelError) throw duffelError;
    
    // Save booking to Supabase
    const bookingData: Database['public']['Tables']['bookings']['Insert'] = {
      user_id: userData.user.id,
      booking_reference: duffelData.booking_reference,
      status: 'confirmed',
      origin: duffelData.slices[0].origin.iata_code,
      destination: duffelData.slices[0].destination.iata_code,
      departure_date: duffelData.slices[0].departing_at.split('T')[0],
      return_date: duffelData.slices[1]?.departing_at.split('T')[0] || null,
      passengers: passengers.length,
      cabin_class: duffelData.cabin_class,
      total_price: parseFloat(duffelData.total_amount),
      duffel_booking_id: duffelData.id,
      duffel_offer_id: offerId
    };
      
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData);

    if (bookingError) throw bookingError;

    return duffelData;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('duffel_booking_id')
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;

    const { data: duffelData, error: duffelError } = await supabase.functions.invoke('duffel-proxy', {
      body: {
        path: `/air/orders/${bookingData.duffel_booking_id}/actions/cancel`,
        method: 'POST'
      }
    });

    if (duffelError) throw duffelError;

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    return duffelData;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

export const getBookingServices = async (bookingId: string) => {
  try {
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('duffel_booking_id')
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;

    const { data, error } = await supabase.functions.invoke('duffel-proxy', {
      body: {
        path: `/air/orders/${bookingData.duffel_booking_id}/services`,
        method: 'GET'
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching booking services:', error);
    throw error;
  }
};