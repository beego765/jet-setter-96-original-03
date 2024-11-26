import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Duffel } from 'npm:@duffel/api'

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const duffel = new Duffel({
  token: DUFFEL_API_KEY || ''
})

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
      const places = await duffel.placesSuggestions.list({ query: query.query })
      return new Response(JSON.stringify({ data: places.data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (path === '/offer_requests' && method === 'POST') {
      const offerRequest = await duffel.offerRequests.create(body.data)
      if (!offerRequest.data?.id) {
        throw new Error('No offer request ID received')
      }

      const offers = await duffel.offers.list({
        offer_request_id: offerRequest.data.id,
        sort: 'total_amount',
        limit: 10,
      })

      return new Response(JSON.stringify({ data: offers.data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error(`Unsupported path: ${path}`)
  } catch (error) {
    console.error('Duffel API error:', error)
    return new Response(
      JSON.stringify({ error: `Duffel API error: ${error.message}` }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})