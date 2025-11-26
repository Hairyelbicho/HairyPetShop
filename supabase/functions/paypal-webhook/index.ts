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
    const event = JSON.parse(body)

    console.log('PayPal webhook event:', event.event_type)
    console.log('Event data:', JSON.stringify(event, null, 2))

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Configuración de comisión dinámica (privada)
    const INAUGURATION_START_DATE = new Date('2024-01-01')
    const INAUGURATION_DURATION_DAYS = 35
    const PROMOTION_END_DATE = new Date(INAUGURATION_START_DATE.getTime() + (INAUGURATION_DURATION_DAYS * 24 * 60 * 60 * 1000))
    const isPromotionActive = new Date() < PROMOTION_END_DATE
    const currentCommissionRate = isPromotionActive ? 0.20 : 0.10 // 20% durante promoción, 10% después

    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
      case 'PAYMENT.CAPTURE.COMPLETED':
        const orderId = event.resource.id || event.resource.supplementary_data?.related_ids?.order_id
        const captureAmount = parseFloat(event.resource.amount?.value || '0')
        
        console.log('Processing payment completion for order:', orderId)
        console.log('Capture amount:', captureAmount)
        
        // Actualizar estado del pago en la base de datos
        const { error: updateError } = await supabase
          .from('paypal_payments')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('order_id', orderId)

        if (updateError) {
          console.error('Error updating payment:', updateError)
        }

        // Obtener información del pago para procesar automáticamente
        const { data: payment } = await supabase
          .from('paypal_payments')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (payment) {
          // Calcular comisión con la tasa actual (20% durante promoción, 10% después)
          const totalAmount = payment.amount
          const commissionAmount = totalAmount * currentCommissionRate
          const supplierAmount = totalAmount * (1 - currentCommissionRate)

          console.log('Procesando pago PayPal automáticamente:', {
            product: payment.product_name,
            totalAmount: totalAmount,
            commission: commissionAmount,
            supplierAmount: supplierAmount,
            commissionRate: currentCommissionRate,
            isPromotionActive: isPromotionActive,
            customer: payment.customer_name
          })

          // Actualizar comisiones en el pago
          await supabase
            .from('paypal_payments')
            .update({
              commission_amount: commissionAmount,
              supplier_amount: supplierAmount,
              commission_rate: currentCommissionRate,
              is_promotion_active: isPromotionActive
            })
            .eq('id', payment.id)

          // Crear orden automática para el proveedor
          const { error: orderError } = await supabase
            .from('automatic_orders')
            .insert({
              payment_id: payment.id,
              product_name: payment.product_name,
              customer_email: payment.customer_email,
              customer_name: payment.customer_name,
              total_amount: totalAmount,
              commission_amount: commissionAmount,
              supplier_amount: supplierAmount,
              commission_rate: currentCommissionRate,
              is_promotion_active: isPromotionActive,
              status: 'processing',
              payment_method: 'paypal',
              created_at: new Date().toISOString()
            })

          if (orderError) {
            console.error('Error creating automatic order:', orderError)
          } else {
            console.log('✅ Orden automática creada exitosamente')
          }

          // Registrar comisión para seguimiento
          await supabase
            .from('commissions')
            .insert({
              payment_id: payment.id,
              order_id: orderId,
              total_amount: totalAmount,
              commission_amount: commissionAmount,
              supplier_amount: supplierAmount,
              commission_rate: currentCommissionRate,
              currency: payment.currency || 'EUR',
              payment_method: 'paypal',
              is_promotion_active: isPromotionActive,
              created_at: new Date().toISOString()
            })

          // Crear notificación automática
          await supabase
            .from('notifications')
            .insert({
              type: 'payment_completed',
              title: '🎉 ¡Pago PayPal Completado!',
              message: `Producto: ${payment.product_name} | Total: €${totalAmount} | Comisión: €${commissionAmount.toFixed(2)} (${(currentCommissionRate * 100).toFixed(0)}%) ${isPromotionActive ? '🎉 PROMOCIÓN ACTIVA' : ''}`,
              data: {
                payment_id: payment.id,
                order_id: orderId,
                commission_amount: commissionAmount,
                commission_rate: currentCommissionRate,
                is_promotion: isPromotionActive
              },
              is_read: false,
              created_at: new Date().toISOString()
            })

          console.log('✅ Procesamiento automático completado')
        }
        break

      case 'PAYMENT.CAPTURE.DENIED':
      case 'CHECKOUT.ORDER.VOIDED':
        const failedOrderId = event.resource.id || event.resource.supplementary_data?.related_ids?.order_id
        
        await supabase
          .from('paypal_payments')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('order_id', failedOrderId)

        // Notificación de pago fallido
        await supabase
          .from('notifications')
          .insert({
            type: 'payment_failed',
            title: '❌ Pago PayPal Fallido',
            message: `Pago rechazado para orden: ${failedOrderId}`,
            data: { order_id: failedOrderId },
            is_read: false,
            created_at: new Date().toISOString()
          })
        break

      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`)
    }

    return new Response(
      JSON.stringify({ 
        received: true,
        processed: true,
        event_type: event.event_type 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('PayPal webhook error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        received: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})