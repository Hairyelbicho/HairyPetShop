
import { useState, useEffect } from 'react';

interface VisitorData {
  id: string;
  timeOnSite: number;
  pagesViewed: number;
  currentProduct?: string;
  behavior: 'browsing' | 'interested' | 'leaving' | 'purchasing';
  location?: string;
}

export default function SmartLeadCapture() {
  const [visitor, setVisitor] = useState<VisitorData>({
    id: Math.random().toString(36).substr(2, 9),
    timeOnSite: 0,
    pagesViewed: 1,
    behavior: 'browsing'
  });

  const [showNotification, setShowNotification] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [lunaMessage, setLunaMessage] = useState('');

  const whatsappNumber = "+34744403191";

  // Función para enviar lead a n8n automáticamente
  const sendLeadToN8N = async (leadData: any) => {
    try {
      await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/n8n-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_lead_to_n8n',
          data: {
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            source: leadData.source,
            interest: leadData.interest
          }
        }),
      });
      console.log('✅ Lead enviado a n8n automáticamente');
    } catch (error) {
      console.error('Error enviando lead a n8n:', error);
    }
  };

  // Función para obtener mensaje de Luna IA
  const getLunaMessage = async (behavior: string) => {
    try {
      const response = await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/ai-sales-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_sales_message',
          data: {
            customerBehavior: behavior,
            productInterest: visitor.currentProduct || 'general',
            timeOnSite: visitor.timeOnSite,
            phone: whatsappNumber
          }
        }),
      });

      const result = await response.json();
      if (result.success) {
        return result.message;
      }
    } catch (error) {
      console.error('Error obteniendo mensaje de Luna IA:', error);
    }

    // Mensaje de respaldo si falla la IA
    const fallbackMessages = {
      browsing: "¡Hola! 👋 Soy Luna, tu especialista personal en mascotas de PetStore. Veo que estás explorando nuestros productos. Como experta en más de 1,000 productos, puedo ayudarte a encontrar exactamente lo que necesitas para tu peludo amigo. ¿Tienes perro, gato o ambos? 🐾✨",
      interested: "¡Excelente elección! 🌟 Soy Luna y ese producto es uno de mis favoritos. Como especialista en mascotas, puedo confirmarte que es perfecto para mascotas que buscan calidad premium. 💎 Te ofrezco algo especial: Si lo compras ahora, te regalo el envío GRATIS + una sorpresa para tu mascota. ¿Qué te parece?",
      leaving: "¡Espera un momento! 🐾 Soy Luna y no quiero que te vayas sin encontrar lo perfecto para tu mascota. He ayudado a más de 1,000 familias a encontrar productos increíbles. ⚡ OFERTA EXCLUSIVA: 20% de descuento + envío gratis si compras en los próximos 10 minutos. ¡Solo para ti! ¿Me das 2 minutos para mostrarte algo que sé que te va a encantar? 💕",
      purchasing: "¡Genial! 🎉 Soy Luna y me emociona ayudarte. Eres el tipo de cliente que me encanta: decidido y que sabe lo que quiere. 🛒 Te voy a preparar todo: Producto seleccionado ✅ Descuento aplicado ✅ Envío gratis activado ✅ ¿Prefieres pagar con tarjeta o PayPal? Te mando el link de pago seguro ahora mismo 💳"
    };

    return fallbackMessages[behavior as keyof typeof fallbackMessages] || fallbackMessages.browsing;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitor(prev => ({
        ...prev,
        timeOnSite: prev.timeOnSite + 1
      }));
    }, 1000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !messageSent) {
        setVisitor(prev => ({ ...prev, behavior: 'leaving' }));
        triggerSmartMessage('leaving');
      }
    };

    const handleProductView = () => {
      setTimeout(() => {
        if (!messageSent) {
          setVisitor(prev => ({ ...prev, behavior: 'interested' }));
          triggerSmartMessage('interested');
        }
      }, 45000); // Reducido a 45 segundos para ser más proactivo
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Mensaje inicial más rápido
    setTimeout(() => {
      if (!messageSent && visitor.timeOnSite > 20) {
        triggerSmartMessage('browsing');
      }
    }, 20000); // Reducido a 20 segundos

    return () => {
      clearInterval(interval);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [messageSent, visitor.timeOnSite]);

  const triggerSmartMessage = async (behavior: string) => {
    if (messageSent) return;

    // Obtener mensaje personalizado de Luna IA
    const message = await getLunaMessage(behavior);
    setLunaMessage(message);

    console.log(`🤖 Luna IA enviando mensaje automático:`, message);
    
    setShowNotification(true);
    setMessageSent(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 8000); // Mostrar notificación más tiempo

    // Enviar lead a n8n cuando se detecta interés
    const leadData = {
      id: Date.now(),
      name: 'Visitante Interesado',
      email: 'lead@detected.com',
      phone: '+34000000000',
      source: 'luna_ai_capture',
      interest: behavior,
      timestamp: new Date().toISOString(),
      status: 'new',
      luna_message: message
    };

    const existingLeads = JSON.parse(localStorage.getItem('smartLeads') || '[]');
    existingLeads.push(leadData);
    localStorage.setItem('smartLeads', JSON.stringify(existingLeads));

    // 🚀 ENVIAR LEAD A N8N AUTOMÁTICAMENTE
    setTimeout(() => {
      sendLeadToN8N(leadData);
    }, 500);

    // Enviar notificación de lead capturado
    try {
      await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/ai-sales-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_sale_notification',
          data: {
            saleData: {
              productName: 'Lead Capturado',
              amount: 0,
              customerName: 'Visitante Interesado',
              customerEmail: 'lead@detected.com',
              paymentMethod: 'luna_ai_capture',
              platform: 'website'
            }
          }
        }),
      });
    } catch (error) {
      console.error('Error enviando notificación de lead:', error);
    }
  };

  const sendManualMessage = () => {
    const message = "¡Hola Luna! Me interesa conocer más sobre PetStore y sus productos automáticos para mascotas. Vi tu mensaje automático y me gustaría hablar contigo.";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
  };

  const testLunaCapture = async () => {
    await triggerSmartMessage('interested');
  };

  return (
    <>
      {/* Indicador de Luna IA Activa */}
      <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold">Luna IA Activa</span>
        <i className="ri-robot-line"></i>
      </div>

      {/* Botón de prueba (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={testLunaCapture}
          className="fixed top-20 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs cursor-pointer"
        >
          Probar Luna IA
        </button>
      )}

      {/* Notificación de Mensaje de Luna IA */}
      {showNotification && (
        <div className="fixed bottom-20 right-6 z-50 bg-white border-l-4 border-purple-500 rounded-lg shadow-2xl p-4 max-w-md animate-slide-in">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="ri-robot-line text-purple-600 text-lg"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-gray-900">Luna IA - Especialista en Mascotas</span>
                <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">IA</div>
                <i className="ri-whatsapp-line text-green-500"></i>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-3 border-l-2 border-purple-300">
                <p className="text-sm text-gray-700 italic">
                  {lunaMessage.substring(0, 150)}...
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Enviado a n8n para automatización completa
                </span>
                <button
                  onClick={sendManualMessage}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded text-xs hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer whitespace-nowrap"
                >
                  Responder a Luna →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel de Monitoreo Luna IA (Solo visible en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-40 bg-gradient-to-r from-purple-900 to-pink-900 text-white p-4 rounded-lg text-xs max-w-xs">
          <div className="font-semibold mb-2 flex items-center space-x-2">
            <i className="ri-robot-line"></i>
            <span>🤖 Monitor Luna IA + n8n</span>
          </div>
          <div>ID: {visitor.id}</div>
          <div>Tiempo: {visitor.timeOnSite}s</div>
          <div>Páginas: {visitor.pagesViewed}</div>
          <div>Estado: {visitor.behavior}</div>
          <div>Luna IA: {messageSent ? '✅ Mensaje enviado' : '⏳ Analizando...'}</div>
          <div>n8n: {messageSent ? '✅ Sincronizado' : '⏳ Esperando'}</div>
          <div>WhatsApp: {messageSent ? '✅ Notificado' : '⏳ Pendiente'}</div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
