import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const { event_type, data } = body

    console.log('Syncee webhook received:', { event_type, data })

    // Handle different Syncee events
    switch (event_type) {
      case 'product.created':
      case 'product.updated':
        await handleProductUpdate(supabaseClient, data)
        break
      
      case 'order.created':
        await handleOrderCreated(supabaseClient, data)
        break
      
      case 'inventory.updated':
        await handleInventoryUpdate(supabaseClient, data)
        break
      
      case 'price.updated':
        await handlePriceUpdate(supabaseClient, data)
        break
      
      default:
        console.log('Unhandled event type:', event_type)
    }

    // Send real-time notification
    await sendNotification(supabaseClient, {
      type: event_type,
      message: `Syncee evento procesado: ${event_type}`,
      data: data,
      timestamp: new Date().toISOString()
    })

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

async function handleProductUpdate(supabase: any, productData: any) {
  const { error } = await supabase
    .from('syncee_products')
    .upsert({
      syncee_id: productData.id,
      title: productData.title,
      description: productData.description,
      price: productData.price,
      compare_at_price: productData.compare_at_price,
      sku: productData.sku,
      inventory_quantity: productData.inventory_quantity,
      images: productData.images,
      variants: productData.variants,
      supplier_id: productData.supplier_id,
      category: productData.category,
      tags: productData.tags,
      status: productData.status,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error updating product:', error)
    throw error
  }

  console.log('Product updated successfully:', productData.id)
}

async function handleOrderCreated(supabase: any, orderData: any) {
  const { error } = await supabase
    .from('syncee_orders')
    .insert({
      syncee_order_id: orderData.id,
      customer_email: orderData.customer?.email,
      customer_name: orderData.customer?.name,
      total_price: orderData.total_price,
      currency: orderData.currency,
      line_items: orderData.line_items,
      shipping_address: orderData.shipping_address,
      billing_address: orderData.billing_address,
      order_status: orderData.status,
      payment_status: orderData.payment_status,
      created_at: orderData.created_at,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error creating order:', error)
    throw error
  }

  // Auto-process order with supplier
  await processOrderWithSupplier(supabase, orderData)
  
  console.log('Order created and processed:', orderData.id)
}

async function handleInventoryUpdate(supabase: any, inventoryData: any) {
  const { error } = await supabase
    .from('syncee_products')
    .update({
      inventory_quantity: inventoryData.quantity,
      updated_at: new Date().toISOString()
    })
    .eq('syncee_id', inventoryData.product_id)

  if (error) {
    console.error('Error updating inventory:', error)
    throw error
  }

  console.log('Inventory updated:', inventoryData.product_id)
}

async function handlePriceUpdate(supabase: any, priceData: any) {
  const { error } = await supabase
    .from('syncee_products')
    .update({
      price: priceData.price,
      compare_at_price: priceData.compare_at_price,
      updated_at: new Date().toISOString()
    })
    .eq('syncee_id', priceData.product_id)

  if (error) {
    console.error('Error updating price:', error)
    throw error
  }

  console.log('Price updated:', priceData.product_id)
}

async function processOrderWithSupplier(supabase: any, orderData: any) {
  // Auto-forward order to supplier
  for (const item of orderData.line_items) {
    const { data: product } = await supabase
      .from('syncee_products')
      .select('supplier_id, syncee_id')
      .eq('syncee_id', item.product_id)
      .single()

    if (product) {
      // Create supplier order
      await supabase
        .from('supplier_orders')
        .insert({
          order_id: orderData.id,
          supplier_id: product.supplier_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          status: 'pending',
          created_at: new Date().toISOString()
        })
    }
  }
}

async function sendNotification(supabase: any, notification: any) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      type: notification.type,
      title: getNotificationTitle(notification.type),
      message: notification.message,
      data: notification.data,
      is_read: false,
      created_at: notification.timestamp
    })

  if (error) {
    console.error('Error sending notification:', error)
  }
}

function getNotificationTitle(eventType: string): string {
  const titles: { [key: string]: string } = {
    'product.created': '🆕 Nuevo Producto Sincronizado',
    'product.updated': '📝 Producto Actualizado',
    'order.created': '🛒 Nueva Orden Recibida',
    'inventory.updated': '📦 Inventario Actualizado',
    'price.updated': '💰 Precio Actualizado'
  }
  
  return titles[eventType] || '🔔 Notificación de Syncee'
}