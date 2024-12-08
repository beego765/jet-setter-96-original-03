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
        const response = await duffel.offerRequests.create(body.data)
        console.log('Offer request response:', response)
        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    if (path.startsWith('/air/offers')) {
      if (method === 'GET') {
        const offerId = path.split('/').pop()
        console.log('Fetching offer:', offerId)
        const response = await duffel.offers.get(offerId)
        console.log('Offer response:', response)
        return new Response(JSON.stringify(response), {
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