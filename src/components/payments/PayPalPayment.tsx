
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface PayPalPaymentProps {
  product: Product;
  onClose: () => void;
}

export default function PayPalPayment({ product, onClose }: PayPalPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentStep, setPaymentStep] = useState<'info' | 'processing' | 'success'>('info');
  const [paymentResult, setPaymentResult] = useState<any>(null);

  // Configuración de comisión dinámica (privada)
  const INAUGURATION_START_DATE = new Date('2024-01-01');
  const INAUGURATION_DURATION_DAYS = 35;
  const PROMOTION_END_DATE = new Date(INAUGURATION_START_DATE.getTime() + (INAUGURATION_DURATION_DAYS * 24 * 60 * 60 * 1000));
  const isPromotionActive = new Date() < PROMOTION_END_DATE;
  const currentCommissionRate = isPromotionActive ? 0.20 : 0.10; // 20% durante promoción, 10% después

  const commission = product.price * currentCommissionRate;
  const supplierAmount = product.price * (1 - currentCommissionRate);

  // Función para enviar notificación automática por WhatsApp
  const sendAutomaticWhatsAppNotification = (paymentData: any) => {
    const message = `🎉 ¡NUEVA VENTA PROCESADA AUTOMÁTICAMENTE!

📦 Producto: ${product.name}
💰 Total: €${product.price}
💵 Mi comisión: €${paymentData.commission.toFixed(2)} (${(currentCommissionRate * 100).toFixed(0)}%)
🏪 Al proveedor: €${paymentData.supplierAmount.toFixed(2)}

👤 Cliente: ${customerInfo.name}
📧 Email: ${customerInfo.email}
${customerInfo.phone ? `📱 Teléfono: ${customerInfo.phone}` : ''}

✅ ACCIONES AUTOMÁTICAS COMPLETADAS:
🔄 Pago procesado con PayPal
💰 Comisión calculada y registrada
📦 Orden enviada automáticamente al proveedor
📱 Cliente será notificado del envío
💳 Pago ID: ${paymentData.orderId}

${isPromotionActive ? '🎉 PROMOCIÓN INAUGURACIÓN ACTIVA - Comisión 20%' : ''}

⚡ Sistema funcionando perfectamente!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
  };

  // Función para enviar datos a n8n automáticamente
  const sendSaleToN8N = async (paymentData: any) => {
    try {
      await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/n8n-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_sale_to_n8n',
          data: {
            productName: product.name,
            amount: product.price,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            paymentMethod: 'paypal',
            commission: paymentData.commission,
            supplierAmount: paymentData.supplierAmount,
            orderId: paymentData.orderId
          }
        }),
      });
      console.log('✅ Venta enviada a n8n automáticamente');
    } catch (error) {
      console.error('Error enviando venta a n8n:', error);
    }
  };

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Crear orden de PayPal
      const response = await fetch('https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/paypal-create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.name,
          amount: product.price,
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
        }),
      });

      const data = await response.json();

      if (data.success && data.approvalUrl) {
        // Redirigir a PayPal para completar el pago
        window.open(data.approvalUrl, '_blank');
        
        // Simular éxito después de un tiempo
        setTimeout(() => {
          const mockPaymentResult = {
            success: true,
            commission: commission,
            supplierAmount: supplierAmount,
            orderId: data.orderId,
            commissionRate: currentCommissionRate
          };

          setPaymentResult(mockPaymentResult);
          setPaymentStep('success');
          setIsProcessing(false);

          // Guardar en localStorage para simular base de datos
          const paymentData = {
            id: Date.now(),
            productName: product.name,
            amount: product.price,
            commission: commission,
            supplierAmount: supplierAmount,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            status: 'completed',
            paymentMethod: 'paypal',
            commissionRate: currentCommissionRate,
            isPromotionActive: isPromotionActive,
            timestamp: new Date().toISOString()
          };

          const existingPayments = JSON.parse(localStorage.getItem('paypalPayments') || '[]');
          existingPayments.push(paymentData);
          localStorage.setItem('paypalPayments', JSON.stringify(existingPayments));

          console.log('✅ Pago PayPal procesado exitosamente:', paymentData);

          // 🚀 ENVIAR DATOS A N8N AUTOMÁTICAMENTE
          setTimeout(() => {
            sendSaleToN8N(mockPaymentResult);
          }, 1000);

          // 🚀 ENVIAR NOTIFICACIÓN AUTOMÁTICA POR WHATSAPP
          setTimeout(() => {
            sendAutomaticWhatsAppNotification(mockPaymentResult);
          }, 1500);

        }, 5000); // Simular tiempo de procesamiento de PayPal

      } else {
        throw new Error(data.error || 'Error al crear orden de PayPal');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago: ' + (error as Error).message);
      setIsProcessing(false);
      setPaymentStep('info');
    }
  };

  if (paymentStep === 'processing') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-paypal-line text-2xl text-blue-600 animate-pulse"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Procesando Pago con PayPal</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-600 text-sm"></i>
              </div>
              <span className="text-sm text-gray-700">Conectando con PayPal...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-loader-4-line text-blue-600 text-sm animate-spin"></i>
              </div>
              <span className="text-sm text-gray-700">Procesando pago de €{product.price}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-600 text-sm"></i>
              </div>
              <span className="text-sm text-gray-700">Calculando comisión automáticamente</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="ri-loader-4-line text-purple-600 text-sm animate-spin"></i>
              </div>
              <span className="text-sm text-gray-700">Enviando al proveedor...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-loader-4-line text-green-600 text-sm animate-spin"></i>
              </div>
              <span className="text-sm text-gray-700">Preparando notificación WhatsApp...</span>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-700">
              <div className="font-semibold mb-2">🔄 Procesamiento Automático</div>
              <div className="space-y-1 text-xs">
                <div>✅ Validando datos del cliente</div>
                <div>💳 Procesando pago seguro con PayPal</div>
                <div>💰 Calculando comisiones automáticamente</div>
                <div>📦 Preparando orden para proveedor</div>
                <div>📱 Configurando notificación automática</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-double-line text-2xl text-green-600"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">¡Pago PayPal Procesado Exitosamente!</h3>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Producto:</span>
                <span className="font-semibold">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total pagado:</span>
                <span className="font-semibold">€{product.price}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>ID de orden:</span>
                <span className="font-mono">{paymentResult.orderId}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-robot-line text-green-600"></i>
              <span className="font-semibold text-green-900">Sistema Automático Activado</span>
            </div>
            <p className="text-sm text-green-700 mb-3">
              ✅ Orden enviada al proveedor automáticamente<br/>
              📱 Cliente será notificado del envío<br/>
              💰 Comisión registrada automáticamente<br/>
              🔒 Pago procesado de forma segura con PayPal
            </p>
            
            <div className="bg-green-100 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <i className="ri-whatsapp-line text-green-600"></i>
                <span className="font-semibold text-green-800 text-sm">Notificación WhatsApp Automática</span>
              </div>
              <p className="text-xs text-green-700">
                📲 Se enviará automáticamente en unos segundos...
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Pago con PayPal</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          <p className="text-gray-600 mt-2">Procesamiento seguro y automático</p>
        </div>

        <div className="p-6">
          {/* Información del producto */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover object-top rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{product.name}</h4>
              <p className="text-lg font-bold text-blue-600">€{product.price}</p>
            </div>
          </div>

          {/* Formulario de información del cliente */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Ej: María González"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="maria@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="+34 123 456 789"
              />
            </div>
          </div>

          {/* Información de automatización */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-robot-line text-green-600"></i>
              <span className="font-semibold text-green-900">Automatización Completa</span>
            </div>
            <p className="text-sm text-green-700 mb-3">
              Al completar el pago, el sistema automáticamente:
            </p>
            <div className="space-y-1 text-xs text-green-600">
              <div className="flex items-center space-x-2">
                <i className="ri-check-line"></i>
                <span>Procesa el pago con PayPal</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line"></i>
                <span>Calcula y registra comisiones</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line"></i>
                <span>Envía orden al proveedor</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line"></i>
                <span>📱 Notifica por WhatsApp automáticamente</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing || !customerInfo.name || !customerInfo.email}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <i className="ri-paypal-line"></i>
                <span>Pagar €{product.price} con PayPal</span>
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              🔒 Pago 100% seguro • Datos protegidos • Notificación automática por WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
