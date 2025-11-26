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
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    // En producción, aquí verificarías la firma del webhook
    const event = JSON.parse(body)

    console.log('Stripe webhook event:', event.type)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        
        // Actualizar estado del pago en la base de datos
        const { error: updateError } = await supabase
          .from('stripe_payments')
          .update({ 
            status: 'succeeded',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating payment:', updateError)
        }

        // Obtener información del pago para procesar automáticamente
        const { data: payment } = await supabase
          .from('stripe_payments')
          .select('*')
          .eq('payment_intent_id', paymentIntent.id)
          .single()

        if (payment) {
          // Simular envío automático al proveedor
          console.log('Procesando pago automáticamente:', {
            product: payment.product_name,
            commission: payment.commission_amount / 100,
            supplierAmount: payment.supplier_amount / 100,
            customer: payment.customer_name
          })

          // Crear orden automática para el proveedor
          const { error: orderError } = await supabase
            .from('automatic_orders')
            .insert({
              payment_id: payment.id,
              product_name: payment.product_name,
              customer_email: payment.customer_email,
              customer_name: payment.customer_name,
              total_amount: payment.amount / 100,
              commission_amount: payment.commission_amount / 100,
              supplier_amount: payment.supplier_amount / 100,
              status: 'processing',
              payment_method: 'stripe'
            })

          if (orderError) {
            console.error('Error creating automatic order:', orderError)
          }
        }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        
        await supabase
          .from('stripe_payments')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', failedPayment.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})