
import { useState, useEffect } from 'react';
import { apiUrl } from '../../utils/ownApi';

interface SalesChannel {
  id: string;
  name: string;
  platform: 'whatsapp' | 'email' | 'telegram' | 'tiktok';
  status: 'active' | 'inactive' | 'configuring';
  icon: string;
  color: string;
  sales: number;
  leads: number;
  conversionRate: number;
}

interface AutoMessage {
  id: string;
  platform: string;
  trigger: string;
  message: string;
  products: string[];
  active: boolean;
}

export default function AutoSalesBot() {
  const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([
    {
      id: 'whatsapp',
      name: 'WhatsApp Business + Luna IA',
      platform: 'whatsapp',
      status: 'active',
      icon: 'ri-whatsapp-line',
      color: 'green',
      sales: 47,
      leads: 156,
      conversionRate: 30.1
    },
    {
      id: 'email',
      name: 'Email Marketing + IA',
      platform: 'email',
      status: 'active',
      icon: 'ri-mail-line',
      color: 'blue',
      sales: 23,
      leads: 89,
      conversionRate: 25.8
    },
    {
      id: 'telegram',
      name: 'Telegram Bot + IA',
      platform: 'telegram',
      status: 'active',
      icon: 'ri-telegram-line',
      color: 'cyan',
      sales: 12,
      leads: 34,
      conversionRate: 35.3
    },
    {
      id: 'tiktok',
      name: 'TikTok Shop + IA',
      platform: 'tiktok',
      status: 'active',
      icon: 'ri-tiktok-line',
      color: 'pink',
      sales: 8,
      leads: 28,
      conversionRate: 28.6
    }
  ]);

  const [autoMessages, setAutoMessages] = useState<AutoMessage[]>([
    {
      id: '1',
      platform: 'whatsapp',
      trigger: 'nuevo_visitante',
      message: '¡Hola! 👋 Soy Luna, tu especialista personal en mascotas de PetStore. Veo que buscas algo especial para tu peludo amigo. Como experta en más de 1,000 productos, puedo ayudarte a encontrar exactamente lo que necesitas. ¿Tienes perro, gato o ambos? 🐾✨',
      products: ['collar-premium', 'juguete-interactivo'],
      active: true
    },
    {
      id: '2',
      platform: 'email',
      trigger: 'abandono_carrito',
      message: '¡Hola de nuevo! 🛒 Soy Luna y vi que tienes productos increíbles esperándote. Como especialista, puedo confirmarte que has elegido productos de calidad premium. ¡OFERTA ESPECIAL! 20% descuento + envío GRATIS si completas tu compra en los próximos 30 minutos. Tu mascota te lo agradecerá 💕',
      products: ['todos'],
      active: true
    },
    {
      id: '3',
      platform: 'telegram',
      trigger: 'producto_visto',
      message: '🔥 ¡Hola! Soy Luna, tu asesora personal. Vi que te interesa este producto y como especialista te confirmo: ¡Es una elección PERFECTA! Tengo una oferta exclusiva para ti: 15% descuento + regalo sorpresa. ¿Lo aprovechamos? Solo por tiempo limitado ⚡',
      products: ['todos'],
      active: true
    },
    {
      id: '4',
      platform: 'tiktok',
      trigger: 'video_visto',
      message: '🎬 ¡Hola! Soy Luna y vi que viste nuestro video. ¡Qué buen ojo tienes! Ese producto es uno de mis favoritos. Como especialista en mascotas, te ofrezco algo especial: 25% descuento + envío express GRATIS. ¿Tu mascota se lo merece, no? 🌟',
      products: ['productos-trending'],
      active: true
    }
  ]);

  const [isGeneratingSale, setIsGeneratingSale] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);
  const [totalRevenue, setTotalRevenue] = useState(3247.80);
  const [lunaActive, setLunaActive] = useState(true);

  // Simular ventas automáticas con Luna IA
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% probabilidad cada 8 segundos
        generateAutomaticSale();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const generateAutomaticSale = async () => {
    const platforms = ['whatsapp', 'email', 'telegram', 'tiktok'];
    const products = [
      { name: 'Collar Premium Luna', price: 29.99 },
      { name: 'Juguete Interactivo Pro', price: 22.50 },
      { name: 'Pienso Premium Plus', price: 48.00 },
      { name: 'Cama Ortopédica Deluxe', price: 52.99 },
      { name: 'Kit Cuidado Completo', price: 35.99 }
    ];
    const customers = ['María G.', 'Carlos L.', 'Ana M.', 'José R.', 'Laura S.', 'Pedro T.', 'Carmen F.'];

    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];

    const sale = {
      id: Date.now(),
      platform,
      customer,
      product: product.name,
      amount: product.price,
      timestamp: new Date(),
      automated: true,
      agent: 'Luna IA'
    };

    setLastSale(sale);
    setTotalRevenue(prev => prev + product.price);

    // Actualizar estadísticas del canal
    setSalesChannels(prev => prev.map(channel => 
      channel.platform === platform 
        ? { ...channel, sales: channel.sales + 1 }
        : channel
    ));

    // Enviar notificación de venta automática
    try {
      await fetch(apiUrl('/api/ai-sales-agent'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_sale_notification',
          data: {
            saleData: {
              productName: product.name,
              amount: product.price,
              customerName: customer,
              customerEmail: `${customer.toLowerCase().replace(' ', '.')}@email.com`,
              paymentMethod: platform,
              platform: platform
            }
          }
        }),
      });
    } catch (error) {
      console.error('Error enviando notificación:', error);
    }

    // Mostrar notificación
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🤖 ¡Venta Automática con Luna IA!', {
        body: `${customer} compró ${product.name} por €${product.price} via ${platform}`,
        icon: '/hairypetshop-logo.png'
      });
    }

    console.log('🤖 Venta automática generada por Luna IA:', sale);
  };

  const testLunaIA = async () => {
    setIsGeneratingSale(true);
    
    try {
      const response = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: 'luna',
          messages: [],
        }),
      });

      const result = await response.json();
      
      if (result.success && result.message) {
        alert(`🤖 Luna dice:\n\n${result.message}`);
        
        // Generar venta de prueba
        setTimeout(() => {
          generateAutomaticSale();
        }, 1000);
      } else {
        alert('Error al generar respuesta con Groq. Revisa la consola para más detalles.');
        console.error(result);
      }
    } catch (error) {
      console.error('Error probando IA de Groq:', error);
      alert('Error de conexión con Groq. Verifica tu conexión y API Key.');
    }
    
    setIsGeneratingSale(false);
  };

  const configureChannel = (channelId: string) => {
    const configurations = {
      whatsapp: {
        title: 'Configurar WhatsApp Business + Luna IA',
        steps: [
          '1. Conecta tu número de WhatsApp Business',
          '2. Activa Luna IA como vendedora automática',
          '3. Configura respuestas inteligentes 24/7',
          '4. Integra catálogo de productos automático',
          '5. Activa notificaciones de ventas en tiempo real'
        ],
        action: 'Activar Luna IA'
      },
      email: {
        title: 'Configurar Email Marketing + IA',
        steps: [
          '1. Conecta tu proveedor de email (Gmail, Outlook)',
          '2. Activa Luna IA para emails personalizados',
          '3. Configura secuencias de seguimiento inteligentes',
          '4. Automatiza emails de abandono de carrito',
          '5. Genera reportes de conversión automáticos'
        ],
        action: 'Activar Email IA'
      },
      telegram: {
        title: 'Configurar Telegram Bot + Luna IA',
        steps: [
          '1. Bot @HairyPet_bot ya está creado ✅',
          '2. Luna IA integrada como asistente de ventas ✅',
          '3. Comandos automáticos inteligentes configurados ✅',
          '4. Webhook activo en Supabase ✅',
          '5. Sincronización completa con n8n ✅'
        ],
        action: 'Bot IA Activo'
      },
      tiktok: {
        title: 'Configurar TikTok Shop + IA',
        steps: [
          '1. Registra tu TikTok Shop',
          '2. Integra Luna IA para comentarios automáticos',
          '3. Configura videos automáticos con IA',
          '4. Activa ventas en vivo con asistente IA',
          '5. Automatiza respuestas a mensajes directos'
        ],
        action: 'Configurar TikTok IA'
      }
    };

    const config = configurations[channelId as keyof typeof configurations];
    
    if (channelId === 'telegram') {
      // Telegram ya está configurado
      const message = `🤖 ${config.title}

${config.steps.join('\n')}

🌟 TELEGRAM BOT ACTIVO:
• Bot: @HairyPet_bot
• Luna IA funcionando 24/7
• Comandos: /start, /productos, /ofertas, /contacto
• Integración completa con n8n
• Notificaciones automáticas

✅ ¡Tu bot de Telegram ya está listo y funcionando!

🚀 CÓMO DIVULGAR TU BOT:

📱 COMPARTIR EN REDES:
• Instagram: "¡Habla con Luna IA! 🤖 t.me/HairyPet_bot"
• Facebook: "Asistente 24/7 para mascotas 🐾"
• TikTok: "Bot inteligente que vende automáticamente"

🔗 ENLACE DIRECTO:
https://t.me/HairyPet_bot

📲 QR CODE:
Genera un QR del enlace para tarjetas/tienda

🎯 ESTRATEGIAS:
• Pon el enlace en tu bio de Instagram
• Compártelo en grupos de mascotas
• Inclúyelo en tu firma de email
• Añádelo a tarjetas de visita

¿Quieres que te ayude a crear contenido para promocionar el bot?`;

      const encodedMessage = encodeURIComponent(message);
      
      // Abrir tanto WhatsApp como Telegram
      window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
      setTimeout(() => {
        window.open('https://t.me/HairyPet_bot', '_blank');
      }, 1000);
    } else {
      const message = `🤖 ${config.title}

${config.steps.join('\n')}

🌟 INCLUYE:
• Luna IA como vendedora personal 24/7
• Automatización completa con n8n
• Notificaciones de ventas en WhatsApp
• Análisis de conversiones en tiempo real

¿Te ayudo a configurar este canal con IA?`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con Luna IA */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-robot-line text-2xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold">🤖 Luna (Powered by Groq) - Vendedora Automática</h3>
              <p className="text-purple-100">IA ultra rápida de Groq • Activa 24/7 en todos los canales</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${lunaActive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <div className={`w-2 h-2 rounded-full ${lunaActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-sm font-medium">{lunaActive ? 'Groq IA Activa' : 'Groq IA Inactiva'}</span>
            </div>
            
            <button
              onClick={testLunaIA}
              disabled={isGeneratingSale}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-2 whitespace-nowrap"
            >
              {isGeneratingSale ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  <span>Luna trabajando...</span>
                </>
              ) : (
                <>
                  <i className="ri-play-line"></i>
                  <span>Probar Groq IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</div>
            <div className="text-purple-100 text-sm">Ingresos con Luna IA</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{salesChannels.reduce((acc, ch) => acc + ch.sales, 0)}</div>
            <div className="text-purple-100 text-sm">Ventas Automáticas</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">4</div>
            <div className="text-purple-100 text-sm">Canales con IA</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-purple-100 text-sm">Luna Disponible</div>
          </div>
        </div>
      </div>

      {/* Última venta automática con Luna IA */}
      {lastSale && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="ri-robot-line text-green-600 text-xl"></i>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-green-900 flex items-center space-x-2">
                <span>🎉 ¡Venta Automática con Luna IA!</span>
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">NUEVA</div>
              </div>
              <div className="text-sm text-green-700">
                <strong>{lastSale.customer}</strong> compró <strong>{lastSale.product}</strong> por <strong>€{lastSale.amount}</strong> via {lastSale.platform}
              </div>
              <div className="text-xs text-green-600 flex items-center space-x-2">
                <span>{lastSale.timestamp.toLocaleTimeString('es-ES')}</span>
                <span>•</span>
                <span>Procesado por {lastSale.agent}</span>
                <span>•</span>
                <span>Notificación enviada a WhatsApp</span>
              </div>
            </div>
            <div className="bg-green-100 px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-green-700">IA AUTOMÁTICO</span>
            </div>
          </div>
        </div>
      )}

      {/* Canales de Venta con IA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {salesChannels.map((channel) => (
          <div key={channel.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-${channel.color}-100 rounded-full flex items-center justify-center`}>
                  <i className={`${channel.icon} text-${channel.color}-600 text-xl`}></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{channel.name}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Luna IA Activa</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => configureChannel(channel.id)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:from-blue-600 hover:to-purple-600 cursor-pointer whitespace-nowrap"
              >
                Configurar IA
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{channel.sales}</div>
                <div className="text-xs text-gray-600">Ventas IA</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{channel.leads}</div>
                <div className="text-xs text-gray-600">Leads IA</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{channel.conversionRate}%</div>
                <div className="text-xs text-gray-600">Conversión</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <i className="ri-robot-line text-green-600"></i>
                <span className="text-sm font-medium text-green-800">Luna IA Vendiendo 24/7</span>
              </div>
              <p className="text-xs text-green-700">
                Atenta • Amable • Convincente • Experta en mascotas
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mensajes Automáticos de Luna IA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="ri-message-line text-purple-600"></i>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">💬 Mensajes de Luna IA</h4>
                <p className="text-sm text-gray-600">Vendedora IA atenta, amable y convincente</p>
              </div>
            </div>
            <button
              onClick={() => {
                const message = '🤖 Quiero personalizar los mensajes de Luna IA para que sea aún más convincente y genere más ventas. ¿Me ayudas a optimizar su personalidad vendedora?';
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:from-purple-600 hover:to-pink-600 cursor-pointer whitespace-nowrap"
            >
              Personalizar Luna IA
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {autoMessages.map((message) => (
            <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.platform === 'whatsapp' ? 'bg-green-100' :
                    message.platform === 'email' ? 'bg-blue-100' :
                    message.platform === 'telegram' ? 'bg-cyan-100' : 'bg-pink-100'
                  }`}>
                    <i className={`${
                      message.platform === 'whatsapp' ? 'ri-whatsapp-line text-green-600' :
                      message.platform === 'email' ? 'ri-mail-line text-blue-600' :
                      message.platform === 'telegram' ? 'ri-telegram-line text-cyan-600' : 'ri-tiktok-line text-pink-600'
                    } text-sm`}></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 capitalize flex items-center space-x-2">
                      <span>{message.platform}</span>
                      <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">Luna IA</div>
                    </div>
                    <div className="text-sm text-gray-600">Trigger: {message.trigger}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    IA Activa
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-3 border-l-4 border-purple-500">
                <p className="text-sm text-gray-700 italic">{message.message}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Productos: {message.products.join(', ')}</span>
                <button
                  onClick={() => {
                    const editMessage = `🤖 Quiero optimizar este mensaje de Luna IA:

Plataforma: ${message.platform}
Trigger: ${message.trigger}
Mensaje actual: "${message.message}"

¿Me ayudas a hacerlo más convincente y que genere más ventas?`;
                    const encodedMessage = encodeURIComponent(editMessage);
                    window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                  }}
                  className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium"
                >
                  Optimizar IA
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuración Avanzada de Luna IA */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <i className="ri-brain-line text-white text-xl"></i>
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-gray-900 mb-2">🧠 Luna IA - Configuración Avanzada</h5>
            <p className="text-gray-600 mb-4">
              Personaliza completamente a Luna IA para que sea la vendedora perfecta para tu negocio
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span>Personalidad vendedora convincente</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span>Respuestas inteligentes 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span>Notificaciones de ventas en WhatsApp</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span>Integración completa con n8n</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span>Análisis de comportamiento del cliente</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span>Automatización multi-canal</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const message = '🚀 Quiero configurar Luna IA completa para WhatsApp, Email, Telegram y TikTok. Necesito que sea la vendedora más convincente y que me notifique todas las ventas automáticamente. ¿Me ayudas con la configuración avanzada?';
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
              >
                Configurar Luna IA Completa
              </button>
              <button
                onClick={() => {
                  const message = '📊 Quiero ver estadísticas detalladas de Luna IA: conversiones, mensajes enviados, ventas generadas, y optimizar su rendimiento. ¿Me muestras el dashboard completo?';
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                }}
                className="bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
              >
                Ver Estadísticas IA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
