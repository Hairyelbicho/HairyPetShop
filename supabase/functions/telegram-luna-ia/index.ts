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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Configuración de Luna IA para Telegram
    const TELEGRAM_BOT_TOKEN = "7611611121:AAHkEDU1_QK68PKLH2ac-2Ikldi5JukOx4A"
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

    // Personalidad de Luna IA para Telegram
    const LUNA_IA_PERSONALITY = {
      name: "Luna",
      role: "Especialista en Mascotas y Vendedora Experta",
      personality: "Atenta, amable, convincente y apasionada por las mascotas",
      platform: "Telegram",
      expertise: ["nutrición animal", "juguetes interactivos", "cuidado veterinario", "accesorios premium"],
      sales_techniques: [
        "crear urgencia con ofertas limitadas",
        "personalizar recomendaciones según la mascota",
        "usar emojis y stickers para conectar emocionalmente",
        "ofrecer bundles con descuentos exclusivos",
        "generar confianza con testimonios reales"
      ]
    }

    // Productos destacados para Telegram
    const TELEGRAM_PRODUCTS = [
      {
        name: "Collar Premium Luna",
        price: 29.99,
        description: "Collar de cuero premium con grabado personalizado",
        image: "https://readdy.ai/api/search-image?query=Premium leather dog collar with metal buckle&width=400&height=300&seq=collar_tg&orientation=landscape"
      },
      {
        name: "Juguete Interactivo Pro",
        price: 22.50,
        description: "Juguete inteligente que mantiene a tu mascota activa",
        image: "https://readdy.ai/api/search-image?query=Interactive pet toy with LED lights&width=400&height=300&seq=toy_tg&orientation=landscape"
      },
      {
        name: "Pienso Premium Plus",
        price: 48.00,
        description: "Alimentación premium para mascotas exigentes",
        image: "https://readdy.ai/api/search-image?query=Premium pet food bag with natural ingredients&width=400&height=300&seq=food_tg&orientation=landscape"
      }
    ]

    if (req.method === 'POST') {
      const update = await req.json()
      console.log('Telegram Update:', JSON.stringify(update, null, 2))

      if (update.message) {
        const message = update.message
        const chatId = message.chat.id
        const userId = message.from.id
        const userName = message.from.first_name || 'Cliente'
        const userMessage = message.text || ''

        console.log(`Mensaje de ${userName} (${userId}): ${userMessage}`)

        // Registrar mensaje en Supabase
        await supabase
          .from('telegram_messages')
          .insert({
            user_id: userId,
            username: userName,
            chat_id: chatId,
            message: userMessage,
            type: 'user_message',
            created_at: new Date().toISOString()
          })

        let lunaResponse = ""
        let replyMarkup = null

        // Comandos especiales
        if (userMessage.startsWith('/start')) {
          lunaResponse = `¡Hola ${userName}! 👋🐾

Soy Luna, tu especialista personal en mascotas de HairyPetShop. Me emociona conocerte y ayudarte a encontrar lo mejor para tu peludo amigo.

Como experta en más de 1,000 productos para mascotas, puedo ayudarte con:

🐕 Productos para perros
🐱 Accesorios para gatos  
🐠 Equipos para peces
🐦 Artículos para pájaros
🐴 Equipamiento equino
🏥 Material veterinario

¿Qué tipo de mascota tienes? ¡Cuéntame y te ayudo a encontrar productos increíbles! ✨`

          replyMarkup = {
            inline_keyboard: [
              [
                { text: "🐕 Perros", callback_data: "category_perros" },
                { text: "🐱 Gatos", callback_data: "category_gatos" }
              ],
              [
                { text: "🐠 Peces", callback_data: "category_peces" },
                { text: "🐦 Pájaros", callback_data: "category_pajaros" }
              ],
              [
                { text: "🛒 Ver Ofertas", callback_data: "show_offers" },
                { text: "📞 Contactar", callback_data: "contact_whatsapp" }
              ]
            ]
          }
        }
        
        else if (userMessage.startsWith('/productos')) {
          lunaResponse = `🛒 ¡Productos Destacados de HairyPetShop!

Como especialista, estos son mis favoritos:

${TELEGRAM_PRODUCTS.map((product, index) => 
  `${index + 1}. **${product.name}**
💰 €${product.price}
📝 ${product.description}`
).join('\n\n')}

🔥 **OFERTA ESPECIAL**: 20% descuento + envío GRATIS si compras hoy

¿Cuál te interesa más? ¡Te doy más detalles! 💕`

          replyMarkup = {
            inline_keyboard: [
              [
                { text: "🛒 Comprar Collar", callback_data: "buy_collar" },
                { text: "🎾 Comprar Juguete", callback_data: "buy_toy" }
              ],
              [
                { text: "🍖 Comprar Pienso", callback_data: "buy_food" },
                { text: "💬 Hablar con Luna", callback_data: "chat_luna" }
              ]
            ]
          }
        }
        
        else if (userMessage.startsWith('/ofertas')) {
          lunaResponse = `🔥 ¡OFERTAS EXCLUSIVAS DE LUNA IA!

Como tu especialista personal, tengo ofertas súper especiales:

⚡ **FLASH SALE - Solo hoy:**
• 25% descuento en collares premium
• 30% OFF en juguetes interactivos  
• Envío GRATIS en pedidos +30€
• Regalo sorpresa incluido

🎯 **BUNDLE ESPECIAL:**
Collar + Juguete + Pienso = €79.99 (antes €120)
¡Ahorro de €40! 💰

⏰ **Oferta válida solo 2 horas**

¿Aprovechamos esta súper oferta? Tu mascota te lo agradecerá 🐾✨`

          replyMarkup = {
            inline_keyboard: [
              [
                { text: "🔥 ¡Quiero la Oferta!", callback_data: "claim_offer" }
              ],
              [
                { text: "📦 Ver Bundle", callback_data: "show_bundle" },
                { text: "💬 Más Info", callback_data: "more_info" }
              ]
            ]
          }
        }
        
        else if (userMessage.startsWith('/contacto')) {
          lunaResponse = `📞 ¡Perfecto! Aquí tienes todas las formas de contactar:

**🤖 Luna IA (yo) - Disponible 24/7:**
• Telegram: @HairyPet_bot (aquí mismo)
• WhatsApp: +34 744 403 191

**🏪 HairyPetShop:**
• Web: hairypetshop.com
• Email: info@hairypetshop.com
• Facebook: https://www.facebook.com/settings/?tab=linked_instagram
• Instagram: https://www.facebook.com/settings/?tab=linked_instagram

**⚡ Respuesta inmediata:**
Te respondo al instante por Telegram o WhatsApp. ¡Elige lo que prefieras!

¿Prefieres seguir hablando aquí o cambiar a WhatsApp? 💬`

          replyMarkup = {
            inline_keyboard: [
              [
                { text: "💬 Seguir en Telegram", callback_data: "stay_telegram" },
                { text: "📱 Ir a WhatsApp", callback_data: "go_whatsapp" }
              ]
            ]
          }
        }
        
        // Respuestas inteligentes de Luna IA
        else {
          const lowerMessage = userMessage.toLowerCase()
          
          if (lowerMessage.includes('precio') || lowerMessage.includes('cuesta') || lowerMessage.includes('coste')) {
            lunaResponse = `💰 ¡Excelente pregunta sobre precios!

Como especialista, te aseguro que nuestros precios son súper competitivos:

🏷️ **Rango de precios:**
• Collares: €15-45
• Juguetes: €8-35  
• Pienso: €25-60
• Accesorios: €5-80

🎯 **OFERTA ESPECIAL PARA TI:**
15% descuento + envío gratis si compras hoy

¿Qué producto específico te interesa? Te doy el precio exacto y una oferta personalizada 💕`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "💰 Ver Precios Exactos", callback_data: "exact_prices" },
                  { text: "🎁 Mi Oferta Personal", callback_data: "personal_offer" }
                ]
              ]
            }
          }
          
          else if (lowerMessage.includes('calidad') || lowerMessage.includes('bueno') || lowerMessage.includes('recomendación')) {
            lunaResponse = `⭐ ¡Me encanta que preguntes por calidad!

Como especialista con 3+ años de experiencia, solo recomiendo lo mejor:

✅ **Garantía de Calidad Luna:**
• Productos testados por veterinarios
• Materiales premium certificados
• Miles de reseñas 5 estrellas
• Garantía de satisfacción 100%

🏆 **Mis productos favoritos:**
• Collar Premium Luna (mi nombre no es casualidad 😉)
• Juguete Interactivo Pro
• Pienso Premium Plus

¿Qué tipo de mascota tienes? Te personalizo la recomendación perfecta 🎯`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "🐕 Tengo Perro", callback_data: "have_dog" },
                  { text: "🐱 Tengo Gato", callback_data: "have_cat" }
                ],
                [
                  { text: "🐠 Tengo Peces", callback_data: "have_fish" },
                  { text: "🐦 Tengo Pájaros", callback_data: "have_birds" }
                ]
              ]
            }
          }
          
          else if (lowerMessage.includes('envío') || lowerMessage.includes('entrega')) {
            lunaResponse = `🚚 ¡Súper rápido y seguro!

**📦 Opciones de envío:**
• Express 24h: €4.99
• Estándar 48-72h: €2.99  
• GRATIS en pedidos +30€

**🎯 OFERTA ESPECIAL:**
¡Te regalo el envío express si compras ahora!

**📍 Cobertura:**
• Toda España peninsular
• Baleares y Canarias
• Seguimiento en tiempo real

¿Para cuándo lo necesitas? Puedo gestionarte envío urgente si es necesario 💨`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "⚡ Envío Express", callback_data: "express_shipping" },
                  { text: "🆓 Envío Gratis", callback_data: "free_shipping" }
                ]
              ]
            }
          }
          
          else if (lowerMessage.includes('sí') || lowerMessage.includes('si') || lowerMessage.includes('vale') || lowerMessage.includes('ok')) {
            lunaResponse = `🎉 ¡GENIAL! Me emociona ayudarte

Eres el tipo de cliente que me encanta: decidido y que sabe lo que quiere.

🛒 **Te preparo todo:**
• Producto seleccionado ✅
• Descuento aplicado ✅  
• Envío gratis activado ✅
• Regalo sorpresa incluido ✅

💳 **Métodos de pago:**
• Tarjeta de crédito/débito
• PayPal
• Transferencia
• Criptomonedas

¿Cómo prefieres pagar? Te mando el link seguro ahora mismo 🔒`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "💳 Tarjeta", callback_data: "pay_card" },
                  { text: "🅿️ PayPal", callback_data: "pay_paypal" }
                ],
                [
                  { text: "₿ Crypto", callback_data: "pay_crypto" },
                  { text: "📱 WhatsApp", callback_data: "pay_whatsapp" }
                ]
              ]
            }
          }
          
          else {
            lunaResponse = `😊 ¡Entiendo perfectamente!

Como especialista en mascotas, mi trabajo es resolver todas tus dudas para que tomes la mejor decisión.

💡 **¿En qué puedo ayudarte específicamente?**
• Recomendaciones de productos
• Precios y ofertas especiales
• Información de envío
• Cuidados para tu mascota

Tengo más de 3 años ayudando a familias como la tuya y siempre encuentro la solución perfecta 🎯

¿Qué te preocupa más? ¡Estoy aquí para ayudarte! 💕`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "🛒 Ver Productos", callback_data: "show_products" },
                  { text: "💰 Ver Ofertas", callback_data: "show_offers" }
                ],
                [
                  { text: "📞 Contactar", callback_data: "contact_whatsapp" },
                  { text: "❓ Ayuda", callback_data: "help_menu" }
                ]
              ]
            }
          }
        }

        // Enviar respuesta de Luna IA
        const telegramResponse = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: lunaResponse,
            parse_mode: 'Markdown',
            reply_markup: replyMarkup
          }),
        })

        // Registrar respuesta de Luna IA
        await supabase
          .from('telegram_messages')
          .insert({
            user_id: userId,
            username: 'Luna IA',
            chat_id: chatId,
            message: lunaResponse,
            type: 'luna_response',
            created_at: new Date().toISOString()
          })

        // Enviar a n8n para automatización
        await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/n8n-integration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'send_lead_to_n8n',
            data: {
              name: userName,
              telegram_id: userId,
              source: 'telegram_luna_ia',
              message: userMessage,
              luna_response: lunaResponse,
              interest: 'telegram_interaction'
            }
          }),
        })

        console.log('✅ Respuesta de Luna IA enviada y registrada en n8n')
      }

      // Manejar callback queries (botones inline)
      if (update.callback_query) {
        const callbackQuery = update.callback_query
        const chatId = callbackQuery.message.chat.id
        const userId = callbackQuery.from.id
        const userName = callbackQuery.from.first_name || 'Cliente'
        const callbackData = callbackQuery.data

        let responseText = ""
        let replyMarkup = null

        switch (callbackData) {
          case 'show_offers':
            responseText = `🔥 ¡OFERTAS EXCLUSIVAS LUNA IA!

**⚡ FLASH SALE - Solo hoy:**
• Collar Premium: €29.99 → €22.49 (25% OFF)
• Juguete Interactivo: €22.50 → €15.75 (30% OFF)
• Pienso Premium: €48.00 → €38.40 (20% OFF)

**🎁 BONUS:**
• Envío GRATIS
• Regalo sorpresa
• Garantía extendida

⏰ Oferta válida 2 horas. ¡No te la pierdas! 💕`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "🛒 Comprar Ahora", callback_data: "buy_now" },
                  { text: "📱 WhatsApp", callback_data: "go_whatsapp" }
                ]
              ]
            }
            break

          case 'contact_whatsapp':
            responseText = `📱 ¡Perfecto! Te paso a WhatsApp para atención personalizada.

**Luna IA también está en WhatsApp:**
+34 744 403 191

Haz clic en el botón para abrir WhatsApp directamente con un mensaje preparado 👇`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "📱 Abrir WhatsApp", url: "https://wa.me/34744403191?text=¡Hola Luna! Vengo desde Telegram y me interesa conocer más sobre HairyPetShop 🐾" }
                ]
              ]
            }
            break

          case 'buy_now':
            responseText = `🛒 ¡Excelente decisión!

**Opciones de compra:**

1️⃣ **WhatsApp** (recomendado)
   • Atención personalizada
   • Pago seguro
   • Confirmación inmediata

2️⃣ **Web directa**
   • hairypetshop.com
   • Pago online
   • Envío automático

¿Cómo prefieres comprar? ¡Te ayudo con todo! 💕`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "📱 Comprar por WhatsApp", url: "https://wa.me/34744403191?text=¡Hola Luna! Quiero comprar productos de la oferta especial de Telegram 🛒" }
                ],
                [
                  { text: "🌐 Ir a la Web", url: "https://hairypetshop.com" }
                ]
              ]
            }
            break

          default:
            responseText = `😊 ¡Entendido! ¿En qué más puedo ayudarte?

Recuerda que estoy aquí 24/7 para ayudarte con todo lo que necesites para tu mascota 🐾`
        }

        // Responder al callback query
        await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: "✅ Procesando..."
          }),
        })

        // Enviar mensaje de respuesta
        await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: responseText,
            parse_mode: 'Markdown',
            reply_markup: replyMarkup
          }),
        })

        // Registrar interacción
        await supabase
          .from('telegram_messages')
          .insert({
            user_id: userId,
            username: userName,
            chat_id: chatId,
            message: `Callback: ${callbackData}`,
            type: 'callback_query',
            created_at: new Date().toISOString()
          })
      }

      return new Response('OK', {
        headers: corsHeaders,
        status: 200,
      })
    }

    // GET request - Configurar webhook
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const action = url.searchParams.get('action')

      if (action === 'set_webhook') {
        const webhookUrl = `https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/telegram-luna-ia`
        
        const setWebhookResponse = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: webhookUrl,
            allowed_updates: ['message', 'callback_query']
          }),
        })

        const webhookResult = await setWebhookResponse.json()

        return new Response(
          JSON.stringify({
            success: true,
            webhook_set: webhookResult.ok,
            webhook_url: webhookUrl,
            bot_username: '@HairyPet_bot',
            luna_ia_active: true
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Luna IA para Telegram está activa',
          bot_username: '@HairyPet_bot',
          commands: ['/start', '/productos', '/ofertas', '/contacto']
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

  } catch (error) {
    console.error('Error en Telegram Luna IA:', error)
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