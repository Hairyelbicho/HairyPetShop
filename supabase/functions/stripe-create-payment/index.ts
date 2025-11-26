import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { productName, amount, customerEmail, customerName } = await req.json()

    // Obtener la clave secreta de Stripe desde los secretos
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key not configured')
    }

    // Crear PaymentIntent con Stripe
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amount.toString(), // Cantidad en centavos
        currency: 'eur',
        'metadata[product_name]': productName,
        'metadata[customer_email]': customerEmail || '',
        'metadata[customer_name]': customerName || '',
        'metadata[commission_rate]': '10', // 10% de comisión
      }),
    })

    if (!stripeResponse.ok) {
      const error = await stripeResponse.text()
      throw new Error(`Stripe API error: ${error}`)
    }

    const paymentIntent = await stripeResponse.json()

    // Calcular comisión (10%) y cantidad para el proveedor (90%)
    const commissionAmount = Math.round(amount * 0.1)
    const supplierAmount = amount - commissionAmount

    // Guardar en Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: dbError } = await supabase
      .from('stripe_payments')
      .insert({
        payment_intent_id: paymentIntent.id,
        customer_email: customerEmail,
        customer_name: customerName,
        amount: amount,
        currency: 'eur',
        status: paymentIntent.status,
        product_name: productName,
        commission_amount: commissionAmount,
        supplier_amount: supplierAmount,
      })

    if (dbError) {
      console.error('Database error:', dbError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        commission: commissionAmount / 100, // Convertir a euros para mostrar
        supplierAmount: supplierAmount / 100,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
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