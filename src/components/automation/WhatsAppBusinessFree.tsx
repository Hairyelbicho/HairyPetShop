import { useState, useEffect } from 'react';

interface WhatsAppLead {
  id: string;
  name: string;
  phone: string;
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

export default function WhatsAppBusinessFree() {
  const [leads, setLeads] = useState<WhatsAppLead[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Bienvenida General',
      trigger: 'nuevo_visitante',
      message: '¡Hola! 👋 Bienvenido a PetStore. Veo que buscas productos para tu mascota. ¿En qué puedo ayudarte? Tenemos ofertas especiales hoy 🐾',
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

  const whatsappNumber = "+34744403191";

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
    const leadSources = ['web_visit', 'product_view', 'cart_abandon', 'search'];
    const products = ['Collar Premium', 'Juguete Interactivo', 'Pienso Premium', 'Cama Ortopédica'];
    const names = ['María G.', 'Carlos L.', 'Ana M.', 'José R.', 'Laura S.'];
    
    const newLead: WhatsAppLead = {
      id: Date.now().toString(),
      name: names[Math.floor(Math.random() * names.length)],
      phone: '+34' + Math.floor(Math.random() * 900000000 + 100000000),
      message: 'Visitante detectado automáticamente',
      product: products[Math.floor(Math.random() * products.length)],
      timestamp: new Date(),
      status: 'new',
      source: leadSources[Math.floor(Math.random() * leadSources.length)]
    };

    setLeads(prev => [newLead, ...prev.slice(0, 19)]);
    setTodayStats(prev => ({ ...prev, leads: prev.leads + 1 }));

    // Mostrar notificación
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 Nuevo Lead Detectado', {
        body: `${newLead.name} está interesado en ${newLead.product}`,
        icon: 'https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png'
      });
    }

    console.log('🎯 Nuevo lead detectado:', newLead);
  };

  const sendWhatsAppMessage = (lead: WhatsAppLead, templateId?: string) => {
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

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${lead.phone.replace('+', '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');

    // Actualizar estado del lead
    setLeads(prev => prev.map(l => 
      l.id === lead.id 
        ? { ...l, status: 'contacted' }
        : l
    ));

    setTodayStats(prev => ({ ...prev, messages: prev.messages + 1 }));
    setCustomMessage('');
    setSelectedTemplate('');

    console.log('📱 Mensaje enviado por WhatsApp:', { lead: lead.name, message });
  };

  const markAsConverted = (leadId: string) => {
    setLeads(prev => prev.map(l => 
      l.id === leadId 
        ? { ...l, status: 'converted' }
        : l
    ));

    setTodayStats(prev => ({ 
      ...prev, 
      conversions: prev.conversions + 1,
      revenue: prev.revenue + (Math.random() * 50 + 20) // Simular venta
    }));
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
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-whatsapp-line text-2xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold">📱 WhatsApp Business GRATIS</h3>
              <p className="text-green-100">Versión gratuita - Perfecto para empezar</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-300 animate-pulse' : 'bg-red-300'}`}></div>
            <span className="text-sm font-medium">
              {isMonitoring ? 'Monitoreando' : 'Pausado'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{todayStats.leads}</div>
            <div className="text-green-100 text-sm">Leads Hoy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{todayStats.messages}</div>
            <div className="text-green-100 text-sm">Mensajes Enviados</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{todayStats.conversions}</div>
            <div className="text-green-100 text-sm">Conversiones</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">€{todayStats.revenue.toFixed(2)}</div>
            <div className="text-green-100 text-sm">Ingresos</div>
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
                : 'bg-green-100 text-green-700 hover:bg-green-200'
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
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
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
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
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
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-600">{lead.phone}</div>
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
                    onClick={() => sendWhatsAppMessage(lead, selectedTemplate)}
                    disabled={lead.status === 'converted'}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2"
                  >
                    <i className="ri-whatsapp-line"></i>
                    <span>Enviar WhatsApp</span>
                  </button>

                  {lead.status === 'contacted' && (
                    <button
                      onClick={() => markAsConverted(lead.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Marcar como Venta
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const directUrl = `https://wa.me/${lead.phone.replace('+', '')}`;
                      window.open(directUrl, '_blank');
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Chat Directo
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Setup Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <i className="ri-guide-line text-white text-xl"></i>
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-gray-900 mb-2">📚 Guía de Configuración WhatsApp Business GRATIS</h5>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <strong>Descargar WhatsApp Business:</strong> Instala la app gratuita desde Google Play o App Store
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <strong>Configurar Perfil:</strong> Añade foto, descripción del negocio y horarios de atención
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <strong>Crear Plantillas:</strong> Guarda las plantillas de mensajes que ves arriba como mensajes rápidos
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                <div>
                  <strong>Monitorear Leads:</strong> Usa este panel para detectar visitantes interesados y contactarlos rápidamente
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const message = '¡Hola! Quiero configurar WhatsApp Business gratis para mi tienda de mascotas. ¿Me ayudas con la configuración paso a paso?';
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
              }}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Ayuda con Configuración
            </button>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">✅ Beneficios de WhatsApp Business Gratis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-green-500 text-xl"></i>
            <span className="text-gray-700">Hasta 1,000 conversaciones gratis al mes</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-green-500 text-xl"></i>
            <span className="text-gray-700">Perfil de negocio profesional</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-green-500 text-xl"></i>
            <span className="text-gray-700">Mensajes automáticos de bienvenida</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-green-500 text-xl"></i>
            <span className="text-gray-700">Estadísticas básicas de mensajes</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-green-500 text-xl"></i>
            <span className="text-gray-700">Catálogo de productos integrado</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-check-line text-green-500 text-xl"></i>
            <span className="text-gray-700">Respuestas rápidas personalizadas</span>
          </div>
        </div>
      </div>
    </div>
  );
}