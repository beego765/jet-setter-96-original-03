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

    // Safe logging of request details
    console.log('Duffel API Request:', {
      path,
      method,
      bodyPreview: body ? JSON.stringify(body).substring(0, 500) + '...' : 'No body'
    });

    // Validate required parameters
    if (!path) {
      throw new Error('Path is required')
    }

    // Special handling for payments
    if (path.includes('/air/payments')) {
      console.log('Processing payment request:', {
        orderId: body?.data?.order_id,
        amount: body?.data?.amount,
        currency: body?.data?.currency,
        type: body?.data?.type
      });

      // Validate payment request
      if (!body?.data?.order_id || !body?.data?.amount || !body?.data?.currency || !body?.data?.type) {
        const missingFields = [];
        if (!body?.data?.order_id) missingFields.push('order_id');
        if (!body?.data?.amount) missingFields.push('amount');
        if (!body?.data?.currency) missingFields.push('currency');
        if (!body?.data?.type) missingFields.push('type');
        
        throw new Error(`Invalid payment request: missing fields: ${missingFields.join(', ')}`);
      }
    }

    // Special handling for hold requests
    if (path.includes('/air/orders') && path.includes('/hold')) {
      console.log('Processing hold request:', {
        orderId: path.split('/')[3],
        expiresAt: body?.data?.expires_at
      });
    }

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
      dataPreview: data ? JSON.stringify(data).substring(0, 500) + '...' : 'No data'
    });

    if (!response.ok) {
      console.error('Duffel API error:', {
        status: response.status,
        data
      });

      // Enhanced error response
      return new Response(
        JSON.stringify({
          error: {
            message: data.errors?.[0]?.message || 'Duffel API error',
            code: data.errors?.[0]?.code || response.status,
            details: data.errors || []
          }
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: response.status
        },
      );
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
      JSON.stringify({ 
        error: {
          message: error.message,
          type: 'DuffelProxyError'
        }
      }),
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