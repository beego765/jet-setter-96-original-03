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

    console.log('Duffel API Request:', {
      path,
      method,
      bodyPreview: JSON.stringify(body).substring(0, 500) + '...'
    });

    // For all endpoints
    console.log('Making request to Duffel API:', {
      url: `https://api.duffel.com${path}`,
      method,
      body: JSON.stringify(body, null, 2)
    });

    const response = await fetch(`https://api.duffel.com${path}`, {
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${duffelApiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1'
      },
      ...(body && { body: JSON.stringify(body) })
    });

    const data = await response.json()
    
    console.log('Duffel API response:', {
      path,
      status: response.status,
      hasData: !!data,
      dataPreview: JSON.stringify(data).substring(0, 500) + '...'
    });

    // If it's an offer request, wait longer for the offers to be generated
    if (path === '/air/offer_requests' && response.ok) {
      console.log('Waiting for offers to be generated...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: response.status
      },
    );
  } catch (error) {
    console.error('Error in Duffel proxy:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    );
  }
});