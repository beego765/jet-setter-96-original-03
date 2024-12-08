import { Duffel } from 'npm:@duffel/api'
import { corsHeaders } from '../_shared/cors.ts'

// Initialize the Duffel client with debug mode for better logging
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

    // Handle different API endpoints
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
        return new Response(JSON.stringify({ data: { offers: offers.data } }), {
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

    if (path.startsWith('/air/orders')) {
      if (method === 'POST') {
        console.log('Creating order:', body)
        const response = await duffel.orders.create(body.data)
        console.log('Order creation response:', response)
        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      if (method === 'GET') {
        const orderId = path.split('/').pop()
        console.log('Fetching order:', orderId)
        const response = await duffel.orders.get(orderId)
        console.log('Order response:', response)
        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    if (path.startsWith('/air/payments')) {
      if (method === 'POST') {
        console.log('Creating payment:', body)
        const response = await duffel.payments.create(body.data)
        console.log('Payment response:', response)
        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    throw new Error(`Unsupported path: ${path} or method: ${method}`)

  } catch (error) {
    console.error('Error processing request:', error)
    
    // Handle Duffel API errors
    if (error.errors) {
      return new Response(
        JSON.stringify({
          errors: error.errors,
          meta: error.meta
        }), 
        {
          status: error.meta?.status || 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
