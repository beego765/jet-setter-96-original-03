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
      console.error('DUFFEL_API_KEY is not set')
      throw new Error('DUFFEL_API_KEY is not set')
    }

    // Special handling for /air/offers endpoint
    if (path === '/air/offers' && method === 'GET') {
      console.log('Creating offer request with body:', JSON.stringify(body))

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
            slices: [{
              origin: body.data.slices[0].origin,
              destination: body.data.slices[0].destination,
              departure_date: body.data.slices[0].departure_date
            }],
            passengers: body.data.passengers,
            cabin_class: body.data.cabin_class
          }
        })
      })

      const offerRequestData = await offerRequestResponse.json()
      
      console.log('Offer request response:', {
        status: offerRequestResponse.status,
        data: offerRequestData
      })

      if (!offerRequestResponse.ok) {
        console.error('Offer request failed:', {
          status: offerRequestResponse.status,
          error: offerRequestData
        })
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

      if (!offerRequestData.data?.id) {
        console.error('Invalid offer request response:', offerRequestData)
        throw new Error('Failed to create offer request')
      }

      // Wait for offers to be generated
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Now get the offers using the offer request ID
      const offersResponse = await fetch(`https://api.duffel.com/air/offers?offer_request_id=${offerRequestData.data.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${duffelApiKey}`,
          'Accept': 'application/json',
          'Duffel-Version': 'v1'
        }
      })

      const offersData = await offersResponse.json()
      
      console.log('Offers response:', {
        status: offersResponse.status,
        offersCount: offersData?.data?.length || 0,
        data: offersData
      })

      if (!offersResponse.ok) {
        return new Response(
          JSON.stringify(offersData),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
            status: offersResponse.status
          }
        )
      }

      return new Response(
        JSON.stringify(offersData),
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
    console.log('Making request to Duffel API:', {
      url: `https://api.duffel.com${path}`,
      method,
      body
    })

    const response = await fetch(`https://api.duffel.com${path}`, {
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${duffelApiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1'
      },
      ...(body && { body: JSON.stringify(body) })
    })

    const data = await response.json()
    
    console.log('Duffel API response:', {
      path,
      status: response.status,
      hasData: !!data
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
        status: 500,
      },
    )
  }
})