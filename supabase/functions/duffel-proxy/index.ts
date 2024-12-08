import { Duffel } from '@duffel/api'
import { corsHeaders } from '../_shared/cors.ts'

// Initialize the Duffel client
const duffel = new Duffel({
  token: Deno.env.get('DUFFEL_API_KEY') || '',
  debug: { verbose: true },
})

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { path, method, body } = await req.json()
    console.log('Duffel API Request:', { path, method, body })

    if (path === '/air/offer_requests') {
      try {
        console.log('Creating offer request with body:', body)
        const offerRequest = await duffel.offerRequests.create(body.data)
        console.log('Offer request created:', offerRequest)

        // Get the offers for this request
        const offers = await duffel.offers.list({
          offer_request_id: offerRequest.data.id,
        })
        console.log('Offers retrieved:', offers)

        return new Response(JSON.stringify(offers), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      } catch (error) {
        console.error('Duffel API error:', error)
        return new Response(
          JSON.stringify({
            errors: error.errors || [{ message: error.message }],
            meta: error.meta || { status: 400 }
          }),
          {
            status: error.meta?.status || 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    // Handle other paths...
    return new Response(
      JSON.stringify({ error: 'Invalid path' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})