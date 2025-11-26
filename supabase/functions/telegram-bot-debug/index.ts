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
    // CONFIGURACIÓN SUPABASE - USANDO TU PROYECTO ACTUAL
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    console.log('🔍 Supabase URL:', supabaseUrl)
    console.log('🔍 Supabase Key exists:', !!supabaseKey)
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // CONFIGURACIÓN TELEGRAM BOT
    const TELEGRAM_BOT_TOKEN = "7611611121:AAHkEDU1_QK68PKLH2ac-2Ikldi5JukOx4A"
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

    console.log('🤖 Telegram Bot Debug - Procesando request:', req.method)

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

        // CREAR TABLA SI NO EXISTE
        try {
          await supabase.rpc('create_telegram_table_if_not_exists')
        } catch (error) {
          console.log('⚠️ Creando tabla telegram_messages manualmente...')
          try {
            const { error: createError } = await supabase
              .from('telegram_messages')
              .insert({
                user_id: 999999,
                username: 'test',
                chat_id: 999999,
                message: 'test',
                type: 'test',
                created_at: new Date().toISOString()
              })
            
            if (createError && createError.code === '42P01') {
              console.log('❌ Tabla no existe, necesita ser creada en Supabase')
            }
          } catch (insertError) {
            console.log('⚠️ Error de inserción:', insertError)
          }
        }

        // REGISTRAR MENSAJE EN SUPABASE
        try {
          const { data, error } = await supabase
            .from('telegram_messages')
            .insert({
              user_id: userId,
              username: userName,
              chat_id: chatId,
              message: userMessage,
              type: 'user_message',
              created_at: new Date().toISOString()
            })
            .select()

          console.log('✅ Mensaje guardado en Supabase:', data)
          if (error) console.log('⚠️ Error guardando:', error)
        } catch (dbError) {
          console.log('⚠️ Error de DB:', dbError)
        }

        let lunaResponse = ""
        let replyMarkup = null

        // RESPUESTAS DE LUNA IA
        if (userMessage.startsWith('/start')) {
          lunaResponse = `¡Hola ${userName}! 👋🐾

Soy Luna IA, tu especialista personal en mascotas de HairyPetShop. 

🎯 **¿Cómo puedo ayudarte hoy?**
• Recomendaciones de productos
• Ofertas exclusivas
• Información de envío
• Cuidados para mascotas

¡Estoy aquí 24/7 para ayudarte! ✨`

          replyMarkup = {
            inline_keyboard: [
              [
                { text: "🛒 Ver Productos", callback_data: "show_products" },
                { text: "🔥 Ofertas", callback_data: "show_offers" }
              ],
              [
                { text: "📱 WhatsApp", callback_data: "go_whatsapp" },
                { text: "📞 Contacto", callback_data: "contact_info" }
              ]
            ]
          }
        } else {
          lunaResponse = `¡Hola ${userName}! 😊

Soy Luna IA, tu asistente personal para mascotas.

¿En qué puedo ayudarte? Puedo:
• Recomendarte productos
• Darte ofertas especiales
• Ayudarte con información

¡Escríbeme lo que necesites! 🐾`

          replyMarkup = {
            inline_keyboard: [
              [
                { text: "🛒 Productos", callback_data: "show_products" },
                { text: "💰 Ofertas", callback_data: "show_offers" }
              ]
            ]
          }
        }

        // ENVIAR RESPUESTA A TELEGRAM
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
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Error enviando mensaje a Telegram',
              telegram_error: telegramResult
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500,
            }
          )
        }

        // REGISTRAR RESPUESTA DE LUNA IA
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
          console.log('⚠️ Error guardando respuesta:', dbError)
        }

        // ENVIAR A N8N WORKFLOW
        try {
          const n8nResponse = await fetch('http://localhost:5678/webhook/petstore-lead', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              event: 'telegram_interaction',
              timestamp: new Date().toISOString(),
              lead: {
                name: userName,
                telegram_id: userId,
                source: 'telegram_luna_ia',
                message: userMessage,
                luna_response: lunaResponse,
                interest: 'telegram_bot'
              }
            }),
          })
          
          console.log('✅ Enviado a n8n workflow:', n8nResponse.ok)
        } catch (n8nError) {
          console.log('⚠️ Error enviando a n8n:', n8nError)
        }

        return new Response('OK', {
          headers: corsHeaders,
          status: 200,
        })
      }

      // MANEJAR CALLBACK QUERIES
      if (update.callback_query) {
        const callbackQuery = update.callback_query
        const chatId = callbackQuery.message.chat.id
        const callbackData = callbackQuery.data

        let responseText = ""
        let replyMarkup = null

        switch (callbackData) {
          case 'show_offers':
            responseText = `🔥 **OFERTAS EXCLUSIVAS**

• Collar Premium: €29.99 → €22.49 (25% OFF)
• Juguete Interactivo: €22.50 → €15.75 (30% OFF)
• Pienso Premium: €48.00 → €38.40 (20% OFF)

🎁 **BONUS:** Envío GRATIS + Regalo sorpresa

⏰ Oferta válida hoy. ¡No te la pierdas!`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "🛒 Comprar Ahora", callback_data: "buy_now" },
                  { text: "📱 WhatsApp", callback_data: "go_whatsapp" }
                ]
              ]
            }
            break

          case 'go_whatsapp':
            responseText = `📱 **¡Perfecto!** Te paso a WhatsApp para atención personalizada.

**Luna IA también está en WhatsApp:**
+34 744 403 191

Haz clic en el botón para abrir WhatsApp 👇`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "📱 Abrir WhatsApp", url: "https://wa.me/34744403191?text=¡Hola Luna! Vengo desde Telegram 🐾" }
                ]
              ]
            }
            break

          default:
            responseText = `😊 ¡Entendido! ¿En qué más puedo ayudarte?

Estoy aquí 24/7 para ayudarte con todo lo que necesites 🐾`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "🛒 Productos", callback_data: "show_products" },
                  { text: "💰 Ofertas", callback_data: "show_offers" }
                ]
              ]
            }
        }

        // RESPONDER AL CALLBACK
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

        // ENVIAR MENSAJE DE RESPUESTA
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

        return new Response('OK', {
          headers: corsHeaders,
          status: 200,
        })
      }
    }

    // GET REQUEST - CONFIGURAR WEBHOOK
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const action = url.searchParams.get('action')

      if (action === 'set_webhook') {
        const webhookUrl = `${supabaseUrl.replace('/rest/v1', '')}/functions/v1/telegram-bot-debug`
        
        console.log('🔧 Configurando webhook:', webhookUrl)
        
        const setWebhookResponse = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: webhookUrl,
            allowed_updates: ['message', 'callback_query'],
            drop_pending_updates: true
          }),
        })

        const webhookResult = await setWebhookResponse.json()
        console.log('🔧 Resultado webhook:', webhookResult)

        return new Response(
          JSON.stringify({
            success: true,
            webhook_set: webhookResult.ok,
            webhook_url: webhookUrl,
            webhook_result: webhookResult,
            bot_username: '@HairyPet_bot',
            supabase_url: supabaseUrl,
            message: webhookResult.ok ? '✅ Webhook configurado correctamente' : '❌ Error configurando webhook'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      if (action === 'test_bot') {
        const testResponse = await fetch(`${TELEGRAM_API_URL}/getMe`)
        const botInfo = await testResponse.json()
        
        return new Response(
          JSON.stringify({
            success: true,
            bot_info: botInfo,
            bot_username: '@HairyPet_bot',
            supabase_url: supabaseUrl,
            supabase_connected: !!supabaseKey,
            message: '🤖 Luna IA está funcionando correctamente'
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
          message: '🤖 Luna IA para Telegram - Debug Version',
          bot_username: '@HairyPet_bot',
          supabase_url: supabaseUrl,
          supabase_connected: !!supabaseKey,
          webhook_url: `${supabaseUrl.replace('/rest/v1', '')}/functions/v1/telegram-bot-debug`,
          actions: {
            set_webhook: '?action=set_webhook',
            test_bot: '?action=test_bot'
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

  } catch (error) {
    console.error('❌ Error en Telegram Bot Debug:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
        supabase_url: Deno.env.get('SUPABASE_URL'),
        supabase_connected: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})