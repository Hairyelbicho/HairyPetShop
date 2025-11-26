import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-nowpayments-sig',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verificar firma IPN de NOWPayments
    const signature = req.headers.get('x-nowpayments-sig')
    const body = await req.text()
    
    // Verificar la firma con la clave secreta IPN
    const ipnSecret = 'yupFadX/KBi8CBBSLL/QFptl9Zwq6aXb'
    
    // Crear hash HMAC-SHA512
    const encoder = new TextEncoder()
    const keyData = encoder.encode(ipnSecret)
    const messageData = encoder.encode(body)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    )
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (signature !== expectedSignature) {
      console.log('Invalid signature')
      return new Response('Invalid signature', { status: 401 })
    }

    const paymentData = JSON.parse(body)
    console.log('NOWPayments webhook received:', paymentData)

    // Procesar diferentes estados de pago
    switch (paymentData.payment_status) {
      case 'waiting':
        await handlePaymentWaiting(supabaseClient, paymentData)
        break
      
      case 'confirming':
        await handlePaymentConfirming(supabaseClient, paymentData)
        break
      
      case 'confirmed':
        await handlePaymentConfirmed(supabaseClient, paymentData)
        break
      
      case 'sending':
        await handlePaymentSending(supabaseClient, paymentData)
        break
      
      case 'partially_paid':
        await handlePaymentPartial(supabaseClient, paymentData)
        break
      
      case 'finished':
        await handlePaymentFinished(supabaseClient, paymentData)
        break
      
      case 'failed':
      case 'refunded':
        await handlePaymentFailed(supabaseClient, paymentData)
        break
      
      default:
        console.log('Unknown payment status:', paymentData.payment_status)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function handlePaymentWaiting(supabase: any, paymentData: any) {
  // Guardar pago pendiente
  await supabase
    .from('crypto_payments')
    .upsert({
      payment_id: paymentData.payment_id,
      order_id: paymentData.order_id,
      payment_status: 'waiting',
      pay_address: paymentData.pay_address,
      pay_amount: paymentData.pay_amount,
      pay_currency: paymentData.pay_currency,
      price_amount: paymentData.price_amount,
      price_currency: paymentData.price_currency,
      customer_email: paymentData.order_description || '',
      created_at: paymentData.created_at,
      updated_at: new Date().toISOString()
    })

  // Notificar al vendedor
  await sendNotification(supabase, {
    type: 'payment_waiting',
    title: '⏳ Pago Pendiente - NOWPayments',
    message: `Cliente esperando pago: ${paymentData.pay_amount} ${paymentData.pay_currency}`,
    payment_id: paymentData.payment_id
  })
}

async function handlePaymentConfirming(supabase: any, paymentData: any) {
  await supabase
    .from('crypto_payments')
    .update({
      payment_status: 'confirming',
      updated_at: new Date().toISOString()
    })
    .eq('payment_id', paymentData.payment_id)

  await sendNotification(supabase, {
    type: 'payment_confirming',
    title: '🔄 Confirmando Pago',
    message: `Pago recibido, confirmando en blockchain...`,
    payment_id: paymentData.payment_id
  })
}

async function handlePaymentConfirmed(supabase: any, paymentData: any) {
  await supabase
    .from('crypto_payments')
    .update({
      payment_status: 'confirmed',
      actually_paid: paymentData.actually_paid,
      updated_at: new Date().toISOString()
    })
    .eq('payment_id', paymentData.payment_id)

  await sendNotification(supabase, {
    type: 'payment_confirmed',
    title: '✅ Pago Confirmado',
    message: `Pago confirmado: ${paymentData.actually_paid} ${paymentData.pay_currency}`,
    payment_id: paymentData.payment_id
  })
}

async function handlePaymentSending(supabase: any, paymentData: any) {
  await supabase
    .from('crypto_payments')
    .update({
      payment_status: 'sending',
      updated_at: new Date().toISOString()
    })
    .eq('payment_id', paymentData.payment_id)

  await sendNotification(supabase, {
    type: 'payment_sending',
    title: '📤 Procesando Pago',
    message: 'Enviando fondos a tu wallet...',
    payment_id: paymentData.payment_id
  })
}

async function handlePaymentFinished(supabase: any, paymentData: any) {
  // Marcar pago como completado
  await supabase
    .from('crypto_payments')
    .update({
      payment_status: 'finished',
      outcome_amount: paymentData.outcome_amount,
      outcome_currency: paymentData.outcome_currency,
      updated_at: new Date().toISOString()
    })
    .eq('payment_id', paymentData.payment_id)

  // Obtener información del pago
  const { data: payment } = await supabase
    .from('crypto_payments')
    .select('*')
    .eq('payment_id', paymentData.payment_id)
    .single()

  if (payment) {
    // Calcular comisión automáticamente (10%)
    const totalAmount = parseFloat(payment.price_amount)
    const commission = totalAmount * 0.1
    const supplierAmount = totalAmount * 0.9

    // Registrar comisión
    await supabase
      .from('commissions')
      .insert({
        payment_id: paymentData.payment_id,
        order_id: payment.order_id,
        total_amount: totalAmount,
        commission_amount: commission,
        supplier_amount: supplierAmount,
        currency: payment.price_currency,
        created_at: new Date().toISOString()
      })

    // Procesar orden automáticamente
    await processAutomaticOrder(supabase, payment, supplierAmount)
    
    // Enviar orden al proveedor automáticamente
    await sendOrderToSupplier(supabase, payment, supplierAmount)
  }

  await sendNotification(supabase, {
    type: 'payment_finished',
    title: '🎉 ¡Venta Completada!',
    message: `Pago finalizado. Comisión: €${(parseFloat(paymentData.price_amount || '0') * 0.1).toFixed(2)}`,
    payment_id: paymentData.payment_id
  })
}

async function handlePaymentPartial(supabase: any, paymentData: any) {
  await supabase
    .from('crypto_payments')
    .update({
      payment_status: 'partially_paid',
      actually_paid: paymentData.actually_paid,
      updated_at: new Date().toISOString()
    })
    .eq('payment_id', paymentData.payment_id)

  const remaining = parseFloat(paymentData.pay_amount) - parseFloat(paymentData.actually_paid)

  await sendNotification(supabase, {
    type: 'payment_partial',
    title: '⚠️ Pago Parcial',
    message: `Pago parcial recibido. Faltan ${remaining.toFixed(8)} ${paymentData.pay_currency}`,
    payment_id: paymentData.payment_id
  })
}

async function handlePaymentFailed(supabase: any, paymentData: any) {
  await supabase
    .from('crypto_payments')
    .update({
      payment_status: paymentData.payment_status,
      updated_at: new Date().toISOString()
    })
    .eq('payment_id', paymentData.payment_id)

  await sendNotification(supabase, {
    type: 'payment_failed',
    title: '❌ Pago Fallido',
    message: `Pago ${paymentData.payment_status}. Revisar con cliente.`,
    payment_id: paymentData.payment_id
  })
}

async function processAutomaticOrder(supabase: any, payment: any, supplierAmount: number) {
  // Crear registro de orden automática
  await supabase
    .from('automatic_orders')
    .insert({
      payment_id: payment.payment_id,
      order_id: payment.order_id,
      customer_email: payment.customer_email,
      total_amount: payment.price_amount,
      commission_amount: parseFloat(payment.price_amount) * 0.1,
      supplier_amount: supplierAmount,
      currency: payment.price_currency,
      status: 'processing',
      created_at: new Date().toISOString()
    })

  console.log('Orden automática procesada:', payment.order_id)
}

async function sendOrderToSupplier(supabase: any, payment: any, supplierAmount: number) {
  // Registrar envío al proveedor
  await supabase
    .from('supplier_orders')
    .insert({
      payment_id: payment.payment_id,
      order_id: payment.order_id,
      supplier_id: 'nowpayments_auto',
      amount: supplierAmount,
      currency: payment.price_currency,
      customer_email: payment.customer_email,
      status: 'sent',
      created_at: new Date().toISOString()
    })

  console.log('Orden enviada al proveedor automáticamente:', payment.order_id)
}

async function sendNotification(supabase: any, notification: any) {
  await supabase
    .from('notifications')
    .insert({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: { payment_id: notification.payment_id },
      is_read: false,
      created_at: new Date().toISOString()
    })
}