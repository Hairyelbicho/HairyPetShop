
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GlobalMarket {
  country: string;
  flag: string;
  currency: string;
  sales: number;
  revenue: number;
  conversion: number;
  topProduct: string;
}

interface SocialChannel {
  platform: string;
  icon: string;
  color: string;
  followers: number;
  engagement: number;
  sales: number;
  status: 'active' | 'pending' | 'inactive';
}

export default function GlobalDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [globalMarkets, setGlobalMarkets] = useState<GlobalMarket[]>([
    { country: 'España', flag: '🇪🇸', currency: 'EUR', sales: 47, revenue: 2847.50, conversion: 3.2, topProduct: 'Collar Premium' },
    { country: 'Estados Unidos', flag: '🇺🇸', currency: 'USD', sales: 89, revenue: 5234.80, conversion: 4.1, topProduct: 'Juguete Interactivo' },
    { country: 'Reino Unido', flag: '🇬🇧', currency: 'GBP', sales: 34, revenue: 1876.90, conversion: 2.8, topProduct: 'Pienso Premium' },
    { country: 'Alemania', flag: '🇩🇪', currency: 'EUR', sales: 56, revenue: 3421.60, conversion: 3.5, topProduct: 'Cama Ortopédica' },
    { country: 'Francia', flag: '🇫🇷', currency: 'EUR', sales: 28, revenue: 1654.30, conversion: 2.9, topProduct: 'Kit Cuidado' },
    { country: 'Canadá', flag: '🇨🇦', currency: 'CAD', sales: 23, revenue: 1987.40, conversion: 3.1, topProduct: 'Transportín' },
    { country: 'Australia', flag: '🇦🇺', currency: 'AUD', sales: 19, revenue: 1543.20, conversion: 2.7, topProduct: 'Collar Premium' },
    { country: 'Italia', flag: '🇮🇹', currency: 'EUR', sales: 31, revenue: 1876.50, conversion: 3.0, topProduct: 'Juguete Interactivo' },
    { country: 'Brasil', flag: '🇧🇷', currency: 'BRL', sales: 42, revenue: 8765.30, conversion: 3.8, topProduct: 'Pienso Premium' },
    { country: 'México', flag: '🇲🇽', currency: 'MXN', sales: 38, revenue: 24567.80, conversion: 3.4, topProduct: 'Cama Ortopédica' }
  ]);

  const [socialChannels, setSocialChannels] = useState<SocialChannel[]>([
    { platform: 'WhatsApp', icon: 'ri-whatsapp-line', color: 'green', followers: 2847, engagement: 89.5, sales: 156, status: 'active' },
    { platform: 'Telegram', icon: 'ri-telegram-line', color: 'blue', followers: 1234, engagement: 76.3, sales: 89, status: 'active' },
    { platform: 'TikTok', icon: 'ri-tiktok-line', color: 'pink', followers: 15678, engagement: 92.1, sales: 234, status: 'active' },
    { platform: 'Instagram', icon: 'ri-instagram-line', color: 'purple', followers: 8945, engagement: 67.8, sales: 123, status: 'pending' },
    { platform: 'Facebook', icon: 'ri-facebook-line', color: 'blue', followers: 5432, engagement: 54.2, sales: 67, status: 'pending' },
    { platform: 'Email', icon: 'ri-mail-line', color: 'gray', followers: 3456, engagement: 45.6, sales: 89, status: 'active' }
  ]);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [avgConversion, setAvgConversion] = useState(0);

  useEffect(() => {
    const revenue = globalMarkets.reduce((acc, market) => acc + market.revenue, 0);
    const sales = globalMarkets.reduce((acc, market) => acc + market.sales, 0);
    const conversion = globalMarkets.reduce((acc, market) => acc + market.conversion, 0) / globalMarkets.length;
    
    setTotalRevenue(revenue);
    setTotalSales(sales);
    setAvgConversion(conversion);
  }, [globalMarkets]);

  const tabs = [
    { id: 'overview', name: 'Resumen Global', icon: 'ri-global-line' },
    { id: 'markets', name: 'Mercados', icon: 'ri-earth-line' },
    { id: 'social', name: 'Redes Sociales', icon: 'ri-share-line' },
    { id: 'reports', name: 'Reportes', icon: 'ri-file-chart-line' },
    { id: 'optimization', name: 'Optimización', icon: 'ri-rocket-line' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Global Stats */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="ri-global-line text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">🌍 Dashboard Global HairyPetShop</h3>
                    <p className="text-blue-100">Vendiendo en 10 países • 6 canales sociales • Automatización 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">SISTEMA GLOBAL ACTIVO</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
                  <div className="text-blue-100 text-sm">Ingresos Globales</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{totalSales}</div>
                  <div className="text-blue-100 text-sm">Ventas Totales</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">10</div>
                  <div className="text-blue-100 text-sm">Países Activos</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{avgConversion.toFixed(1)}%</div>
                  <div className="text-blue-100 text-sm">Conversión Media</div>
                </div>
              </div>
            </div>

            {/* Top Markets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <i className="ri-trophy-line text-yellow-500"></i>
                <span>🏆 Top 5 Mercados</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {globalMarkets
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((market, index) => (
                    <div key={market.country} className="text-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-lg border">
                      <div className="text-2xl mb-2">{market.flag}</div>
                      <div className="font-semibold text-gray-900">{market.country}</div>
                      <div className="text-lg font-bold text-green-600 mt-2">
                        {market.currency} {market.revenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">{market.sales} ventas</div>
                      <div className="text-xs text-gray-500 mt-1">#{index + 1} en ranking</div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Social Channels Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <i className="ri-share-line text-blue-500"></i>
                <span>📱 Canales Sociales</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {socialChannels.slice(0, 6).map((channel) => (
                  <div key={channel.platform} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-${channel.color}-100 rounded-full flex items-center justify-center`}>
                          <i className={`${channel.icon} text-${channel.color}-600`}></i>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{channel.platform}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            channel.status === 'active' ? 'bg-green-100 text-green-700' :
                            channel.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {channel.status === 'active' ? 'Activo' : 
                             channel.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seguidores:</span>
                        <span className="font-medium">{channel.followers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engagement:</span>
                        <span className="font-medium">{channel.engagement}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ventas:</span>
                        <span className="font-medium text-green-600">{channel.sales}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'markets':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <i className="ri-earth-line text-blue-500"></i>
                  <span>🌍 Mercados Globales</span>
                </h4>
              </div>
              
              <div className="divide-y divide-gray-200">
                {globalMarkets.map((market) => (
                  <div key={market.country} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{market.flag}</div>
                        <div>
                          <div className="font-semibold text-gray-900">{market.country}</div>
                          <div className="text-sm text-gray-600">Producto top: {market.topProduct}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {market.currency} {market.revenue.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">Ingresos</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">{market.sales}</div>
                          <div className="text-xs text-gray-600">Ventas</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{market.conversion}%</div>
                          <div className="text-xs text-gray-600">Conversión</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          const message = `📊 Quiero optimizar las ventas en ${market.country} ${market.flag}. Actualmente tengo ${market.sales} ventas con ${market.conversion}% de conversión. ¿Cómo puedo mejorar estos números?`;
                          const encodedMessage = encodeURIComponent(message);
                          window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Optimizar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <i className="ri-share-line text-purple-500"></i>
                    <span>📱 Integración Redes Sociales Globales</span>
                  </h4>
                  <button
                    onClick={() => {
                      const message = '🚀 Quiero integrar Instagram y Facebook globalmente para vender en los 10 países. Necesito automatización completa con Luna IA. ¿Me ayudas a configurar todo?';
                      const encodedMessage = encodeURIComponent(message);
                      window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:from-purple-600 hover:to-pink-600 cursor-pointer whitespace-nowrap"
                  >
                    Integrar Todas
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {socialChannels.map((channel) => (
                  <div key={channel.platform} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-${channel.color}-100 rounded-full flex items-center justify-center`}>
                          <i className={`${channel.icon} text-${channel.color}-600 text-xl`}></i>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{channel.platform}</div>
                          <div className="text-sm text-gray-600">
                            {channel.followers.toLocaleString()} seguidores • {channel.engagement}% engagement
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{channel.sales}</div>
                          <div className="text-xs text-gray-600">Ventas</div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          channel.status === 'active' ? 'bg-green-100 text-green-700' :
                          channel.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {channel.status === 'active' ? '✅ Activo' : 
                           channel.status === 'pending' ? '⏳ Pendiente' : '❌ Inactivo'}
                        </div>
                        
                        <button
                          onClick={() => {
                            const message = `📱 Quiero configurar ${channel.platform} para vender globalmente con Luna IA. Necesito automatización completa en los 10 países. ¿Me ayudas?`;
                            const encodedMessage = encodeURIComponent(message);
                            window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                            channel.status === 'active' 
                              ? 'bg-blue-500 hover:bg-blue-600 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {channel.status === 'active' ? 'Optimizar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            {/* Email Reports Configuration */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <i className="ri-mail-line text-white text-xl"></i>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-2">📧 Reportes Automáticos por Email</h5>
                  <p className="text-gray-600 mb-4">
                    Recibe reportes detallados de todos tus mercados globales automáticamente
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Reporte diario a las 9:00 AM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Reporte semanal los lunes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Reporte mensual el día 1</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Alertas de ventas en tiempo real</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Análisis por país y canal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Recomendaciones de optimización</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        const message = '📧 Quiero configurar reportes automáticos por email para todos mis mercados globales. Necesito reportes diarios, semanales y mensuales con análisis detallados. Mi email es: hairyelbicho@gmail.com';
                        const encodedMessage = encodeURIComponent(message);
                        window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                      }}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
                    >
                      Configurar Reportes
                    </button>
                    <button
                      onClick={() => {
                        const message = '📊 Quiero ver un ejemplo de reporte automático para entender qué información recibiré por email. ¿Me puedes mostrar un reporte de muestra?';
                        const encodedMessage = encodeURIComponent(message);
                        window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                      }}
                      className="bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
                    >
                      Ver Ejemplo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-calendar-line text-blue-600"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Reporte Diario</h5>
                    <p className="text-sm text-gray-600">Cada día a las 9:00 AM</p>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Ventas por país</li>
                  <li>• Ingresos totales</li>
                  <li>• Top productos</li>
                  <li>• Conversiones por canal</li>
                  <li>• Alertas importantes</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-calendar-week-line text-green-600"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Reporte Semanal</h5>
                    <p className="text-sm text-gray-600">Cada lunes</p>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Análisis de tendencias</li>
                  <li>• Comparativa semanal</li>
                  <li>• Rendimiento por mercado</li>
                  <li>• Recomendaciones</li>
                  <li>• Objetivos próxima semana</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="ri-calendar-month-line text-purple-600"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Reporte Mensual</h5>
                    <p className="text-sm text-gray-600">Cada día 1</p>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Resumen ejecutivo</li>
                  <li>• ROI por mercado</li>
                  <li>• Análisis competitivo</li>
                  <li>• Estrategias optimización</li>
                  <li>• Proyecciones futuras</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'optimization':
        return (
          <div className="space-y-6">
            {/* Optimization Overview */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <i className="ri-rocket-line text-white text-xl"></i>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-2">🎯 Optimización por País</h5>
                  <p className="text-gray-600 mb-4">
                    Estrategias personalizadas para maximizar conversiones en cada mercado
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Análisis de comportamiento por país</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Precios optimizados por mercado</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Horarios de publicación ideales</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Mensajes culturalmente adaptados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>Canales prioritarios por región</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span>A/B testing automático</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        const message = '🎯 Quiero optimizar las conversiones en todos mis mercados globales. Necesito estrategias específicas para cada país, precios optimizados y mensajes culturalmente adaptados. ¿Me ayudas?';
                        const encodedMessage = encodeURIComponent(message);
                        window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                      }}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
                    >
                      Optimizar Todo
                    </button>
                    <button
                      onClick={() => {
                        const message = '📊 Quiero ver un análisis detallado de oportunidades de mejora en cada uno de mis 10 mercados. ¿Qué países tienen más potencial de crecimiento?';
                        const encodedMessage = encodeURIComponent(message);
                        window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                      }}
                      className="bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap"
                    >
                      Análisis Detallado
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization by Market */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {globalMarkets.slice(0, 6).map((market) => (
                <div key={market.country} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{market.flag}</div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{market.country}</h5>
                        <p className="text-sm text-gray-600">Conversión: {market.conversion}%</p>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      market.conversion >= 3.5 ? 'bg-green-100 text-green-700' :
                      market.conversion >= 3.0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {market.conversion >= 3.5 ? '🚀 Excelente' :
                       market.conversion >= 3.0 ? '⚡ Bueno' : '🎯 Mejorable'}
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ingresos:</span>
                      <span className="font-medium">{market.currency} {market.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ventas:</span>
                      <span className="font-medium">{market.sales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Producto:</span>
                      <span className="font-medium">{market.topProduct}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-2">Recomendaciones:</div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {market.conversion < 3.0 && (
                        <>
                          <li>• Optimizar precios locales</li>
                          <li>• Mejorar mensajes culturales</li>
                          <li>• Aumentar frecuencia de posts</li>
                        </>
                      )}
                      {market.conversion >= 3.0 && market.conversion < 3.5 && (
                        <>
                          <li>• Expandir productos populares</li>
                          <li>• Probar nuevos canales</li>
                          <li>• Optimizar horarios</li>
                        </>
                      )}
                      {market.conversion >= 3.5 && (
                        <>
                          <li>• Mantener estrategia actual</li>
                          <li>• Escalar inversión</li>
                          <li>• Replicar en otros mercados</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => {
                      const message = `🎯 Quiero optimizar específicamente ${market.country} ${market.flag}. Tengo ${market.conversion}% de conversión y ${market.sales} ventas. ¿Qué estrategias específicas me recomiendas para este mercado?`;
                      const encodedMessage = encodeURIComponent(message);
                      window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
                    }}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    Optimizar {market.country}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

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
                    HairyPetShop
                  </h1>
                  <p className="text-xs text-gray-600">Dashboard Global</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">10 Países Activos</span>
              </div>
              
              <Link
                to="/automation-dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex items-center space-x-1"
              >
                <i className="ri-robot-line"></i>
                <span>Automatización</span>
              </Link>
              
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex items-center space-x-1"
              >
                <i className="ri-home-line"></i>
                <span>Tienda</span>
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
