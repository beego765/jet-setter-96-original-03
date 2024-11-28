import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_KEY')
if (!DUFFEL_API_KEY) {
  throw new Error('DUFFEL_API_KEY environment variable is not set')
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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
    console.log('Request body:', JSON.stringify(body, null, 2))

    const response = await fetch(`${DUFFEL_API_URL}${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Duffel-Version': 'v1'
      },
      ...(body && { body: JSON.stringify(body) })
    });

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Duffel API error response:', errorData)
      throw new Error(`Duffel API error: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    console.log('Duffel API response:', data)

    return new Response(
      JSON.stringify(data.data || data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in duffel-proxy:', error)
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