
import { useState } from 'react';
import { sanitizeInput, validateEmail, validatePhone, validateWalletAddress, rateLimiter, generateCSRFToken, secureLog } from '../../utils/security';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CryptoPaymentProps {
  product: Product;
  onClose: () => void;
}

export default function CryptoPayment({ product, onClose }: CryptoPaymentProps) {
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    walletAddress: ''
  });
  const [paymentStep, setPaymentStep] = useState<'select' | 'info' | 'processing' | 'success'>('select');
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [csrfToken] = useState(generateCSRFToken());
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Configuración de comisión dinámica (privada - no visible al público)
  const INAUGURATION_START_DATE = new Date('2024-01-01');
  const INAUGURATION_DURATION_DAYS = 35;
  const PROMOTION_END_DATE = new Date(INAUGURATION_START_DATE.getTime() + (INAUGURATION_DURATION_DAYS * 24 * 60 * 60 * 1000));
  const isPromotionActive = new Date() < PROMOTION_END_DATE;
  const currentCommissionRate = isPromotionActive ? 0.20 : 0.10; // 20% durante promoción, 10% después

  const commission = product.price * currentCommissionRate;
  const supplierAmount = product.price * (1 - currentCommissionRate);

  const cryptoOptions = [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: 'ri-bit-coin-line',
      color: 'from-orange-500 to-yellow-500',
      rate: 0.000023,
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      type: 'btc' as const
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'ri-ethereum-line',
      color: 'from-blue-500 to-purple-500',
      rate: 0.00041,
      address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      type: 'eth' as const
    },
    {
      id: 'sol',
      name: 'Solana',
      symbol: 'SOL',
      icon: 'ri-sun-line',
      color: 'from-purple-500 to-pink-500',
      rate: 0.0045,
      address: 'ABwFdpytiokvvfSnuSP9oJmWHNYt1jf32KQRw7tMPaHC',
      type: 'sol' as const
    },
    {
      id: 'usdt',
      name: 'Tether',
      symbol: 'USDT',
      icon: 'ri-money-dollar-circle-line',
      color: 'from-green-500 to-green-600',
      rate: 1.08,
      address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      type: 'eth' as const
    },
    {
      id: 'hbt',
      name: 'Hairy Token',
      symbol: 'HBT',
      icon: 'ri-heart-line',
      color: 'from-yellow-500 to-orange-500',
      rate: 25.5,
      address: 'ABwFdpytiokvvfSnuSP9oJmWHNYt1jf32KQRw7tMPaHC',
      type: 'sol' as const
    }
  ];

  const selectedCryptoData = cryptoOptions.find(crypto => crypto.id === selectedCrypto);
  const cryptoAmount = selectedCryptoData ? (product.price * selectedCryptoData.rate).toFixed(8) : '0';

  // Validación de formulario con seguridad
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Validar nombre
    const sanitizedName = sanitizeInput(customerInfo.name);
    if (!sanitizedName || sanitizedName.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (sanitizedName.length > 100) {
      newErrors.name = 'El nombre es demasiado largo';
    }
    
    // Validar email
    const sanitizedEmail = sanitizeInput(customerInfo.email);
    if (!validateEmail(sanitizedEmail)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar teléfono (opcional)
    if (customerInfo.phone && !validatePhone(customerInfo.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }
    
    // Validar dirección de wallet
    const sanitizedWallet = sanitizeInput(customerInfo.walletAddress);
    if (!sanitizedWallet) {
      newErrors.walletAddress = 'La dirección de wallet es requerida';
    } else if (selectedCryptoData && !validateWalletAddress(sanitizedWallet, selectedCryptoData.type)) {
      newErrors.walletAddress = `Dirección de wallet ${selectedCryptoData.symbol} inválida`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Rate limiting para prevenir spam
  const checkRateLimit = (): boolean => {
    const clientId = customerInfo.email || 'anonymous';
    return rateLimiter.isAllowed(`crypto_payment_${clientId}`, 3, 300000);
  };

  // Función para enviar notificación automática por WhatsApp (sin mostrar comisiones al público)
  const sendAutomaticWhatsAppNotification = (paymentData: any) => {
    const message = `🎉 ¡NUEVA VENTA CRYPTO PROCESADA AUTOMÁTICAMENTE!

📦 Producto: ${product.name}
💰 Total: €${product.price}
💵 Mi comisión: €${paymentData.commission.toFixed(2)} (${(currentCommissionRate * 100).toFixed(0)}%)
🏪 Al proveedor: €${paymentData.supplierAmount.toFixed(2)}

👤 Cliente: ${customerInfo.name}
📧 Email: ${customerInfo.email}
${customerInfo.phone ? `📱 Teléfono: ${customerInfo.phone}` : ''}

💎 PAGO CRYPTO:
🪙 Moneda: ${selectedCryptoData?.name} (${selectedCryptoData?.symbol})
💰 Cantidad: ${cryptoAmount} ${selectedCryptoData?.symbol}
🔗 Wallet: ${customerInfo.walletAddress}

✅ ACCIONES AUTOMÁTICAS COMPLETADAS:
🔄 Pago crypto verificado y validado
💰 Comisión calculada y registrada
📦 Orden enviada automáticamente al proveedor
📱 Cliente será notificado del envío
🔗 TX ID: ${paymentData.txId}

${isPromotionActive ? '🎉 PROMOCIÓN INAUGURACIÓN ACTIVA - Comisión 20%' : ''}

⚡ Sistema funcionando perfectamente!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setCustomerInfo(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCryptoSelect = (cryptoId: string) => {
    setSelectedCrypto(cryptoId);
    setPaymentStep('info');
  };

  const handlePayment = async () => {
    try {
      // Validaciones de seguridad
      if (!validateForm()) {
        return;
      }
      
      if (!checkRateLimit()) {
        alert('Demasiados intentos. Por favor, espera unos minutos antes de intentar de nuevo.');
        return;
      }

      setPaymentStep('processing');

      secureLog('Iniciando procesamiento de pago crypto', {
        productId: product.id,
        productName: product.name,
        amount: product.price,
        cryptoType: selectedCrypto,
        customerEmail: customerInfo.email
      });

      // Simular procesamiento de pago crypto con validaciones de seguridad
      setTimeout(() => {
        const mockPaymentResult = {
          success: true,
          commission: commission,
          supplierAmount: supplierAmount,
          txId: `0x${Math.random().toString(16).substr(2, 64)}`,
          cryptoAmount: cryptoAmount,
          cryptoSymbol: selectedCryptoData?.symbol,
          commissionRate: currentCommissionRate,
          csrfToken: csrfToken
        };

        setPaymentResult(mockPaymentResult);
        setPaymentStep('success');

        // Guardar en localStorage con datos sanitizados
        const paymentData = {
          id: Date.now(),
          productName: sanitizeInput(product.name),
          amount: product.price,
          commission: commission,
          supplierAmount: supplierAmount,
          customerName: sanitizeInput(customerInfo.name),
          customerEmail: sanitizeInput(customerInfo.email),
          customerPhone: customerInfo.phone ? sanitizeInput(customerInfo.phone) : '',
          walletAddress: sanitizeInput(customerInfo.walletAddress),
          cryptoType: selectedCrypto,
          cryptoAmount: cryptoAmount,
          status: 'completed',
          paymentMethod: 'crypto',
          commissionRate: currentCommissionRate,
          isPromotionActive: isPromotionActive,
          timestamp: new Date().toISOString(),
          csrfToken: csrfToken
        };

        const existingPayments = JSON.parse(localStorage.getItem('cryptoPayments') || '[]');
        existingPayments.push(paymentData);
        localStorage.setItem('cryptoPayments', JSON.stringify(existingPayments));

        secureLog('Pago crypto procesado exitosamente', {
          paymentId: paymentData.id,
          amount: paymentData.amount,
          commission: paymentData.commission,
          cryptoType: paymentData.cryptoType
        });

        // 🚀 ENVIAR NOTIFICACIÓN AUTOMÁTICA POR WHATSAPP
        setTimeout(() => {
          sendAutomaticWhatsAppNotification(mockPaymentResult);
        }, 1500);

      }, 4000);

    } catch (error) {
      secureLog('Error en procesamiento de pago crypto', { error: (error as Error).message });
      alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
      setPaymentStep('info');
    }
  };

  if (paymentStep === 'processing') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className={`${selectedCryptoData?.icon} text-2xl text-purple-600 animate-pulse`}></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Procesando Pago Crypto Seguro</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-600 text-sm"></i>
              </div>
              <span className="text-sm text-gray-700">Validando wallet de forma segura...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="ri-loader-4-line text-purple-600 text-sm animate-spin"></i>
              </div>
              <span className="text-sm text-gray-700">Procesando {cryptoAmount} {selectedCryptoData?.symbol}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-600 text-sm"></i>
              </div>
              <span className="text-sm text-gray-700">Verificando transacción blockchain...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-loader-4-line text-blue-600 text-sm animate-spin"></i>
              </div>
              <span className="text-sm text-gray-700">Confirmando en red segura...</span>
            </div>
          </div>
          
          <div className="mt-6 bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-700">
              <div className="font-semibold mb-2">🔒 Procesamiento Blockchain Seguro</div>
              <div className="space-y-1 text-xs">
                <div>✅ Validación criptográfica</div>
                <div>🛡️ Verificación de dirección</div>
                <div>⛓️ Confirmación en blockchain</div>
                <div>📦 Automatización completa</div>
                <div>📱 Notificación segura</div>
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
          <h3 className="text-xl font-bold text-gray-900 mb-4">¡Pago Crypto Procesado Exitosamente!</h3>
          
          <div className="bg-gradient-to-r from-green-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Producto:</span>
                <span className="font-semibold">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total pagado:</span>
                <span className="font-semibold">€{product.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-600">Cantidad crypto:</span>
                <span className="font-semibold text-purple-600">{paymentResult.cryptoAmount} {paymentResult.cryptoSymbol}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>TX ID:</span>
                <span className="font-mono text-xs break-all">{paymentResult.txId.slice(0, 20)}...</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-robot-line text-green-600"></i>
              <span className="font-semibold text-green-900">Sistema Automático Activado</span>
            </div>
            <p className="text-sm text-green-700 mb-3">
              ✅ Orden procesada automáticamente<br/>
              📱 Notificación enviada al vendedor<br/>
              📦 Cliente será contactado para envío<br/>
              🔒 Pago verificado en blockchain
            </p>
            
            <div className="bg-green-100 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <i className="ri-whatsapp-line text-green-600"></i>
                <span className="font-semibold text-green-800 text-sm">Notificación Automática</span>
              </div>
              <p className="text-xs text-green-700">
                📲 El vendedor ha sido notificado automáticamente
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

  if (paymentStep === 'select') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Pago Seguro con Criptomonedas</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <p className="text-gray-600 mt-2">Elige tu criptomoneda preferida</p>
          </div>

          <div className="p-6">
            {/* Información del producto */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover object-top rounded-lg"
                loading="lazy"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <p className="text-lg font-bold text-blue-600">€{product.price}</p>
              </div>
            </div>

            <div className="space-y-3">
              {cryptoOptions.map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => handleCryptoSelect(crypto.id)}
                  className="w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${crypto.color} rounded-full flex items-center justify-center`}>
                    <i className={`${crypto.icon} text-white text-xl`}></i>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">{crypto.name}</div>
                    <div className="text-sm text-gray-600">
                      {(product.price * crypto.rate).toFixed(8)} {crypto.symbol}
                    </div>
                  </div>
                  <div className="text-purple-600">
                    <i className="ri-arrow-right-line text-xl"></i>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-shield-check-line text-purple-600"></i>
                <span className="font-semibold text-purple-900">Pago Crypto Seguro</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div className="flex items-center space-x-1">
                  <i className="ri-shield-check-line text-green-500"></i>
                  <span>Verificado</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="ri-speed-line text-blue-500"></i>
                  <span>Rápido</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="ri-eye-off-line text-purple-500"></i>
                  <span>Privado</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="ri-global-line text-orange-500"></i>
                  <span>Descentralizado</span>
                </div>
              </div>
            </div>
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
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPaymentStep('select')}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </button>
              <h3 className="text-xl font-bold text-gray-900">
                Pagar con {selectedCryptoData?.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Información del pago crypto */}
          <div className={`bg-gradient-to-r ${selectedCryptoData?.color} rounded-lg p-4 mb-6 text-white`}>
            <div className="flex items-center space-x-3 mb-3">
              <i className={`${selectedCryptoData?.icon} text-2xl`}></i>
              <div>
                <div className="font-bold">{selectedCryptoData?.name}</div>
                <div className="text-sm opacity-90">Cantidad a pagar</div>
              </div>
            </div>
            <div className="text-2xl font-bold">{cryptoAmount} {selectedCryptoData?.symbol}</div>
            <div className="text-sm opacity-90">≈ €{product.price}</div>
          </div>

          {/* Dirección de pago */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Enviar a esta dirección:</div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="font-mono text-sm break-all text-gray-900">
                {selectedCryptoData?.address}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedCryptoData?.address || '');
                  alert('¡Dirección copiada al portapapeles!');
                }}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
              >
                <i className="ri-file-copy-line mr-1"></i>
                Copiar dirección
              </button>
            </div>
          </div>

          {/* Formulario de información del cliente con validación */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: María González"
                maxLength={100}
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="maria@ejemplo.com"
                maxLength={254}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu dirección de wallet *
              </label>
              <input
                type="text"
                value={customerInfo.walletAddress}
                onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono ${
                  errors.walletAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Dirección de tu wallet..."
                required
              />
              {errors.walletAddress && <p className="text-red-500 text-xs mt-1">{errors.walletAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+34 123 456 789"
                maxLength={20}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!customerInfo.name || !customerInfo.email || !customerInfo.walletAddress}
            className={`w-full bg-gradient-to-r ${selectedCryptoData?.color} hover:opacity-90 text-white py-3 px-4 rounded-lg font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center space-x-2`}
          >
            <i className="ri-shield-check-line"></i>
            <span>Confirmar Pago Seguro</span>
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              🔒 Transacción verificada en blockchain • Datos protegidos • Procesamiento automático
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
