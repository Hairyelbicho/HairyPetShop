import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [whatsappUrl] = useState(`https://wa.me/34744403191`);

  const featuredProducts = [
    {
      id: 1,
      name: "Collar Premium para Perros",
      price: 24.99,
      originalPrice: 34.99,
      discount: 29,
      rating: 4.8,
      reviews: 156,
      category: "perros",
      image: "https://readdy.ai/api/search-image?query=Premium%20leather%20dog%20collar%20with%20metal%20buckle%2C%20high%20quality%20pet%20accessory%2C%20brown%20leather%20collar%20for%20medium%20dogs%2C%20professional%20product%20photography&width=400&height=300&seq=collar1&orientation=landscape"
    },
    {
      id: 2,
      name: "Juguete Interactivo para Gatos",
      price: 18.50,
      originalPrice: 25.00,
      discount: 26,
      rating: 4.9,
      reviews: 203,
      category: "gatos",
      image: "https://readdy.ai/api/search-image?query=Interactive%20cat%20toy%20with%20feathers%20and%20bells%2C%20colorful%20pet%20toy%20for%20indoor%20cats%2C%20engaging%20cat%20entertainment%20product%2C%20clean%20white%20background&width=400&height=300&seq=cattoy1&orientation=landscape"
    },
    {
      id: 3,
      name: "Acuario Completo 50L",
      price: 89.99,
      originalPrice: 120.00,
      discount: 25,
      rating: 4.7,
      reviews: 89,
      category: "peces",
      image: "https://readdy.ai/api/search-image?query=Complete%2050%20liter%20aquarium%20tank%20with%20LED%20lighting%2C%20filter%20system%2C%20tropical%20fish%20tank%20setup%2C%20modern%20aquarium%20design&width=400&height=300&seq=aquarium1&orientation=landscape"
    },
    {
      id: 4,
      name: "Jaula Espaciosa para Pájaros",
      price: 65.00,
      originalPrice: 85.00,
      discount: 24,
      rating: 4.6,
      reviews: 67,
      category: "pajaros",
      image: "https://readdy.ai/api/search-image?query=Large%20bird%20cage%20with%20multiple%20perches%2C%20spacious%20aviary%20for%20parrots%20and%20canaries%2C%20white%20metal%20bird%20cage%20with%20feeding%20bowls%2C%20pet%20store%20quality&width=400&height=300&seq=birdcage1&orientation=landscape"
    },
    {
      id: 5,
      name: "Arnés Profesional para Caballos",
      price: 145.00,
      originalPrice: 180.00,
      discount: 19,
      rating: 4.9,
      reviews: 34,
      category: "caballos",
      image: "https://readdy.ai/api/search-image?query=Professional%20horse%20harness%20with%20leather%20straps%2C%20equestrian%20equipment%20for%20training%2C%20brown%20leather%20horse%20tack%2C%20high%20quality%20riding%20gear&width=400&height=300&seq=harness1&orientation=landscape"
    },
    {
      id: 6,
      name: "Kit Veterinario Básico",
      price: 78.50,
      originalPrice: 95.00,
      discount: 17,
      rating: 4.8,
      reviews: 112,
      category: "veterinarios",
      image: "https://readdy.ai/api/search-image?query=Veterinary%20medical%20kit%20with%20stethoscope%2C%20thermometer%20and%20basic%20tools%2C%20professional%20vet%20equipment%20set%2C%20medical%20supplies%20for%20pet%20care&width=400&height=300&seq=vetkit1&orientation=landscape"
    },
    {
      id: 7,
      name: "Cama Ortopédica para Perros",
      price: 42.99,
      originalPrice: 55.00,
      discount: 22,
      rating: 4.7,
      reviews: 178,
      category: "perros",
      image: "https://readdy.ai/api/search-image?query=Orthopedic%20dog%20bed%20with%20memory%20foam%2C%20comfortable%20pet%20sleeping%20mat%2C%20gray%20fabric%20dog%20bed%20for%20large%20breeds%2C%20supportive%20pet%20furniture&width=400&height=300&seq=dogbed1&orientation=landscape"
    },
    {
      id: 8,
      name: "Torre Rascador para Gatos",
      price: 56.00,
      originalPrice: 75.00,
      discount: 25,
      rating: 4.8,
      reviews: 145,
      category: "gatos",
      image: "https://readdy.ai/api/search-image?query=Multi%20level%20cat%20scratching%20tower%20with%20sisal%20rope%2C%20tall%20cat%20tree%20with%20platforms%20and%20hiding%20spots%2C%20beige%20cat%20furniture%20for%20indoor%20cats&width=400&height=300&seq=cattower1&orientation=landscape"
    },
    {
      id: 9,
      name: "Filtro Avanzado para Acuario",
      price: 34.99,
      originalPrice: 45.00,
      discount: 22,
      rating: 4.6,
      reviews: 92,
      category: "peces",
      image: "https://readdy.ai/api/search-image?query=Advanced%20aquarium%20filter%20system%20with%20multiple%20stages%2C%20water%20filtration%20equipment%20for%20fish%20tanks%2C%20black%20aquarium%20filter%20with%20tubes&width=400&height=300&seq=filter1&orientation=landscape"
    },
    {
      id: 10,
      name: "Comedero Automático para Pájaros",
      price: 28.50,
      originalPrice: 38.00,
      discount: 25,
      rating: 4.5,
      reviews: 76,
      category: "pajaros",
      image: "https://readdy.ai/api/search-image?query=Automatic%20bird%20feeder%20with%20seed%20dispenser%2C%20self%20filling%20bird%20food%20container%2C%20clear%20plastic%20bird%20feeder%20for%20cages&width=400&height=300&seq=birdfeeder1&orientation=landscape"
    },
    {
      id: 11,
      name: "Manta Térmica para Caballos",
      price: 98.00,
      originalPrice: 125.00,
      discount: 22,
      rating: 4.7,
      reviews: 45,
      category: "caballos",
      image: "https://readdy.ai/api/search-image?query=Thermal%20horse%20blanket%20for%20winter%2C%20waterproof%20horse%20rug%20with%20straps%2C%20navy%20blue%20equestrian%20blanket%20for%20cold%20weather%20protection&width=400&height=300&seq=horseblanket1&orientation=landscape"
    },
    {
      id: 12,
      name: "Estetoscopio Veterinario",
      price: 125.00,
      originalPrice: 150.00,
      discount: 17,
      rating: 4.9,
      reviews: 67,
      category: "veterinarios",
      image: "https://readdy.ai/api/search-image?query=Professional%20veterinary%20stethoscope%20for%20animal%20examination%2C%20medical%20grade%20vet%20stethoscope%20with%20dual%20head%2C%20black%20medical%20instrument&width=400&height=300&seq=stethoscope1&orientation=landscape"
    },
    // NUEVOS PRODUCTOS VIRALES
    {
      id: 13,
      name: "Arenero Automático Autolimpiable",
      price: 189.99,
      originalPrice: 249.99,
      discount: 24,
      rating: 4.9,
      reviews: 342,
      category: "gatos",
      image: "https://readdy.ai/api/search-image?query=Automatic%20self%20cleaning%20cat%20litter%20box%20with%20smart%20sensors%2C%20modern%20white%20automatic%20litter%20box%2C%20robotic%20cat%20toilet%20with%20waste%20drawer%2C%20high%20tech%20pet%20product&width=400&height=300&seq=autolitter1&orientation=landscape"
    },
    {
      id: 14,
      name: "Fuente de Agua Inteligente para Mascotas",
      price: 45.99,
      originalPrice: 65.00,
      discount: 29,
      rating: 4.8,
      reviews: 289,
      category: "perros",
      image: "https://readdy.ai/api/search-image?query=Smart%20pet%20water%20fountain%20with%20LED%20lights%20and%20filters%2C%20automatic%20water%20dispenser%20for%20cats%20and%20dogs%2C%20modern%20white%20pet%20fountain%20with%20flowing%20water&width=400&height=300&seq=fountain1&orientation=landscape"
    },
    {
      id: 15,
      name: "Comedero Automático con Cámara WiFi",
      price: 129.99,
      originalPrice: 179.99,
      discount: 28,
      rating: 4.9,
      reviews: 456,
      category: "perros",
      image: "https://readdy.ai/api/search-image?query=Smart%20automatic%20pet%20feeder%20with%20WiFi%20camera%2C%20white%20automatic%20food%20dispenser%20with%20app%20control%2C%20modern%20pet%20feeding%20station%20with%20video%20monitoring&width=400&height=300&seq=smartfeeder1&orientation=landscape"
    },
    {
      id: 16,
      name: "GPS Tracker para Mascotas",
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      rating: 4.7,
      reviews: 234,
      category: "perros",
      image: "https://readdy.ai/api/search-image?query=GPS%20pet%20tracker%20collar%20attachment%2C%20small%20waterproof%20GPS%20device%20for%20dogs%20and%20cats%2C%20modern%20pet%20location%20tracker%20with%20LED%20light&width=400&height=300&seq=gpstracker1&orientation=landscape"
    },
    {
      id: 17,
      name: "Cepillo Eléctrico Masajeador",
      price: 34.99,
      originalPrice: 49.99,
      discount: 30,
      rating: 4.8,
      reviews: 567,
      category: "gatos",
      image: "https://readdy.ai/api/search-image?query=Electric%20pet%20grooming%20brush%20with%20massage%20function%2C%20automatic%20pet%20hair%20remover%20brush%2C%20modern%20grooming%20tool%20for%20cats%20and%20dogs%20with%20soft%20bristles&width=400&height=300&seq=electricbrush1&orientation=landscape"
    },
    {
      id: 18,
      name: "Transportín Expandible con Ruedas",
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      rating: 4.6,
      reviews: 178,
      category: "perros",
      image: "https://readdy.ai/api/search-image?query=Expandable%20pet%20carrier%20with%20wheels%2C%20modern%20rolling%20pet%20travel%20bag%20with%20mesh%20windows%2C%20airline%20approved%20pet%20carrier%20with%20telescopic%20handle&width=400&height=300&seq=carrier1&orientation=landscape"
    },
    {
      id: 19,
      name: "Túnel de Juego Plegable para Gatos",
      price: 29.99,
      originalPrice: 39.99,
      discount: 25,
      rating: 4.7,
      reviews: 423,
      category: "gatos",
      image: "https://readdy.ai/api/search-image?query=Collapsible%20cat%20play%20tunnel%20with%20multiple%20openings%2C%20colorful%20cat%20tunnel%20toy%20with%20crinkle%20material%2C%20foldable%20cat%20entertainment%20tunnel&width=400&height=300&seq=cattunnel1&orientation=landscape"
    },
    {
      id: 20,
      name: "Dispensador de Premios Interactivo",
      price: 39.99,
      originalPrice: 54.99,
      discount: 27,
      rating: 4.8,
      reviews: 312,
      category: "perros",
      image: "https://readdy.ai/api/search-image?query=Interactive%20treat%20dispenser%20puzzle%20toy%20for%20dogs%2C%20smart%20pet%20treat%20ball%20with%20adjustable%20difficulty%2C%20blue%20and%20white%20treat%20dispensing%20toy&width=400&height=300&seq=treatdispenser1&orientation=landscape"
    },
    {
      id: 21,
      name: "Cortauñas Eléctrico con Luz LED",
      price: 24.99,
      originalPrice: 34.99,
      discount: 29,
      rating: 4.6,
      reviews: 267,
      category: "perros",
      image: "https://readdy.ai/api/search-image?query=Electric%20pet%20nail%20grinder%20with%20LED%20light%2C%20safe%20nail%20trimmer%20for%20dogs%20and%20cats%2C%20modern%20pet%20nail%20clipper%20with%20quiet%20motor&width=400&height=300&seq=nailgrinder1&orientation=landscape"
    },
    {
      id: 22,
      name: "Manta Térmica Autocalentable",
      price: 49.99,
      originalPrice: 69.99,
      discount: 29,
      rating: 4.9,
      reviews: 389,
      category: "gatos",
      image: "https://readdy.ai/api/search-image?query=Self%20heating%20pet%20blanket%20with%20thermal%20technology%2C%20soft%20gray%20pet%20warming%20mat%2C%20cozy%20self%20warming%20bed%20for%20cats%20and%20small%20dogs&width=400&height=300&seq=heatingblanket1&orientation=landscape"
    },
    {
      id: 23,
      name: "Pelota Interactiva con Movimiento Automático",
      price: 32.99,
      originalPrice: 44.99,
      discount: 27,
      rating: 4.7,
      reviews: 445,
      category: "perros",
      image: "https://readdy.ai/api/search-image?query=Automatic%20rolling%20ball%20toy%20for%20dogs%2C%20self%20moving%20interactive%20pet%20ball%20with%20LED%20lights%2C%20smart%20pet%20toy%20that%20moves%20by%20itself&width=400&height=300&seq=autoball1&orientation=landscape"
    },
    {
      id: 24,
      name: "Escalera Plegable para Mascotas",
      price: 54.99,
      originalPrice: 74.99,
      discount: 27,
      rating: 4.6,
      reviews: 198,
      category: "perros",
      image: "https://readdy.ai/api/search-image?query=Foldable%20pet%20stairs%20for%20bed%20and%20couch%2C%20portable%20dog%20steps%20with%20non%20slip%20surface%2C%20gray%20pet%20ramp%20for%20small%20dogs%20and%20cats&width=400&height=300&seq=petsteps1&orientation=landscape"
    }
  ];

  const categories = [
    { id: 'todos', name: 'Todos los productos', icon: 'ri-apps-line' },
    { id: 'perros', name: 'Perros', icon: 'ri-heart-line' },
    { id: 'gatos', name: 'Gatos', icon: 'ri-heart-line' },
    { id: 'peces', name: 'Peces', icon: 'ri-water-line' },
    { id: 'pajaros', name: 'Pájaros', icon: 'ri-flight-takeoff-line' },
    { id: 'caballos', name: 'Caballos', icon: 'ri-horse-line' },
    { id: 'veterinarios', name: 'Equipos Veterinarios', icon: 'ri-stethoscope-line' }
  ];

  const filteredProducts = selectedCategory === 'todos' 
    ? featuredProducts 
    : featuredProducts.filter(product => product.category === selectedCategory);

  const handleWhatsAppContact = (productName?: string) => {
    let whatsappMessage = productName 
      ? `¡Hola! Me interesa el producto: ${productName}. ¿Podrías darme más información?`
      : `¡Hola! Me interesa conocer más sobre HairyPetShop y sus productos para mascotas.`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`${whatsappUrl}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png" 
                alt="HairyPetShop Logo" 
                className="w-10 h-10"
              />
              <h1 className="text-2xl font-bold text-blue-900" style={{ fontFamily: '"Pacifico", serif' }}>
                HairyPetShop
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#productos" className="text-gray-700 hover:text-blue-900 transition-colors cursor-pointer">
                Productos
              </a>
              <Link to="/automation-dashboard" className="text-gray-700 hover:text-blue-900 transition-colors cursor-pointer flex items-center space-x-1">
                <i className="ri-robot-line"></i>
                <span>Automatización</span>
              </Link>
              <Link to="/hairy-home" className="text-gray-700 hover:text-blue-900 transition-colors cursor-pointer">
                Hairy Home
              </Link>
              <Link to="/hairy-wallet" className="text-gray-700 hover:text-blue-900 transition-colors cursor-pointer">
                Hairy Wallet
              </Link>
            </nav>

            <button
              onClick={() => handleWhatsAppContact()}
              className="text-green-500 hover:text-green-600 cursor-pointer"
            >
              <i className="ri-whatsapp-line text-2xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              🐾 HairyPetShop - Para Tu Mejor Amigo
            </h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Porque tu mascota merece lo mejor, siempre. Un sistema fácil y automático que te acerca todo lo necesario.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#productos"
                className="bg-white hover:bg-gray-50 text-blue-900 px-8 py-3 rounded-full text-lg font-bold transition-colors shadow-lg cursor-pointer whitespace-nowrap"
              >
                Ver Productos
              </a>
              <button
                onClick={() => handleWhatsAppContact()}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-bold transition-colors cursor-pointer inline-flex items-center justify-center space-x-2 shadow-lg whitespace-nowrap"
              >
                <i className="ri-whatsapp-line text-xl"></i>
                <span>Contactar por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Section */}
      <section id="productos" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🛒 Productos para tu Mascota
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Todo lo que tu mejor amigo necesita, con la mejor calidad y precios especiales
            </p>
          </div>

          {/* Categorías */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className={category.icon}></i>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Productos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-product-shop>
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <div className="flex items-center space-x-1">
                      <i className="ri-star-fill text-yellow-400 text-sm"></i>
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-900">€{product.price}</span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">€{product.originalPrice}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <i className="ri-chat-3-line mr-1"></i>
                      {product.reviews}
                    </div>
                  </div>

                  <button
                    onClick={() => handleWhatsAppContact(product.name)}
                    className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
                  >
                    <i className="ri-shopping-cart-line"></i>
                    <span>Comprar Ahora</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png" 
                  alt="HairyPetShop Logo" 
                  className="w-10 h-10"
                />
                <h3 className="text-xl font-bold" style={{ fontFamily: '"Pacifico", serif' }}>
                  HairyPetShop
                </h3>
              </div>
              <p className="text-gray-400 text-sm">
                Tu tienda de confianza para el cuidado y bienestar de tu mascota.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#productos" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Productos
                  </a>
                </li>
                <li>
                  <Link to="/automation-dashboard" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Automatización
                  </Link>
                </li>
                <li>
                  <Link to="/hairy-home" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Hairy Home
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
                  <span className="text-gray-400">info@hairypetshop.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 HairyPetShop. Todos los derechos reservados.
              </p>
              <a 
                href="https://readdy.ai/?origin=logo" 
                className="text-gray-500 hover:text-gray-400 text-sm transition-colors mt-2 md:mt-0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website Builder
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
