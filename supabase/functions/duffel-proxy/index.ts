import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Duffel } from 'npm:@duffel/api'

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_KEY')

if (!DUFFEL_API_KEY) {
  throw new Error('DUFFEL_API_KEY environment variable is not set')
}

const duffel = new Duffel({
  token: DUFFEL_API_KEY
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { path, method, query = {}, body = null } = await req.json()

    console.log(`Duffel API request: ${method} ${path}`)
    console.log('Query:', query)
    console.log('Body:', body)

    if (path === '/places/suggestions') {
      console.log('Searching places with query:', query.query)
      const places = await duffel.placesSuggestions.list({ query: query.query })
      console.log('Places found:', places.data?.length || 0)
      
      return new Response(JSON.stringify({ data: places.data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (path === '/offer_requests' && method === 'POST') {
      console.log('Creating offer request with data:', body.data)
      const offerRequest = await duffel.offerRequests.create(body.data)
      
      if (!offerRequest.data?.id) {
        console.error('No offer request ID received:', offerRequest)
        throw new Error('No offer request ID received')
      }

      console.log('Fetching offers for request:', offerRequest.data.id)
      const offersResponse = await duffel.offers.list({
        offer_request_id: offerRequest.data.id,
        sort: 'total_amount',
        limit: 10,
      })

      if (!offersResponse.data) {
        console.error('No offers data received:', offersResponse)
        throw new Error('No offers data received from Duffel API')
      }

      console.log(`Found ${offersResponse.data.length} offers`)
      return new Response(JSON.stringify({ data: offersResponse.data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error(`Unsupported path: ${path}`)
  } catch (error) {
    console.error('Duffel API error:', error)
    return new Response(
      JSON.stringify({ 
        error: `Duffel API error: ${error.message}`,
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})