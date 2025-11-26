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

    // Productos destacados con imágenes
    const featuredProducts = [
      {
        id: 'collar-premium',
        name: 'Collar Premium Luna',
        price: 29.99,
        originalPrice: 39.99,
        discount: 25,
        image: 'https://readdy.ai/api/search-image?query=Premium leather dog collar with metal buckle, high quality pet accessory, brown leather collar for medium dogs, professional product photography with clean white background&width=400&height=300&seq=collar1&orientation=landscape',
        description: 'Collar de cuero premium con grabado personalizado. Resistente y elegante.'
      },
      {
        id: 'juguete-interactivo',
        name: 'Juguete Interactivo Pro',
        price: 22.50,
        originalPrice: 30.00,
        discount: 25,
        image: 'https://readdy.ai/api/search-image?query=Interactive cat toy with feathers and bells, colorful pet toy for indoor cats, engaging cat entertainment product, clean white background professional photography&width=400&height=300&seq=cattoy1&orientation=landscape',
        description: 'Juguete inteligente que mantiene a tu mascota activa y entretenida.'
      },
      {
        id: 'pienso-premium',
        name: 'Pienso Premium Plus',
        price: 48.00,
        originalPrice: 60.00,
        discount: 20,
        image: 'https://readdy.ai/api/search-image?query=Premium pet food bag with high quality ingredients, dog food package, professional pet nutrition product with clean background&width=400&height=300&seq=food1&orientation=landscape',
        description: 'Alimentación premium para mascotas exigentes. Ingredientes naturales.'
      },
      {
        id: 'cama-ortopedica',
        name: 'Cama Ortopédica Deluxe',
        price: 52.99,
        originalPrice: 70.00,
        discount: 24,
        image: 'https://readdy.ai/api/search-image?query=Orthopedic dog bed with memory foam, comfortable pet sleeping mat, gray fabric dog bed for large breeds, supportive pet furniture with clean background&width=400&height=300&seq=dogbed1&orientation=landscape',
        description: 'Cama ortopédica con memoria foam. Máximo confort para tu mascota.'
      },
      {
        id: 'kit-cuidado',
        name: 'Kit Cuidado Completo',
        price: 35.99,
        originalPrice: 45.00,
        discount: 20,
        image: 'https://readdy.ai/api/search-image?query=Complete pet grooming kit with brushes, nail clippers, shampoo, professional pet care products set with clean white background&width=400&height=300&seq=kit1&orientation=landscape',
        description: 'Kit completo de cuidado: cepillos, champú, cortauñas y más.'
      },
      {
        id: 'transportin-premium',
        name: 'Transportín Premium',
        price: 89.99,
        originalPrice: 120.00,
        discount: 25,
        image: 'https://readdy.ai/api/search-image?query=Premium pet carrier with comfortable interior, airline approved pet transport bag, professional pet travel case with clean background&width=400&height=300&seq=carrier1&orientation=landscape',
        description: 'Transportín premium homologado para viajes. Máxima seguridad.'
      }
    ]

    console.log('🤖 Telegram Luna IA - Procesando request:', req.method)

    if (req.method === 'POST') {
      const update = await req.json()
      console.log('📨 Telegram Update recibido:', JSON.stringify(update, null, 2))

      if (update.message) {
        const message = update.message
        const chatId = message.chat.id
        const userId = message.from.id
        const userName = message.from.first_name || 'Cliente'
        const userMessage = message.text || ''

        console.log(`👤 Mensaje de ${userName} (${userId}): ${userMessage}`)

        // Registrar mensaje en Supabase
        try {
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
        } catch (dbError) {
          console.log('⚠️ Error guardando en DB (continuando):', dbError.message)
        }

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
                { text: "🛒 Ver Productos", callback_data: "show_products" },
                { text: "🔥 Ofertas Flash", callback_data: "show_offers" }
              ],
              [
                { text: "🐕 Perros", callback_data: "category_perros" },
                { text: "🐱 Gatos", callback_data: "category_gatos" }
              ],
              [
                { text: "📞 Contactar", callback_data: "contact_whatsapp" }
              ]
            ]
          }
        }
        
        else if (userMessage.startsWith('/productos')) {
          // Mostrar catálogo completo con imágenes
          lunaResponse = `🛒 ¡Catálogo Completo HairyPetShop!

Como especialista, estos son mis productos favoritos con **OFERTAS EXCLUSIVAS**:

🔥 **DESCUENTOS ESPECIALES SOLO HOY**
⏰ Válido por tiempo limitado`

          replyMarkup = {
            inline_keyboard: [
              [
                { text: "🎯 Collar Premium (-25%)", callback_data: "product_collar-premium" }
              ],
              [
                { text: "🎾 Juguete Interactivo (-25%)", callback_data: "product_juguete-interactivo" }
              ],
              [
                { text: "🍖 Pienso Premium (-20%)", callback_data: "product_pienso-premium" }
              ],
              [
                { text: "🛏️ Cama Ortopédica (-24%)", callback_data: "product_cama-ortopedica" }
              ],
              [
                { text: "🧴 Kit Cuidado (-20%)", callback_data: "product_kit-cuidado" }
              ],
              [
                { text: "🎒 Transportín (-25%)", callback_data: "product_transportin-premium" }
              ],
              [
                { text: "💰 Ver Todas las Ofertas", callback_data: "show_all_offers" }
              ]
            ]
          }
        }
        
        else if (userMessage.startsWith('/ofertas')) {
          lunaResponse = `🔥 ¡OFERTAS EXCLUSIVAS DE LUNA IA!

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
                { text: "🛒 Ver Productos con Descuento", callback_data: "show_products" }
              ],
              [
                { text: "⚡ Comprar Ahora", callback_data: "buy_now_fast" }
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
                  { text: "🛒 Ver Productos con Precios", callback_data: "show_products" }
                ],
                [
                  { text: "🎁 Mi Oferta Personal", callback_data: "personal_offer" }
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
        console.log('📤 Enviando respuesta de Luna IA...')
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

        const telegramResult = await telegramResponse.json()
        console.log('📨 Respuesta de Telegram API:', telegramResult)

        if (!telegramResponse.ok) {
          console.error('❌ Error enviando mensaje:', telegramResult)
        } else {
          console.log('✅ Mensaje enviado correctamente')
        }

        // Registrar respuesta de Luna IA
        try {
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
        } catch (dbError) {
          console.log('⚠️ Error guardando respuesta en DB:', dbError.message)
        }

        // Enviar a n8n para automatización
        try {
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
          console.log('✅ Lead enviado a n8n')
        } catch (n8nError) {
          console.log('⚠️ Error enviando a n8n:', n8nError.message)
        }
      }

      // Manejar callback queries (botones inline) - MEJORADO
      if (update.callback_query) {
        const callbackQuery = update.callback_query
        const chatId = callbackQuery.message.chat.id
        const userId = callbackQuery.from.id
        const userName = callbackQuery.from.first_name || 'Cliente'
        const callbackData = callbackQuery.data

        console.log(`🔘 Callback de ${userName}: ${callbackData}`)

        let responseText = ""
        let replyMarkup = null
        let sendPhoto = false
        let photoUrl = ""

        // Manejar productos específicos
        if (callbackData.startsWith('product_')) {
          const productId = callbackData.replace('product_', '')
          const product = featuredProducts.find(p => p.id === productId)
          
          if (product) {
            sendPhoto = true
            photoUrl = product.image
            
            responseText = `🎯 **${product.name}**

💰 **PRECIO ESPECIAL:** €${product.price} ~~€${product.originalPrice}~~
🔥 **DESCUENTO:** ${product.discount}% OFF
💸 **AHORRAS:** €${(product.originalPrice - product.price).toFixed(2)}

📝 **Descripción:**
${product.description}

🎁 **INCLUYE GRATIS:**
• Envío express 24h
• Regalo sorpresa
• Garantía extendida

⏰ **Oferta válida solo 1 hora**

¿Lo quieres? ¡Te proceso la compra ahora mismo! 🚀`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "🛒 ¡SÍ, LO QUIERO!", callback_data: `buy_${productId}` }
                ],
                [
                  { text: "📱 Comprar por WhatsApp", callback_data: `whatsapp_buy_${productId}` }
                ],
                [
                  { text: "🔙 Ver Más Productos", callback_data: "show_products" }
                ]
              ]
            }
          }
        }
        
        // Manejar compras directas
        else if (callbackData.startsWith('buy_')) {
          const productId = callbackData.replace('buy_', '')
          const product = featuredProducts.find(p => p.id === productId)
          
          if (product) {
            responseText = `🎉 ¡EXCELENTE ELECCIÓN!

**Producto:** ${product.name}
**Precio:** €${product.price}
**Descuento:** ${product.discount}% OFF

🚀 **PROCESO DE COMPRA RÁPIDO:**

**Opción 1: Pago Inmediato**
• Tarjeta de crédito/débito
• PayPal
• Transferencia bancaria

**Opción 2: WhatsApp Personal**
• Atención personalizada
• Pago contra reembolso
• Financiación disponible

¿Cómo prefieres pagar? ¡Te ayudo con todo! 💕`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "💳 Pago Online Inmediato", url: `https://hairypetshop.com/checkout?product=${productId}&telegram=${userId}&discount=${product.discount}` }
                ],
                [
                  { text: "📱 WhatsApp Personal", url: `https://wa.me/34744403191?text=¡Hola Luna! Quiero comprar ${product.name} por €${product.price} desde Telegram. Mi ID: ${userId}` }
                ],
                [
                  { text: "🔙 Elegir Otro Producto", callback_data: "show_products" }
                ]
              ]
            }

            // Registrar venta potencial
            try {
              await supabase
                .from('telegram_sales')
                .insert({
                  user_id: userId,
                  username: userName,
                  product_id: productId,
                  product_name: product.name,
                  price: product.price,
                  status: 'interested',
                  created_at: new Date().toISOString()
                })
            } catch (dbError) {
              console.log('⚠️ Error guardando venta potencial:', dbError.message)
            }
          }
        }
        
        // Manejar compras por WhatsApp
        else if (callbackData.startsWith('whatsapp_buy_')) {
          const productId = callbackData.replace('whatsapp_buy_', '')
          const product = featuredProducts.find(p => p.id === productId)
          
          if (product) {
            responseText = `📱 ¡Perfecto! Te redirijo a WhatsApp para completar tu compra.

**Producto:** ${product.name}
**Precio especial:** €${product.price}

En WhatsApp podrás:
• Confirmar tu pedido
• Elegir método de pago
• Recibir seguimiento personalizado
• Resolver cualquier duda

¡Haz clic en el botón para continuar! 👇`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "📱 Continuar en WhatsApp", url: `https://wa.me/34744403191?text=¡Hola Luna! Quiero comprar ${product.name} por €${product.price}. Vengo desde Telegram (ID: ${userId}). ¿Me ayudas con el proceso de compra?` }
                ]
              ]
            }
          }
        }

        // Otros callbacks
        else {
          switch (callbackData) {
            case 'show_products':
              responseText = `🛒 **CATÁLOGO EXCLUSIVO TELEGRAM**

¡Productos seleccionados especialmente para ti con descuentos únicos!

👇 **Haz clic en cualquier producto para ver detalles y comprar:**`

              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🎯 Collar Premium (-25%)", callback_data: "product_collar-premium" }
                  ],
                  [
                    { text: "🎾 Juguete Interactivo (-25%)", callback_data: "product_juguete-interactivo" }
                  ],
                  [
                    { text: "🍖 Pienso Premium (-20%)", callback_data: "product_pienso-premium" }
                  ],
                  [
                    { text: "🛏️ Cama Ortopédica (-24%)", callback_data: "product_cama-ortopedica" }
                  ],
                  [
                    { text: "🧴 Kit Cuidado (-20%)", callback_data: "product_kit-cuidado" }
                  ],
                  [
                    { text: "🎒 Transportín (-25%)", callback_data: "product_transportin-premium" }
                  ]
                ]
              }
              break

            case 'buy_now_fast':
            case 'show_all_offers':
              responseText = `🔥 **COMPRA RÁPIDA - OFERTAS FLASH**

¡Elige tu producto favorito y cómpralo en 30 segundos!

**DESCUENTOS ACTIVOS:**
• Hasta 30% OFF
• Envío GRATIS
• Regalo incluido

👇 **Selecciona y compra inmediatamente:**`

              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🎯 Collar €22.49", callback_data: "buy_collar-premium" }
                  ],
                  [
                    { text: "🎾 Juguete €15.75", callback_data: "buy_juguete-interactivo" }
                  ],
                  [
                    { text: "🍖 Pienso €38.40", callback_data: "buy_pienso-premium" }
                  ],
                  [
                    { text: "🛏️ Cama €39.99", callback_data: "buy_cama-ortopedica" }
                  ],
                  [
                    { text: "📱 Comprar por WhatsApp", callback_data: "go_whatsapp" }
                  ]
                ]
              }
              break

            case 'contact_whatsapp':
            case 'go_whatsapp':
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

            case 'stay_telegram':
              responseText = `😊 ¡Perfecto! Me quedo aquí contigo en Telegram.

¿En qué más puedo ayudarte? Puedo:
• Recomendarte productos específicos
• Darte precios y ofertas exclusivas
• Ayudarte con información de envío
• Resolver cualquier duda sobre mascotas

¡Estoy aquí para ti 24/7! 🐾💕`

              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🛒 Ver Productos", callback_data: "show_products" },
                    { text: "💰 Ver Ofertas", callback_data: "show_all_offers" }
                  ]
                ]
              }
              break

            default:
              responseText = `😊 ¡Entendido! ¿En qué más puedo ayudarte?

Recuerda que estoy aquí 24/7 para ayudarte con todo lo que necesites para tu mascota 🐾

¿Quieres ver nuestros productos o prefieres que te ayude con algo específico?`

              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🛒 Ver Productos", callback_data: "show_products" },
                    { text: "💰 Ver Ofertas", callback_data: "show_all_offers" }
                  ],
                  [
                    { text: "📱 WhatsApp", callback_data: "go_whatsapp" }
                  ]
                ]
              }
          }
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

        // Enviar respuesta (con foto si es necesario)
        let callbackResponse
        
        if (sendPhoto && photoUrl) {
          callbackResponse = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: chatId,
              photo: photoUrl,
              caption: responseText,
              parse_mode: 'Markdown',
              reply_markup: replyMarkup
            }),
          })
        } else {
          callbackResponse = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
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
        }

        const callbackResult = await callbackResponse.json()
        console.log('📨 Respuesta callback:', callbackResult)

        // Registrar interacción
        try {
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
        } catch (dbError) {
          console.log('⚠️ Error guardando callback en DB:', dbError.message)
        }
      }

      return new Response('OK', {
        headers: corsHeaders,
        status: 200,
      })
    }

    // Manejar requests GET para configuración
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const action = url.searchParams.get('action')

      if (action === 'set_webhook') {
        const webhookUrl = `https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/telegram-luna-ia-fixed`
        
        const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: webhookUrl,
            allowed_updates: ['message', 'callback_query']
          }),
        })

        const result = await response.json()
        console.log('🔗 Webhook configurado:', result)

        return new Response(JSON.stringify({
          success: true,
          message: 'Webhook configurado correctamente',
          webhook_url: webhookUrl,
          result: result
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (action === 'get_webhook_info') {
        const response = await fetch(`${TELEGRAM_API_URL}/getWebhookInfo`)
        const result = await response.json()
        
        return new Response(JSON.stringify({
          success: true,
          webhook_info: result
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (action === 'test_bot') {
        const response = await fetch(`${TELEGRAM_API_URL}/getMe`)
        const result = await response.json()
        
        return new Response(JSON.stringify({
          success: true,
          bot_info: result,
          message: 'Bot funcionando correctamente'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Telegram Luna IA Bot funcionando',
        available_actions: ['set_webhook', 'get_webhook_info', 'test_bot']
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Method not allowed', {
      headers: corsHeaders,
      status: 405,
    })

  } catch (error) {
    console.error('❌ Error en Telegram Luna IA:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})