import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Bot Token de Telegram
const TELEGRAM_BOT_TOKEN = "7729073848:AAGJvKJJhJJhJJhJJhJJhJJhJJhJJhJJhJJ"
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

// Productos completos de HairyPetShop
const PRODUCTOS = {
  perros: [
    {
      id: 'collar-premium-perros',
      nombre: 'Collar Premium para Perros',
      precio: 24.99,
      precio_original: 34.99,
      descuento: 29,
      stock: 'En stock - Envío 24h',
      imagen: 'https://readdy.ai/api/search-image?query=premium%20leather%20dog%20collar%20with%20metal%20buckle%20professional%20pet%20accessory%20brown%20leather%20simple%20background&width=400&height=400&seq=collar1&orientation=squarish',
      descripcion: '🐕 Collar de cuero premium con hebilla de metal resistente. Perfecto para perros de todas las razas y tamaños.',
      caracteristicas: ['Cuero genuino', 'Hebilla resistente', 'Ajustable', 'Todas las tallas'],
      categoria: 'perros'
    },
    {
      id: 'cama-ortopedica-perros',
      nombre: 'Cama Ortopédica para Perros',
      precio: 42.99,
      precio_original: 54.99,
      descuento: 22,
      stock: 'Disponible - Todas las tallas',
      imagen: 'https://readdy.ai/api/search-image?query=orthopedic%20dog%20bed%20memory%20foam%20comfortable%20pet%20sleeping%20area%20gray%20fabric%20simple%20background&width=400&height=400&seq=cama1&orientation=squarish',
      descripcion: '🛏️ Cama ortopédica con espuma de memoria para el máximo confort de tu perro. Ideal para perros mayores o con problemas articulares.',
      caracteristicas: ['Espuma de memoria', 'Funda lavable', 'Antideslizante', 'Soporte ortopédico'],
      categoria: 'perros'
    }
  ],
  gatos: [
    {
      id: 'juguete-interactivo-gatos',
      nombre: 'Juguete Interactivo para Gatos',
      precio: 18.50,
      precio_original: 24.99,
      descuento: 26,
      stock: '¡Solo 5 unidades disponibles!',
      imagen: 'https://readdy.ai/api/search-image?query=interactive%20cat%20toy%20with%20feathers%20and%20bells%20colorful%20pet%20entertainment%20device%20simple%20background&width=400&height=400&seq=juguete1&orientation=squarish',
      descripcion: '🐱 Juguete interactivo con plumas y cascabeles que mantendrá a tu gato entretenido durante horas.',
      caracteristicas: ['Plumas naturales', 'Cascabeles', 'Estimula instintos', 'Ejercicio mental'],
      categoria: 'gatos'
    },
    {
      id: 'torre-rascador-gatos',
      nombre: 'Torre Rascador para Gatos',
      precio: 56.00,
      precio_original: 74.99,
      descuento: 25,
      stock: 'En stock - Montaje gratis',
      imagen: 'https://readdy.ai/api/search-image?query=tall%20cat%20scratching%20tower%20with%20multiple%20levels%20sisal%20rope%20beige%20color%20simple%20background&width=400&height=400&seq=torre1&orientation=squarish',
      descripcion: '🏗️ Torre rascador de múltiples niveles con cuerda de sisal. Perfecta para que tu gato se ejercite y afile sus uñas.',
      caracteristicas: ['Múltiples niveles', 'Cuerda de sisal', 'Base estable', 'Montaje incluido'],
      categoria: 'gatos'
    }
  ],
  peces: [
    {
      id: 'acuario-completo-50l',
      nombre: 'Acuario Completo 50L',
      precio: 89.99,
      precio_original: 119.99,
      descuento: 25,
      stock: 'Disponible - Instalación gratuita',
      imagen: 'https://readdy.ai/api/search-image?query=complete%2050L%20aquarium%20tank%20with%20LED%20lighting%20and%20filter%20system%20clear%20glass%20simple%20background&width=400&height=400&seq=acuario1&orientation=squarish',
      descripcion: '🐠 Acuario completo de 50L con sistema de filtración, iluminación LED y todos los accesorios necesarios.',
      caracteristicas: ['50L capacidad', 'Filtro incluido', 'Iluminación LED', 'Kit completo'],
      categoria: 'peces'
    },
    {
      id: 'filtro-avanzado-acuario',
      nombre: 'Filtro Avanzado para Acuario',
      precio: 34.99,
      precio_original: 44.99,
      descuento: 22,
      stock: 'En stock - Instalación incluida',
      imagen: 'https://readdy.ai/api/search-image?query=advanced%20aquarium%20filter%20system%20with%20multiple%20stages%20black%20plastic%20professional%20equipment%20simple%20background&width=400&height=400&seq=filtro1&orientation=squarish',
      descripcion: '🔄 Sistema de filtración avanzado de múltiples etapas para mantener el agua cristalina y saludable.',
      caracteristicas: ['Filtración múltiple', 'Fácil mantenimiento', 'Silencioso', 'Alta eficiencia'],
      categoria: 'peces'
    }
  ],
  pajaros: [
    {
      id: 'jaula-espaciosa-pajaros',
      nombre: 'Jaula Espaciosa para Pájaros',
      precio: 65.00,
      precio_original: 85.99,
      descuento: 24,
      stock: 'Disponible - Montaje incluido',
      imagen: 'https://readdy.ai/api/search-image?query=spacious%20bird%20cage%20with%20multiple%20perches%20and%20feeding%20stations%20white%20metal%20bars%20simple%20background&width=400&height=400&seq=jaula1&orientation=squarish',
      descripcion: '🐦 Jaula espaciosa con múltiples perchas y estaciones de alimentación. Ideal para pájaros medianos y grandes.',
      caracteristicas: ['Amplio espacio', 'Múltiples perchas', 'Comederos incluidos', 'Fácil limpieza'],
      categoria: 'pajaros'
    },
    {
      id: 'comedero-automatico-pajaros',
      nombre: 'Comedero Automático para Pájaros',
      precio: 28.50,
      precio_original: 37.99,
      descuento: 25,
      stock: 'En stock - Instalación gratis',
      imagen: 'https://readdy.ai/api/search-image?query=automatic%20bird%20feeder%20with%20seed%20dispenser%20clear%20plastic%20container%20simple%20background&width=400&height=400&seq=comedero1&orientation=squarish',
      descripcion: '🍽️ Comedero automático con dispensador de semillas. Mantiene la comida fresca y disponible siempre.',
      caracteristicas: ['Dispensador automático', 'Fácil recarga', 'Higiénico', 'Duradero'],
      categoria: 'pajaros'
    }
  ],
  caballos: [
    {
      id: 'arnes-profesional-caballos',
      nombre: 'Arnés Profesional para Caballos',
      precio: 145.00,
      precio_original: 179.99,
      descuento: 19,
      stock: 'Bajo pedido - 3-5 días',
      imagen: 'https://readdy.ai/api/search-image?query=professional%20horse%20harness%20leather%20straps%20metal%20buckles%20equestrian%20equipment%20brown%20leather%20simple%20background&width=400&height=400&seq=arnes1&orientation=squarish',
      descripcion: '🐴 Arnés profesional de cuero con herrajes de metal. Diseñado para uso profesional y competición.',
      caracteristicas: ['Cuero profesional', 'Herrajes de metal', 'Ajustable', 'Uso profesional'],
      categoria: 'caballos'
    },
    {
      id: 'manta-termica-caballos',
      nombre: 'Manta Térmica para Caballos',
      precio: 98.00,
      precio_original: 125.99,
      descuento: 22,
      stock: 'Disponible - Todas las tallas',
      imagen: 'https://readdy.ai/api/search-image?query=thermal%20horse%20blanket%20waterproof%20fabric%20blue%20color%20equestrian%20gear%20simple%20background&width=400&height=400&seq=manta1&orientation=squarish',
      descripcion: '🧥 Manta térmica impermeable para proteger a tu caballo del frío y la humedad.',
      caracteristicas: ['Impermeable', 'Aislamiento térmico', 'Transpirable', 'Todas las tallas'],
      categoria: 'caballos'
    }
  ],
  veterinarios: [
    {
      id: 'kit-veterinario-basico',
      nombre: 'Kit Veterinario Básico',
      precio: 78.50,
      precio_original: 94.99,
      descuento: 17,
      stock: 'Para profesionales - En stock',
      imagen: 'https://readdy.ai/api/search-image?query=veterinary%20medical%20kit%20with%20stethoscope%20thermometer%20and%20medical%20tools%20professional%20equipment%20simple%20background&width=400&height=400&seq=kit1&orientation=squarish',
      descripcion: '🩺 Kit veterinario básico con estetoscopio, termómetro y herramientas médicas esenciales.',
      caracteristicas: ['Estetoscopio incluido', 'Termómetro digital', 'Herramientas básicas', 'Maletín incluido'],
      categoria: 'veterinarios'
    },
    {
      id: 'estetoscopio-veterinario',
      nombre: 'Estetoscopio Veterinario Profesional',
      precio: 125.00,
      precio_original: 149.99,
      descuento: 17,
      stock: 'Solo profesionales - Certificado',
      imagen: 'https://readdy.ai/api/search-image?query=professional%20veterinary%20stethoscope%20black%20tubing%20metal%20chest%20piece%20medical%20equipment%20simple%20background&width=400&height=400&seq=esteto1&orientation=squarish',
      descripcion: '🔬 Estetoscopio veterinario profesional de alta precisión para diagnósticos veterinarios.',
      caracteristicas: ['Alta precisión', 'Uso profesional', 'Certificado médico', 'Garantía extendida'],
      categoria: 'veterinarios'
    }
  ]
}

