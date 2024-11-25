const SUPABASE_PROJECT_ID = 'yqzsdhoxnkjgmdjxbyos'
const DUFFEL_PROXY = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/duffel-proxy`

// Get the anon key from environment
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
}

export const searchAirports = async (query: string) => {
  try {
    if (!query || query.length < 2) return [];

    const response = await fetch(`${DUFFEL_PROXY}/air/airports?query=${encodeURIComponent(query)}&limit=10`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.map((airport: any) => ({
      iata_code: airport.iata_code,
      name: airport.name,
      city: airport.city?.name,
      country: airport.country?.name
    })) || [];
  } catch (error) {
    console.error('Error searching airports:', error);
    return [];
  }
};

export const searchFlights = async (params: any) => {
  try {
    // First create an offer request
    const offerRequestResponse = await fetch(`${DUFFEL_PROXY}/air/offer_requests`, {
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

    if (!offerRequestResponse.ok) {
      throw new Error(`HTTP error! status: ${offerRequestResponse.status}`);
    }

    const offerRequestData = await offerRequestResponse.json();
    
    // Then get the offers for this request
    const offersResponse = await fetch(
      `${DUFFEL_PROXY}/air/offers?offer_request_id=${offerRequestData.data.id}`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!offersResponse.ok) {
      throw new Error(`HTTP error! status: ${offersResponse.status}`);
    }

    const offersData = await offersResponse.json();
    return offersData.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
};

export const createBooking = async (offerId: string, passengers: any[]) => {
  try {
    const response = await fetch(`${DUFFEL_PROXY}/air/orders`, {
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