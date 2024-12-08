import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const createDuffelBooking = async (flight: any) => {
  console.log('Creating Duffel booking for offer:', flight);

  if (!flight?.total_amount) {
    throw new Error('Flight price is required');
  }

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
            amount: flight.total_amount
          }],
          passengers: [{
            id: `pas_${Date.now()}`, // Generate unique ID using timestamp
            type: 'adult',
            title: 'mr',
            gender: 'm',
            given_name: 'Temporary',
            family_name: 'Passenger',
            email: 'temp@example.com',
            phone_number: '+441234567890', // Using a valid UK phone number format
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
      origin: flight.slices?.[0]?.origin?.iata_code || flight.origin,
      destination: flight.slices?.[0]?.destination?.iata_code || flight.destination,
      departure_date: format(new Date(flight.slices?.[0]?.segments?.[0]?.departing_at || flight.departureDate), 'yyyy-MM-dd'),
      passengers: 1,
      cabin_class: flight.slices?.[0]?.fare_brand_name || flight.cabinClass || 'economy',
      total_price: parseFloat(flight.total_amount),
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