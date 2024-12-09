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

    if (path.startsWith('/air/orders')) {
      if (method === 'POST') {
        console.log('Creating order:', body)
        
        // Process the order data with proper passenger formatting
        const orderData = {
          ...body.data,
          passengers: body.data.passengers.map((passenger: any, index: number) => {
            // Generate a unique ID for each passenger using Duffel's recommended format
            const timestamp = Date.now().toString(36)
            const random = Math.random().toString(36).substring(2, 7)
            const passengerId = `pas_${timestamp}${random}`
            
            console.log(`Generated passenger ID: ${passengerId} for passenger index ${index}`)
            
            return {
              id: passengerId,
              type: passenger.type || 'adult',
              title: passenger.title || 'mr',
              gender: passenger.gender || 'm',
              given_name: passenger.given_name || passenger.firstName || 'Temporary',
              family_name: passenger.family_name || passenger.lastName || 'Passenger',
              email: passenger.email || 'temp@example.com',
              phone_number: passenger.phone_number || '+441234567890',
              born_on: passenger.born_on || passenger.dateOfBirth || '1990-01-01'
            }
          })
        }
        
        console.log('Processed order data:', orderData)
        const order = await duffel.orders.create(orderData)
        console.log('Order created:', order)
        
        return new Response(JSON.stringify(order), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (method === 'GET') {
        const orderId = path.split('/')[3]
        console.log('Fetching order details:', orderId)
        
        const order = await duffel.orders.get(orderId)
        console.log('Order details:', order)
        
        return new Response(JSON.stringify(order), {
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