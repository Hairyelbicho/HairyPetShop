
import { useState, useEffect } from 'react';

interface PaymentData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  product: string;
  quantity: number;
  totalPrice: number;
  commission: number;
  supplierPrice: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'paid' | 'sent_to_supplier' | 'completed';
  timestamp: Date;
  commissionRate: number;
  isPromotionActive: boolean;
}

interface SupplierOrder {
  id: string;
  orderId: string;
  supplierName: string;
  product: string;
  quantity: number;
  price: number;
  status: 'pending' | 'sent' | 'confirmed' | 'shipped';
  trackingNumber?: string;
}

export default function AutoPaymentProcessor() {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCommissions: 0,
    ordersProcessed: 0,
    automationRate: 100,
    promotionCommissions: 0,
    regularCommissions: 0
  });

  // Configuración de la promoción de inauguración
  const INAUGURATION_START_DATE = new Date('2024-01-01');
  const INAUGURATION_DURATION_DAYS = 35;
  const PROMOTION_END_DATE = new Date(INAUGURATION_START_DATE.getTime() + (INAUGURATION_DURATION_DAYS * 24 * 60 * 60 * 1000));
  const isPromotionActive = new Date() < PROMOTION_END_DATE;
  const currentCommissionRate = isPromotionActive ? 0.20 : 0.10;
  const daysRemaining = Math.max(0, Math.ceil((PROMOTION_END_DATE.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  // Simular procesamiento automático de pagos
  useEffect(() => {
    const mockPayments: PaymentData[] = [
      {
        orderId: 'PAY-001',
        customerName: 'María González',
        customerPhone: '+34123456789',
        product: 'Pienso Premium para Perros Adultos',
        quantity: 1,
        totalPrice: 50.59,
        commission: 50.59 * currentCommissionRate,
        supplierPrice: 50.59 * (1 - currentCommissionRate),
        paymentMethod: 'PayPal',
        status: 'completed',
        timestamp: new Date(Date.now() - 5 * 60000),
        commissionRate: currentCommissionRate,
        isPromotionActive: isPromotionActive
      },
      {
        orderId: 'PAY-002',
        customerName: 'Carlos Rodríguez',
        customerPhone: '+34987654321',
        product: 'Arena Aglomerante para Gatos 10L',
        quantity: 2,
        totalPrice: 28.58,
        commission: 28.58 * currentCommissionRate,
        supplierPrice: 28.58 * (1 - currentCommissionRate),
        paymentMethod: 'Crypto',
        status: 'sent_to_supplier',
        timestamp: new Date(Date.now() - 10 * 60000),
        commissionRate: currentCommissionRate,
        isPromotionActive: isPromotionActive
      }
    ];

    setPayments(mockPayments);
    
    const mockSupplierOrders: SupplierOrder[] = [
      {
        id: 'SUP-001',
        orderId: 'PAY-001',
        supplierName: 'PetSupplier Pro',
        product: 'Pienso Premium para Perros Adultos',
        quantity: 1,
        price: 50.59 * (1 - currentCommissionRate),
        status: 'shipped',
        trackingNumber: 'TRK-123456789'
      }
    ];

    setSupplierOrders(mockSupplierOrders);

    // Calcular estadísticas
    const totalRevenue = mockPayments.reduce((sum, p) => sum + p.totalPrice, 0);
    const totalCommissions = mockPayments.reduce((sum, p) => sum + p.commission, 0);
    const promotionCommissions = mockPayments.filter(p => p.isPromotionActive).reduce((sum, p) => sum + p.commission, 0);
    const regularCommissions = mockPayments.filter(p => !p.isPromotionActive).reduce((sum, p) => sum + p.commission, 0);
    
    setStats({
      totalRevenue,
      totalCommissions,
      ordersProcessed: mockPayments.length,
      automationRate: 100,
      promotionCommissions,
      regularCommissions
    });

    // Simular nuevos pagos cada 45 segundos
    const interval = setInterval(() => {
      simulateNewPayment();
    }, 45000);

    return () => clearInterval(interval);
  }, [currentCommissionRate, isPromotionActive]);

  const simulateNewPayment = () => {
    const products = [
      { name: 'Pienso Premium para Perros', price: isPromotionActive ? 45.53 : 50.59 },
      { name: 'Arena para Gatos', price: isPromotionActive ? 12.86 : 14.29 },
      { name: 'Acuario Completo 60L', price: isPromotionActive ? 89.09 : 98.99 },
      { name: 'Jaula para Pájaros', price: isPromotionActive ? 67.31 : 74.79 }
    ];

    const customers = [
      { name: 'Ana Martín', phone: '+34555666777' },
      { name: 'José López', phone: '+34444555666' },
      { name: 'Laura Sánchez', phone: '+34333444555' }
    ];

    const product = products[Math.floor(Math.random() * products.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const commission = product.price * currentCommissionRate;
    const supplierPrice = product.price * (1 - currentCommissionRate);

    const newPayment: PaymentData = {
      orderId: `PAY-${Date.now()}`,
      customerName: customer.name,
      customerPhone: customer.phone,
      product: product.name,
      quantity: 1,
      totalPrice: product.price,
      commission,
      supplierPrice,
      paymentMethod: Math.random() > 0.5 ? 'PayPal' : 'Crypto',
      status: 'pending',
      timestamp: new Date(),
      commissionRate: currentCommissionRate,
      isPromotionActive: isPromotionActive
    };

    setPayments(prev => [newPayment, ...prev.slice(0, 9)]);
    
    // Procesar automáticamente
    setTimeout(() => processPayment(newPayment.orderId), 2000);
  };

  const processPayment = async (orderId: string) => {
    // Paso 1: Procesar pago
    setPayments(prev => 
      prev.map(p => 
        p.orderId === orderId ? { ...p, status: 'processing' } : p
      )
    );

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Paso 2: Pago confirmado
    setPayments(prev => 
      prev.map(p => 
        p.orderId === orderId ? { ...p, status: 'paid' } : p
      )
    );

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Paso 3: Enviar a proveedor
    const payment = payments.find(p => p.orderId === orderId);
    if (payment) {
      await sendToSupplier(payment);
    }

    // Paso 4: Completar orden
    setPayments(prev => 
      prev.map(p => 
        p.orderId === orderId ? { ...p, status: 'completed' } : p
      )
    );

    // Actualizar estadísticas
    setStats(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + (payment?.totalPrice || 0),
      totalCommissions: prev.totalCommissions + (payment?.commission || 0),
      ordersProcessed: prev.ordersProcessed + 1,
      promotionCommissions: payment?.isPromotionActive ? prev.promotionCommissions + (payment?.commission || 0) : prev.promotionCommissions,
      regularCommissions: !payment?.isPromotionActive ? prev.regularCommissions + (payment?.commission || 0) : prev.regularCommissions
    }));

    // Notificar al administrador (privado)
    showNotification(`💰 Pago procesado: €${payment?.totalPrice} - Comisión: €${payment?.commission.toFixed(2)} (${((payment?.commissionRate || 0) * 100).toFixed(0)}%)`);
  };

  const sendToSupplier = async (payment: PaymentData) => {
    const suppliers = ['PetSupplier Pro', 'MascotasDirect', 'AnimalSupply Plus'];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];

    const supplierOrder: SupplierOrder = {
      id: `SUP-${Date.now()}`,
      orderId: payment.orderId,
      supplierName: supplier,
      product: payment.product,
      quantity: payment.quantity,
      price: payment.supplierPrice,
      status: 'sent'
    };

    setSupplierOrders(prev => [supplierOrder, ...prev.slice(0, 9)]);

    // Simular confirmación del proveedor
    setTimeout(() => {
      setSupplierOrders(prev => 
        prev.map(s => 
          s.id === supplierOrder.id 
            ? { ...s, status: 'confirmed', trackingNumber: `TRK-${Date.now()}` }
            : s
        )
      );
    }, 5000);

    setPayments(prev => 
      prev.map(p => 
        p.orderId === payment.orderId ? { ...p, status: 'sent_to_supplier' } : p
      )
    );

    console.log('Orden enviada al proveedor:', {
      supplier,
      product: payment.product,
      price: payment.supplierPrice,
      commission: payment.commission,
      commissionRate: payment.commissionRate
    });
  };

  const showNotification = (text: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('💰 Sistema de Pagos', {
        body: text,
        icon: '/hairypetshop-logo.png'
      });
    }
  };

  const getStatusColor = (status: PaymentData['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent_to_supplier': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: PaymentData['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'paid': return 'Pagado';
      case 'sent_to_supplier': return 'Enviado a Proveedor';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Promoción Activa */}
      {isPromotionActive && (
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-gift-line text-2xl animate-bounce"></i>
                <span className="text-2xl font-bold">PROMOCIÓN INAUGURACIÓN ACTIVA</span>
              </div>
              <div className="text-lg">
                Comisión aumentada al <span className="font-bold text-yellow-300">20%</span> durante {daysRemaining} días más
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{daysRemaining}</div>
              <div className="text-sm text-pink-200">días restantes</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Ingresos Totales</p>
              <p className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-money-euro-circle-line text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <i className="ri-arrow-up-line text-sm mr-1"></i>
            <span className="text-sm text-green-100">+24% hoy</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Mis Comisiones Totales</p>
              <p className="text-2xl font-bold">€{stats.totalCommissions.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-wallet-line text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <i className="ri-fire-line text-sm mr-1"></i>
            <span className="text-sm text-blue-100">
              {isPromotionActive ? '20%' : '10%'} por venta
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Órdenes Procesadas</p>
              <p className="text-2xl font-bold">{stats.ordersProcessed}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-shopping-bag-line text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <i className="ri-check-line text-sm mr-1"></i>
            <span className="text-sm text-purple-100">Todo automático</span>
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
            <i className="ri-lightning-line text-sm mr-1"></i>
            <span className="text-sm text-orange-100">Sin intervención</span>
          </div>
        </div>
      </div>

      {/* Desglose de Comisiones (Solo para Admin) */}
      {isPromotionActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <i className="ri-gift-line text-pink-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Comisiones Promoción</h3>
                <p className="text-sm text-gray-600">20% durante inauguración</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-pink-600">€{stats.promotionCommissions.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">Quedan {daysRemaining} días</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-percent-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Comisiones Regulares</h3>
                <p className="text-sm text-gray-600">10% tarifa normal</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600">€{stats.regularCommissions.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">Después de promoción</div>
          </div>
        </div>
      )}

      {/* Recent Payments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pagos Automáticos Recientes</h3>
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
                  Total
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mi Comisión (Privada)
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Al Proveedor (Privado)
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.orderId} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                      <div className="text-sm text-gray-500">{payment.customerPhone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{payment.product}</div>
                    <div className="text-sm text-gray-500">Cant: {payment.quantity}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">€{payment.totalPrice.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{payment.paymentMethod}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-bold text-green-600">€{payment.commission.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {(payment.commissionRate * 100).toFixed(0)}%
                      {payment.isPromotionActive && (
                        <span className="ml-1 text-pink-600 font-semibold">PROMO</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-blue-600">€{payment.supplierPrice.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {(100 - payment.commissionRate * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">
                      {payment.timestamp.toLocaleTimeString('es-ES', { 
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

      {/* Supplier Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Órdenes Enviadas a Proveedores</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio (Privado)
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {supplierOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">{order.supplierName}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{order.product}</div>
                    <div className="text-sm text-gray-500">Cant: {order.quantity}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">€{order.price.toFixed(2)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'sent' ? 'Enviado' :
                       order.status === 'confirmed' ? 'Confirmado' :
                       order.status === 'shipped' ? 'Enviado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {order.trackingNumber ? (
                      <div className="text-sm text-blue-600 font-mono">{order.trackingNumber}</div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
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
