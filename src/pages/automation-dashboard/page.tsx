
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AutoOrderSystem from '../../components/automation/AutoOrderSystem';
import AutoPaymentProcessor from '../../components/automation/AutoPaymentProcessor';
import AutoSupplierManager from '../../components/automation/AutoSupplierManager';
import N8NIntegration from '../../components/automation/N8NIntegration';
import RealTimeNotifications from '../../components/notifications/RealTimeNotifications';
import AutoSalesBot from '../../components/automation/AutoSalesBot';
import WhatsAppBusinessFree from '../../components/automation/WhatsAppBusinessFree';

export default function AutomationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: 'ri-dashboard-line' },
    { id: 'sales-bot', name: 'Vendedor Automático', icon: 'ri-robot-line' },
    { id: 'orders', name: 'Pedidos', icon: 'ri-shopping-bag-line' },
    { id: 'payments', name: 'Pagos', icon: 'ri-money-euro-circle-line' },
    { id: 'suppliers', name: 'Proveedores', icon: 'ri-truck-line' },
    { id: 'n8n', name: 'n8n Integration', icon: 'ri-links-line' },
    { id: 'notifications', name: 'Notificaciones', icon: 'ri-notification-line' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Sistema Status */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="ri-robot-line text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Sistema Automático PetStore</h3>
                    <p className="text-green-100">Funcionando 24/7 - Todo automatizado</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">ACTIVO</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">98.7%</div>
                  <div className="text-green-100 text-sm">Automatización</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">€2,847</div>
                  <div className="text-green-100 text-sm">Ingresos Hoy</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">47</div>
                  <div className="text-green-100 text-sm">Ventas Automáticas</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-green-100 text-sm">Canales Activos</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => setActiveTab('sales-bot')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer text-left"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="ri-robot-line text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Vendedor Automático</h4>
                    <p className="text-sm text-gray-600">Multi-canal IA</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">NUEVO</div>
                <p className="text-xs text-gray-500">WhatsApp, Email, Telegram, TikTok</p>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer text-left"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-shopping-bag-line text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pedidos</h4>
                    <p className="text-sm text-gray-600">Gestión automática</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
                <p className="text-xs text-gray-500">Procesados hoy</p>
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer text-left"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-money-euro-circle-line text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pagos</h4>
                    <p className="text-sm text-gray-600">Multi-método</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">€2,847</div>
                <p className="text-xs text-gray-500">Stripe, PayPal, Crypto</p>
              </button>

              <button
                onClick={() => setActiveTab('n8n')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer text-left"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <i className="ri-links-line text-orange-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">n8n Integration</h4>
                    <p className="text-sm text-gray-600">Workflows automáticos</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">ACTIVO</div>
                <p className="text-xs text-gray-500">Conectado y funcionando</p>
              </button>
            </div>

            {/* WhatsApp Business Free Section */}
            <div className="mb-8">
              <WhatsAppBusinessFree />
            </div>

            {/* NUEVO: Sección de Luna IA para Telegram */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <i className="ri-telegram-line text-white text-xl"></i>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-2">🤖 Luna IA para Telegram</h5>
                  <p className="text-gray-600 mb-4">
                    Bot @HairyPet_bot configurado con Luna IA como vendedora automática 24/7
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Bot @HairyPet_bot activo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Luna IA integrada</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Comandos automáticos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Webhook configurado</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Sincronización n8n</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Ventas automáticas</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        window.open('https://t.me/HairyPet_bot', '_blank');
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
                    >
                      Probar Bot
                    </button>
                    <button
                      onClick={() => {
                        const message = '🤖 Quiero ver las estadísticas de Luna IA en Telegram: mensajes enviados, leads generados, ventas convertidas. ¿Me muestras el dashboard completo?';
                        const encodedMessage = encodeURIComponent(message);
                        window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                      }}
                      className="bg-white border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
                    >
                      Ver Estadísticas
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* NUEVO: Sección de n8n Workflows */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <i className="ri-links-line text-white text-xl"></i>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-2">🔗 n8n Workflows Activos</h5>
                  <p className="text-gray-600 mb-4">
                    Automatización completa conectada a tu workflow principal
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Workflow ID: vCJbQTB5vj88tIxe</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Ventas automáticas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Leads sincronizados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Webhooks activos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Notificaciones WhatsApp</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Telegram integrado</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        window.open('http://localhost:5678/workflow/vCJbQTB5vj88tIxe', '_blank');
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
                    >
                      Ver Workflow
                    </button>
                    <button
                      onClick={() => {
                        const message = '🔗 Quiero optimizar mis workflows de n8n para generar más ventas automáticas. ¿Me ayudas a configurar automatizaciones más avanzadas?';
                        const encodedMessage = encodeURIComponent(message);
                        window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                      }}
                      className="bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
                    >
                      Optimizar Workflows
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sistema Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">🔄 Flujo de Automatización Completo</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-user-line text-2xl text-blue-600"></i>
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">1. Cliente Llega</h5>
                  <p className="text-sm text-gray-600">IA detecta visitante y captura lead automáticamente</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-robot-line text-2xl text-purple-600"></i>
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">2. Vendedor IA</h5>
                  <p className="text-sm text-gray-600">Bot vende por WhatsApp, Email, Telegram, TikTok</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-money-euro-circle-line text-2xl text-green-600"></i>
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">3. Pago Automático</h5>
                  <p className="text-sm text-gray-600">Procesa Stripe, PayPal, Crypto automáticamente</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-truck-line text-2xl text-orange-600"></i>
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">4. Envío Automático</h5>
                  <p className="text-sm text-gray-600">Orden al proveedor y notificación por WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'sales-bot':
        return <AutoSalesBot />;
      
      case 'orders':
        return <AutoOrderSystem />;
      
      case 'payments':
        return <AutoPaymentProcessor />;
      
      case 'suppliers':
        return <AutoSupplierManager />;
      
      case 'n8n':
        return <N8NIntegration />;
      
      case 'notifications':
        return <RealTimeNotifications />;
      
      default:
        return <div>Contenido no encontrado</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <img 
                  src="https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png" 
                  alt="PetStore Logo" 
                  className="w-10 h-10"
                />
                <div>
                  <h1 className="text-xl font-bold text-blue-900" style={{ fontFamily: '"Pacifico", serif' }}>
                    PetStore
                  </h1>
                  <p className="text-xs text-gray-600">Dashboard de Automatización</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Sistema Activo</span>
              </div>
              
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex items-center space-x-1"
              >
                <i className="ri-home-line"></i>
                <span>Volver a la Tienda</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.name}</span>
                  {tab.id === 'sales-bot' && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      NUEVO
                    </div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
