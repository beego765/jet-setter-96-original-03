import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_KEY')
const DUFFEL_API = 'https://api.duffel.com/air/v1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { path, method = 'GET', query = {}, body = null } = await req.json()
    
    // Construct URL with query parameters
    const queryString = new URLSearchParams(query).toString()
    const url = `${DUFFEL_API}${path}${queryString ? `?${queryString}` : ''}`
    
    console.log(`Making request to Duffel API:`, {
      method,
      url,
      bodyPreview: body ? JSON.stringify(body).slice(0, 100) + '...' : 'No body'
    })
    
    const response = await fetch(url, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Duffel-Version': 'beta',
      },
      body: body ? JSON.stringify(body) : undefined
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Duffel API error:', {
        status: response.status,
        url,
        error: data.errors?.[0] || data.error,
        headers: Object.fromEntries(response.headers)
      })
      throw new Error(`Duffel API error: ${response.status} - ${data.errors?.[0]?.message || data.error?.message || 'Unknown error'}`)
    }

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  } catch (error) {
    console.error('Error in Duffel proxy:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})