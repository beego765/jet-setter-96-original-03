import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_KEY')
const DUFFEL_API = 'https://api.duffel.com'

serve(async (req) => {
  const url = new URL(req.url)
  const path = url.pathname.replace('/duffel-proxy', '')
  const query = url.search

  try {
    const response = await fetch(`${DUFFEL_API}${path}${query}`, {
      method: req.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Duffel-Version': 'beta'
      },
      body: req.method !== 'GET' ? await req.text() : undefined
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
})