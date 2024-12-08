import { Duffel } from 'npm:@duffel/api'
import { corsHeaders } from '../_shared/cors.ts'

const duffel = new Duffel({
  token: Deno.env.get('DUFFEL_API_KEY') || '',
  debug: { verbose: true }
})

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { path, method, body } = await req.json()
    console.log(`Processing ${method} request to ${path}`, body)

    if (path.startsWith('/air/offer_requests')) {
      if (method === 'POST') {
        console.log('Creating offer request:', body)
        const offerRequest = await duffel.offerRequests.create(body.data)
        console.log('Offer request created:', offerRequest)
        
        // Get all offers for this request
        const offers = await duffel.offers.list({
          offer_request_id: offerRequest.data.id,
          limit: 50
        })
        
        console.log('Offers retrieved:', offers)
        return new Response(JSON.stringify(offers), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    if (path.startsWith('/air/offers')) {
      if (method === 'GET') {
        const params = new URLSearchParams(path.split('?')[1])
        const offerId = params.get('offer_request_id')
        console.log('Fetching offers for request:', offerId)
        
        if (!offerId) {
          throw new Error('Missing offer_request_id parameter')
        }
        
        const offers = await duffel.offers.list({
          offer_request_id: offerId,
          limit: 50
        })
        
        console.log('Offers response:', offers)
        return new Response(JSON.stringify(offers), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    throw new Error(`Unsupported path: ${path} or method: ${method}`)

  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        details: error.errors || []
      }),
      {
        status: error.meta?.status || 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})