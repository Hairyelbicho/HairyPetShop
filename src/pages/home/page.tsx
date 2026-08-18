import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StripePayment from '../../components/payments/StripePayment';
import MatrizBar from '../../components/layout/MatrizBar';
import MainNav from '../../components/layout/MainNav';
import { products, type Product } from '../../data/products';
import CallMeBack from '../../components/chat/CallMeBack';

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

  const featuredProducts = products;

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

  const handlePurchase = (product: Product) => {
    setCheckoutProduct(product);
    setShowCheckoutModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/hairypetshop-logo.png" 
                alt="HairyPetShop Logo" 
                className="w-10 h-10"
              />
              <h1 className="text-2xl font-bold text-blue-900" style={{ fontFamily: '"Pacifico", serif' }}>
                HairyPetShop
              </h1>
            </Link>

            <MainNav />

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

      <div className="bg-[#0f1219] text-gray-300 text-center text-xs md:text-sm py-2 px-4">
        HairyPetShop | Una marca de{' '}
        <a href="https://arkadium88holdingssl.com" className="text-white font-bold hover:underline" target="_blank" rel="noopener noreferrer">
          Arkadium88 Holdings SL
        </a>
      </div>

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
            <div className="max-w-md mx-auto mt-8 bg-white text-gray-800 rounded-2xl p-5 text-left">
              <p className="font-bold text-gray-900 mb-3">¿Te llamamos ahora?</p>
              <CallMeBack source="shop_home" interest="catalogo" compact />
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
              <div key={product.id} className={`bg-white rounded-2xl shadow-lg border overflow-hidden relative ${product.ownBrand ? 'border-blue-900 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                {product.ownBrand && (
                  <div className="absolute top-4 left-4 bg-blue-900 text-white px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest z-10">
                    Línea propia · Delmocán
                  </div>
                )}
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm z-10">
                    -{product.discount}%
                  </div>
                )}
                <Link to={`/producto/${product.slug}`}>
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                </Link>
                <div className="p-6">
                  <Link to={`/producto/${product.slug}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 min-h-[56px] hover:text-blue-800">{product.name}</h3>
                  </Link>
                  {product.shortTech && <p className="text-xs text-gray-500 mb-3">{product.shortTech}</p>}
                  <div className="flex items-center justify-between mb-2">
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
                  <Link to={`/producto/${product.slug}`} className="text-xs font-semibold text-blue-800 hover:underline">
                    {product.ownBrand ? 'Ver ficha técnica completa' : 'Ver ficha'}
                  </Link>
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
                <img src="/hairypetshop-logo.png" alt="Logo" className="w-10 h-10 grayscale opacity-70" />
                <h3 className="text-xl font-bold text-white font-serif">HairyPetShop</h3>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                HairyPetShop es la plataforma de bienestar animal de{' '}
                <span className="font-bold text-gray-200">Arkadium88 Holdings SL</span>, un holding tecnológico dedicado a la innovación y digitalización de soluciones de mercado. Apostamos por la calidad, la automatización y la excelencia en cada uno de nuestros proyectos.
              </p>
              <div className="mt-4 flex flex-col items-start bg-[#161b26] p-4 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Soporte Corporativo:</p>
                <a href="mailto:hairyelbicho@gmail.com" className="text-orange-500 font-bold hover:underline mb-4 flex items-center gap-2">
                  <i className="ri-mail-send-line"></i> hairyelbicho@gmail.com
                </a>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Matriz:</p>
                <div className="flex items-center gap-3">
                  <img src="/Arkadium-logo.jpg" alt="Arkadium88 Holdings SL" className="w-16 h-16 rounded-lg object-cover bg-[#1a1f2e] border border-gray-700 p-1 shadow-lg" />
                  <div>
                    <span className="font-bold text-gray-200 tracking-widest uppercase text-xs block">Arkadium88 Holdings SL</span>
                    <a href="https://arkadium88holdingssl.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-500 hover:text-gray-300">arkadium88holdingssl.com</a>
                    <p className="text-[11px] text-gray-500">ark88@arkadium88holdingssl.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-6">Enlaces Rápidos</h4>
              <ul className="space-y-4">
                <li><Link to="/sobre-nosotros" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                <li><Link to="/partners" className="hover:text-white transition-colors">Partners / Proveedores</Link></li>
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
          <MatrizBar product="HairyPetShop" />
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