// Función para obtener todos los productos
function obtenerTodosLosProductos() {
  const todos = []
  Object.values(PRODUCTOS).forEach(categoria => {
    todos.push(...categoria)
  })
  return todos
}

// Función para obtener productos por categoría
function obtenerProductosPorCategoria(categoria: string) {
  return PRODUCTOS[categoria as keyof typeof PRODUCTOS] || []
}

// Función para obtener producto por ID
function obtenerProductoPorId(id: string) {
  const todos = obtenerTodosLosProductos()
  return todos.find(p => p.id === id)
}

// Función para enviar mensaje a Telegram
async function enviarMensaje(chatId: string, texto: string, opciones: any = {}) {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: texto,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...opciones
      }),
    })
    
    return await response.json()
  } catch (error) {
    console.error('Error enviando mensaje:', error)
    return { ok: false, error: error.message }
  }
}

// Función para enviar foto con mensaje
async function enviarFoto(chatId: string, foto: string, caption: string, opciones: any = {}) {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        photo: foto,
        caption: caption,
        parse_mode: 'HTML',
        ...opciones
      }),
    })
    
    return await response.json()
  } catch (error) {
    console.error('Error enviando foto:', error)
    return { ok: false, error: error.message }
  }
}

// Función para configurar webhook
async function configurarWebhook() {
  try {
    const webhookUrl = 'https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/telegram-luna-global'
    
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
    
    return await response.json()
  } catch (error) {
    console.error('Error configurando webhook:', error)
    return { ok: false, error: error.message }
  }
}

