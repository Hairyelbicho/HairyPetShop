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

    // Credenciales de PayPal
    const PAYPAL_CLIENT_ID = "AbZFUGJ6n7caXMv3YnHSo3Quc_gqUWCxYMUKzMLExxCSt5Ln4Xg1PKdTh90W6fu7tK8A1EvYZja8HH2j"
    const PAYPAL_CLIENT_SECRET = "EIUOCqUa0DWkBYe8NvNeftctMOd612YvGtW5Jvjlmrg6IkDSv7OhKty9HvJcC6MrF5dtGN1R2SzqrN_K"

    // Configuración de comisión dinámica (privada)
    const INAUGURATION_START_DATE = new Date('2024-01-01')
    const INAUGURATION_DURATION_DAYS = 35
    const PROMOTION_END_DATE = new Date(INAUGURATION_START_DATE.getTime() + (INAUGURATION_DURATION_DAYS * 24 * 60 * 60 * 1000))
    const isPromotionActive = new Date() < PROMOTION_END_DATE
    const currentCommissionRate = isPromotionActive ? 0.20 : 0.10 // 20% durante promoción, 10% después

    // Calcular comisión y cantidad para el proveedor
    const commissionAmount = Math.round(amount * currentCommissionRate * 100) / 100
    const supplierAmount = Math.round(amount * (1 - currentCommissionRate) * 100) / 100

    console.log('Creating PayPal payment:', {
      productName,
      amount,
      commissionRate: currentCommissionRate,
      commissionAmount,
      supplierAmount,
      isPromotionActive
    })

    // Obtener token de acceso de PayPal
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    if (!authResponse.ok) {
      throw new Error('Error obteniendo token de PayPal')
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // Crear orden de PayPal
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'EUR',
          value: amount.toFixed(2)
        },
        description: `PetStore - ${productName}`,
        custom_id: `petstore_${Date.now()}`,
        invoice_id: `INV_${Date.now()}`
      }],
      application_context: {
        return_url: `${req.headers.get('origin') || 'https://localhost:3000'}/?payment=success`,
        cancel_url: `${req.headers.get('origin') || 'https://localhost:3000'}/?payment=cancelled`,
        brand_name: 'PetStore',
        locale: 'es-ES',
        landing_page: 'BILLING',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW'
      }
    }

    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `petstore_${Date.now()}`,
      },
      body: JSON.stringify(orderData),
    })

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text()
      throw new Error(`Error creando orden PayPal: ${errorText}`)
    }

    const order = await orderResponse.json()

    // Guardar en Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: dbError } = await supabase
      .from('paypal_payments')
      .insert({
        order_id: order.id,
        customer_email: customerEmail,
        customer_name: customerName,
        amount: amount,
        currency: 'EUR',
        status: 'created',
        product_name: productName,
        commission_amount: commissionAmount,
        supplier_amount: supplierAmount,
        commission_rate: currentCommissionRate,
        is_promotion_active: isPromotionActive,
        created_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Database error:', dbError)
    }

    // Encontrar el enlace de aprobación
    const approvalLink = order.links.find(link => link.rel === 'approve')

    console.log('✅ PayPal order created successfully:', {
      orderId: order.id,
      commissionRate: currentCommissionRate,
      isPromotion: isPromotionActive
    })

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        approvalUrl: approvalLink?.href,
        commission: commissionAmount,
        supplierAmount: supplierAmount,
        commissionRate: currentCommissionRate,
        isPromotionActive: isPromotionActive,
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