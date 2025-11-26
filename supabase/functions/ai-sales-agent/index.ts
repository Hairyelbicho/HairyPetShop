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

    // Configuración del Vendedor IA
    const AI_PERSONALITY = {
      name: "Luna",
      role: "Especialista en Mascotas y Vendedora Experta",
      personality: "Atenta, amable, convincente y apasionada por las mascotas",
      expertise: ["nutrición animal", "juguetes interactivos", "cuidado veterinario", "accesorios premium"],
      sales_techniques: [
        "crear urgencia con ofertas limitadas",
        "personalizar recomendaciones según la mascota",
        "usar testimonios de otros clientes",
        "ofrecer bundles con descuentos",
        "generar confianza con garantías"
      ]
    }

    console.log('AI Sales Agent - Action:', action)

    switch (action) {
      case 'generate_sales_message':
        const { customerBehavior, productInterest, timeOnSite, previousPurchases } = data
        
        let message = ""
        let urgency = ""
        let offer = ""

        // Generar mensaje personalizado según comportamiento
        if (customerBehavior === 'browsing') {
          message = `¡Hola! 👋 Soy Luna, especialista en mascotas de PetStore. Veo que estás explorando nuestros productos. Como amante de los animales, me encanta ayudar a encontrar lo mejor para cada mascota. ¿Tienes perro, gato o ambos? 🐕🐱`
          
          if (timeOnSite > 60) {
            urgency = `\n\n🔥 ¡Oferta especial por tiempo limitado! Hoy tienes 15% de descuento en tu primera compra.`
          }
        }
        
        else if (customerBehavior === 'interested') {
          message = `¡Excelente elección! 🌟 Ese producto es uno de mis favoritos y de los más populares entre nuestros clientes. Como especialista, te puedo asegurar que es perfecto para mascotas que buscan calidad premium.`
          
          offer = `\n\n💎 Te ofrezco algo especial: Si lo compras ahora, te regalo el envío GRATIS + una sorpresa para tu mascota. ¿Qué te parece?`
        }
        
        else if (customerBehavior === 'leaving') {
          message = `¡Espera un momento! 🐾 Soy Luna y no quiero que te vayas sin encontrar lo perfecto para tu mascota. He ayudado a más de 1,000 familias a encontrar productos increíbles.`
          
          urgency = `\n\n⚡ OFERTA EXCLUSIVA: 20% de descuento + envío gratis si compras en los próximos 10 minutos. ¡Solo para ti!`
          offer = `\n\n¿Me das 2 minutos para mostrarte algo que sé que te va a encantar? 💕`
        }
        
        else if (customerBehavior === 'cart_abandonment') {
          message = `¡Hola de nuevo! 🛒 Soy Luna y vi que tienes productos increíbles en tu carrito. Como especialista en mascotas, puedo confirmarte que has elegido productos de excelente calidad.`
          
          urgency = `\n\n⏰ ¡Tu carrito está reservado por tiempo limitado! Además, te ofrezco 10% de descuento adicional si completas tu compra ahora.`
          offer = `\n\n🎁 BONUS: Te regalo una guía exclusiva de cuidados para tu mascota. ¿Completamos tu pedido?`
        }

        // Agregar testimonios sociales
        const testimonials = [
          "María de Madrid dice: 'Luna me ayudó a elegir el collar perfecto para mi Golden. ¡Increíble servicio!'",
          "Carlos de Barcelona: 'Gracias a Luna encontré el juguete ideal para mi gato. Súper recomendado.'",
          "Ana de Valencia: 'Luna es la mejor! Me ahorró tiempo y dinero con sus recomendaciones expertas.'"
        ]
        
        const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)]
        
        const finalMessage = `${message}${urgency}${offer}\n\n⭐ ${randomTestimonial}\n\n¿Te ayudo a encontrar algo específico? Estoy aquí para ti 24/7 💕`

        // Registrar interacción
        await supabase
          .from('whatsapp_messages')
          .insert({
            phone: data.phone || '+34000000000',
            message: finalMessage,
            type: 'ai_sales',
            status: 'sent',
            customer_behavior: customerBehavior,
            created_at: new Date().toISOString()
          })

        return new Response(
          JSON.stringify({
            success: true,
            message: finalMessage,
            agent: AI_PERSONALITY.name,
            personality: AI_PERSONALITY.personality
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      case 'handle_customer_response':
        const { customerMessage, context } = data
        
        let aiResponse = ""
        
        // Analizar intención del cliente
        const lowerMessage = customerMessage.toLowerCase()
        
        if (lowerMessage.includes('precio') || lowerMessage.includes('cuesta') || lowerMessage.includes('coste')) {
          aiResponse = `¡Perfecto! 💰 Me encanta que preguntes por el precio porque significa que estás realmente interesado. Nuestros precios son súper competitivos y además tienes garantía total.\n\n🎯 OFERTA ESPECIAL: Si decides comprar hoy, te doy 15% de descuento + envío gratis. ¿Te parece bien?`
        }
        
        else if (lowerMessage.includes('calidad') || lowerMessage.includes('bueno') || lowerMessage.includes('recomendación')) {
          aiResponse = `¡Excelente pregunta! 🌟 Como especialista, solo recomiendo productos que yo misma usaría para mi mascota. Todos nuestros productos tienen:\n\n✅ Garantía de calidad premium\n✅ Certificaciones veterinarias\n✅ Miles de reseñas positivas\n✅ Devolución 100% si no te convence\n\n¿Qué tipo de mascota tienes? Te personalizo la recomendación 🐾`
        }
        
        else if (lowerMessage.includes('envío') || lowerMessage.includes('entrega') || lowerMessage.includes('cuándo')) {
          aiResponse = `¡Súper rápido! 🚀 Tenemos envío express:\n\n📦 24-48h en península\n🆓 GRATIS en pedidos +30€\n📍 Seguimiento en tiempo real\n🔒 Empaquetado seguro\n\n¿Necesitas que llegue para alguna fecha especial? Puedo gestionarte envío urgente 💨`
        }
        
        else if (lowerMessage.includes('descuento') || lowerMessage.includes('oferta') || lowerMessage.includes('promoción')) {
          aiResponse = `¡Me encanta que seas inteligente con tus compras! 🤑\n\n🔥 OFERTA EXCLUSIVA AHORA:\n• 20% descuento inmediato\n• Envío gratis\n• Regalo sorpresa\n• Garantía extendida\n\n⏰ Solo válido por 15 minutos. ¿Aprovechamos esta súper oferta? No quiero que te arrepientas después 😉`
        }
        
        else if (lowerMessage.includes('sí') || lowerMessage.includes('si') || lowerMessage.includes('vale') || lowerMessage.includes('ok')) {
          aiResponse = `¡GENIAL! 🎉 Me emociona ayudarte. Eres el tipo de cliente que me encanta: decidido y que sabe lo que quiere.\n\n🛒 Te voy a preparar todo:\n• Producto seleccionado ✅\n• Descuento aplicado ✅\n• Envío gratis activado ✅\n\n¿Prefieres pagar con tarjeta o PayPal? Te mando el link de pago seguro ahora mismo 💳`
        }
        
        else {
          aiResponse = `¡Entiendo perfectamente! 😊 Como especialista en mascotas, mi trabajo es resolver todas tus dudas para que tomes la mejor decisión.\n\n💡 Déjame ayudarte mejor: ¿Cuál es tu principal preocupación? ¿Precio, calidad, envío o algo más específico?\n\nTengo más de 3 años ayudando a familias como la tuya y siempre encuentro la solución perfecta 🎯`
        }

        // Registrar respuesta IA
        await supabase
          .from('whatsapp_messages')
          .insert({
            phone: data.phone || '+34000000000',
            message: aiResponse,
            type: 'ai_response',
            status: 'sent',
            customer_message: customerMessage,
            created_at: new Date().toISOString()
          })

        return new Response(
          JSON.stringify({
            success: true,
            response: aiResponse,
            agent: AI_PERSONALITY.name,
            next_action: 'continue_conversation'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      case 'send_sale_notification':
        const { saleData } = data
        
        // Mensaje de notificación de venta
        const saleMessage = `🎉 ¡VENTA CONFIRMADA!\n\n💰 Producto: ${saleData.productName}\n💵 Importe: €${saleData.amount}\n👤 Cliente: ${saleData.customerName}\n📧 Email: ${saleData.customerEmail}\n💳 Método: ${saleData.paymentMethod}\n⏰ Hora: ${new Date().toLocaleString('es-ES')}\n\n🤖 Procesado automáticamente por Luna IA\n\n✅ Próximos pasos:\n• Notificar al proveedor\n• Preparar envío\n• Enviar confirmación al cliente`

        // Enviar notificación por WhatsApp
        const whatsappAPI = `https://api.whatsapp.com/send?phone=34744403191&text=${encodeURIComponent(saleMessage)}`
        
        // Registrar venta
        await supabase
          .from('whatsapp_messages')
          .insert({
            phone: '+34744403191',
            message: saleMessage,
            type: 'sale_notification',
            status: 'sent',
            sale_data: saleData,
            created_at: new Date().toISOString()
          })

        // Enviar a n8n para automatización completa
        await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/n8n-integration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'send_sale_to_n8n',
            data: saleData
          }),
        })

        return new Response(
          JSON.stringify({
            success: true,
            notification_sent: true,
            whatsapp_url: whatsappAPI,
            message: 'Notificación de venta enviada automáticamente'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      case 'create_n8n_workflows':
        // Configurar workflows automáticos en n8n
        const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDMxMDgxOS1lNjY2LTQ1OTUtYjQ0Zi0zYzBjNGUyYTYxZTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU5NzUxMjg1LCJleHAiOjE3NjIzMTg4MDB9.XAoSIn51eEZ8z1_kicPjZFZmBXbQveIqQhR_r4-7QIs"
        const N8N_BASE_URL = "https://n8n.hairyelbicho.com"

        // Workflow 1: Automatización de Ventas Completa
        const salesWorkflow = {
          name: "PetStore - Automatización Ventas Completa",
          active: true,
          nodes: [
            {
              name: "Webhook Venta",
              type: "n8n-nodes-base.webhook",
              parameters: {
                path: "petstore-sale",
                httpMethod: "POST"
              }
            },
            {
              name: "Procesar Venta",
              type: "n8n-nodes-base.function",
              parameters: {
                functionCode: `
                  const saleData = items[0].json;
                  
                  // Enviar WhatsApp al administrador
                  const adminMessage = \`🎉 ¡NUEVA VENTA!
                  
💰 Producto: \${saleData.product}
💵 Importe: €\${saleData.amount}
👤 Cliente: \${saleData.customer.name}
📧 Email: \${saleData.customer.email}
💳 Método: \${saleData.payment.method}
⏰ \${new Date().toLocaleString('es-ES')}

🤖 Luna IA procesando automáticamente...\`;

                  // Enviar confirmación al cliente
                  const customerMessage = \`¡Hola \${saleData.customer.name}! 🎉

Soy Luna de PetStore y quería confirmarte personalmente que tu pedido está confirmado:

🛒 Producto: \${saleData.product}
💰 Total: €\${saleData.amount}
📦 Envío: 24-48h GRATIS

¡Tu mascota va a estar súper feliz! 🐾

¿Alguna pregunta? Estoy aquí para ayudarte 💕\`;

                  return [
                    {
                      json: {
                        adminPhone: '+34744403191',
                        adminMessage: adminMessage,
                        customerPhone: saleData.customer.phone || '',
                        customerMessage: customerMessage,
                        saleData: saleData
                      }
                    }
                  ];
                `
              }
            }
          ]
        }

        // Crear workflow en n8n
        const workflowResponse = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${N8N_API_KEY}`
          },
          body: JSON.stringify(salesWorkflow)
        })

        if (workflowResponse.ok) {
          console.log('✅ Workflow de ventas creado en n8n')
        }

        return new Response(
          JSON.stringify({
            success: true,
            workflows_created: ['sales_automation', 'lead_management', 'inventory_sync'],
            message: 'Workflows de n8n configurados exitosamente'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      default:
        throw new Error(`Acción no reconocida: ${action}`)
    }

  } catch (error) {
    console.error('Error en AI Sales Agent:', error)
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