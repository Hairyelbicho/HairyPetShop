import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_BOT_TOKEN = "7937084864:AAE6yGbFITqMJdKI2cCm_8d2vFg8lDaD-Ps";
const WEBHOOK_URL = "https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/telegram-luna-ia-active";

// Productos con enlaces directos de compra
const productos = [
  {
    id: 1,
    nombre: "🐕 Collar Premium para Perros",
    precio: "€29.99",
    precio_original: "€39.99",
    descuento: "25%",
    imagen: "https://readdy.ai/api/search-image?query=Premium leather dog collar with metal buckle high quality brown leather collar for dogs professional product photography clean white background&width=400&height=300&seq=collar1&orientation=landscape",
    descripcion: "Collar de cuero premium con hebilla de metal. Resistente y elegante para perros medianos y grandes.",
    enlace_compra: "https://hairypetshop.readdy.ai/?product=collar-premium&utm_source=telegram&utm_medium=bot"
  },
  {
    id: 2,
    nombre: "🐱 Juguete Interactivo para Gatos",
    precio: "€22.50",
    precio_original: "€30.00",
    descuento: "25%",
    imagen: "https://readdy.ai/api/search-image?query=Interactive cat toy with feathers and bells colorful pet toy for indoor cats engaging entertainment product clean white background&width=400&height=300&seq=cattoy1&orientation=landscape",
    descripcion: "Juguete interactivo con plumas y cascabeles. Mantiene a tu gato activo y entretenido durante horas.",
    enlace_compra: "https://hairypetshop.readdy.ai/?product=juguete-gato&utm_source=telegram&utm_medium=bot"
  },
  {
    id: 3,
    nombre: "🍖 Pienso Premium Plus",
    precio: "€48.00",
    precio_original: "€60.00",
    descuento: "20%",
    imagen: "https://readdy.ai/api/search-image?query=Premium dog food bag high quality pet nutrition dry food for dogs professional packaging clean white background&width=400&height=300&seq=food1&orientation=landscape",
    descripcion: "Pienso premium con ingredientes naturales. Nutrición completa para perros de todas las edades.",
    enlace_compra: "https://hairypetshop.readdy.ai/?product=pienso-premium&utm_source=telegram&utm_medium=bot"
  },
  {
    id: 4,
    nombre: "🛏️ Cama Ortopédica Deluxe",
    precio: "€52.99",
    precio_original: "€69.99",
    descuento: "24%",
    imagen: "https://readdy.ai/api/search-image?query=Orthopedic dog bed with memory foam comfortable pet sleeping mat gray fabric bed for large dogs supportive furniture clean white background&width=400&height=300&seq=bed1&orientation=landscape",
    descripcion: "Cama ortopédica con espuma de memoria. Máximo confort y soporte para articulaciones de tu mascota.",
    enlace_compra: "https://hairypetshop.readdy.ai/?product=cama-ortopedica&utm_source=telegram&utm_medium=bot"
  },
  {
    id: 5,
    nombre: "🧴 Kit Cuidado Completo",
    precio: "€35.99",
    precio_original: "€45.00",
    descuento: "20%",
    imagen: "https://readdy.ai/api/search-image?query=Complete pet care kit with shampoo brush nail clippers grooming supplies professional pet hygiene products clean white background&width=400&height=300&seq=kit1&orientation=landscape",
    descripcion: "Kit completo de cuidado e higiene. Incluye champú, cepillo, cortauñas y más accesorios esenciales.",
    enlace_compra: "https://hairypetshop.readdy.ai/?product=kit-cuidado&utm_source=telegram&utm_medium=bot"
  },
  {
    id: 6,
    nombre: "🚗 Transportín Premium",
    precio: "€89.99",
    precio_original: "€119.99",
    descuento: "25%",
    imagen: "https://readdy.ai/api/search-image?query=Premium pet carrier transportable cage for dogs and cats safe travel carrier with ventilation professional design clean white background&width=400&height=300&seq=carrier1&orientation=landscape",
    descripcion: "Transportín premium con ventilación. Viajes seguros y cómodos para tu mascota.",
    enlace_compra: "https://hairypetshop.readdy.ai/?product=transportin&utm_source=telegram&utm_medium=bot"
  }
];

