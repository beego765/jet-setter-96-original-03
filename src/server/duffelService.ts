const API_URL = 'https://api.duffel.com/air/';
const API_KEY = 'duffel_test_VKTSwY1W6qRnC2ipzsOQvpKSc426Ct5OIKanj3ERZc-';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
  'Duffel-Version': 'v1'
};

export const searchFlights = async (params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: string;
}) => {
  try {
    const response = await fetch(`${API_URL}offer_requests`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
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
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to search flights');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

export const createBooking = async (offerId: string, passengers: any[]) => {
  try {
    const response = await fetch(`${API_URL}orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};