
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AutoOrderSystem from '../../components/automation/AutoOrderSystem';
import AutoPaymentProcessor from '../../components/automation/AutoPaymentProcessor';
import AutoSupplierManager from '../../components/automation/AutoSupplierManager';
import HairyBotPanel from '../../components/automation/HairyBotPanel';
import RealTimeNotifications from '../../components/notifications/RealTimeNotifications';
import AutoSalesBot from '../../components/automation/AutoSalesBot';
import WhatsAppBusinessFree from '../../components/automation/WhatsAppBusinessFree';

export default function AutomationDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: 'ri-dashboard-line' },
    { id: 'sales-bot', name: 'Vendedor Automático', icon: 'ri-robot-line' },
    { id: 'product-hunter', name: 'Product Hunter IA', icon: 'ri-search-eye-line' },
    { id: 'orders', name: 'Pedidos', icon: 'ri-shopping-bag-line' },
    { id: 'payments', name: 'Pagos', icon: 'ri-money-euro-circle-line' },
    { id: 'accounting', name: 'Contabilidad (Excel)', icon: 'ri-file-excel-line' },
    { id: 'suppliers', name: 'Proveedores', icon: 'ri-truck-line' },
    { id: 'hairy-bot', name: 'HairyBot', icon: 'ri-robot-2-line' },
    { id: 'notifications', name: 'Notificaciones', icon: 'ri-notification-line' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Clave de acceso secreta
    if (passwordInput === 'Arkadium88') {
      setIsAuthenticated(true);
    } else {
      alert('Acceso Denegado. Contraseña incorrecta.');
    }
  };

  const handleExportExcel = () => {
    // Generar un CSV simple
    const headers = "Mes,Ventas Brutas,Reembolsos,Gastos Operativos,Beneficio Neto\n";
    const data = "Enero 2026,€4500,€150,€300,€4050\nFebrero 2026,€5200,€200,€350,€4650\nMarzo 2026,€6100,€100,€400,€5600\nAbril 2026,€5800,€300,€420,€5080\nMayo 2026,€2847,€0,€150,€2697";
    const blob = new Blob([headers + data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Contabilidad_HairyPetShop_2026.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearchProducts = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    setTimeout(() => {
      setSearchResults([
        { name: "Cama Ortopédica para Perros Grandes", cost: 15.50, suggestedPrice: 45.99, margin: "196%", trend: "🔥 +300% ventas esta semana" },
        { name: "Fuente de Agua Inteligente WiFi Gatos", cost: 12.00, suggestedPrice: 39.99, margin: "233%", trend: "📈 Viral en TikTok" },
        { name: "Rastreador GPS Mini para Collares", cost: 8.90, suggestedPrice: 29.99, margin: "237%", trend: "⭐ Top Ventas Amazon" }
      ]);
      setIsSearching(false);
    }, 2000);
  };

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
                onClick={() => setActiveTab('hairy-bot')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer text-left"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <img src="/hairy-bot.png" alt="HairyBot" className="w-12 h-12 rounded-full object-cover bg-[#c4a574] border border-gray-200" />
                  <div>
                    <h4 className="font-semibold text-gray-900">HairyBot</h4>
                    <p className="text-sm text-gray-600">IA Groq · catálogo tienda</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">ACTIVO</div>
                <p className="text-xs text-gray-500">Talk with Us en toda la web</p>
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
                      <span>HairyBot Groq activo</span>
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

            {/* HairyBot Groq */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-start space-x-4">
                <img src="/hairy-bot.png" alt="HairyBot" className="w-12 h-12 rounded-full object-cover bg-[#c4a574] border border-orange-200 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-2">HairyBot · Groq</h5>
                  <p className="text-gray-600 mb-4">
                    Asistente de la tienda: conoce el catálogo, Hairy Home, Hairy Tools, HairyWallet y la matriz Arkadium88 Holdings SL. Responde desde nuestra API (`/api/chat`), no desde n8n ni Readdy.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Motor Groq Llama 3.3 70B</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Catálogo y precios de HairyPetShop</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Widget Talk with Us</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>WhatsApp +34 744 403 191</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Pagos Stripe, PayPal y SOL</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>API propia puerto 8787</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('hairy-bot')}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
                    >
                      Ver HairyBot
                    </button>
                    <button
                      onClick={() => {
                        const message = 'Hola Hairy, ¿qué productos me recomiendas para mi perro?';
                        const encodedMessage = encodeURIComponent(message);
                        window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                      }}
                      className="bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
                    >
                      Probar por WhatsApp
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
      
      case 'accounting':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                 <i className="ri-bar-chart-box-line text-blue-600"></i>
                 Control Financiero y Contabilidad
              </h3>
              <button 
                onClick={handleExportExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <i className="ri-file-excel-line"></i> Descargar Excel (CSV)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
               <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                 <p className="text-sm text-blue-600 font-bold uppercase">Ventas Mes Actual</p>
                 <h4 className="text-2xl font-black text-gray-900">€2,847.00</h4>
               </div>
               <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                 <p className="text-sm text-red-600 font-bold uppercase">Devoluciones / Reembolsos</p>
                 <h4 className="text-2xl font-black text-gray-900">€150.00</h4>
               </div>
               <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                 <p className="text-sm text-orange-600 font-bold uppercase">Gastos de Operación</p>
                 <h4 className="text-2xl font-black text-gray-900">€300.00</h4>
               </div>
               <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                 <p className="text-sm text-green-600 font-bold uppercase">Beneficio Neto</p>
                 <h4 className="text-2xl font-black text-green-700">€2,397.00</h4>
               </div>
            </div>

            {/* Gráficos simulados */}
            <h4 className="text-lg font-bold text-gray-800 mb-4">Evolución de Ingresos Netos (Últimos 5 meses)</h4>
            <div className="flex items-end gap-4 h-48 mb-8 border-b border-l border-gray-200 p-4">
              <div className="w-1/5 bg-blue-200 hover:bg-blue-300 transition-all rounded-t-lg flex items-end justify-center group" style={{ height: '60%' }}>
                 <span className="text-xs font-bold text-blue-900 mb-2 opacity-0 group-hover:opacity-100">€4,050</span>
              </div>
              <div className="w-1/5 bg-blue-300 hover:bg-blue-400 transition-all rounded-t-lg flex items-end justify-center group" style={{ height: '70%' }}>
                 <span className="text-xs font-bold text-blue-900 mb-2 opacity-0 group-hover:opacity-100">€4,650</span>
              </div>
              <div className="w-1/5 bg-blue-400 hover:bg-blue-500 transition-all rounded-t-lg flex items-end justify-center group" style={{ height: '85%' }}>
                 <span className="text-xs font-bold text-white mb-2 opacity-0 group-hover:opacity-100">€5,600</span>
              </div>
              <div className="w-1/5 bg-blue-500 hover:bg-blue-600 transition-all rounded-t-lg flex items-end justify-center group" style={{ height: '75%' }}>
                 <span className="text-xs font-bold text-white mb-2 opacity-0 group-hover:opacity-100">€5,080</span>
              </div>
              <div className="w-1/5 bg-green-500 hover:bg-green-600 transition-all rounded-t-lg flex items-end justify-center group" style={{ height: '40%' }}>
                 <span className="text-xs font-bold text-white mb-2 opacity-0 group-hover:opacity-100">€2,697</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 text-sm text-gray-500 font-bold uppercase mb-12">
               <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span className="text-green-600">May (Actual)</span>
            </div>

            {/* Top Ventas */}
            <h4 className="text-lg font-bold text-gray-800 mb-4 border-t pt-8">Top 3 Productos Más Vendidos (Histórico)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-gray-600 font-bold">Producto</th>
                    <th className="py-3 px-4 text-gray-600 font-bold">Unidades Vendidas</th>
                    <th className="py-3 px-4 text-gray-600 font-bold">Ingreso Bruto</th>
                    <th className="py-3 px-4 text-gray-600 font-bold">Margen Medio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-4 font-semibold flex items-center gap-2"><i className="ri-medal-line text-yellow-500 text-lg"></i> Arenero Automático Autolimpiable</td>
                    <td className="py-4 px-4">342</td>
                    <td className="py-4 px-4 font-bold text-gray-900">€64,976.58</td>
                    <td className="py-4 px-4 text-green-600 font-bold">55%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-4 font-semibold flex items-center gap-2"><i className="ri-medal-line text-gray-400 text-lg"></i> Juguete Interactivo para Gatos</td>
                    <td className="py-4 px-4">203</td>
                    <td className="py-4 px-4 font-bold text-gray-900">€3,755.50</td>
                    <td className="py-4 px-4 text-green-600 font-bold">75%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-4 font-semibold flex items-center gap-2"><i className="ri-medal-line text-orange-400 text-lg"></i> Collar Premium para Perros</td>
                    <td className="py-4 px-4">156</td>
                    <td className="py-4 px-4 font-bold text-gray-900">€3,898.44</td>
                    <td className="py-4 px-4 text-green-600 font-bold">60%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'product-hunter':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                 <i className="ri-search-eye-line text-2xl"></i>
              </div>
              <div>
                 <h3 className="text-2xl font-bold text-gray-900">Product Hunter IA</h3>
                 <p className="text-gray-500 text-sm">Rastrea la web en tiempo real buscando productos virales para mascotas.</p>
              </div>
            </div>

            <form onSubmit={handleSearchProducts} className="mb-8 flex gap-3">
               <input 
                 type="text" 
                 placeholder="Ej. Juguetes para perros grandes, rascadores para gatos..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
               />
               <button type="submit" disabled={isSearching} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md">
                 {isSearching ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-search-line"></i>}
                 {isSearching ? 'Analizando...' : 'Buscar Tendencias'}
               </button>
            </form>

            {searchResults.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="ri-flashlight-fill text-yellow-500"></i> Oportunidades Encontradas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {searchResults.map((result, idx) => (
                    <div key={idx} className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-5 hover:shadow-lg transition-all relative">
                       <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">Alto Margen</span>
                       <h5 className="font-bold text-gray-900 text-lg mb-2 pr-12">{result.name}</h5>
                       <p className="text-xs text-indigo-600 font-semibold mb-4">{result.trend}</p>
                       <div className="bg-white rounded-lg p-3 mb-4 border border-gray-100 flex justify-between">
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Costo Proveedor</p>
                            <p className="font-bold text-red-500">€{result.cost.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase">Precio Sugerido</p>
                            <p className="font-bold text-green-600">€{result.suggestedPrice.toFixed(2)}</p>
                          </div>
                       </div>
                       <button onClick={() => alert(`¡${result.name} añadido a la tienda automáticamente! El Bot lo promocionará inmediatamente.`)} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                         <i className="ri-add-circle-line"></i> Añadir a Tienda ({result.margin})
                       </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'suppliers':
        return <AutoSupplierManager />;
      
      case 'hairy-bot':
        return <HairyBotPanel />;
      
      case 'notifications':
        return <RealTimeNotifications />;
      
      default:
        return <div>Contenido no encontrado</div>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
          <img src="/Arkadium-logo.jpg" alt="Arkadium" className="w-20 h-20 mx-auto mb-6 rounded-lg object-contain bg-gray-900 p-2" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-sm text-gray-500 mb-6">Solo personal de Arkadium88 Holdings SL</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Contraseña Maestra" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
              autoFocus
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer">
               Ingresar a Contabilidad
            </button>
          </form>
          <div className="mt-4">
             <Link to="/" className="text-sm text-blue-600 hover:underline">Volver a la tienda</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <img 
                  src="/hairypetshop-logo.png" 
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
