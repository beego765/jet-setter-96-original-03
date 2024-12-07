import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_KEY')
const DUFFEL_API_URL = 'https://api.duffel.com/air'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { path, method, body } = await req.json()
    console.log('Duffel proxy request:', { path, method, body })

    // Handle offer requests specifically
    if (path === '/air/offer_requests' && method === 'POST') {
      console.log('Creating offer request:', body)
      const response = await fetch(`${DUFFEL_API_URL}/offer_requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DUFFEL_API_KEY}`,
          'Content-Type': 'application/json',
          'Duffel-Version': 'beta',
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      console.log('Offer request response:', data)

      if (!response.ok) {
        console.error('Duffel API error:', data)
        return new Response(
          JSON.stringify(data),
          { 
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // If this is an offer request, we need to get the offers immediately
      if (data.data?.id) {
        console.log('Fetching offers for request:', data.data.id)
        const offersResponse = await fetch(`${DUFFEL_API_URL}/offers?offer_request_id=${data.data.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${DUFFEL_API_KEY}`,
            'Content-Type': 'application/json',
            'Duffel-Version': 'beta',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
          },
        })

        const offersData = await offersResponse.json()
        console.log('Offers response:', offersData)

        return new Response(
          JSON.stringify(offersData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For all other requests
    const response = await fetch(`${DUFFEL_API_URL}${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'beta',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json()
    console.log('Duffel API response:', data)

    if (!response.ok) {
      console.error('Duffel API error:', data)
      return new Response(
        JSON.stringify(data),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in duffel-proxy:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})