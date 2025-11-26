
import { useState, useEffect } from 'react';

interface Order {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  customerPhone: string;
  timestamp: Date;
  supplierOrderId?: string;
  trackingNumber?: string;
}

export default function AutoOrderSystem() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
    automationRate: 98.5
  });

  // Simulación de órdenes automáticas
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customerName: 'María González',
        product: 'Pienso Premium para Perros Adultos',
        quantity: 1,
        price: 50.59,
        status: 'processing',
        paymentMethod: 'PayPal',
        customerPhone: '+34123456789',
        timestamp: new Date(Date.now() - 2 * 60000),
        supplierOrderId: 'SUP-001'
      },
      {
        id: 'ORD-002',
        customerName: 'Carlos Rodríguez',
        product: 'Arena Aglomerante para Gatos 10L',
        quantity: 2,
        price: 28.58,
        status: 'shipped',
        paymentMethod: 'Crypto (SOL)',
        customerPhone: '+34987654321',
        timestamp: new Date(Date.now() - 15 * 60000),
        supplierOrderId: 'SUP-002',
        trackingNumber: 'TRK-123456789'
      },
      {
        id: 'ORD-003',
        customerName: 'Ana Martín',
        product: 'Acuario Completo 60L con Filtro',
        quantity: 1,
        price: 98.99,
        status: 'delivered',
        paymentMethod: 'PayPal',
        customerPhone: '+34555666777',
        timestamp: new Date(Date.now() - 45 * 60000),
        supplierOrderId: 'SUP-003',
        trackingNumber: 'TRK-987654321'
      }
    ];

    setOrders(mockOrders);
    setStats({
      totalOrders: 1247,
      revenue: 63891.45,
      pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
      automationRate: 98.5
    });

    // Simulación de nuevas órdenes cada 30 segundos
    const interval = setInterval(() => {
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        customerName: `Cliente ${Math.floor(Math.random() * 1000)}`,
        product: 'Producto Automático',
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.floor(Math.random() * 100) + 10,
        status: 'processing',
        paymentMethod: Math.random() > 0.5 ? 'PayPal' : 'Crypto',
        customerPhone: '+34' + Math.floor(Math.random() * 900000000 + 100000000),
        timestamp: new Date(),
        supplierOrderId: `SUP-${Date.now()}`
      };

      setOrders(prev => [newOrder, ...prev.slice(0, 9)]);
      setStats(prev => ({
        ...prev,
        totalOrders: prev.totalOrders + 1,
        revenue: prev.revenue + newOrder.price
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Órdenes</p>
              <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-shopping-bag-line text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <i className="ri-arrow-up-line text-sm mr-1"></i>
            <span className="text-sm text-green-100">+12% desde ayer</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Ingresos Totales</p>
              <p className="text-2xl font-bold">€{stats.revenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-money-euro-circle-line text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <i className="ri-arrow-up-line text-sm mr-1"></i>
            <span className="text-sm text-blue-100">+18% desde ayer</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Órdenes Pendientes</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-time-line text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <i className="ri-check-line text-sm mr-1"></i>
            <span className="text-sm text-purple-100">Todo bajo control</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Automatización</p>
              <p className="text-2xl font-bold">{stats.automationRate}%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-robot-line text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <i className="ri-fire-line text-sm mr-1"></i>
            <span className="text-sm text-orange-100">¡Totalmente automático!</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Órdenes Automáticas Recientes</h3>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Sistema Activo</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{order.product}</div>
                    <div className="text-sm text-gray-500">Cant: {order.quantity}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">€{order.price}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{order.paymentMethod}</div>
                    {order.trackingNumber && (
                      <div className="text-xs text-gray-500">#{order.trackingNumber}</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">
                      {order.timestamp.toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