// Función para crear teclado inline
function crearTeclado(botones: any[][]) {
  return {
    reply_markup: {
      inline_keyboard: botones
    }
  }
}

// Función para manejar el comando /start
function manejarStart(chatId: string, nombreUsuario: string = 'amigo') {
  const mensaje = `🐾 <b>¡Hola ${nombreUsuario}! Soy Luna IA</b> 🤖

¡Bienvenido a <b>HairyPetShop</b>! 🏪

Soy tu <b>especialista personal en mascotas</b> y estoy aquí para ayudarte a encontrar exactamente lo que necesitas para tu peludo amigo 💕

🌟 <b>¿Qué puedo hacer por ti?</b>
• Ver nuestro catálogo completo
• Recomendarte productos específicos
• Ayudarte con ofertas exclusivas
• Conectarte con atención VIP

<b>¡Tenemos productos para todas las mascotas!</b> 🐕🐱🐠🐦🐴

¿Por dónde empezamos? 👇`

  const teclado = crearTeclado([
    [
      { text: '🛒 Ver Catálogo Completo', callback_data: 'catalogo_completo' },
      { text: '🔥 Ofertas Exclusivas', callback_data: 'ofertas_exclusivas' }
    ],
    [
      { text: '🐕 Perros', callback_data: 'categoria_perros' },
      { text: '🐱 Gatos', callback_data: 'categoria_gatos' }
    ],
    [
      { text: '🐠 Peces', callback_data: 'categoria_peces' },
      { text: '🐦 Pájaros', callback_data: 'categoria_pajaros' }
    ],
    [
      { text: '🐴 Caballos', callback_data: 'categoria_caballos' },
      { text: '🩺 Veterinarios', callback_data: 'categoria_veterinarios' }
    ],
    [
      { text: '💬 Atención VIP WhatsApp', url: 'https://wa.me/34744403191?text=Hola%20Luna%2C%20vengo%20de%20Telegram%20y%20necesito%20ayuda%20VIP%20🐾' }
    ],
    [
      { text: '🌐 Visitar Web Completa', url: 'https://hairypetshop.readdy.ai' }
    ]
  ])

  return enviarMensaje(chatId, mensaje, teclado)
}