serve(async (req) => {
  try {
    const url = new URL(req.url);
    
    // Configurar webhook
    if (url.searchParams.get('action') === 'set_webhook') {
      const webhookResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: WEBHOOK_URL,
          allowed_updates: ["message", "callback_query"]
        })
      });
      
      const result = await webhookResponse.json();
      return new Response(JSON.stringify({
        success: true,
        message: "✅ Webhook configurado correctamente para @HairyPet_bot",
        telegram_response: result,
        webhook_url: WEBHOOK_URL,
        bot_url: "https://t.me/HairyPet_bot"
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Testear bot
    if (url.searchParams.get('action') === 'test_bot') {
      const testResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
      const botInfo = await testResponse.json();
      
      return new Response(JSON.stringify({
        success: true,
        message: "🤖 Bot @HairyPet_bot funcionando correctamente",
        bot_info: botInfo,
        test_url: "https://t.me/HairyPet_bot",
        shop_url: "https://hairypetshop.readdy.ai"
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Procesar mensajes del bot
    if (req.method === 'POST') {
      const body = await req.json();
      
      // Mensaje de texto
      if (body.message) {
        const chatId = body.message.chat.id;
        const messageText = body.message.text;
        const userName = body.message.from.first_name || 'Cliente';

        let response = '';
        let keyboard = null;

        if (messageText === '/start') {
          response = `¡Hola ${userName}! 👋 

🤖 Soy **Luna IA**, tu especialista personal en mascotas de **HairyPetShop**. 

🐾 Como experta en más de 1,000 productos, puedo ayudarte a encontrar exactamente lo que necesitas para tu peludo amigo.

✨ **¿Qué puedo hacer por ti?**
• Ver nuestro catálogo completo
• Recomendarte productos específicos  
• Ofrecerte descuentos exclusivos
• Llevarte directo a la compra

🎯 **OFERTA ESPECIAL HOY:**
**25% DESCUENTO** + **ENVÍO GRATIS** en todos los productos

¿Empezamos? 🚀`;

          keyboard = {
            inline_keyboard: [
              [
                { text: "🛒 Ver Productos con Descuento", callback_data: "ver_productos" },
              ],
              [
                { text: "🌐 Ir a la Tienda Online", url: "https://hairypetshop.readdy.ai/?utm_source=telegram&utm_medium=bot" }
              ],
              [
                { text: "💬 Hablar con Luna por WhatsApp", url: "https://wa.me/34744403191?text=¡Hola Luna! Vengo del bot de Telegram. Me interesa conocer más sobre los productos para mascotas." }
              ]
            ]
          };

        } else if (messageText === '/productos' || messageText.toLowerCase().includes('producto')) {
          response = `🛒 **CATÁLOGO HAIRYPETSHOP** - Descuentos Especiales

🎯 **OFERTA LIMITADA:** Todos los productos con hasta **25% DESCUENTO** + **ENVÍO GRATIS**

👇 **Selecciona el producto que te interesa:**`;

          keyboard = {
            inline_keyboard: productos.map(producto => [
              { text: `${producto.nombre} - ${producto.precio} (-${producto.descuento})`, callback_data: `producto_${producto.id}` }
            ]).concat([
              [{ text: "🌐 Ver Todos en la Tienda", url: "https://hairypetshop.readdy.ai/?utm_source=telegram&utm_medium=bot" }]
            ])
          };

        } else {
          response = `¡Hola ${userName}! 🤖

No he entendido tu mensaje, pero estoy aquí para ayudarte con todo lo que necesites para tu mascota.

🐾 **¿Qué te gustaría hacer?**`;

          keyboard = {
            inline_keyboard: [
              [
                { text: "🛒 Ver Productos", callback_data: "ver_productos" }
              ],
              [
                { text: "🌐 Ir a la Tienda", url: "https://hairypetshop.readdy.ai/?utm_source=telegram&utm_medium=bot" }
              ],
              [
                { text: "💬 Hablar con Luna", url: "https://wa.me/34744403191?text=¡Hola Luna! Tengo una consulta sobre productos para mascotas." }
              ]
            ]
          };
        }

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: response,
            parse_mode: 'Markdown',
            reply_markup: keyboard
          })
        });
      }

      // Callback queries (botones)
      if (body.callback_query) {
        const chatId = body.callback_query.message.chat.id;
        const callbackData = body.callback_query.data;
        const userName = body.callback_query.from.first_name || 'Cliente';

        if (callbackData === 'ver_productos') {
          const response = `🛒 **CATÁLOGO HAIRYPETSHOP** - Luna IA Recomienda

🎯 **OFERTA ESPECIAL PARA TI:**
✅ **25% DESCUENTO** en todos los productos
✅ **ENVÍO GRATIS** sin mínimo de compra  
✅ **Regalo sorpresa** incluido
✅ **Garantía total** 30 días

⏰ **Oferta válida solo 1 hora**

👇 **Elige el producto perfecto para tu mascota:**`;

          const keyboard = {
            inline_keyboard: productos.map(producto => [
              { text: `${producto.nombre} - ${producto.precio} (-${producto.descuento})`, callback_data: `producto_${producto.id}` }
            ]).concat([
              [{ text: "🌐 Ver Tienda Completa", url: "https://hairypetshop.readdy.ai/?utm_source=telegram&utm_medium=bot" }]
            ])
          };

          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: body.callback_query.message.message_id,
              text: response,
              parse_mode: 'Markdown',
              reply_markup: keyboard
            })
          });

        } else if (callbackData.startsWith('producto_')) {
          const productoId = parseInt(callbackData.split('_')[1]);
          const producto = productos.find(p => p.id === productoId);

          if (producto) {
            // Enviar imagen del producto
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                photo: producto.imagen,
                caption: `✨ **${producto.nombre}** ✨

💰 **PRECIO ESPECIAL:** ${producto.precio} ~~${producto.precio_original}~~ (Ahorras ${producto.descuento})

📝 **Descripción:** ${producto.descripcion}

🎁 **INCLUYE GRATIS:**
✅ Envío Express (valor €8.99)
✅ Garantía Premium 30 días  
✅ Regalo sorpresa para tu mascota
✅ Soporte Luna IA 24/7

⏰ **¡Solo quedan 3 unidades a este precio!**

🤖 Como especialista Luna IA, te confirmo: **¡Es una elección PERFECTA!** 

💎 **¿Cómo quieres comprarlo?**`,
                parse_mode: 'Markdown',
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: "🛒 COMPRAR AHORA EN LA WEB", url: producto.enlace_compra }
                    ],
                    [
                      { text: "💬 Comprar por WhatsApp", url: `https://wa.me/34744403191?text=¡Hola Luna! Quiero comprar ${producto.nombre} por ${producto.precio}. ¿Me preparas el pedido?` }
                    ],
                    [
                      { text: "🌐 Ver Más Detalles en la Tienda", url: `https://hairypetshop.readdy.ai/?product=${producto.id}&utm_source=telegram&utm_medium=bot` }
                    ],
                    [
                      { text: "🔙 Ver Más Productos", callback_data: "ver_productos" }
                    ]
                  ]
                }
              })
            });
          }
        }

        // Responder al callback query
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: body.callback_query.id,
            text: "✅ Luna IA procesando..."
          })
        });
      }

      return new Response("OK", { status: 200 });
    }

    return new Response("Telegram Bot Ready", { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});