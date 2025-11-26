import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar que la clave secreta esté configurada
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    
    if (!STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Stripe secret key not configured' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Verificar conexión con Stripe
    const stripeResponse = await fetch('https://api.stripe.com/v1/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
    })

    if (!stripeResponse.ok) {
      throw new Error('Invalid Stripe credentials')
    }

    const accountData = await stripeResponse.json()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Stripe connected successfully',
        account: {
          id: accountData.id,
          country: accountData.country,
          default_currency: accountData.default_currency,
          business_profile: accountData.business_profile
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Stripe setup error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})