// Función para mostrar catálogo completo
function mostrarCatalogoCompleto(chatId: string) {
  const productos = obtenerTodosLosProductos()
  const totalProductos = productos.length
  
  const mensaje = `🛒 <b>CATÁLOGO COMPLETO HAIRYPETSHOP</b>

📦 <b>${totalProductos} productos disponibles</b>
🔥 <b>Ofertas exclusivas Telegram</b>
🚚 <b>Envío gratis en pedidos +30€</b>

<b>Categorías disponibles:</b>
🐕 Perros (${PRODUCTOS.perros.length} productos)
🐱 Gatos (${PRODUCTOS.gatos.length} productos)  
🐠 Peces (${PRODUCTOS.peces.length} productos)
🐦 Pájaros (${PRODUCTOS.pajaros.length} productos)
🐴 Caballos (${PRODUCTOS.caballos.length} productos)
🩺 Veterinarios (${PRODUCTOS.veterinarios.length} productos)

¿Qué categoría te interesa? 👇`

  const teclado = crearTeclado([
    [
      { text: '🐕 Ver Perros (2)', callback_data: 'categoria_perros' },
      { text: '🐱 Ver Gatos (2)', callback_data: 'categoria_gatos' }
    ],
    [
      { text: '🐠 Ver Peces (2)', callback_data: 'categoria_peces' },
      { text: '🐦 Ver Pájaros (2)', callback_data: 'categoria_pajaros' }
    ],
    [
      { text: '🐴 Ver Caballos (2)', callback_data: 'categoria_caballos' },
      { text: '🩺 Ver Veterinarios (2)', callback_data: 'categoria_veterinarios' }
    ],
    [
      { text: '🔥 Ofertas Exclusivas', callback_data: 'ofertas_exclusivas' }
    ],
    [
      { text: '🏠 Menú Principal', callback_data: 'menu_principal' }
    ]
  ])

  return enviarMensaje(chatId, mensaje, teclado)
}

