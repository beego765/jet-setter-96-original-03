import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_KEY')
const DUFFEL_API = 'https://api.duffel.com/air'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { path, method = 'GET', query = {}, body = null } = await req.json()
    
    // Construct URL with query parameters
    const queryString = new URLSearchParams(query).toString()
    const url = `${DUFFEL_API}${path}${queryString ? `?${queryString}` : ''}`
    
    console.log(`Calling Duffel API: ${url}`)
    
    const response = await fetch(url, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Duffel-Version': 'beta'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Duffel API error:', response.status, data)
      throw new Error(`Duffel API error: ${response.status}`)
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