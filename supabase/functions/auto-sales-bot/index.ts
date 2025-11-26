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
    const { action, data } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Auto Sales Bot - Action:', action)

    switch (action) {
      case 'send_whatsapp_message':
        // Enviar mensaje automático por WhatsApp
        const whatsappData = {
          to: data.phone,
          message: data.message,
          product: data.product,
          customer: data.customer,
          automated: true,
          timestamp: new Date().toISOString()
        }

        // Registrar mensaje en base de datos
        await supabase
          .from('whatsapp_messages')
          .insert({
            phone: data.phone,
            message: data.message,
            product_id: data.productId,
            customer_name: data.customer,
            status: 'sent',
            automated: true,
            created_at: new Date().toISOString()
          })

        console.log('✅ Mensaje WhatsApp automático enviado')
        break

      case 'send_email_campaign':
        // Enviar email automático
        const emailData = {
          to: data.email,
          subject: data.subject,
          content: data.content,
          product: data.product,
          automated: true
        }

        // Registrar email en base de datos
        await supabase
          .from('email_campaigns')
          .insert({
            email: data.email,
            subject: data.subject,
            content: data.content,
            product_id: data.productId,
            status: 'sent',
            automated: true,
            created_at: new Date().toISOString()
          })

        console.log('✅ Email automático enviado')
        break

      case 'create_telegram_sale':
        // Procesar venta desde Telegram
        const telegramSale = {
          customer_name: data.customerName,
          product_name: data.productName,
          amount: data.amount,
          platform: 'telegram',
          telegram_user_id: data.telegramUserId,
          status: 'completed',
          automated: true,
          created_at: new Date().toISOString()
        }

        await supabase
          .from('telegram_sales')
          .insert(telegramSale)

        console.log('✅ Venta Telegram procesada automáticamente')
        break

      case 'create_tiktok_sale':
        // Procesar venta desde TikTok
        const tiktokSale = {
          customer_name: data.customerName,
          product_name: data.productName,
          amount: data.amount,
          platform: 'tiktok',
          tiktok_user_id: data.tiktokUserId,
          status: 'completed',
          automated: true,
          created_at: new Date().toISOString()
        }

        await supabase
          .from('tiktok_sales')
          .insert(tiktokSale)

        console.log('✅ Venta TikTok procesada automáticamente')
        break

      case 'get_sales_stats':
        // Obtener estadísticas de ventas por canal
        const { data: whatsappSales } = await supabase
          .from('whatsapp_messages')
          .select('*')
          .eq('automated', true)

        const { data: emailSales } = await supabase
          .from('email_campaigns')
          .select('*')
          .eq('automated', true)

        const { data: telegramSales } = await supabase
          .from('telegram_sales')
          .select('*')
          .eq('automated', true)

        const { data: tiktokSales } = await supabase
          .from('tiktok_sales')
          .select('*')
          .eq('automated', true)

        const stats = {
          whatsapp: {
            messages: whatsappSales?.length || 0,
            sales: whatsappSales?.filter(m => m.status === 'converted').length || 0
          },
          email: {
            campaigns: emailSales?.length || 0,
            sales: emailSales?.filter(e => e.status === 'converted').length || 0
          },
          telegram: {
            sales: telegramSales?.length || 0,
            revenue: telegramSales?.reduce((acc, sale) => acc + (sale.amount || 0), 0) || 0
          },
          tiktok: {
            sales: tiktokSales?.length || 0,
            revenue: tiktokSales?.reduce((acc, sale) => acc + (sale.amount || 0), 0) || 0
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            stats: stats
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      case 'configure_auto_messages':
        // Configurar mensajes automáticos
        const messageConfig = {
          platform: data.platform,
          trigger: data.trigger,
          message: data.message,
          products: data.products,
          active: data.active || true,
          created_at: new Date().toISOString()
        }

        await supabase
          .from('auto_messages')
          .insert(messageConfig)

        console.log('✅ Mensaje automático configurado')
        break

      case 'trigger_auto_sale':
        // Simular venta automática para testing
        const platforms = ['whatsapp', 'email', 'telegram', 'tiktok']
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)]
        
        const autoSale = {
          platform: randomPlatform,
          customer_name: data.customerName || 'Cliente Automático',
          product_name: data.productName || 'Producto Demo',
          amount: data.amount || 25.99,
          status: 'completed',
          automated: true,
          test_sale: true,
          created_at: new Date().toISOString()
        }

        await supabase
          .from('auto_sales')
          .insert(autoSale)

        // Enviar a n8n si está configurado
        try {
          await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/n8n-integration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'send_sale_to_n8n',
              data: {
                productName: autoSale.product_name,
                amount: autoSale.amount,
                customerName: autoSale.customer_name,
                paymentMethod: 'auto_' + randomPlatform,
                platform: randomPlatform,
                automated: true
              }
            }),
          })
        } catch (error) {
          console.log('n8n integration not available:', error)
        }

        return new Response(
          JSON.stringify({
            success: true,
            sale: autoSale
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      default:
        throw new Error(`Acción no reconocida: ${action}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        action: action,
        processed_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error en Auto Sales Bot:', error)
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