// Función para mostrar categoría
async function mostrarCategoria(chatId: string, categoria: string) {
  const productos = obtenerProductosPorCategoria(categoria)
  
  if (productos.length === 0) {
    return enviarMensaje(chatId, '❌ No se encontraron productos en esta categoría.')
  }

  const nombreCategoria = {
    perros: '🐕 Perros',
    gatos: '🐱 Gatos', 
    peces: '🐠 Peces',
    pajaros: '🐦 Pájaros',
    caballos: '🐴 Caballos',
    veterinarios: '🩺 Veterinarios'
  }[categoria] || categoria

  const mensaje = `${nombreCategoria} - <b>${productos.length} productos disponibles</b>

🔥 <b>Ofertas exclusivas para usuarios de Telegram</b>
🚚 <b>Envío gratis en pedidos +30€</b>

Selecciona un producto para ver detalles completos: 👇`

  const botones = productos.map(producto => [
    { text: `${producto.nombre} - €${producto.precio} (-${producto.descuento}%)`, callback_data: `producto_${producto.id}` }
  ])

  botones.push([
    { text: '🛒 Ver Catálogo Completo', callback_data: 'catalogo_completo' },
    { text: '🏠 Menú Principal', callback_data: 'menu_principal' }
  ])

  const teclado = crearTeclado(botones)

  return enviarMensaje(chatId, mensaje, teclado)
}

// Función para mostrar producto específico
async function mostrarProducto(chatId: string, productoId: string) {
  const producto = obtenerProductoPorId(productoId)
  
  if (!producto) {
    return enviarMensaje(chatId, '❌ Producto no encontrado.')
  }

  const mensaje = `🌟 <b>${producto.nombre}</b>

${producto.descripcion}

💰 <b>Precio:</b> €${producto.precio} <s>€${producto.precio_original}</s>
🔥 <b>Descuento:</b> ${producto.descuento}% OFF
📦 <b>Stock:</b> ${producto.stock}

<b>Características:</b>
${producto.caracteristicas.map(c => `• ${c}`).join('\n')}

<b>🎁 OFERTA EXCLUSIVA TELEGRAM:</b>
¡Compra ahora y obtén 5% descuento adicional!

<b>💳 Opciones de compra:</b>
• Compra directa en web
• Atención personalizada VIP
• Consulta por WhatsApp`

  const teclado = crearTeclado([
    [
      { text: '🛒 Comprar Ahora', url: `https://hairypetshop.readdy.ai?product=${productoId}` }
    ],
    [
      { text: '💬 Consultar por WhatsApp', url: `https://wa.me/34744403191?text=Hola%20Luna%2C%20me%20interesa%20${encodeURIComponent(producto.nombre)}%20que%20vi%20en%20Telegram%20🐾` }
    ],
    [
      { text: `🔙 Volver a ${producto.categoria}`, callback_data: `categoria_${producto.categoria}` },
      { text: '🏠 Menú Principal', callback_data: 'menu_principal' }
    ]
  ])

  return enviarFoto(chatId, producto.imagen, mensaje, teclado)
}

// Función para mostrar ofertas exclusivas
function mostrarOfertasExclusivas(chatId: string) {
  const productos = obtenerTodosLosProductos()
  const mejoresOfertas = productos
    .sort((a, b) => b.descuento - a.descuento)
    .slice(0, 6)

  const mensaje = `🔥 <b>OFERTAS EXCLUSIVAS TELEGRAM</b>

🎁 <b>Solo para usuarios de Telegram:</b>
• Descuento adicional del 5%
• Envío gratis sin mínimo
• Atención VIP prioritaria

<b>🏆 Mejores ofertas disponibles:</b>

${mejoresOfertas.map((p, i) => 
  `${i + 1}. <b>${p.nombre}</b>
   💰 €${p.precio} <s>€${p.precio_original}</s> (-${p.descuento}%)
   📦 ${p.stock}`
).join('\n\n')}

¿Cuál te interesa? 👇`

  const botones = mejoresOfertas.map(producto => [
    { text: `${producto.nombre} - €${producto.precio}`, callback_data: `producto_${producto.id}` }
  ])

  botones.push([
    { text: '🛒 Ver Catálogo Completo', callback_data: 'catalogo_completo' },
    { text: '🏠 Menú Principal', callback_data: 'menu_principal' }
  ])

  const teclado = crearTeclado(botones)

  return enviarMensaje(chatId, mensaje, teclado)
}

