import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_KEY')
if (!DUFFEL_API_KEY) {
  throw new Error('DUFFEL_API_KEY environment variable is not set')
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const DUFFEL_API_URL = 'https://api.duffel.com'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    const { path, method, body } = await req.json()
    console.log(`Duffel API request: ${method} ${path}`)
    console.log('Request body:', body)

    const mapPassengers = (passengers) => {
      const mappedPassengers = [];
      
      // Add adult passengers
      for (let i = 0; i < passengers.adults; i++) {
        mappedPassengers.push({ type: 'adult' });
      }
      
      // Add child passengers
      for (let i = 0; i < passengers.children; i++) {
        mappedPassengers.push({ type: 'child' });
      }
      
      // Add infant passengers
      for (let i = 0; i < passengers.infants; i++) {
        mappedPassengers.push({ type: 'infant_without_seat' });
      }
      
      return mappedPassengers;
    };

    if (path === '/air/offer_requests' && method === 'POST') {
      // Create offer request with mapped passengers
      const offerRequestResponse = await fetch(`${DUFFEL_API_URL}/air/offer_requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DUFFEL_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Duffel-Version': 'v1'
        },
        body: JSON.stringify({
          ...body,
          data: {
            ...body.data,
            passengers: mapPassengers(body.data.passengers)
          }
        })
      });

      if (!offerRequestResponse.ok) {
        throw new Error(`Duffel API error: ${offerRequestResponse.statusText}`)
      }

      const offerRequest = await offerRequestResponse.json()
      console.log('Offer request created:', offerRequest)

      if (!offerRequest.data?.id) {
        throw new Error('No offer request ID received')
      }

      // Get offers for the request
      const offersResponse = await fetch(
        `${DUFFEL_API_URL}/air/offers?offer_request_id=${offerRequest.data.id}&sort=total_amount&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${DUFFEL_API_KEY}`,
            'Accept': 'application/json',
            'Duffel-Version': 'v1'
          }
        }
      )

      if (!offersResponse.ok) {
        throw new Error(`Duffel API error: ${offersResponse.statusText}`)
      }

      const offers = await offersResponse.json()
      console.log(`Found ${offers.data?.length || 0} offers`)

      return new Response(
        JSON.stringify({ offers: offers.data }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    if (path === '/air/orders' && method === 'POST') {
      const orderResponse = await fetch(`${DUFFEL_API_URL}/air/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DUFFEL_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Duffel-Version': 'v1'
        },
        body: JSON.stringify(body)
      })

      if (!orderResponse.ok) {
        throw new Error(`Duffel API error: ${orderResponse.statusText}`)
      }

      const order = await orderResponse.json()
      console.log('Order created:', order)

      return new Response(
        JSON.stringify(order.data), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    throw new Error(`Unsupported path: ${path}`)
  } catch (error) {
    console.error('Duffel API error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
