import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StripePayment from '../../components/payments/StripePayment';

export default function HairyTools() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [creativePrompt, setCreativePrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  
  const [shippingInfo, setShippingInfo] = useState({
    name: '', email: '', address: '', city: '', zip: ''
  });
  
  const navigate = useNavigate();

  // Selector de Modelos: Cloud vs Local (Ollama)
  const aiModels = [
    { id: 'gemini-1.5-flash', name: 'Gemini Flash (Nube)' },
    { id: 'gemini-1.5-pro', name: 'Gemini Pro (Nube)' },
    { id: 'ollama-llama3', name: 'Llama 3 (Local)' },
    { id: 'ollama-mistral', name: 'Mistral (Local)' }
  ];

  const productTypes = [
    { 
      id: 'tshirt', 
      name: 'Camiseta Premium', 
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300',
      prices: { 'S': 24.99, 'M': 26.99, 'L': 28.99, 'XL': 32.99 }
    },
    { 
      id: 'hoodie', 
      name: 'Sudadera Studio', 
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300',
      prices: { 'S': 42.99, 'M': 45.99, 'L': 48.99, 'XL': 52.99 }
    },
    { 
      id: 'cap', 
      name: 'Gorra Trucker', 
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300',
      prices: { 'Única': 19.99 }
    }
  ];

  const generateImageIA = async () => {
    if (!creativePrompt) return alert("Por favor, escribe lo que quieres crear.");
    
    setIsGenerating(true);
    setGeneratedContent(''); // Limpiar canvas previo

    try {
      let enhancedPrompt = creativePrompt;

      // 1. Integración REAL con IAs para Mejorar el Prompt
      const systemInstruction = `Create a short English prompt (max 20 words) for an AI image generator based on this idea: ${creativePrompt}. Return ONLY the prompt text, no intro, no quotes, no newlines.`;

      if (selectedModel.startsWith('gemini')) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (apiKey) {
          try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: systemInstruction }] }]
              })
            });
            const data = await res.json();
            if (data.candidates && data.candidates[0].content.parts[0].text) {
              // Limpiamos la respuesta para evitar romper la URL de Pollinations
              enhancedPrompt = data.candidates[0].content.parts[0].text.replace(/[\n"']/g, '').trim();
            }
          } catch (e) {
            console.warn("Gemini falló, usando texto original.");
          }
        }
      } else if (selectedModel.startsWith('ollama')) {
        const ollamaModel = selectedModel.replace('ollama-', '');
        try {
          const res = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: ollamaModel,
              prompt: systemInstruction,
              stream: false
            })
          });
          const data = await res.json();
          if (data.response) {
            enhancedPrompt = data.response.replace(/[\n"']/g, '').trim();
          }
        } catch (e) {
          console.warn("Ollama falló, usando texto original.");
        }
      }

      // 2. Generación de Imagen (URL segura y limpia)
      const finalPrompt = `vector art graphic design, flat colors, white background, ${enhancedPrompt}`;
      const seed = Math.floor(Math.random() * 999999);
      // Usamos el endpoint primario de pollinations
      const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(finalPrompt)}?seed=${seed}&width=1024&height=1024&nologo=true&model=flux`;
      
      const img = new Image();
      img.src = imageUrl;
      
      img.onload = () => {
        setGeneratedContent(imageUrl);
        setIsGenerating(false);
      };
      
      img.onerror = () => {
        alert("Error de conexión con el motor de renderizado. Por favor intenta con un texto más corto.");
        setIsGenerating(false);
      };

    } catch (error) {
      alert("Error crítico. Revisa tu conexión.");
      setIsGenerating(false);
    }
  };

  const getPrice = () => {
    if (!selectedProduct) return 0;
    return selectedProduct.prices[selectedSize] || Object.values(selectedProduct.prices)[0];
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col h-screen overflow-hidden">
      
      {/* Cabecera Web (Real, sin imitar Windows) */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer border-none bg-transparent">
             <i className="ri-arrow-left-line text-xl"></i>
          </button>
          <img src="/HairyTools_Icon.png" className="w-8 h-8 rounded-md" alt="Logo" />
          <span className="font-bold text-slate-800 text-lg tracking-tight">HairyTools <span className="font-light text-slate-400">| AI Studio</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Motor IA Conectado</span>
          </div>
        </div>
      </header>

      {/* Layout Readdy.ai (2 Columnas: Chat/Input Izquierda, Canvas Derecha) */}
      <main className="flex-1 flex gap-4 p-4 max-w-full overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* Columna Izquierda: Input y Controles */}
        <div className="w-full lg:w-[400px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
             <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-1">Tu Asistente de Diseño</h2>
             <p className="text-xs text-slate-500">Describe tu idea y selecciona un motor de IA.</p>
          </div>

          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
            
            {/* Input Principal */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase mb-2 block">1. Idea Creativa</label>
              <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 h-32 focus:border-indigo-500 outline-none resize-none text-sm text-slate-700 transition-all shadow-inner"
                  placeholder="Ej: Un perro astronauta navegando por el espacio profundo en estilo cómic..."
                  value={creativePrompt}
                  onChange={(e) => setCreativePrompt(e.target.value)}
              />
            </div>

            {/* Configuración */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase mb-2 block">2. Motor de Razonamiento</label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-700 outline-none cursor-pointer shadow-sm hover:border-slate-300 transition-all"
              >
                {aiModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={generateImageIA} 
              disabled={isGenerating}
              className={`w-full mt-auto py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide border-none cursor-pointer ${isGenerating ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'}`}
            >
               {isGenerating ? <><i className="ri-loader-4-line animate-spin text-xl"></i> Procesando...</> : <><i className="ri-magic-line text-xl"></i> Generar Diseño</>}
            </button>
          </div>
        </div>

        {/* Espacio Publicitario (Google Ads Top) */}
        <div className="w-full bg-gray-100 border border-gray-200 border-dashed rounded-xl h-24 mb-16 flex flex-col items-center justify-center text-gray-400">
          <span className="text-xs uppercase tracking-widest font-bold">Espacio Publicitario Reservado (Google Ads)</span>
          <span className="text-[10px]">728 x 90 Leaderboard</span>
        </div>

        {/* Columna Derecha: Canvas / Output */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
          
          <div className="h-14 border-b border-slate-100 flex items-center px-6 bg-slate-50 shrink-0 justify-between">
             <h2 className="text-sm font-bold text-slate-700">Canvas de Trabajo</h2>
             {generatedContent && (
               <button onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedContent;
                  link.download = `HairyDesign_${Date.now()}.png`;
                  link.click();
               }} className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2">
                 <i className="ri-download-line"></i> HD
               </button>
             )}
          </div>

          <div className="flex-1 bg-slate-100 relative flex items-center justify-center overflow-hidden p-8">
             {isGenerating ? (
                <div className="text-center flex flex-col items-center">
                   <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-6 shadow-md"></div>
                   <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest animate-pulse">Sintetizando imagen con {aiModels.find(m => m.id === selectedModel)?.name}...</p>
                </div>
             ) : generatedContent ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center animate-in zoom-in duration-500">
                   <img src={generatedContent} className="max-h-full max-w-full rounded-xl shadow-2xl border-4 border-white object-contain" alt="Hairy Studio Art" />
                   
                   {/* Flotante Printify Action */}
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                      <button onClick={() => setShowProductModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 px-8 rounded-full shadow-xl hover:shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center gap-3 uppercase text-sm border-none cursor-pointer">
                         <i className="ri-printer-fill text-xl"></i> Imprimir Producto
                      </button>
                   </div>
                </div>
             ) : (
                <div className="text-center opacity-30 flex flex-col items-center">
                  <i className="ri-palette-line text-[100px] text-slate-400 mb-4"></i>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-500">El lienzo está vacío</p>
                </div>
             )}
          </div>
        </div>
      </main>

      {/* Modales Product & Checkout (Reutilizados del sistema anterior, diseño unificado) */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
               <h3 className="text-2xl font-black text-slate-800">Seleccionar Soporte</h3>
               <button onClick={() => setShowProductModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border-none bg-transparent">
                  <i className="ri-close-line text-2xl"></i>
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {productTypes.map(p => (
                <div 
                  key={p.id} 
                  className="bg-white border-2 border-slate-100 rounded-2xl p-5 hover:border-indigo-500 transition-all cursor-pointer text-center group shadow-sm hover:shadow-md" 
                  onClick={() => { setSelectedProduct(p); setShowProductModal(false); setShowCheckoutModal(true); }}
                >
                  <div className="aspect-square bg-slate-50 rounded-xl mb-4 overflow-hidden">
                     <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                  </div>
                  <p className="font-bold text-slate-800 mb-1">{p.name}</p>
                  <p className="text-indigo-600 font-bold text-sm">Desde €{Object.values(p.prices)[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Detalles Logísticos</h2>
            
            <div className="space-y-5">
              <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Talla Seleccionada</label>
                 <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedProduct && Object.keys(selectedProduct.prices).map(size => (
                      <button 
                       key={size}
                       onClick={() => setSelectedSize(size)}
                       className={`px-4 py-2 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${selectedSize === size ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
                      >
                        {size}
                      </button>
                    ))}
                 </div>
              </div>

              <input type="text" placeholder="Nombre completo" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-indigo-500 text-sm" />
              <input type="text" placeholder="Dirección de entrega" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-indigo-500 text-sm" />
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Precio Total:</span>
                <span className="text-xl font-black text-indigo-600">€{getPrice()}</span>
              </div>

              <div className="pt-4 flex flex-col gap-3">
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
                     // Redirigir a HairyWallet pre-rellenando el monto y la wallet de destino
                     navigate('/hairy-wallet/enviar', { 
                       state: { 
                          // Simulamos conversión de EUR a SOL (ej: 1 SOL = ~150 EUR)
                          amount: (getPrice() / 150).toFixed(4), 
                          recipient: "StoreWalletHairyPetShopDestination999999999", // Wallet pública de la tienda
                          concept: `Pago por: ${selectedProduct?.name} (Talla: ${selectedSize})`
                       } 
                     });
                   }}
                   className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg cursor-pointer border-none flex items-center justify-center gap-2"
                 >
                   <i className="ri-wallet-3-line text-lg"></i> Pagar con HairyWallet (SOL)
                 </button>
                 <button onClick={() => setShowCheckoutModal(false)} className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase cursor-pointer bg-transparent border-none">
                   Cancelar
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStripeModal && selectedProduct && (
        <StripePayment 
          product={{ 
            id: selectedProduct.id, 
            name: `${selectedProduct.name} (Talla: ${selectedSize})`, 
            price: getPrice(), 
            image: selectedProduct.image 
          }} 
          onClose={() => setShowStripeModal(false)} 
        />
      )}
    </div>
  );
}