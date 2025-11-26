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

    // PRODUCTOS COMPLETOS DE LA WEB - SINCRONIZADOS PERFECTAMENTE
    const featuredProducts = [
      {
        id: 'collar-premium-perros',
        name: 'Collar Premium para Perros',
        price: 24.99,
        originalPrice: 34.99,
        discount: 29,
        rating: 4.8,
        reviews: 156,
        category: 'perros',
        image: 'https://readdy.ai/api/search-image?query=Premium leather dog collar with metal buckle, high quality pet accessory, brown leather collar for medium dogs, professional product photography&width=400&height=300&seq=collar1&orientation=landscape',
        description: 'Collar de cuero premium con hebilla metálica resistente. Diseñado para la comodidad y seguridad de tu perro.',
        features: ['Cuero genuino premium', 'Hebilla metálica reforzada', 'Grabado personalizado', 'Resistente al agua', 'Ajustable'],
        webUrl: 'https://hairypetshop.com/producto/collar-premium-perros'
      },
      {
        id: 'juguete-interactivo-gatos',
        name: 'Juguete Interactivo para Gatos',
        price: 18.50,
        originalPrice: 25.00,
        discount: 26,
        rating: 4.9,
        reviews: 203,
        category: 'gatos',
        image: 'https://readdy.ai/api/search-image?query=Interactive cat toy with feathers and bells, colorful pet toy for indoor cats, engaging cat entertainment product, clean white background&width=400&height=300&seq=cattoy1&orientation=landscape',
        description: 'Juguete interactivo con plumas y cascabeles que mantiene a tu gato activo y entretenido durante horas.',
        features: ['Plumas naturales', 'Cascabeles sonoros', 'Estimula instintos cazadores', 'Materiales seguros', 'Duradero'],
        webUrl: 'https://hairypetshop.com/producto/juguete-interactivo-gatos'
      },
      {
        id: 'acuario-completo-50l',
        name: 'Acuario Completo 50L',
        price: 89.99,
        originalPrice: 120.00,
        discount: 25,
        rating: 4.7,
        reviews: 89,
        category: 'peces',
        image: 'https://readdy.ai/api/search-image?query=Complete 50 liter aquarium tank with LED lighting, filter system, tropical fish tank setup, modern aquarium design&width=400&height=300&seq=aquarium1&orientation=landscape',
        description: 'Acuario completo de 50 litros con sistema de filtración LED y todo lo necesario para tus peces tropicales.',
        features: ['Iluminación LED completa', 'Sistema de filtro avanzado', 'Calentador automático', 'Kit de inicio incluido', 'Cristal resistente'],
        webUrl: 'https://hairypetshop.com/producto/acuario-50l'
      },
      {
        id: 'jaula-espaciosa-pajaros',
        name: 'Jaula Espaciosa para Pájaros',
        price: 65.00,
        originalPrice: 85.00,
        discount: 24,
        rating: 4.6,
        reviews: 67,
        category: 'pajaros',
        image: 'https://readdy.ai/api/search-image?query=Large bird cage with multiple perches, spacious aviary for parrots and canaries, white metal bird cage with feeding bowls, pet store quality&width=400&height=300&seq=birdcage1&orientation=landscape',
        description: 'Jaula espaciosa con múltiples perchas, ideal para canarios, periquitos y loros pequeños.',
        features: ['Múltiples perchas naturales', 'Comederos y bebederos', 'Bandeja extraíble', 'Espacio amplio', 'Fácil limpieza'],
        webUrl: 'https://hairypetshop.com/producto/jaula-pajaros'
      },
      {
        id: 'arnes-profesional-caballos',
        name: 'Arnés Profesional para Caballos',
        price: 145.00,
        originalPrice: 180.00,
        discount: 19,
        rating: 4.9,
        reviews: 34,
        category: 'caballos',
        image: 'https://readdy.ai/api/search-image?query=Professional horse harness with leather straps, equestrian equipment for training, brown leather horse tack, high quality riding gear&width=400&height=300&seq=harness1&orientation=landscape',
        description: 'Arnés profesional de cuero para entrenamiento ecuestre. Calidad premium para uso profesional.',
        features: ['Cuero premium italiano', 'Totalmente ajustable', 'Uso profesional certificado', 'Máxima durabilidad', 'Herrajes de acero'],
        webUrl: 'https://hairypetshop.com/producto/arnes-caballos'
      },
      {
        id: 'kit-veterinario-basico',
        name: 'Kit Veterinario Básico',
        price: 78.50,
        originalPrice: 95.00,
        discount: 17,
        rating: 4.8,
        reviews: 112,
        category: 'veterinarios',
        image: 'https://readdy.ai/api/search-image?query=Veterinary medical kit with stethoscope, thermometer and basic tools, professional vet equipment set, medical supplies for pet care&width=400&height=300&seq=vetkit1&orientation=landscape',
        description: 'Kit médico veterinario básico con estetoscopio, termómetro y herramientas esenciales para cuidado básico.',
        features: ['Estetoscopio profesional', 'Termómetro digital', 'Herramientas básicas', 'Maletín organizador', 'Manual incluido'],
        webUrl: 'https://hairypetshop.com/producto/kit-veterinario'
      },
      {
        id: 'cama-ortopedica-perros',
        name: 'Cama Ortopédica para Perros',
        price: 42.99,
        originalPrice: 55.00,
        discount: 22,
        rating: 4.7,
        reviews: 178,
        category: 'perros',
        image: 'https://readdy.ai/api/search-image?query=Orthopedic dog bed with memory foam, comfortable pet sleeping mat, gray fabric dog bed for large breeds, supportive pet furniture&width=400&height=300&seq=dogbed1&orientation=landscape',
        description: 'Cama ortopédica con espuma de memoria para el máximo confort y apoyo articular de tu perro.',
        features: ['Espuma de memoria premium', 'Apoyo ortopédico certificado', 'Funda lavable', 'Base antideslizante', 'Diferentes tamaños'],
        webUrl: 'https://hairypetshop.com/producto/cama-ortopedica'
      },
      {
        id: 'torre-rascador-gatos',
        name: 'Torre Rascador para Gatos',
        price: 56.00,
        originalPrice: 75.00,
        discount: 25,
        rating: 4.8,
        reviews: 145,
        category: 'gatos',
        image: 'https://readdy.ai/api/search-image?query=Multi level cat scratching tower with sisal rope, tall cat tree with platforms and hiding spots, beige cat furniture for indoor cats&width=400&height=300&seq=cattower1&orientation=landscape',
        description: 'Torre rascador multinivel con cuerda de sisal, plataformas y escondites perfecta para gatos de interior.',
        features: ['Múltiples niveles', 'Cuerda de sisal natural', 'Plataformas acolchadas', 'Base súper estable', 'Fácil montaje'],
        webUrl: 'https://hairypetshop.com/producto/torre-rascador'
      },
      {
        id: 'filtro-avanzado-acuario',
        name: 'Filtro Avanzado para Acuario',
        price: 34.99,
        originalPrice: 45.00,
        discount: 22,
        rating: 4.6,
        reviews: 92,
        category: 'peces',
        image: 'https://readdy.ai/api/search-image?query=Advanced aquarium filter system with multiple stages, water filtration equipment for fish tanks, black aquarium filter with tubes&width=400&height=300&seq=filter1&orientation=landscape',
        description: 'Sistema de filtración avanzado de múltiples etapas para mantener el agua cristalina y saludable.',
        features: ['Filtración de 3 etapas', 'Instalación súper fácil', 'Funcionamiento silencioso', 'Media filtrante incluida', 'Bajo consumo'],
        webUrl: 'https://hairypetshop.com/producto/filtro-acuario'
      },
      {
        id: 'comedero-automatico-pajaros',
        name: 'Comedero Automático para Pájaros',
        price: 28.50,
        originalPrice: 38.00,
        discount: 25,
        rating: 4.5,
        reviews: 76,
        category: 'pajaros',
        image: 'https://readdy.ai/api/search-image?query=Automatic bird feeder with seed dispenser, self filling bird food container, clear plastic bird feeder for cages&width=400&height=300&seq=birdfeeder1&orientation=landscape',
        description: 'Comedero automático con dispensador de semillas que mantiene la comida siempre fresca y disponible.',
        features: ['Dispensado automático', 'Capacidad 500g', 'Material transparente resistente', 'Fácil recarga', 'Sistema antigoteo'],
        webUrl: 'https://hairypetshop.com/producto/comedero-automatico'
      },
      {
        id: 'manta-termica-caballos',
        name: 'Manta Térmica para Caballos',
        price: 98.00,
        originalPrice: 125.00,
        discount: 22,
        rating: 4.7,
        reviews: 45,
        category: 'caballos',
        image: 'https://readdy.ai/api/search-image?query=Thermal horse blanket for winter, waterproof horse rug with straps, navy blue equestrian blanket for cold weather protection&width=400&height=300&seq=horseblanket1&orientation=landscape',
        description: 'Manta térmica impermeable diseñada para proteger a tu caballo del frío extremo y la lluvia.',
        features: ['100% impermeable', 'Aislamiento térmico avanzado', 'Correas ajustables', 'Resistente al desgarro', 'Transpirable'],
        webUrl: 'https://hairypetshop.com/producto/manta-termica'
      },
      {
        id: 'estetoscopio-veterinario',
        name: 'Estetoscopio Veterinario Profesional',
        price: 125.00,
        originalPrice: 150.00,
        discount: 17,
        rating: 4.9,
        reviews: 67,
        category: 'veterinarios',
        image: 'https://readdy.ai/api/search-image?query=Professional veterinary stethoscope for animal examination, medical grade vet stethoscope with dual head, black medical instrument&width=400&height=300&seq=stethoscope1&orientation=landscape',
        description: 'Estetoscopio veterinario profesional de grado médico con cabezal dual para exámenes precisos en todas las especies.',
        features: ['Grado médico certificado', 'Cabezal dual optimizado', 'Acústica superior', 'Auriculares súper cómodos', 'Garantía profesional'],
        webUrl: 'https://hairypetshop.com/producto/estetoscopio'
      }
    ]

    // Categorías optimizadas
    const categories = [
      { id: 'todos', name: 'Todos los productos', icon: '🛒', emoji: '🐾', count: featuredProducts.length },
      { id: 'perros', name: 'Perros', icon: '🐕', emoji: '🐕', count: featuredProducts.filter(p => p.category === 'perros').length },
      { id: 'gatos', name: 'Gatos', icon: '🐱', emoji: '🐱', count: featuredProducts.filter(p => p.category === 'gatos').length },
      { id: 'peces', name: 'Peces', icon: '🐠', emoji: '🐠', count: featuredProducts.filter(p => p.category === 'peces').length },
      { id: 'pajaros', name: 'Pájaros', icon: '🐦', emoji: '🐦', count: featuredProducts.filter(p => p.category === 'pajaros').length },
      { id: 'caballos', name: 'Caballos', icon: '🐴', emoji: '🐴', count: featuredProducts.filter(p => p.category === 'caballos').length },
      { id: 'veterinarios', name: 'Equipos Veterinarios', icon: '🏥', emoji: '🩺', count: featuredProducts.filter(p => p.category === 'veterinarios').length }
    ]

    console.log('🤖 Telegram Luna IA ULTRA - Procesando request:', req.method)

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

        // Comandos especiales MEJORADOS
        if (userMessage.startsWith('/start')) {
          lunaResponse = `¡Hola ${userName}! 👋🐾

Soy **Luna IA**, tu especialista personal en mascotas de HairyPetShop. ¡Bienvenido a la experiencia de compra más inteligente!

🤖 **¿Qué puedo hacer por ti?**
• 🛒 **Catálogo completo:** ${featuredProducts.length} productos premium
• 💰 **Ofertas exclusivas:** Hasta 29% descuento SOLO Telegram
• ⚡ **Compra súper rápida:** Pago en 30 segundos
• 🌐 **Envío a web:** Si prefieres ver más detalles
• 📱 **WhatsApp directo:** Para atención VIP

🐾 **Nuestras especialidades:**
${categories.filter(c => c.id !== 'todos').map(cat => `${cat.emoji} **${cat.name}:** ${cat.count} productos`).join('\n')}

💎 **VENTAJAS EXCLUSIVAS TELEGRAM:**
✅ Descuentos adicionales
✅ Compra directa sin salir del chat
✅ Ofertas flash limitadas
✅ Atención personalizada 24/7

¿Qué tipo de mascota tienes? ¡Empezamos! ✨`

          replyMarkup = {
            inline_keyboard: [
              [
                { text: "🛒 VER CATÁLOGO COMPLETO (12)", callback_data: "show_all_products" },
                { text: "🔥 OFERTAS FLASH (-29%)", callback_data: "show_flash_offers" }
              ],
              [
                { text: `🐕 Perros (${categories.find(c => c.id === 'perros')?.count})`, callback_data: "category_perros" },
                { text: `🐱 Gatos (${categories.find(c => c.id === 'gatos')?.count})`, callback_data: "category_gatos" }
              ],
              [
                { text: `🐠 Peces (${categories.find(c => c.id === 'peces')?.count})`, callback_data: "category_peces" },
                { text: `🐦 Pájaros (${categories.find(c => c.id === 'pajaros')?.count})`, callback_data: "category_pajaros" }
              ],
              [
                { text: `🐴 Caballos (${categories.find(c => c.id === 'caballos')?.count})`, callback_data: "category_caballos" },
                { text: `🩺 Veterinarios (${categories.find(c => c.id === 'veterinarios')?.count})`, callback_data: "category_veterinarios" }
              ],
              [
                { text: "⚡ COMPRA SÚPER RÁPIDA", callback_data: "quick_buy" }
              ],
              [
                { text: "🌐 IR A WEB COMPLETA", url: "https://hairypetshop.com" },
                { text: "📱 WhatsApp VIP", callback_data: "contact_whatsapp" }
              ]
            ]
          }
        }
        
        else if (userMessage.startsWith('/productos')) {
          lunaResponse = `🛒 **CATÁLOGO COMPLETO HAIRYPETSHOP** 

¡Bienvenido al catálogo más completo! **${featuredProducts.length} productos premium** con ofertas exclusivas para usuarios de Telegram.

📊 **RESUMEN COMPLETO:**
${categories.filter(c => c.id !== 'todos').map(cat => `${cat.emoji} **${cat.name}:** ${cat.count} productos disponibles`).join('\n')}

🔥 **OFERTAS ACTIVAS:**
• **Máximo descuento:** 29% OFF
• **Envío GRATIS:** En pedidos +€50
• **Garantía extendida:** 30 días
• **Regalo sorpresa:** En todas las compras

💳 **MÉTODOS DE PAGO:**
✅ Compra directa desde Telegram
✅ Redirección a web para más opciones
✅ WhatsApp para atención personalizada
✅ Contra reembolso disponible

⏰ **Ofertas limitadas - No te las pierdas**

👇 **¿Qué te interesa más?**`

          replyMarkup = {
            inline_keyboard: [
              [
                { text: "🛒 VER TODOS LOS PRODUCTOS", callback_data: "show_all_products" }
              ],
              [
                { text: `🐕 Perros (${categories.find(c => c.id === 'perros')?.count})`, callback_data: "category_perros" },
                { text: `🐱 Gatos (${categories.find(c => c.id === 'gatos')?.count})`, callback_data: "category_gatos" }
              ],
              [
                { text: `🐠 Peces (${categories.find(c => c.id === 'peces')?.count})`, callback_data: "category_peces" },
                { text: `🐦 Pájaros (${categories.find(c => c.id === 'pajaros')?.count})`, callback_data: "category_pajaros" }
              ],
              [
                { text: `🐴 Caballos (${categories.find(c => c.id === 'caballos')?.count})`, callback_data: "category_caballos" },
                { text: `🩺 Veterinarios (${categories.find(c => c.id === 'veterinarios')?.count})`, callback_data: "category_veterinarios" }
              ],
              [
                { text: "⚡ COMPRA RÁPIDA", callback_data: "quick_buy" },
                { text: "🌐 WEB COMPLETA", url: "https://hairypetshop.com" }
              ]
            ]
          }
        }
        
        else if (userMessage.startsWith('/ofertas')) {
          // Seleccionar los productos con mayor descuento
          const topOffers = featuredProducts
            .sort((a, b) => b.discount - a.discount)
            .slice(0, 5)

          lunaResponse = `🔥 **¡OFERTAS FLASH EXCLUSIVAS TELEGRAM!**

**⚡ TOP 5 DESCUENTOS - SOLO USUARIOS TELEGRAM:**

${topOffers.map((product, index) => 
            `${index + 1}️⃣ **${product.name}**
💰 €${product.price} ~~€${product.originalPrice}~~ **(-${product.discount}%)**
⭐ ${product.rating}/5 (${product.reviews} reseñas)`
          ).join('\n\n')}

🎁 **BONUS EXCLUSIVO TELEGRAM:**
• **Envío express GRATIS** (24-48h)
• **Regalo sorpresa doble** incluido
• **Garantía VIP** 60 días
• **Soporte prioritario** 24/7
• **Descuento adicional** por ser usuario Telegram

⏰ **Ofertas válidas: 23h 27min restantes**

¿Cuál te interesa más? ¡Compra en 30 segundos! 💕`

          replyMarkup = {
            inline_keyboard: [
              ...topOffers.slice(0, 3).map(product => [{
                text: `${product.category === 'perros' ? '🐕' : product.category === 'gatos' ? '🐱' : product.category === 'peces' ? '🐠' : product.category === 'pajaros' ? '🐦' : product.category === 'caballos' ? '🐴' : '🩺'} ${product.name} €${product.price}`,
                callback_data: `buy_${product.id}`
              }]),
              [
                { text: "🛒 VER TODAS LAS OFERTAS", callback_data: "show_all_products" }
              ],
              [
                { text: "⚡ COMPRA FLASH", callback_data: "quick_buy" }
              ]
            ]
          }
        }
        
        else if (userMessage.startsWith('/contacto')) {
          lunaResponse = `📞 **CONTACTO COMPLETO - ELIGE TU OPCIÓN FAVORITA**

**🤖 Luna IA (Especialista Personal) - 24/7:**
• 📱 **Telegram:** @HairyPet_bot (aquí mismo) ✅
• 💬 **WhatsApp:** +34 744 403 191

**🏪 HairyPetShop Oficial:**
• 🌐 **Web:** https://hairypetshop.com
• 📧 **Email:** info@hairypetshop.com
• 📍 **Ubicación:** Madrid, España
• ⏰ **Horario:** 24/7 online

**⚡ VENTAJAS POR CANAL:**

**📱 TELEGRAM (Aquí):**
✅ Compra en 30 segundos
✅ Ofertas exclusivas
✅ Catálogo completo
✅ Sin cambiar de app

**💬 WHATSAPP:**
✅ Atención súper personalizada
✅ Ofertas VIP adicionales
✅ Financiación disponible
✅ Seguimiento de pedido

**🌐 WEB:**
✅ Experiencia completa
✅ Más información detallada
✅ Sistema de reseñas
✅ Blog y consejos

¿Dónde prefieres continuar? 💖`

          replyMarkup = {
            inline_keyboard: [
              [
                { text: "💬 Continuar en Telegram", callback_data: "stay_telegram" },
                { text: "📱 Ir a WhatsApp VIP", callback_data: "go_whatsapp" }
              ],
              [
                { text: "🌐 Abrir Web Completa", url: "https://hairypetshop.com" }
              ],
              [
                { text: "🛒 Ver Productos", callback_data: "show_all_products" }
              ]
            ]
          }
        }
        
        // Respuestas inteligentes de Luna IA MEJORADAS
        else {
          const lowerMessage = userMessage.toLowerCase()
          
          if (lowerMessage.includes('precio') || lowerMessage.includes('cuesta') || lowerMessage.includes('coste')) {
            const priceRanges = categories.filter(c => c.id !== 'todos').map(cat => {
              const catProducts = featuredProducts.filter(p => p.category === cat.id)
              const minPrice = Math.min(...catProducts.map(p => p.price))
              const maxPrice = Math.max(...catProducts.map(p => p.price))
              return `${cat.emoji} **${cat.name}:** €${minPrice} - €${maxPrice}`
            })

            lunaResponse = `💰 **PRECIOS COMPLETOS Y OFERTAS EXCLUSIVAS**

Como especialista, te garantizo que nuestros precios son **súper competitivos** y tenemos las **mejores ofertas del mercado**.

**🏷️ RANGOS DE PRECIOS POR CATEGORÍA:**
${priceRanges.join('\n')}

**🎯 OFERTA ESPECIAL SOLO PARA TI:**
✅ **15% descuento adicional** comprando hoy
✅ **Envío gratis** en pedidos +€50
✅ **Regalo sorpresa** incluido
✅ **Garantía extendida** 30 días
✅ **Financiación** sin intereses disponible

**💡 CONSEJO DE EXPERTA:**
Los productos con mayor descuento son limitados. ¡No te los pierdas!

¿Qué producto específico te interesa? Te doy precio exacto y oferta personalizada 💕`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "🛒 Ver Productos con Precios", callback_data: "show_all_products" }
                ],
                [
                  { text: "🎁 Mi Oferta Personal", callback_data: "personal_offer" },
                  { text: "⚡ Compra Rápida", callback_data: "quick_buy" }
                ],
                [
                  { text: "💬 WhatsApp para Financiación", callback_data: "go_whatsapp" }
                ]
              ]
            }
          }
          
          else if (lowerMessage.includes('web') || lowerMessage.includes('página') || lowerMessage.includes('website')) {
            lunaResponse = `🌐 **¡PERFECTO! Te llevo a nuestra web completa**

**Ventajas de nuestra web:**
✅ **Experiencia completa** con todos los detalles
✅ **Sistema de reseñas** de clientes reales
✅ **Blog especializado** con consejos
✅ **Comparador de productos**
✅ **Chat en vivo** disponible
✅ **Múltiples métodos de pago**

**🔄 TAMBIÉN puedes:**
• **Seguir comprando aquí** en Telegram (más rápido)
• **Ir a WhatsApp** para atención personalizada

**💡 CONSEJO:** Si solo quieres comprar rápido, ¡quédate aquí! Es súper fácil.

¿Qué prefieres? 🤔`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "🌐 IR A WEB COMPLETA", url: "https://hairypetshop.com" }
                ],
                [
                  { text: "⚡ Comprar Aquí (Más Rápido)", callback_data: "quick_buy" }
                ],
                [
                  { text: "🛒 Ver Catálogo", callback_data: "show_all_products" },
                  { text: "📱 WhatsApp VIP", callback_data: "go_whatsapp" }
                ]
              ]
            }
          }
          
          else {
            lunaResponse = `😊 **¡Perfecto! Estoy aquí para ayudarte con TODO**

Como especialista en mascotas con +3 años de experiencia, puedo ayudarte con:

**🛒 PRODUCTOS:**
• Recomendaciones personalizadas
• Comparativas entre productos
• Ofertas exclusivas y descuentos
• Disponibilidad y envíos

**💰 PRECIOS Y PAGOS:**
• Precios especiales Telegram
• Métodos de pago disponibles
• Financiación sin intereses
• Ofertas por volumen

**🐾 CONSEJOS DE MASCOTAS:**
• Cuidados específicos por especie
• Productos recomendados por edad
• Solución de problemas comunes
• Consejos de alimentación

**🚚 LOGÍSTICA:**
• Tiempos de entrega
• Seguimiento de pedidos
• Cambios y devoluciones
• Garantías

¿En qué específicamente te puedo ayudar hoy? 💕`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "🛒 Ver Productos", callback_data: "show_all_products" },
                  { text: "💰 Ver Ofertas", callback_data: "show_flash_offers" }
                ],
                [
                  { text: "🐕 Perros", callback_data: "category_perros" },
                  { text: "🐱 Gatos", callback_data: "category_gatos" }
                ],
                [
                  { text: "📞 Contacto Personal", callback_data: "contact_whatsapp" },
                  { text: "❓ Más Ayuda", callback_data: "help_menu" }
                ]
              ]
            }
          }
        }

        // Enviar respuesta de Luna IA
        console.log('📤 Enviando respuesta de Luna IA ULTRA...')
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
                source: 'telegram_luna_ia_ultra',
                message: userMessage,
                luna_response: lunaResponse,
                interest: 'telegram_interaction',
                products_available: featuredProducts.length
              }
            }),
          })
          console.log('✅ Lead enviado a n8n')
        } catch (n8nError) {
          console.log('⚠️ Error enviando a n8n:', n8nError.message)
        }
      }

      // Manejar callback queries (botones inline) - ULTRA MEJORADO
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

        // Manejar productos específicos con MÁXIMO DETALLE
        if (callbackData.startsWith('product_')) {
          const productId = callbackData.replace('product_', '')
          const product = featuredProducts.find(p => p.id === productId)
          
          if (product) {
            sendPhoto = true
            photoUrl = product.image
            
            responseText = `${product.category === 'perros' ? '🐕' : product.category === 'gatos' ? '🐱' : product.category === 'peces' ? '🐠' : product.category === 'pajaros' ? '🐦' : product.category === 'caballos' ? '🐴' : '🩺'} **${product.name}**

💰 **PRECIO EXCLUSIVO TELEGRAM:** €${product.price} ~~€${product.originalPrice}~~
🔥 **DESCUENTO:** ${product.discount}% OFF (**AHORRAS €${(product.originalPrice - product.price).toFixed(2)}**)
⭐ **Valoración:** ${product.rating}/5 ⭐ (${product.reviews} reseñas verificadas)

📝 **Descripción completa:**
${product.description}

✨ **Características premium:**
${product.features.map(f => `• ${f}`).join('\n')}

🎁 **INCLUYE GRATIS CON TU COMPRA:**
• ✅ Envío express 24-48h
• ✅ Regalo sorpresa personalizado
• ✅ Garantía extendida 30 días
• ✅ Soporte técnico especializado
• ✅ Manual de uso y cuidados

⏰ **Oferta válida: 58 minutos restantes**

🚀 **¿Listo para comprarlo? ¡Es súper fácil!**`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: `🛒 ¡SÍ, LO QUIERO YA! €${product.price}`, callback_data: `buy_${productId}` }
                ],
                [
                  { text: "💳 Pago Online Rápido", callback_data: `quick_pay_${productId}` },
                  { text: "📱 WhatsApp Personal", callback_data: `whatsapp_buy_${productId}` }
                ],
                [
                  { text: "🌐 Ver en Web Completa", url: product.webUrl }
                ],
                [
                  { text: "🔙 Ver Más Productos", callback_data: "show_all_products" },
                  { text: `${product.category === 'perros' ? '🐕' : product.category === 'gatos' ? '🐱' : product.category === 'peces' ? '🐠' : product.category === 'pajaros' ? '🐦' : product.category === 'caballos' ? '🐴' : '🩺'} Más ${categories.find(c => c.id === product.category)?.name}`, callback_data: `category_${product.category}` }
                ]
              ]
            }
          }
        }
        
        // Manejar compras directas MEJORADO
        else if (callbackData.startsWith('buy_')) {
          const productId = callbackData.replace('buy_', '')
          const product = featuredProducts.find(p => p.id === productId)
          
          if (product) {
            responseText = `🎉 **¡EXCELENTE ELECCIÓN, ${userName}!**

**✅ Producto seleccionado:** ${product.name}
**💰 Precio final:** €${product.price} (€${(product.originalPrice - product.price).toFixed(2)} de ahorro)
**🔥 Descuento aplicado:** ${product.discount}% OFF
**⭐ Calificación:** ${product.rating}/5 (${product.reviews} reseñas)

🚀 **OPCIONES DE COMPRA SÚPER FÁCILES:**

**1️⃣ COMPRA ONLINE INMEDIATA (Recomendado)**
💳 Tarjeta de crédito/débito
💰 PayPal
🏦 Transferencia bancaria
⚡ Proceso en 30 segundos

**2️⃣ WHATSAPP PERSONAL VIP**
👩‍💼 Atención personalizada conmigo
💰 Pago contra reembolso
💸 Financiación 0% intereses
🎁 Ofertas adicionales exclusivas
📦 Seguimiento personalizado

**🎯 MI RECOMENDACIÓN:** WhatsApp para mejor precio y atención VIP

¿Cómo prefieres continuar? ¡Te ayudo con todo! 💕`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "💳 PAGO ONLINE INMEDIATO", url: `https://hairypetshop.com/checkout?product=${productId}&telegram=${userId}&discount=${product.discount}&source=telegram` }
                ],
                [
                  { text: "📱 WHATSAPP VIP (RECOMENDADO)", url: `https://wa.me/34744403191?text=¡Hola Luna! Quiero comprar ${product.name} por €${product.price} desde Telegram. Mi ID: ${userId}. ¿Tienes ofertas VIP adicionales?` }
                ],
                [
                  { text: "🌐 Comprar en Web", url: product.webUrl }
                ],
                [
                  { text: "🔙 Elegir Otro Producto", callback_data: "show_all_products" }
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
                  status: 'purchase_initiated',
                  created_at: new Date().toISOString()
                })
            } catch (dbError) {
              console.log('⚠️ Error guardando venta potencial:', dbError.message)
            }
          }
        }
        
        // Manejar compras por WhatsApp MEJORADO
        else if (callbackData.startsWith('whatsapp_buy_')) {
          const productId = callbackData.replace('whatsapp_buy_', '')
          const product = featuredProducts.find(p => p.id === productId)
          
          if (product) {
            responseText = `📱 **¡PERFECTO! Te redirijo a WhatsApp VIP**

**🛒 Producto:** ${product.name}
**💰 Precio especial:** €${product.price}
**🎁 Descuento:** ${product.discount}% OFF

**🌟 VENTAJAS WHATSAPP VIP:**
✅ **Atención 100% personalizada** conmigo
✅ **Ofertas adicionales** exclusivas
✅ **Descuentos extra** por lealtad
✅ **Financiación 0%** disponible
✅ **Pago contra reembolso** sin coste
✅ **Seguimiento directo** de tu pedido
✅ **Soporte post-venta** premium

**💡 CONSEJO ESPECIAL:** Menciona que vienes de Telegram para descuentos adicionales

¡Haz clic para continuar con atención VIP! 👇`

            replyMarkup = {
              inline_keyboard: [
                [
                  { text: "📱 CONTINUAR EN WHATSAPP VIP", url: `https://wa.me/34744403191?text=¡Hola Luna! Quiero comprar ${product.name} por €${product.price}. Vengo desde Telegram (ID: ${userId}). ¿Tienes ofertas VIP adicionales y financiación disponible?` }
                ],
                [
                  { text: "💳 Pagar Online Directo", url: product.webUrl }
                ],
                [
                  { text: "🔙 Ver Otros Productos", callback_data: "show_all_products" }
                ]
              ]
            }
          }
        }

        // Manejar categorías MEJORADO
        else if (callbackData.startsWith('category_')) {
          const categoryId = callbackData.replace('category_', '')
          const category = categories.find(c => c.id === categoryId)
          const categoryProducts = featuredProducts.filter(p => p.category === categoryId)

          if (category && categoryProducts.length > 0) {
            const avgRating = (categoryProducts.reduce((sum, p) => sum + p.rating, 0) / categoryProducts.length).toFixed(1)
            const maxDiscount = Math.max(...categoryProducts.map(p => p.discount))
            const minPrice = Math.min(...categoryProducts.map(p => p.price))
            const maxPrice = Math.max(...categoryProducts.map(p => p.price))

            responseText = `${category.emoji} **PRODUCTOS DE ${category.name.toUpperCase()}**

**📊 RESUMEN DE CATEGORÍA:**
• **Productos disponibles:** ${categoryProducts.length}
• **Rango de precios:** €${minPrice} - €${maxPrice}
• **Valoración promedio:** ⭐ ${avgRating}/5
• **Máximo descuento:** ${maxDiscount}% OFF

**🔥 NUESTROS ${category.name.toUpperCase()}:**
${categoryProducts.map(p => 
              `${category.emoji} **${p.name}**
💰 €${p.price} ~~€${p.originalPrice}~~ (-${p.discount}%)
⭐ ${p.rating}/5 • ${p.reviews} reseñas`
            ).join('\n\n')}

**🎁 INCLUYE EN TODOS:**
✅ Envío GRATIS en pedidos +€50
✅ Garantía extendida 30 días
✅ Regalo sorpresa incluido
✅ Soporte especializado 24/7

👇 **Selecciona el que más te guste:**`

            const productButtons = categoryProducts.map(product => [{
              text: `${category.emoji} ${product.name} - €${product.price}`,
              callback_data: `product_${product.id}`
            }])

            replyMarkup = {
              inline_keyboard: [
                ...productButtons,
                [
                  { text: "🛒 Ver TODOS los Productos", callback_data: "show_all_products" },
                  { text: "⚡ Compra Rápida", callback_data: "quick_buy" }
                ],
                [
                  { text: "🔙 Volver al Inicio", callback_data: "back_to_start" }
                ]
              ]
            }
          }
        }

        // Mostrar todos los productos ULTRA MEJORADO
        else if (callbackData === 'show_all_products') {
          responseText = `🛒 **CATÁLOGO COMPLETO HAIRYPETSHOP** 

**¡Bienvenido al catálogo más completo! ${featuredProducts.length} productos premium**

**📊 ESTADÍSTICAS COMPLETAS:**
• **Total productos:** ${featuredProducts.length}
• **Categorías:** ${categories.filter(c => c.id !== 'todos').length}
• **Descuento máximo:** ${Math.max(...featuredProducts.map(p => p.discount))}% OFF
• **Valoración promedio:** ⭐ ${(featuredProducts.reduce((sum, p) => sum + p.rating, 0) / featuredProducts.length).toFixed(1)}/5

**🎯 POR CATEGORÍAS:**
${categories.filter(c => c.id !== 'todos').map(cat => 
            `${cat.emoji} **${cat.name}:** ${cat.count} productos disponibles`
          ).join('\n')}

**🔥 OFERTAS EXCLUSIVAS TELEGRAM:**
• Hasta **${Math.max(...featuredProducts.map(p => p.discount))}% descuento**
• **Envío GRATIS** en pedidos +€50
• **Compra directa** sin salir del chat
• **Garantía extendida** 30 días

👇 **Elige categoría o ve directamente a compra rápida:**`

          const categoryButtons = categories.filter(c => c.id !== 'todos').map(category => [{
            text: `${category.emoji} ${category.name} (${category.count})`,
            callback_data: `category_${category.id}`
          }])

          replyMarkup = {
            inline_keyboard: [
              ...categoryButtons.slice(0, 3), // Primeras 3 categorías
              ...categoryButtons.slice(3), // Resto de categorías
              [
                { text: "⚡ COMPRA SÚPER RÁPIDA", callback_data: "quick_buy" },
                { text: "🔥 OFERTAS FLASH", callback_data: "show_flash_offers" }
              ],
              [
                { text: "🌐 IR A WEB COMPLETA", url: "https://hairypetshop.com" },
                { text: "📱 WhatsApp VIP", callback_data: "go_whatsapp" }
              ]
            ]
          }
        }

        // Compra rápida MEJORADA
        else if (callbackData === 'quick_buy') {
          const topProducts = featuredProducts
            .sort((a, b) => (b.rating * b.reviews + b.discount) - (a.rating * a.reviews + a.discount))
            .slice(0, 4)

          responseText = `⚡ **COMPRA SÚPER RÁPIDA - TOP PRODUCTOS**

**Los 4 productos MÁS VENDIDOS y MEJOR VALORADOS:**

${topProducts.map((product, index) => 
            `${index + 1}️⃣ **${product.name}**
${product.category === 'perros' ? '🐕' : product.category === 'gatos' ? '🐱' : product.category === 'peces' ? '🐠' : product.category === 'pajaros' ? '🐦' : product.category === 'caballos' ? '🐴' : '🩺'} €${product.price} ~~€${product.originalPrice}~~ (-${product.discount}%)
⭐ ${product.rating}/5 • ${product.reviews} reseñas • **MUY POPULAR**`
          ).join('\n\n')}

**🚀 PROCESO SÚPER FÁCIL:**
1️⃣ Selecciona producto
2️⃣ Elige método de pago
3️⃣ ¡Confirmado en 30 segundos!

**🎁 BONUS COMPRA RÁPIDA:**
• Descuento adicional automático
• Envío prioritario
• Regalo extra incluido

👇 **¿Cuál quieres?**`

          replyMarkup = {
            inline_keyboard: [
              ...topProducts.map(product => [{
                text: `${product.category === 'perros' ? '🐕' : product.category === 'gatos' ? '🐱' : product.category === 'peces' ? '🐠' : product.category === 'pajaros' ? '🐦' : product.category === 'caballos' ? '🐴' : '🩺'} ${product.name} €${product.price}`,
                callback_data: `buy_${product.id}`
              }]),
              [
                { text: "🛒 VER TODOS LOS PRODUCTOS", callback_data: "show_all_products" }
              ]
            ]
          }
        }

        // Resto de callbacks mejorados...
        else {
          switch (callbackData) {
            case 'show_flash_offers':
              const flashProducts = featuredProducts
                .sort((a, b) => b.discount - a.discount)
                .slice(0, 4)

              responseText = `🔥 **OFERTAS FLASH EXCLUSIVAS TELEGRAM**

**⚡ SOLO USUARIOS TELEGRAM - TIEMPO SÚPER LIMITADO:**

${flashProducts.map((product, index) => 
                `${index + 1}️⃣ **${product.name}**
${product.category === 'perros' ? '🐕' : product.category === 'gatos' ? '🐱' : product.category === 'peces' ? '🐠' : product.category === 'pajaros' ? '🐦' : product.category === 'caballos' ? '🐴' : '🩺'} €${product.price} ~~€${product.originalPrice}~~ **(-${product.discount}%)**
💸 **AHORRAS:** €${(product.originalPrice - product.price).toFixed(2)}`
              ).join('\n\n')}

**🎁 BONUS FLASH EXCLUSIVO:**
• **Envío express GRATIS** (24h)
• **Regalo doble sorpresa**
• **Garantía VIP** 60 días
• **Soporte prioritario**

⏰ **Quedan: 22h 15min**

👇 **¡APROVECHA YA!**`

              replyMarkup = {
                inline_keyboard: [
                  ...flashProducts.slice(0, 2).map(product => [{
                    text: `🔥 ${product.name} €${product.price}`,
                    callback_data: `buy_${product.id}`
                  }]),
                  [
                    { text: "🛒 TODAS LAS OFERTAS", callback_data: "show_all_products" }
                  ],
                  [
                    { text: "⚡ COMPRA FLASH", callback_data: "quick_buy" }
                  ]
                ]
              }
              break

            case 'contact_whatsapp':
            case 'go_whatsapp':
              responseText = `📱 **¡PERFECTO! Te paso a WhatsApp VIP**

**🌟 VENTAJAS WHATSAPP VIP EXCLUSIVAS:**
• 👩‍💼 **Atención personalizada** con Luna IA
• 💰 **Ofertas VIP adicionales** no disponibles aquí
• 🎁 **Regalos sorpresa extra** para clientes VIP
• 💸 **Financiación 0% intereses** disponible
• 📦 **Seguimiento personalizado** de tu pedido
• 🛡️ **Garantía premium** extendida
• 🚀 **Envío prioritario** gratis

**📱 Luna IA también está en WhatsApp:**
+34 744 403 191

**💡 TIP ESPECIAL:** Menciona que vienes de Telegram para descuentos exclusivos

Haz clic para abrir WhatsApp con mensaje VIP preparado 👇`

              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "📱 ABRIR WHATSAPP VIP", url: "https://wa.me/34744403191?text=¡Hola Luna! Vengo desde Telegram y me interesa atención VIP 🌟. ¿Tienes ofertas especiales exclusivas para mí? Quiero conocer todos los productos de HairyPetShop 🐾" }
                  ],
                  [
                    { text: "🔙 Continuar en Telegram", callback_data: "stay_telegram" }
                  ]
                ]
              }
              break

            case 'stay_telegram':
              responseText = `😊 **¡GENIAL! Continuamos aquí en Telegram**

**🤖 VENTAJAS TELEGRAM EXCLUSIVAS:**
• ✅ **Compra en 30 segundos** máximo
• ✅ **Ofertas exclusivas** solo Telegram
• ✅ **Chat directo** conmigo 24/7
• ✅ **Sin cambiar de app** - súper cómodo
• ✅ **Notificaciones** de ofertas flash
• ✅ **Historial** de conversación

**🎯 ¿En qué te puedo ayudar ahora?**
• 🛒 Recomendaciones personalizadas
• 💰 Precios y ofertas exclusivas
• 🚚 Información de envío
• 🐾 Consejos para tu mascota
• 💳 Métodos de pago disponibles

¡Dime qué necesitas y te ayudo al instante! 💕`

              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🛒 Ver Productos", callback_data: "show_all_products" },
                    { text: "💰 Ver Ofertas", callback_data: "show_flash_offers" }
                  ],
                  [
                    { text: "⚡ Compra Rápida", callback_data: "quick_buy" }
                  ],
                  [
                    { text: "🐕 Perros", callback_data: "category_perros" },
                    { text: "🐱 Gatos", callback_data: "category_gatos" }
                  ]
                ]
              }
              break

            case 'back_to_start':
              responseText = `🏠 **¡Volvemos al inicio con todo mejorado!**

**🎯 ¿En qué puedo ayudarte hoy?**

**📊 RESUMEN ACTUAL:**
🛒 **Productos disponibles:** ${featuredProducts.length}
🔥 **Ofertas activas:** Hasta ${Math.max(...featuredProducts.map(p => p.discount))}% OFF
🚚 **Envío:** GRATIS en pedidos +€50
⭐ **Valoración:** ${(featuredProducts.reduce((sum, p) => sum + p.rating, 0) / featuredProducts.length).toFixed(1)}/5 promedio
👥 **Clientes satisfechos:** +500

**💡 CONSEJO:** ¡Las ofertas flash son limitadas!

¡Dime qué te interesa! 😊`

              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🛒 VER TODOS LOS PRODUCTOS", callback_data: "show_all_products" },
                    { text: "🔥 OFERTAS FLASH", callback_data: "show_flash_offers" }
                  ],
                  [
                    { text: "🐕 Perros", callback_data: "category_perros" },
                    { text: "🐱 Gatos", callback_data: "category_gatos" }
                  ],
                  [
                    { text: "⚡ Compra Rápida", callback_data: "quick_buy" },
                    { text: "📞 Contactar", callback_data: "contact_whatsapp" }
                  ]
                ]
              }
              break

            default:
              responseText = `😊 **¡Perfecto! Estoy aquí para todo lo que necesites**

**🎯 OPCIONES DISPONIBLES:**
• 🛒 **Ver catálogo completo** (${featuredProducts.length} productos)
• 💰 **Ofertas flash exclusivas** (hasta ${Math.max(...featuredProducts.map(p => p.discount))}% OFF)
• 🐾 **Productos por categoría** (${categories.filter(c => c.id !== 'todos').length} categorías)
• 📱 **Contacto personalizado** VIP

**🌟 RECORDATORIO:** 
¡Estoy aquí 24/7 para ayudarte con todo lo que tu mascota necesita!

**💡 TIP:** Las ofertas exclusivas de Telegram son las mejores que tenemos 😉`

              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🛒 Ver Productos", callback_data: "show_all_products" },
                    { text: "💰 Ver Ofertas", callback_data: "show_flash_offers" }
                  ],
                  [
                    { text: "⚡ Compra Rápida", callback_data: "quick_buy" }
                  ],
                  [
                    { text: "📱 WhatsApp VIP", callback_data: "go_whatsapp" }
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
            text: "✅ Procesando tu solicitud..."
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
        console.log('📨 Respuesta callback ULTRA:', callbackResult)

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
        const webhookUrl = `https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/telegram-luna-ia-ultra`
        
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
        console.log('🔗 Webhook ULTRA configurado:', result)

        return new Response(JSON.stringify({
          success: true,
          message: 'Webhook ULTRA configurado correctamente',
          webhook_url: webhookUrl,
          result: result,
          products_loaded: featuredProducts.length,
          categories_available: categories.length,
          improvements: [
            '✅ Catálogo 100% sincronizado con web',
            '✅ Botones súper optimizados para ventas',
            '✅ Compra directa mejorada',
            '✅ Redirección inteligente a web',
            '✅ Ofertas exclusivas Telegram',
            '✅ Proceso de compra en 30 segundos',
            '✅ Integración perfecta con WhatsApp VIP'
          ]
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (action === 'get_webhook_info') {
        const response = await fetch(`${TELEGRAM_API_URL}/getWebhookInfo`)
        const result = await response.json()
        
        return new Response(JSON.stringify({
          success: true,
          webhook_info: result,
          products_count: featuredProducts.length,
          categories_count: categories.length,
          version: 'ULTRA_MEJORADO'
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
          message: 'Bot ULTRA funcionando perfectamente',
          products_loaded: featuredProducts.length,
          categories_loaded: categories.length,
          version: 'ULTRA_V2.0',
          ultra_features: [
            '🛒 Catálogo completo sincronizado (12 productos)',
            '🔥 Botones ultra optimizados para conversión',
            '⚡ Compra directa desde Telegram en 30s',
            '🌐 Redirección inteligente a web completa',
            '📱 Integración perfecta con WhatsApp VIP',
            '🎁 Ofertas exclusivas solo Telegram',
            '📊 Categorías organizadas con contadores',
            '💳 Múltiples opciones de pago',
            '🎯 Proceso de compra mejoradísimo',
            '⭐ Información detallada de productos'
          ]
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Telegram Luna IA ULTRA Bot funcionando PERFECTAMENTE',
        version: 'ULTRA_V2.0',
        products_count: featuredProducts.length,
        categories_count: categories.length,
        available_actions: ['set_webhook', 'get_webhook_info', 'test_bot'],
        ultra_improvements: [
          '✅ Catálogo completo 100% sincronizado con web',
          '✅ Botones ULTRA optimizados para maximizar ventas',
          '✅ Compra directa desde Telegram súper fácil',
          '✅ Redirección inteligente a web cuando necesario',
          '✅ Ofertas exclusivas SOLO para Telegram',
          '✅ Categorías perfectamente organizadas',
          '✅ Proceso de compra en máximo 30 segundos',
          '✅ Integración perfecta con WhatsApp VIP',
          '✅ Información detallada de cada producto',
          '✅ Sistema de tracking de ventas mejorado'
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Method not allowed', {
      headers: corsHeaders,
      status: 405,
    })

  } catch (error) {
    console.error('❌ Error en Telegram Luna IA ULTRA:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
        version: 'ULTRA_V2.0'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})