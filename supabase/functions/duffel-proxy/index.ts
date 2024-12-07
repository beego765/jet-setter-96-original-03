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

    // If this is a new order creation, we need to handle passenger data differently
    if (path === '/air/orders' && method === 'POST' && body?.data?.passengers) {
      // Remove the id field from passengers for new orders
      body.data.passengers = body.data.passengers.map((passenger: any) => {
        const { id, ...passengerWithoutId } = passenger
        return passengerWithoutId
      })
      console.log('Modified request body for new order:', body)
    }

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