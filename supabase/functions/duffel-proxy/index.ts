import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    const { path, method, body } = await req.json()
    const duffelApiKey = Deno.env.get('DUFFEL_API_KEY')
    
    if (!duffelApiKey) {
      throw new Error('DUFFEL_API_KEY is not set')
    }

    console.log('Making request to Duffel API:', {
      url: `https://api.duffel.com${path}`,
      method,
      body
    })

    // Special handling for /air/offers endpoint
    if (path === '/air/offers' && method === 'GET') {
      // Create an offer request first
      const offerRequestResponse = await fetch('https://api.duffel.com/air/offer_requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${duffelApiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Duffel-Version': 'v1'
        },
        body: JSON.stringify({ 
          data: {
            slices: body?.slices || [],
            passengers: body?.passengers || [],
            cabin_class: body?.cabin_class || 'economy'
          }
        })
      });

      const offerRequestData = await offerRequestResponse.json();
      
      if (!offerRequestResponse.ok) {
        console.error('Offer request failed:', offerRequestData);
        return new Response(
          JSON.stringify(offerRequestData),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
            status: offerRequestResponse.status
          },
        )
      }

      // Now get the offers using the offer request ID
      const offersResponse = await fetch(`https://api.duffel.com/air/offers?offer_request_id=${offerRequestData.data.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${duffelApiKey}`,
          'Accept': 'application/json',
          'Duffel-Version': 'v1'
        }
      });

      const data = await offersResponse.json();
      
      console.log('Duffel API response:', {
        status: offersResponse.status,
        data
      });

      return new Response(
        JSON.stringify(data),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: offersResponse.status
        },
      )
    }

    // For all other endpoints
    const requestBody = body ? JSON.stringify({ data: body }) : undefined;
    
    const response = await fetch(`https://api.duffel.com${path}`, {
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${duffelApiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1'
      },
      ...(requestBody && { body: requestBody })
    })

    const data = await response.json()
    
    console.log('Duffel API response:', {
      status: response.status,
      data
    })

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: response.status
      },
    )
  } catch (error) {
    console.error('Error in Duffel proxy:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    )
  }
})