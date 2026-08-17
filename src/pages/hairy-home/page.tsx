import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ownApi } from '../../utils/ownApi';
import MatrizBar from '../../components/layout/MatrizBar';

export default function HairyHome() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    operationType: 'alquiler',
    city: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const whatsappNumber = "+34744403191";
  const whatsappUrl = `https://wa.me/34744403191`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const leadData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: 'hairy_home',
      interest: `${formData.operationType} - ${formData.city}`,
      message: formData.message,
      created_at: new Date().toISOString()
    };

    try {
      await ownApi('/api/leads', leadData);

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        operationType: 'alquiler',
        city: '',
        message: ''
      });

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error enviando formulario:', error);
      alert('Error al enviar. Por favor, intenta de nuevo o contacta por WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppContact = (message?: string) => {
    const defaultMessage = '¡Hola! Me interesa Hairy Home para encontrar viviendas pet-friendly. ¿Pueden ayudarme?';
    const encodedMessage = encodeURIComponent(message || defaultMessage);
    window.open(`${whatsappUrl}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: '"Nunito", sans-serif' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/hairypetshop-logo.png" 
                alt="Hairy Home Logo" 
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Hairy Home
                </h1>
                <p className="text-xs text-gray-600">Hogares Pet-Friendly</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <a href="#contacto" onClick={() => setFormData({...formData, operationType: 'alquiler'})} className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Buscar
              </a>
              <a href="#como-funciona" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Cómo Funciona
              </a>
              <Link to="/partners" className="text-blue-900 font-semibold hover:text-blue-700 transition-colors cursor-pointer">
                Partners / Proveedores
              </Link>
              <Link to="/sobre-nosotros" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Sobre nosotros
              </Link>
              <a href="#beneficios" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Beneficios
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Contacto
              </a>
              <Link
                to="/hairy-tools"
                className="text-blue-600 font-bold hover:text-blue-900 transition-colors cursor-pointer flex items-center gap-1"
              >
                <i className="ri-palette-line"></i>
                Hairy Tools
              </Link>
              <Link 
                to="/hairy-wallet"
                className="text-gray-700 hover:text-purple-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <i className="ri-wallet-3-line"></i>
                HairyWallet
              </Link>
              <Link 
                to="/"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Ir a la Tienda
              </Link>
            </nav>

            <button
              onClick={() => handleWhatsAppContact()}
              className="md:hidden text-green-500 hover:text-green-600 cursor-pointer"
            >
              <i className="ri-whatsapp-line text-2xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto Hero */}
            <div className="text-center lg:text-left">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                🏠 100% Pet-Friendly
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Hairy Home: casas y hoteles donde tu mascota es{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  bienvenida
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Solo mostramos viviendas y alojamientos 100% pet-friendly. 
                Sin sorpresas, sin rechazos. Tu mascota siempre es bienvenida. 🐾
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#contacto"
                  onClick={() => setFormData({...formData, operationType: 'alquiler'})}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 shadow-lg"
                >
                  <i className="ri-search-line"></i>
                  <span>Buscar alquiler pet-friendly</span>
                </a>
                
                <a
                  href="#contacto"
                  onClick={() => setFormData({...formData, operationType: 'compra'})}
                  className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-full text-lg font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 shadow-lg"
                >
                  <i className="ri-home-smile-line"></i>
                  <span>Comprar o vender</span>
                </a>
              </div>

              <div className="mt-6">
                <a
                  href="#contacto"
                  onClick={() => setFormData({...formData, operationType: 'hotel'})}
                  className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold cursor-pointer"
                >
                  <i className="ri-hotel-line"></i>
                  <span>Hoteles para viajar con tu mascota</span>
                  <i className="ri-arrow-right-line"></i>
                </a>
              </div>
            </div>

            {/* Imagen Hero */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/55fa14d3b883ceb4a5de6da3b3d7ba1d.png"
                  alt="Hairy como agente inmobiliario"
                  className="w-full h-auto"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-900">Disponible Ahora</span>
                  </div>
                  <p className="text-xs text-gray-600">+500 propiedades pet-friendly</p>
                </div>
              </div>

              {/* Decoración */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona Hairy Home?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encontrar tu hogar pet-friendly es súper fácil con Hairy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Paso 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="ri-chat-smile-3-line text-4xl text-blue-600"></i>
              </div>
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Cuéntanos qué necesitas
              </h3>
              <p className="text-gray-600">
                Dinos qué tipo de casa u hotel necesitas, en qué ciudad y con qué mascota viajas o vives
              </p>
            </div>

            {/* Paso 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="ri-filter-3-line text-4xl text-purple-600"></i>
              </div>
              <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Hairy filtra opciones reales
              </h3>
              <p className="text-gray-600">
                Solo te mostramos propiedades 100% verificadas donde tu mascota es bienvenida
              </p>
            </div>

            {/* Paso 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="ri-gift-line text-4xl text-green-600"></i>
              </div>
              <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Reserva y gana HBT
              </h3>
              <p className="text-gray-600">
                Reserva, múdate o vende, y gana puntos HBT para usar en HairyPetShop
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Hairy Home?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Beneficios exclusivos para ti y tu mascota
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beneficio 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="ri-shield-check-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Cero sorpresas
              </h3>
              <p className="text-gray-600 mb-4">
                Solo contratos donde se aceptan mascotas. Sin letra pequeña, sin rechazos de última hora.
              </p>
              <div className="flex items-center space-x-2 text-green-600 font-semibold">
                <i className="ri-checkbox-circle-line"></i>
                <span>100% verificado</span>
              </div>
            </div>

            {/* Beneficio 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="ri-map-pin-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Barrios pet-friendly
              </h3>
              <p className="text-gray-600 mb-4">
                Zonas con parques, veterinarios y servicios cercanos para tu mascota.
              </p>
              <div className="flex items-center space-x-2 text-purple-600 font-semibold">
                <i className="ri-map-2-line"></i>
                <span>Mapa interactivo</span>
              </div>
            </div>

            {/* Beneficio 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="ri-coin-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Recompensas HBT
              </h3>
              <p className="text-gray-600 mb-4">
                Gana tokens HBT conectados con HairyPetShop. Úsalos para comprar productos.
              </p>
              <div className="flex items-center space-x-2 text-orange-600 font-semibold">
                <i className="ri-wallet-line"></i>
                <span>Hairy Wallet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atención al Cliente */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="ri-customer-service-2-line text-4xl text-white"></i>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Atención Hairy Home Especializada
              </h2>
              <p className="text-xl text-blue-100">
                Equipo humano + IA revisando tu caso
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <i className="ri-file-text-line text-2xl text-white mt-1"></i>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Revisión de contratos</h4>
                    <p className="text-blue-100 text-sm">
                      Verificamos que tu contrato incluya cláusulas pet-friendly
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <i className="ri-scales-line text-2xl text-white mt-1"></i>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Dudas legales básicas</h4>
                    <p className="text-blue-100 text-sm">
                      Orientación sobre derechos y obligaciones con mascotas
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <i className="ri-hotel-line text-2xl text-white mt-1"></i>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Ayuda para reservas</h4>
                    <p className="text-blue-100 text-sm">
                      Te ayudamos a reservar hoteles pet-friendly
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <i className="ri-truck-line text-2xl text-white mt-1"></i>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Mudanzas con mascotas</h4>
                    <p className="text-blue-100 text-sm">
                      Consejos y servicios para mudarte con tu peludo
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleWhatsAppContact('¡Hola! Necesito ayuda del equipo de Hairy Home para encontrar una vivienda pet-friendly.')}
                className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-full text-lg font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 shadow-lg"
              >
                <i className="ri-whatsapp-line text-2xl"></i>
                <span>Hablar por WhatsApp</span>
              </button>

              <a
                href="#contacto"
                className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 shadow-lg"
              >
                <i className="ri-mail-line"></i>
                <span>Enviar mensaje a un agente</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Contacto */}
      <section id="contacto" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cuéntanos qué necesitas
            </h2>
            <p className="text-lg text-gray-600">
              Completa el formulario y te responderemos en menos de 24 horas
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            {submitSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center space-x-3">
                <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
                <div>
                  <p className="font-semibold text-green-900">¡Mensaje enviado con éxito!</p>
                  <p className="text-sm text-green-700">Un agente se pondrá en contacto contigo pronto.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+34 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de operación *
                  </label>
                  <select
                    name="operationType"
                    value={formData.operationType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="alquiler">Alquiler</option>
                    <option value="compra">Compra</option>
                    <option value="venta">Venta</option>
                    <option value="hotel">Hotel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Madrid, Barcelona, Valencia..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cuéntanos más sobre lo que necesitas *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Busco un piso de 2 habitaciones en Madrid para vivir con mi perro labrador..."
                />
                <p className="text-xs text-gray-500 mt-1">{formData.message.length}/500 caracteres</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-sm text-blue-900">
                  <i className="ri-information-line mr-2"></i>
                  Al enviar, tu solicitud se guarda en nuestro sistema para crear una respuesta automática y asignar un agente humano.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl text-lg font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center space-x-2 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line"></i>
                    <span>Enviar solicitud</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Integración con Ecosistema Hairy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  🎁 Ecosistema Hairy
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Conecta con tu Hairy Wallet
                </h2>
                
                <p className="text-lg text-gray-600 mb-6">
                  Usa tu Hairy Wallet y tu cuenta de HairyPetShop para acumular tokens HBT con cada operación inmobiliaria.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-coin-line text-orange-600"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Gana HBT por cada operación</h4>
                      <p className="text-gray-600 text-sm">Alquiler, compra, venta o reserva de hotel</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-shopping-bag-line text-orange-600"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Usa tus tokens en la tienda</h4>
                      <p className="text-gray-600 text-sm">Compra productos para tu mascota con HBT</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-wallet-line text-orange-600"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Una sola cuenta para todo</h4>
                      <p className="text-gray-600 text-sm">Gestiona todo desde tu Hairy Wallet</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/hairy-wallet"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors cursor-pointer whitespace-nowrap shadow-lg"
                >
                  <i className="ri-wallet-3-line"></i>
                  <span>Abrir mi Hairy Wallet</span>
                  <i className="ri-arrow-right-line"></i>
                </Link>
              </div>

              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src="/hairy-wallet-logo.png" 
                      alt="Hairy Wallet" 
                      className="w-16 h-16"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Hairy Wallet</h3>
                      <p className="text-gray-600">Tu billetera digital</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white mb-6">
                    <p className="text-sm opacity-90 mb-2">Balance HBT</p>
                    <p className="text-4xl font-bold">847.50 HBT</p>
                    <p className="text-sm opacity-90 mt-2">≈ €84.75 EUR</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <i className="ri-home-line text-green-600"></i>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Alquiler Madrid</p>
                          <p className="text-xs text-gray-600">Hace 2 días</p>
                        </div>
                      </div>
                      <p className="font-bold text-green-600">+50 HBT</p>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="ri-shopping-cart-line text-blue-600"></i>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Compra en tienda</p>
                          <p className="text-xs text-gray-600">Hace 5 días</p>
                        </div>
                      </div>
                      <p className="font-bold text-red-600">-25 HBT</p>
                    </div>
                  </div>
                </div>

                {/* Decoración */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/hairypetshop-logo.png" 
                  alt="Hairy Home Logo" 
                  className="w-10 h-10"
                />
                <div>
                  <h3 className="text-xl font-bold">Hairy Home</h3>
                  <p className="text-xs text-gray-400">Hogares Pet-Friendly</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Tu hogar perfecto donde tu mascota siempre es bienvenida. 🐾
              </p>
              <div className="mt-5 flex items-center gap-3 bg-gray-800/60 p-3 rounded-xl border border-gray-700">
                <img
                  src="/Arkadium-logo.jpg"
                  alt="Arkadium88 Holdings SL"
                  className="w-12 h-12 rounded-lg object-cover border border-gray-600 flex-shrink-0"
                />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Matriz</p>
                  <p className="text-sm font-semibold">Arkadium88 Holdings SL</p>
                  <p className="text-[11px] text-gray-400">ark88@arkadium88holdingssl.com</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#contacto" onClick={() => setFormData({...formData, operationType: 'alquiler'})} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Buscar vivienda
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a href="#beneficios" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Beneficios
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Contacto
                  </a>
                </li>
                <li>
                  <Link to="/hairy-tools" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Hairy Tools (IA + Printify)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-gray-400">Alquiler pet-friendly</span>
                </li>
                <li>
                  <span className="text-gray-400">Compra y venta</span>
                </li>
                <li>
                  <span className="text-gray-400">Hoteles con mascotas</span>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Tienda HairyPetShop
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <i className="ri-whatsapp-line text-green-400"></i>
                  <span className="text-gray-400">+34 744 403 191</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-mail-line text-blue-400"></i>
                  <span className="text-gray-400">home@hairyelbicho.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-map-pin-line text-red-400"></i>
                  <span className="text-gray-400">Madrid, España</span>
                </li>
              </ul>

              <div className="mt-6">
                <h5 className="text-sm font-semibold mb-3">Síguenos</h5>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleWhatsAppContact()}
                    className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="ri-whatsapp-line text-sm"></i>
                  </button>
                  <button
                    onClick={() => window.open('https://www.facebook.com/settings/?tab=linked_instagram', '_blank')}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="ri-facebook-fill text-sm"></i>
                  </button>
                  <button
                    onClick={() => window.open('https://www.facebook.com/settings/?tab=linked_instagram', '_blank')}
                    className="w-8 h-8 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="ri-instagram-line text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <MatrizBar product="Hairy Home" />
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <button
        onClick={() => handleWhatsAppContact()}
        className="fixed bottom-24 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-50"
        title="Contactar por WhatsApp"
      >
        <i className="ri-whatsapp-line text-3xl"></i>
      </button>
    </div>
  );
}

// Añadir stats al final del archivo
const stats = {
  totalProducts: 0,
  activeProducts: 0,
  pendingProducts: 0
};
