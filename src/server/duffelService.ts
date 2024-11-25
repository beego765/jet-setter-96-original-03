const API_KEY = 'duffel_test_VKTSwY1W6qRnC2ipzsOQvpKSc426Ct5OIKanj3ERZc-';
const DUFFEL_API = 'https://api.duffel.com/air';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
  'Duffel-Version': 'v1'
};

export const searchAirports = async (query: string) => {
  try {
    // Using direct API call with proper headers
    const response = await fetch(`${DUFFEL_API}/airports/suggestions?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching airports:', error);
    return [];
  }
};

export const searchFlights = async (params: any) => {
  try {
    const response = await fetch(`${DUFFEL_API}/offer_requests`, {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
};

export const createBooking = async (offerId: string, passengers: any[]) => {
  try {
    const response = await fetch(`${DUFFEL_API}/orders`, {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
};