import { useState, useEffect } from 'react';
import {
  sendTelegramMessage as sendTelegramMsg,
  notifyNewLead,
  notifyMessageSent,
  notifyConversion,
  TELEGRAM_BOT_USERNAME
} from '../../services/telegramService';

interface TelegramLead {
  id: string;
  name: string;
  chatId: string;
  username?: string;
  message: string;
  product?: string;
  timestamp: Date;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  source: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  trigger: string;
  message: string;
  category: 'welcome' | 'product' | 'follow_up' | 'closing';
}

export default function TelegramBusinessFree() {
  const [leads, setLeads] = useState<TelegramLead[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Bienvenida General',
      trigger: 'nuevo_visitante',
      message: '¡Hola! 👋 Bienvenido a HairyPetShop. Veo que buscas productos para tu mascota. ¿En qué puedo ayudarte? Tenemos ofertas especiales hoy 🐾',
      category: 'welcome'
    },
    {
      id: '2',
      name: 'Interés en Producto',
      trigger: 'producto_visto',
      message: '¡Hola! 😊 Vi que te interesa [PRODUCTO]. Es uno de nuestros más populares. ¿Te gustaría conocer más detalles o tienes alguna pregunta específica?',
      category: 'product'
    },
    {
      id: '3',
      name: 'Seguimiento 24h',
      trigger: 'seguimiento_24h',
      message: '¡Hola de nuevo! 🐕 ¿Pudiste revisar la información que te envié ayer? Si tienes alguna duda sobre [PRODUCTO], estoy aquí para ayudarte.',
      category: 'follow_up'
    },
    {
      id: '4',
      name: 'Cierre de Venta',
      trigger: 'cierre_venta',
      message: '¡Perfecto! 🎉 Para proceder con tu pedido de [PRODUCTO], necesito confirmar: ¿Cuál es tu dirección de envío? El pago lo puedes hacer por transferencia o en efectivo contra entrega.',
      category: 'closing'
    }
  ]);
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [todayStats, setTodayStats] = useState({
    leads: 0,
    messages: 0,
    conversions: 0,
    revenue: 0
  });


  // Simular detección de leads automática
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85 && isMonitoring) { // 15% probabilidad cada 30 segundos
        generateNewLead();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const generateNewLead = () => {
    const leadSources = ['web_visit', 'product_view', 'cart_abandon', 'search', 'telegram'];
    const products = ['Collar Premium', 'Juguete Interactivo', 'Pienso Premium', 'Cama Ortopédica'];
    const names = ['María G.', 'Carlos L.', 'Ana M.', 'José R.', 'Laura S.'];
    const usernames = ['maria_g', 'carlos_l', 'ana_m', 'jose_r', 'laura_s'];
    
    const newLead: TelegramLead = {
      id: Date.now().toString(),
      name: names[Math.floor(Math.random() * names.length)],
      chatId: String(Math.floor(Math.random() * 1000000000)),
      username: usernames[Math.floor(Math.random() * usernames.length)],
      message: 'Visitante detectado automáticamente',
      product: products[Math.floor(Math.random() * products.length)],
      timestamp: new Date(),
      status: 'new',
      source: leadSources[Math.floor(Math.random() * leadSources.length)]
    };

    setLeads(prev => [newLead, ...prev.slice(0, 19)]);
    setTodayStats(prev => ({ ...prev, leads: prev.leads + 1 }));

    // Enviar notificaciones a Discord y n8n
    notifyNewLead({
      id: newLead.id,
      name: newLead.name,
      chatId: newLead.chatId,
      product: newLead.product,
      source: newLead.source,
    });

    // Mostrar notificación del navegador
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 Nuevo Lead Detectado', {
        body: `${newLead.name} está interesado en ${newLead.product}`,
        icon: 'https://telegram.org/img/t_logo.png'
      });
    }

    console.log('🎯 Nuevo lead detectado:', newLead);
  };

  const sendTelegramMessage = async (lead: TelegramLead, templateId?: string) => {
    let message = customMessage;
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        message = template.message.replace('[PRODUCTO]', lead.product || 'nuestros productos');
      }
    }

    if (!message.trim()) {
      alert('Por favor, selecciona una plantilla o escribe un mensaje personalizado.');
      return;
    }

    const success = await sendTelegramMsg({
      chatId: lead.chatId,
      text: message,
      parseMode: 'HTML'
    });

    if (success) {
      // Actualizar estado del lead
      setLeads(prev => prev.map(l => 
        l.id === lead.id 
          ? { ...l, status: 'contacted' }
          : l
      ));

      setTodayStats(prev => ({ ...prev, messages: prev.messages + 1 }));
      setCustomMessage('');
      setSelectedTemplate('');

      // Notificar a Discord y n8n
      notifyMessageSent({
        id: lead.id,
        name: lead.name,
        chatId: lead.chatId,
        product: lead.product,
        message: message,
      });

      console.log('📱 Mensaje enviado por Telegram:', { lead: lead.name, message });
      alert('✅ Mensaje enviado exitosamente por Telegram');
    } else {
      alert('❌ Error al enviar el mensaje. Verifica que el chat_id sea válido.');
    }
  };

  const markAsConverted = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    
    setLeads(prev => prev.map(l => 
      l.id === leadId 
        ? { ...l, status: 'converted' }
        : l
    ));

    const revenue = Math.random() * 50 + 20;
    setTodayStats(prev => ({ 
      ...prev, 
      conversions: prev.conversions + 1,
      revenue: prev.revenue + revenue
    }));

    // Notificar a Discord y n8n
    if (lead) {
      notifyConversion({
        id: lead.id,
        name: lead.name,
        chatId: lead.chatId,
        product: lead.product,
        revenue: revenue,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Nuevo';
      case 'contacted': return 'Contactado';
      case 'converted': return 'Convertido';
      case 'lost': return 'Perdido';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-telegram-line text-2xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold">🤖 Telegram Bot - HairyPet</h3>
              <p className="text-blue-100">Bot: {TELEGRAM_BOT_USERNAME} • Integrado con n8n y Discord</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-blue-300 animate-pulse' : 'bg-red-300'}`}></div>
            <span className="text-sm font-medium">
              {isMonitoring ? 'Monitoreando' : 'Pausado'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{todayStats.leads}</div>
            <div className="text-blue-100 text-sm">Leads Hoy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{todayStats.messages}</div>
            <div className="text-blue-100 text-sm">Mensajes Enviados</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{todayStats.conversions}</div>
            <div className="text-blue-100 text-sm">Conversiones</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">€{todayStats.revenue.toFixed(2)}</div>
            <div className="text-blue-100 text-sm">Ingresos</div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">🎛️ Panel de Control</h4>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              isMonitoring 
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isMonitoring ? 'Pausar Monitoreo' : 'Iniciar Monitoreo'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">📋 Plantillas de Mensajes</h5>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setCustomMessage(template.message);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.trigger}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-3">✏️ Mensaje Personalizado</h5>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Escribe tu mensaje personalizado aquí..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <div className="mt-2 text-sm text-gray-600">
              Usa [PRODUCTO] para insertar el nombre del producto automáticamente
            </div>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">🎯 Leads Detectados</h4>
            <button
              onClick={generateNewLead}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Simular Lead
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {leads.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-search-line text-2xl text-gray-400"></i>
              </div>
              <h5 className="text-lg font-medium text-gray-900 mb-2">Esperando leads...</h5>
              <p className="text-gray-600">Los visitantes interesados aparecerán aquí automáticamente</p>
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-600">
                        Chat ID: {lead.chatId}
                        {lead.username && ` • @${lead.username}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lead.timestamp.toLocaleString('es-ES')} • {lead.source}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {getStatusText(lead.status)}
                    </span>
                  </div>
                </div>

                {lead.product && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">Producto de interés:</div>
                    <div className="text-sm text-blue-700">{lead.product}</div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => sendTelegramMessage(lead, selectedTemplate)}
                    disabled={lead.status === 'converted'}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2"
                  >
                    <i className="ri-telegram-line"></i>
                    <span>Enviar Telegram</span>
                  </button>

                  {lead.status === 'contacted' && (
                    <button
                      onClick={() => markAsConverted(lead.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Marcar como Venta
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME.replace('@', '')}`;
                      window.open(telegramUrl, '_blank');
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Abrir Bot
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Setup Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <i className="ri-guide-line text-white text-xl"></i>
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-gray-900 mb-2">📚 Integración Telegram + n8n + Discord</h5>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <strong>Bot Telegram Configurado:</strong> {TELEGRAM_BOT_USERNAME} está listo para recibir y enviar mensajes
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <strong>Integración n8n:</strong> Los eventos se envían automáticamente a n8n para automatización avanzada
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <strong>Notificaciones Discord:</strong> Todas las acciones importantes se notifican en tu servidor de Discord
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                <div>
                  <strong>Flujo de Venta:</strong> Detecta leads, envía mensajes automáticos y convierte ventas con seguimiento completo
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  window.open(`https://t.me/${TELEGRAM_BOT_USERNAME.replace('@', '')}`, '_blank');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Abrir Bot en Telegram
              </button>
              <button
                onClick={() => {
                  window.open('https://discord.com/channels/@me', '_blank');
                }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Ver Discord
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">✅ Ventajas de Telegram Bot + Integraciones</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-blue-500 text-xl"></i>
            <span className="text-gray-700">Mensajes ilimitados sin costo</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-blue-500 text-xl"></i>
            <span className="text-gray-700">API completa y flexible</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-blue-500 text-xl"></i>
            <span className="text-gray-700">Automatización con n8n</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-blue-500 text-xl"></i>
            <span className="text-gray-700">Notificaciones en tiempo real en Discord</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-blue-500 text-xl"></i>
            <span className="text-gray-700">Seguimiento completo del flujo de venta</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-blue-500 text-xl"></i>
            <span className="text-gray-700">Integración con múltiples plataformas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

