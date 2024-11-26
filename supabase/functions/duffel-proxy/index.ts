import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@duffel/api'

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_KEY')
if (!DUFFEL_API_KEY) {
  throw new Error('DUFFEL_API_KEY environment variable is not set')
}

const duffel = createClient({
  token: DUFFEL_API_KEY
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { path, method, body } = await req.json()
    console.log(`Duffel API request: ${method} ${path}`)
    console.log('Request body:', body)

    if (path === '/air/offer_requests' && method === 'POST') {
      const offerRequest = await duffel.offerRequests.create(body.data)
      
      if (!offerRequest.data?.id) {
        throw new Error('No offer request ID received')
      }

      const offers = await duffel.offers.list({
        offer_request_id: offerRequest.data.id,
        sort: 'total_amount',
        limit: 10,
      })

      return new Response(JSON.stringify({ offers: offers.data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (path === '/air/orders' && method === 'POST') {
      const order = await duffel.orders.create(body.data)
      return new Response(JSON.stringify(order.data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
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