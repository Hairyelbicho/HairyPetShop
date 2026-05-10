import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StripePayment from '../../components/payments/StripePayment';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';

export default function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [whatsappUrl] = useState(`https://wa.me/34744403191`);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null);

  // Store treasury wallet address (replace with actual if needed)
  const TREASURY_WALLET = "7XF6rG8P3C5Fm9S1g3vA8k6L4N9jB5T2m1qWxP8yK5rN"; 

  useEffect(() => {
    const savedWallet = localStorage.getItem('hairy_wallet_address');
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, []);

  const featuredProducts = [
    {
      id: 1,
      name: "Collar Premium para Perros (Cuero)",
      price: 24.99,
      originalPrice: 34.99,
      discount: 29,
      rating: 4.8,
      reviews: 156,
      category: "perros",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400"
    },
    {
      id: 2,
      name: "Juguete Interactivo para Gatos (Láser)",
      price: 18.50,
      originalPrice: 25.00,
      discount: 26,
      rating: 4.9,
      reviews: 203,
      category: "gatos",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"
    },
    {
      id: 3,
      name: "Acuario Completo 50L con LED",
      price: 89.99,
      originalPrice: 120.00,
      discount: 25,
      rating: 4.7,
      reviews: 89,
      category: "peces",
      image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400"
    },
    {
      id: 4,
      name: "Arenero Automático Autolimpiable",
      price: 189.99,
      originalPrice: 249.99,
      discount: 24,
      rating: 4.9,
      reviews: 342,
      category: "gatos",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400"
    },
    {
      id: 5,
      name: "Cama Ortopédica Viscoelástica XXL",
      price: 55.00,
      originalPrice: 79.99,
      discount: 31,
      rating: 4.9,
      reviews: 512,
      category: "perros",
      image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=400"
    },
    {
      id: 6,
      name: "Dispensador de Comida WiFi con Cámara",
      price: 75.99,
      originalPrice: 105.00,
      discount: 28,
      rating: 4.8,
      reviews: 289,
      category: "perros",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400"
    },
    {
      id: 7,
      name: "Rascador Árbol Gigante para Gatos (170cm)",
      price: 64.50,
      originalPrice: 89.90,
      discount: 28,
      rating: 4.6,
      reviews: 145,
      category: "gatos",
      image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400"
    },
    {
      id: 8,
      name: "Correa Retráctil con Linterna LED",
      price: 19.99,
      originalPrice: 29.99,
      discount: 33,
      rating: 4.7,
      reviews: 402,
      category: "perros",
      image: "https://images.unsplash.com/photo-1605639156481-244775d6f803?w=400"
    },
    {
      id: 9,
      name: "Jaula Espaciosa para Pájaros (Canarios/Loros)",
      price: 45.00,
      originalPrice: 60.00,
      discount: 25,
      rating: 4.5,
      reviews: 78,
      category: "pajaros",
      image: "https://images.unsplash.com/photo-1552728089-571069502b48?w=400"
    },
    {
      id: 10,
      name: "Cámara de Seguridad para Mascotas HD",
      price: 34.99,
      originalPrice: 49.99,
      discount: 30,
      rating: 4.8,
      reviews: 620,
      category: "todos",
      image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400"
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

  const connectWallet = () => {
    navigate('/hairy-wallet');
  };

  const handlePurchase = (product: typeof featuredProducts[0]) => {
    setCheckoutProduct(product);
    setShowCheckoutModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <a href="#productos" className="text-gray-700 hover:text-blue-900 transition-colors cursor-pointer">Productos</a>
              <Link to="/automation-dashboard" className="text-gray-700 hover:text-blue-900 transition-colors cursor-pointer flex items-center space-x-1">
                <i className="ri-robot-line"></i>
                <span>Automatización</span>
              </Link>
              <Link to="/hairy-home" className="text-gray-700 hover:text-blue-900 transition-colors cursor-pointer">Hairy Home</Link>
              <Link to="/hairy-tools" className="text-blue-600 font-bold hover:text-blue-900 transition-colors cursor-pointer flex items-center space-x-1">
                <img src="/HairyTools_Icon.png" alt="Icon" className="w-6 h-6 rounded-md object-cover shadow-sm" />
                <span>Hairy Tools</span>
              </Link>
              <Link to="/hairy-wallet" className="text-gray-700 hover:text-blue-900 transition-colors cursor-pointer">Hairy Wallet</Link>
            </nav>

            <div className="flex items-center gap-4">
              <button onClick={() => handleWhatsAppContact()} className="text-green-500 hover:text-green-600 cursor-pointer">
                <i className="ri-whatsapp-line text-2xl"></i>
              </button>
              {walletAddress ? (
                <div className="bg-purple-100 text-purple-900 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                  <i className="ri-wallet-3-line"></i>
                  HairyWallet: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </div>
              ) : (
                <button onClick={connectWallet} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md">
                  <i className="ri-wallet-3-line"></i>
                  Usar mi HairyWallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">🐾 HairyPetShop - Para Tu Mejor Amigo</h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Compra tus productos con Solana (SOL) en tiempo real, directamente con tu HairyWallet sin intermediarios.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/hairy-tools"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-bold transition-colors shadow-lg cursor-pointer whitespace-nowrap flex items-center space-x-3"
              >
                <img src="/HairyTools_Icon.png" alt="Tools Icon" className="w-8 h-8 rounded-lg shadow-md bg-white p-0.5" />
                <span>Probar Hairy Tools IA</span>
              </Link>
              {!walletAddress && (
                <button
                  onClick={connectWallet}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-bold transition-colors cursor-pointer inline-flex items-center justify-center space-x-2 shadow-lg whitespace-nowrap"
                >
                  <i className="ri-wallet-3-line text-xl"></i>
                  <span>Configurar Wallet para Comprar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Estadísticas Públicas (Social Proof) */}
      <section className="bg-white border-b border-gray-100 relative z-10 -mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-4">
               <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                 <i className="ri-group-line text-2xl text-blue-600"></i>
               </div>
               <h3 className="text-4xl font-black text-gray-900 mb-1">12,485</h3>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Usuarios Registrados</p>
            </div>
            <div className="p-4">
               <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                 <i className="ri-pulse-line text-2xl text-green-600"></i>
               </div>
               <h3 className="text-4xl font-black text-gray-900 mb-1 flex items-center justify-center gap-2">
                 1,240 <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
               </h3>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tráfico Real Hoy</p>
            </div>
            <div className="p-4">
               <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                 <i className="ri-shopping-cart-2-line text-2xl text-purple-600"></i>
               </div>
               <h3 className="text-4xl font-black text-gray-900 mb-1">487</h3>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ventas este mes</p>
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">🛒 Catálogo para Mascotas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm z-10">
                    -{product.discount}%
                  </div>
                )}
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 min-h-[56px]">{product.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-left">
                      <span className="text-2xl font-bold text-blue-900">€{product.price}</span>
                      <p className="text-sm text-gray-500">~{(product.price / 150).toFixed(4)} SOL</p>
                    </div>
                    <button 
                      onClick={() => handlePurchase(product)} 
                      disabled={isProcessing}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-semibold flex items-center gap-2 cursor-pointer transition-all"
                    >
                      {isProcessing ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-shopping-cart-2-line"></i>}
                      {isProcessing ? 'Procesando...' : 'Comprar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Moderno con Enlaces Legales y Publicidad */}
      <footer className="bg-[#0f1219] text-gray-400 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Espacio Publicitario (Google Ads Footer) */}
          <div className="w-full bg-[#1a1f2e] border border-gray-700 border-dashed rounded-lg h-24 mb-12 flex flex-col items-center justify-center text-gray-500">
            <span className="text-xs uppercase tracking-widest font-bold">Espacio Publicitario Reservado (Google Ads)</span>
            <span className="text-[10px]">728 x 90 Leaderboard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img src="https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png" alt="Logo" className="w-10 h-10 grayscale opacity-70" />
                <h3 className="text-xl font-bold text-white font-serif">HairyPetShop</h3>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Tu destino de confianza para productos premium, tecnología IA y pagos descentralizados.
              </p>
              <div className="mt-4 flex flex-col items-start bg-[#161b26] p-4 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Soporte Corporativo:</p>
                <a href="mailto:hairyelbicho@gmail.com" className="text-orange-500 font-bold hover:underline mb-4 flex items-center gap-2">
                  <i className="ri-mail-send-line"></i> hairyelbicho@gmail.com
                </a>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Una marca de:</p>
                <div className="flex items-center gap-3">
                  <img src="/Arkadium-logo.jpg" alt="Arkadium88 Logo" className="w-16 h-16 rounded-lg object-contain bg-[#1a1f2e] border border-gray-700 p-1 shadow-lg" />
                  <span className="font-bold text-gray-200 tracking-widest uppercase text-xs">Arkadium88 Holdings SL</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-6">Enlaces Rápidos</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#productos" className="hover:text-white transition-colors">Catálogo</a></li>
                <li><Link to="/hairy-tools" className="hover:text-white transition-colors">Hairy Tools (IA)</Link></li>
                <li><Link to="/hairy-wallet" className="hover:text-white transition-colors">Hairy Wallet</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-6">Legal & Privacidad</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><i className="ri-shield-check-line"></i> Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><i className="ri-file-list-3-line"></i> Términos de Servicio</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><i className="ri-refund-2-line"></i> Política de Devoluciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><i className="ri-cookie-line"></i> Política de Cookies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-6">Redes Sociales</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors">
                  <i className="ri-twitter-x-line"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors">
                  <i className="ri-instagram-line"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors">
                  <i className="ri-tiktok-fill"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2026 Arkadium88 Holdings SL. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal de Selección de Pago */}
      {showCheckoutModal && checkoutProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
               <h3 className="text-xl font-bold text-gray-900">Método de Pago</h3>
               <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer border-none bg-transparent">
                  <i className="ri-close-line text-2xl"></i>
               </button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
               <img src={checkoutProduct.image} className="w-16 h-16 rounded-lg object-cover" alt={checkoutProduct.name} />
               <div>
                  <p className="font-bold text-gray-800 leading-tight">{checkoutProduct.name}</p>
                  <p className="text-blue-600 font-black text-lg">€{checkoutProduct.price}</p>
               </div>
            </div>

            <div className="space-y-3">
               <button 
                 onClick={() => { 
                   setShowCheckoutModal(false); 
                   setShowStripeModal(true);
                 }}
                 className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg cursor-pointer border-none flex items-center justify-center gap-2"
               >
                 <i className="ri-bank-card-line text-lg"></i> Pagar con Tarjeta (Stripe / Fiat)
               </button>
               
               <button 
                 onClick={() => { 
                   setShowCheckoutModal(false); 
                   navigate('/hairy-wallet/enviar', { 
                     state: { 
                        amount: (checkoutProduct.price / 150).toFixed(4), 
                        recipient: TREASURY_WALLET,
                        concept: `Compra Catálogo: ${checkoutProduct.name}`
                     } 
                   });
                 }}
                 className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg cursor-pointer border-none flex items-center justify-center gap-2"
               >
                 <i className="ri-wallet-3-line text-lg"></i> Pagar con HairyWallet (SOL)
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Stripe */}
      {showStripeModal && checkoutProduct && (
        <StripePayment 
          product={checkoutProduct} 
          onClose={() => setShowStripeModal(false)} 
        />
      )}
    </div>
  );
}