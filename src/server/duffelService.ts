const API_KEY = 'duffel_test_VKTSwY1W6qRnC2ipzsOQvpKSc426Ct5OIKanj3ERZc-';
const DUFFEL_API = 'https://api.duffel.com';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
  'Duffel-Version': 'beta'
};

export const searchAirports = async (query: string) => {
  try {
    const response = await fetch(`${DUFFEL_API}/air/places?query=${encodeURIComponent(query)}`, {
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
    // First create an offer request
    const offerRequestResponse = await fetch(`${DUFFEL_API}/air/offer_requests`, {
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
      `${DUFFEL_API}/air/offers?offer_request_id=${offerRequestData.data.id}`,
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
    const response = await fetch(`${DUFFEL_API}/air/orders`, {
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