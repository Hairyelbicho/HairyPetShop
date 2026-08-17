
import { useState, useEffect } from 'react';

interface Sale {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  paymentMethod: string;
  timestamp: Date;
  customerPhone: string;
}

interface NotificationSettings {
  email: boolean;
  whatsapp: boolean;
  browser: boolean;
  sound: boolean;
}

export default function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Sale[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    whatsapp: true,
    browser: true,
    sound: true
  });
  const [isConnected, setIsConnected] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);

  // Simulación de notificaciones en tiempo real
  useEffect(() => {
    // Solicitar permisos de notificación del navegador
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      // Simular nueva venta cada 45-90 segundos
      const randomDelay = Math.random() * 45000 + 45000;
      
      setTimeout(() => {
        const newSale: Sale = {
          id: `SALE-${Date.now()}`,
          customerName: generateRandomCustomerName(),
          product: generateRandomProduct(),
          amount: Math.floor(Math.random() * 150) + 20,
          paymentMethod: Math.random() > 0.5 ? 'PayPal' : 'Crypto',
          timestamp: new Date(),
          customerPhone: '+34' + Math.floor(Math.random() * 900000000 + 100000000)
        };

        setNotifications(prev => [newSale, ...prev.slice(0, 9)]);
        setTotalSales(prev => prev + 1);
        setTodayRevenue(prev => prev + newSale.amount);

        // Enviar notificaciones según configuración
        sendNotifications(newSale);
      }, randomDelay);
    }, 1000);

    return () => clearInterval(interval);
  }, [settings]);

  const generateRandomCustomerName = () => {
    const names = ['María García', 'Carlos López', 'Ana Martín', 'José Rodríguez', 'Laura Sánchez', 'Miguel Torres', 'Carmen Ruiz', 'David Moreno'];
    return names[Math.floor(Math.random() * names.length)];
  };

  const generateRandomProduct = () => {
    const products = [
      'Pienso Premium para Perros',
      'Arena para Gatos',
      'Acuario Completo',
      'Jaula para Pájaros',
      'Collar Inteligente',
      'Juguete Interactivo',
      'Cama Ortopédica',
      'Transportín de Viaje'
    ];
    return products[Math.floor(Math.random() * products.length)];
  };

  const sendNotifications = (sale: Sale) => {
    // Notificación del navegador
    if (settings.browser && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 ¡Nueva Venta!', {
        body: `${sale.customerName} compró ${sale.product} por €${sale.amount}`,
        icon: '/hairypetshop-logo.png',
        tag: sale.id
      });
    }

    // Sonido de notificación
    if (settings.sound) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.play().catch(() => {});
    }

    // Simular envío de WhatsApp y Email
    if (settings.whatsapp) {
      console.log(`WhatsApp enviado: Nueva venta de €${sale.amount}`);
    }
    
    if (settings.email) {
      console.log(`Email enviado: Nueva venta de €${sale.amount}`);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const testNotification = () => {
    const testSale: Sale = {
      id: 'TEST-001',
      customerName: 'Cliente de Prueba',
      product: 'Producto de Prueba',
      amount: 50,
      paymentMethod: 'PayPal',
      timestamp: new Date(),
      customerPhone: '+34123456789'
    };
    
    sendNotifications(testSale);
    setNotifications(prev => [testSale, ...prev.slice(0, 9)]);
  };

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-notification-line text-2xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Notificaciones en Tiempo Real</h3>
              <p className="text-green-100">Sistema activo - Recibe cada venta al instante</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-300 animate-pulse' : 'bg-red-300'}`}></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{totalSales}</div>
            <div className="text-green-100 text-sm">Ventas Hoy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">€{todayRevenue.toFixed(2)}</div>
            <div className="text-green-100 text-sm">Ingresos Hoy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">98.5%</div>
            <div className="text-green-100 text-sm">Automatización</div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Configuración de Notificaciones</h4>
          <button
            onClick={testNotification}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            Probar Notificación
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <i className="ri-mail-line text-red-600"></i>
              </div>
              <div>
                <div className="font-medium text-gray-900">Email</div>
                <div className="text-sm text-gray-600">Notificaciones por correo</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('email')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                settings.email ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-whatsapp-line text-green-600"></i>
              </div>
              <div>
                <div className="font-medium text-gray-900">WhatsApp</div>
                <div className="text-sm text-gray-600">Mensajes instantáneos</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('whatsapp')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                settings.whatsapp ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.whatsapp ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-notification-line text-blue-600"></i>
              </div>
              <div>
                <div className="font-medium text-gray-900">Navegador</div>
                <div className="text-sm text-gray-600">Notificaciones push</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('browser')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                settings.browser ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.browser ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="ri-volume-up-line text-purple-600"></i>
              </div>
              <div>
                <div className="font-medium text-gray-900">Sonido</div>
                <div className="text-sm text-gray-600">Alerta sonora</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('sound')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                settings.sound ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.sound ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">Notificaciones Recientes</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <i className="ri-time-line"></i>
              <span>Tiempo real</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-notification-off-line text-2xl text-gray-400"></i>
              </div>
              <h5 className="text-lg font-medium text-gray-900 mb-2">Esperando notificaciones...</h5>
              <p className="text-gray-600">Las nuevas ventas aparecerán aquí automáticamente</p>
            </div>
          ) : (
            notifications.map((sale, index) => (
              <div key={sale.id} className={`p-4 hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-green-50 border-l-4 border-green-500' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-money-euro-circle-line text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        🎉 Nueva venta - €{sale.amount}
                      </div>
                      <div className="text-sm text-gray-600">
                        {sale.customerName} compró {sale.product}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center space-x-4 mt-1">
                        <span>📱 {sale.customerPhone}</span>
                        <span>💳 {sale.paymentMethod}</span>
                        <span>🕒 {sale.timestamp.toLocaleTimeString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {index === 0 && (
                    <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-700">Nueva</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* WhatsApp Integration Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <i className="ri-whatsapp-line text-white text-xl"></i>
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-gray-900 mb-2">📱 Notificaciones por WhatsApp</h5>
            <p className="text-gray-600 mb-4">
              Recibe cada venta directamente en tu WhatsApp personal: <strong>+34 744 403 191</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span>Notificación instantánea de cada venta</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span>Detalles completos del pedido</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span>Información del cliente</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span>Estado del pago automático</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
