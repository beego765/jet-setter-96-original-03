import { Duffel } from '@duffel/api';

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY,
});

export const searchFlights = async (params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: string;
}) => {
  try {
    const { data } = await duffel.offerRequests.create({
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
      passengers: [{ type: "adult", age: 25 }],
      cabin_class: params.cabinClass.toLowerCase(),
    });

    return data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

export const createBooking = async (offerId: string, passengers: any[]) => {
  try {
    const { data } = await duffel.orders.create({
      selected_offers: [offerId],
      passengers,
    });

    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};