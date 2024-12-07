import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const createDuffelBooking = async (flight: any) => {
  console.log('Creating Duffel booking for offer:', flight);

  const { data: duffelOrder, error: duffelError } = await supabase.functions.invoke('duffel-proxy', {
    body: {
      path: '/air/orders',
      method: 'POST',
      body: {
        data: {
          type: 'instant',
          selected_offers: [flight.id],
          payments: [{
            type: 'balance',
            currency: 'GBP',
            amount: flight.price.toString()
          }],
          passengers: [{
            id: `pas_${Math.random().toString(36).substring(2, 15)}`,
            type: 'adult',
            title: 'mr',
            gender: 'm',
            given_name: 'Temporary',
            family_name: 'Passenger',
            email: 'temp@example.com',
            phone_number: '+447700900000',
            born_on: '1990-01-01'
          }]
        }
      }
    }
  });

  if (duffelError) {
    console.error('Error creating Duffel booking:', duffelError);
    throw duffelError;
  }

  console.log('Duffel booking created:', duffelOrder);
  return duffelOrder;
};

export const createBookingRecord = async (
  userId: string,
  flight: any,
  duffelOrderId: string
) => {
  const { data: bookingData, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      origin: flight.origin,
      destination: flight.destination,
      departure_date: format(new Date(flight.departureDate), 'yyyy-MM-dd'),
      passengers: 1,
      cabin_class: flight.cabinClass,
      total_price: flight.price,
      duffel_offer_id: flight.id,
      duffel_booking_id: duffelOrderId,
      status: 'draft'
    })
    .select()
    .single();

  if (bookingError) {
    console.error('Error creating booking:', bookingError);
    throw bookingError;
  }

  return bookingData;
};

export const addBookingExtras = async (
  bookingId: string,
  selectedExtras: {
    bags: boolean;
    meals: boolean;
    wifi: boolean;
    flexibleTicket: boolean;
  }
) => {
  const addons = [];
  if (selectedExtras.bags) {
    addons.push({
      booking_id: bookingId,
      type: 'baggage',
      name: 'Extra Baggage',
      price: 30.00
    });
  }
  if (selectedExtras.meals) {
    addons.push({
      booking_id: bookingId,
      type: 'meal',
      name: 'In-flight Meal',
      price: 15.00
    });
  }
  if (selectedExtras.wifi) {
    addons.push({
      booking_id: bookingId,
      type: 'seat',
      name: 'Wi-Fi Access',
      price: 10.00
    });
  }
  if (selectedExtras.flexibleTicket) {
    addons.push({
      booking_id: bookingId,
      type: 'change',
      name: 'Flexible Ticket',
      price: 50.00
    });
  }

  if (addons.length > 0) {
    const { error: addonsError } = await supabase
      .from('booking_addons')
      .insert(addons);

    return addonsError;
  }
};