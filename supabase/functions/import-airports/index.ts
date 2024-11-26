import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Fetch airports data from GitHub
    const response = await fetch('https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json')
    const airports = await response.json()

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Transform and insert the data
    const transformedAirports = airports.map((airport: any) => ({
      iata_code: airport.iata_code,
      name: airport.name,
      city: airport.city,
      country: airport.country,
      latitude: airport.lat,
      longitude: airport.lng
    }))

    // Insert data in batches of 1000 to avoid timeout
    const batchSize = 1000
    for (let i = 0; i < transformedAirports.length; i += batchSize) {
      const batch = transformedAirports.slice(i, i + batchSize)
      const { error } = await supabase
        .from('airports')
        .upsert(batch, { onConflict: 'iata_code' })

      if (error) {
        throw error
      }
    }

    return new Response(
      JSON.stringify({ message: 'Airports data imported successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})