// Función principal del servidor
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    // Configurar webhook
    if (action === 'set_webhook') {
      const result = await configurarWebhook()
      return new Response(
        JSON.stringify({
          success: true,
          message: '✅ Webhook configurado correctamente',
          webhook_result: result,
          bot_url: 'https://t.me/HairyPet_bot'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Test del bot
    if (action === 'test_bot') {
      return new Response(
        JSON.stringify({
          success: true,
          message: '🤖 Bot funcionando perfectamente',
          productos_disponibles: obtenerTodosLosProductos().length,
          categorias: Object.keys(PRODUCTOS).length,
          bot_url: 'https://t.me/HairyPet_bot',
          status: 'ACTIVO'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Manejar updates de Telegram
    if (req.method === 'POST') {
      const update = await req.json()
      console.log('Update recibido:', JSON.stringify(update, null, 2))

      // Manejar mensajes
      if (update.message) {
        const message = update.message
        const chatId = message.chat.id.toString()
        const texto = message.text || ''
        const nombreUsuario = message.from?.first_name || 'amigo'

        if (texto.startsWith('/start')) {
          await manejarStart(chatId, nombreUsuario)
        } else if (texto.toLowerCase().includes('productos') || texto.toLowerCase().includes('catálogo')) {
          await mostrarCatalogoCompleto(chatId)
        } else if (texto.toLowerCase().includes('ofertas')) {
          await mostrarOfertasExclusivas(chatId)
        } else {
          // Respuesta inteligente de Luna IA
          const respuesta = `🤖 <b>Hola ${nombreUsuario}, soy Luna IA</b> 💕

Entiendo que buscas "${texto}". Como especialista en mascotas, te puedo ayudar a encontrar exactamente lo que necesitas.

🌟 <b>¿Te interesa alguna de estas opciones?</b>
• Ver nuestro catálogo completo
• Ofertas exclusivas para Telegram
• Atención personalizada VIP

¿Qué prefieres? 👇`

          const teclado = crearTeclado([
            [
              { text: '🛒 Ver Catálogo', callback_data: 'catalogo_completo' },
              { text: '🔥 Ofertas', callback_data: 'ofertas_exclusivas' }
            ],
            [
              { text: '💬 Atención VIP', url: 'https://wa.me/34744403191?text=Hola%20Luna%2C%20vengo%20de%20Telegram%20🐾' }
            ]
          ])

          await enviarMensaje(chatId, respuesta, teclado)
        }
      }

      // Manejar callback queries (botones)
      if (update.callback_query) {
        const callbackQuery = update.callback_query
        const chatId = callbackQuery.message.chat.id.toString()
        const data = callbackQuery.data

        // Responder al callback query
        await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: '⏳ Cargando...'
          })
        })

        if (data === 'menu_principal') {
          await manejarStart(chatId, callbackQuery.from?.first_name || 'amigo')
        } else if (data === 'catalogo_completo') {
          await mostrarCatalogoCompleto(chatId)
        } else if (data === 'ofertas_exclusivas') {
          await mostrarOfertasExclusivas(chatId)
        } else if (data.startsWith('categoria_')) {
          const categoria = data.replace('categoria_', '')
          await mostrarCategoria(chatId, categoria)
        } else if (data.startsWith('producto_')) {
          const productoId = data.replace('producto_', '')
          await mostrarProducto(chatId, productoId)
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Update procesado' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '🤖 Telegram Luna IA Global funcionando',
        productos: obtenerTodosLosProductos().length,
        bot_url: 'https://t.me/HairyPet_bot'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error en Telegram Bot:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Error procesado correctamente'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})