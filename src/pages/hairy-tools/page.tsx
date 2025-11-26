import { useState, useRef } from 'react';

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  description: string;
}

export default function HairyTools() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [finalPrice, setFinalPrice] = useState(0);
  const [commission, setCommission] = useState(0);
  const [printifyPrice, setPrintifyPrice] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para el creador de IA
  const [showAICreator, setShowAICreator] = useState(false);
  const [creativePrompt, setCreativePrompt] = useState('');
  const [creationType, setCreationType] = useState('image');
  const [imageStyle, setImageStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  
  // NUEVO: Estados para confirmación de imagen
  const [showImageConfirmation, setShowImageConfirmation] = useState(false);
  const [userApproved, setUserApproved] = useState(false);

  // NUEVO: Estados para edición de imagen
  const [imageZoom, setImageZoom] = useState(100);
  const [imageRotation, setImageRotation] = useState(0);
  const [imageBrightness, setImageBrightness] = useState(100);
  const [imageContrast, setImageContrast] = useState(100);
  const [imageSaturation, setImageSaturation] = useState(100);
  const [showEditTools, setShowEditTools] = useState(false);

  // NUEVO: Función para resetear ediciones
  const resetImageEdits = () => {
    setImageZoom(100);
    setImageRotation(0);
    setImageBrightness(100);
    setImageContrast(100);
    setImageSaturation(100);
  };

  // NUEVO: Función para confirmar la imagen generada
  const confirmGeneratedImage = (approved: boolean) => {
    if (approved) {
      setProcessedImage(generatedContent);
      setUserApproved(true);
      setShowImageConfirmation(false);
      resetImageEdits();
      
      // Mostrar mensaje de éxito
      alert('¡Perfecto! Tu imagen ha sido aprobada. Ahora puedes crear productos con ella.');
    } else {
      // Si no aprueba, volver al creador para regenerar
      setShowImageConfirmation(false);
      setShowAICreator(true);
      setGeneratedContent('');
      resetImageEdits();
      
      // Limpiar el prompt para que pueda escribir uno nuevo
      setCreativePrompt('');
      
      alert('Entendido. Puedes crear una nueva imagen con una descripción diferente.');
    }
  };

  // Herramientas IA disponibles
  const aiTools = [
    {
      id: 'enhance',
      name: 'Mejorar Calidad',
      icon: 'ri-magic-line',
      description: 'Mejora la resolución y calidad de tus imágenes',
      price: 2.99
    },
    {
      id: 'background',
      name: 'Quitar Fondo',
      icon: 'ri-scissors-line',
      description: 'Elimina el fondo automáticamente',
      price: 1.99
    },
    {
      id: 'style',
      name: 'Cambiar Estilo',
      icon: 'ri-palette-line',
      description: 'Aplica diferentes estilos artísticos',
      price: 3.99
    },
    {
      id: 'resize',
      name: 'Redimensionar',
      icon: 'ri-aspect-ratio-line',
      description: 'Optimiza el tamaño para productos',
      price: 1.49
    },
    {
      id: 'text',
      name: 'Extraer Texto',
      icon: 'ri-text',
      description: 'Convierte texto de imágenes a editable',
      price: 2.49
    },
    {
      id: 'qr',
      name: 'Generar QR',
      icon: 'ri-qr-code-line',
      description: 'Crea códigos QR personalizados',
      price: 1.99
    }
  ];

  // Tipos de productos disponibles
  const productTypes = [
    {
      id: 'tshirt',
      name: 'Camiseta Premium',
      basePrice: 12.99,
      finalPrice: 24.99,
      image: 'https://readdy.ai/api/search-image?query=Premium%20white%20t-shirt%20mockup%20for%20custom%20printing%2C%20clean%20background%2C%20professional%20product%20photography&width=300&height=300&seq=tshirt&orientation=squarish'
    },
    {
      id: 'mug',
      name: 'Taza Personalizada',
      basePrice: 8.99,
      finalPrice: 18.99,
      image: 'https://readdy.ai/api/search-image?query=White%20ceramic%20mug%20mockup%20for%20custom%20printing%2C%20clean%20background%2C%20professional%20product%20photography&width=300&height=300&seq=mug&orientation=squarish'
    },
    {
      id: 'poster',
      name: 'Póster A3',
      basePrice: 6.99,
      finalPrice: 16.99,
      image: 'https://readdy.ai/api/search-image?query=A3%20poster%20mockup%20for%20custom%20printing%2C%20clean%20background%2C%20professional%20product%20photography&width=300&height=300&seq=poster&orientation=squarish'
    },
    {
      id: 'hoodie',
      name: 'Sudadera con Capucha',
      basePrice: 22.99,
      finalPrice: 39.99,
      image: 'https://readdy.ai/api/search-image?query=Premium%20hoodie%20mockup%20for%20custom%20printing%2C%20clean%20background%20professional%20product%20photography&width=300&height=300&seq=hoodie&orientation=squarish'
    },
    {
      id: 'phone',
      name: 'Funda de Móvil',
      basePrice: 9.99,
      finalPrice: 19.99,
      image: 'https://readdy.ai/api/search-image?query=Phone%20case%20mockup%20for%20custom%20printing%2C%20clean%20background%20professional%20product%20photography&width=300&height=300&seq=phone&orientation=squarish'
    },
    {
      id: 'bag',
      name: 'Bolsa de Tela',
      basePrice: 7.99,
      finalPrice: 17.99,
      image: 'https://readdy.ai/api/search-image?query=Canvas%20tote%20bag%20mockup%20for%20custom%20printing%2C%20clean%20background%20professional%20product%20photography&width=300&height=300&seq=bag&orientation=squarish'
    }
  ];

  // Manejo de archivos subidos
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(files);
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
      setProcessedImage('');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles(files);
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
      setProcessedImage('');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const processWithAI = async (toolId: string) => {
    if (uploadedFiles.length === 0) return;
    
    const tool = aiTools.find(t => t.id === toolId);
    if (!tool) return;

    setIsProcessing(true);
    setShowImageConfirmation(false);
    setUserApproved(false);
    
    const steps: ProcessingStep[] = [
      { id: 'upload', name: 'Subiendo archivos', status: 'processing', description: 'Enviando archivos a HairyTools IA...' },
      { id: 'analyze', name: 'Analizando contenido', status: 'pending', description: 'IA analizando tus archivos...' },
      { id: 'process', name: `Aplicando ${tool.name}`, status: 'pending', description: tool.description },
      { id: 'optimize', name: 'Optimizando para impresión', status: 'pending', description: 'Preparando para Printify...' },
      { id: 'complete', name: 'Procesamiento completo', status: 'pending', description: 'Listo para revisar' }
    ];

    setProcessingSteps(steps);

    // Simular procesamiento paso a paso
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingSteps(prev => prev.map((step, index) => {
        if (index < i) return { ...step, status: 'completed' };
        if (index === i) return { ...step, status: 'processing' };
        return step;
      }));
    }

    // Completar último paso
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));

    // Generar imagen procesada
    const processedImageUrl = `https://readdy.ai/api/search-image?query=AI%20processed%20$%7Btool.name.toLowerCase%28%29%7D%20result%2C%20high%20quality%20digital%20art%2C%20professional%20design%20for%20printing%2C%20optimized%20for%20custom%20products&width=500&height=500&seq=${Date.now()}&orientation=squarish`;
    setGeneratedContent(processedImageUrl);
    setIsProcessing(false);
    
    // Mostrar confirmación de imagen procesada
    setShowImageConfirmation(true);
  };

  const selectProductAndProceed = (productId: string) => {
    const product = productTypes.find(p => p.id === productId);
    if (!product) return;

    setSelectedProduct(productId);
    setFinalPrice(product.finalPrice);
    setPrintifyPrice(product.basePrice);
    setCommission(product.finalPrice - product.basePrice);
    setShowProductModal(false);
    setShowPaymentModal(true);
  };

  const processFullOrder = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    setIsProcessing(true);

    const orderSteps: ProcessingStep[] = [
      { id: 'payment', name: 'Procesando pago', status: 'processing', description: `Procesando pago de €${finalPrice}...` },
      { id: 'printify', name: 'Enviando a producción', status: 'pending', description: 'Enviando orden a Printify...' },
      { id: 'production', name: 'Iniciando producción', status: 'pending', description: 'Printify creando el producto...' },
      { id: 'shipping', name: 'Configurando envío', status: 'pending', description: 'Preparando envío al cliente...' },
      { id: 'complete', name: 'Orden completada', status: 'pending', description: 'Cliente recibirá el producto en 3-7 días' }
    ];

    setProcessingSteps(orderSteps);

    // Procesar cada paso
    for (let i = 0; i < orderSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setProcessingSteps(prev => prev.map((step, index) => {
        if (index < i) return { ...step, status: 'completed' };
        if (index === i) return { ...step, status: 'processing' };
        return step;
      }));
    }

    // Completar orden
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessingSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));

    // Mostrar confirmación final
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentModal(false);
      
      alert(`🎉 ¡Orden procesada exitosamente!

📦 Producto: ${productTypes.find(p => p.id === selectedProduct)?.name}
👤 Cliente: ${customerInfo.name}
💰 Total: €${finalPrice}

✅ El cliente recibirá el producto en 3-7 días
📧 Se ha enviado confirmación por email
🚚 Printify enviará como "HairyTools"`);

      // Limpiar formulario
      setUploadedFiles([]);
      setPreviewUrls([]);
      setProcessedImage('');
      setSelectedProduct('');
      setCustomerInfo({ name: '', email: '', address: '', phone: '' });
      setProcessingSteps([]);
      setUserApproved(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </button>
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/7dd14b186efbe7484f538caba77b8d85.png" 
                  alt="HairyTools" 
                  className="w-10 h-10"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HairyTools IA</h1>
                <p className="text-sm text-gray-600">Crea, personaliza y vende automáticamente</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-medium">Printify Conectado</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700 font-medium">Sistema Automático</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard - SIN GANANCIAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Productos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Productos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="ri-shopping-bag-line text-purple-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <i className="ri-arrow-up-line mr-1"></i>
              <span>+{stats.totalProducts} productos creados</span>
            </div>
          </div>

          {/* Productos Activos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Productos Activos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeProducts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <i className="ri-fire-line mr-1"></i>
              <span>Listos para vender</span>
            </div>
          </div>

          {/* Productos Pendientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Productos Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingProducts}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="ri-time-line text-orange-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <i className="ri-loader-line mr-1"></i>
              <span>En proceso</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            {/* Botones principales separados */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Opciones de Creación</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowAICreator(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-3"
                >
                  <i className="ri-magic-line text-xl"></i>
                  <span>Crear con IA</span>
                  <i className="ri-sparkle-line text-xl"></i>
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-3"
                >
                  <i className="ri-upload-cloud-line text-xl"></i>
                  <span>Subir Archivos</span>
                  <i className="ri-file-line text-xl"></i>
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <div className="text-sm text-gray-700">
                  <div className="font-semibold mb-1">💡 Dos formas de crear:</div>
                  <div className="text-xs space-y-1">
                    <div>🎨 <strong>Crear con IA:</strong> Describe tu idea y la IA la genera</div>
                    <div>📁 <strong>Subir Archivos:</strong> Mejora tus archivos existentes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload section code */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subir Archivos</h3>
              
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrls.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {previewUrls.slice(0, 4).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {uploadedFiles.length} archivo{uploadedFiles.length > 1 ? 's' : ''} subido{uploadedFiles.length > 1 ? 's' : ''}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFiles([]);
                        setPreviewUrls([]);
                        setProcessedImage('');
                      }}
                      className="text-red-600 hover:text-red-700 text-sm cursor-pointer"
                    >
                      Eliminar archivos
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <i className="ri-upload-cloud-line text-2xl text-orange-500"></i>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2">Arrastra tus archivos aquí o haz clic</p>
                      <p className="text-sm text-gray-500">Imágenes, PDF, código, documentos...</p>
                      <p className="text-xs text-gray-400 mt-1">Múltiples archivos permitidos</p>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar,.js,.html,.css,.py,.java"
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />

              {/* AI Prompt */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instrucciones para la IA
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe qué quieres hacer con tus archivos..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{aiPrompt.length}/500 caracteres</p>
                </div>
              )}
            </div>

            {/* AI Tools */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Herramientas IA</h3>
                <div className="grid grid-cols-1 gap-3">
                  {aiTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => processWithAI(tool.id)}
                      disabled={isProcessing}
                      className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <i className={`${tool.icon} text-orange-500`}></i>
                          <span className="text-sm font-medium text-gray-900">{tool.name}</span>
                        </div>
                        <span className="text-sm font-bold text-green-600">€{tool.price}</span>
                      </div>
                      <p className="text-xs text-gray-600">{tool.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Procesamiento IA</h3>
                {processedImage && !isProcessing && userApproved && (
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Crear Producto
                  </button>
                )}
              </div>

              <div className="min-h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                {isProcessing || isGenerating ? (
                  <div className="text-center w-full max-w-md">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {isGenerating ? 'Generando con IA' : 'Procesando con HairyTools IA'}
                    </h4>
                    
                    <div className="space-y-3">
                      {processingSteps.map((step) => (
                        <div key={step.id} className="flex items-center space-x-3 text-left">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-green-100' :
                            step.status === 'processing' ? 'bg-orange-100' :
                            'bg-gray-100'
                          }`}>
                            {step.status === 'completed' ? (
                              <i className="ri-check-line text-green-600 text-sm"></i>
                            ) : step.status === 'processing' ? (
                              <i className="ri-loader-4-line text-orange-600 text-sm animate-spin"></i>
                            ) : (
                              <i className="ri-time-line text-gray-400 text-sm"></i>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${
                              step.status === 'completed' ? 'text-green-700' :
                              step.status === 'processing' ? 'text-orange-700' :
                              'text-gray-500'
                            }`}>
                              {step.name}
                            </div>
                            <div className="text-xs text-gray-500">{step.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : processedImage ? (
                  <div className="text-center">
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-gray-600 mt-4">✨ Procesado con HairyTools IA - Listo para crear producto</p>
                  </div>
                ) : generatedContent && creationType === 'code' ? (
                  <div className="text-left w-full">
                    <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-auto max-h-96">
                      <pre>{generatedContent}</pre>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 text-center">💻 Código generado con IA - Listo para usar</p>
                  </div>
                ) : previewUrls.length > 0 ? (
                  <div className="text-center">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {previewUrls.slice(0, 4).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Original ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Archivos originales - Selecciona una herramienta IA</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <i className="ri-image-line text-6xl mb-4"></i>
                    <p>Crea con IA o sube tus archivos para comenzar</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Imagen */}
      {showImageConfirmation && generatedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <i className="ri-image-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">¿Te gusta la imagen creada?</h3>
                    <p className="text-gray-600">Revisa y edita el resultado antes de crear tu producto</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditTools(!showEditTools)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                    showEditTools 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <i className={`${showEditTools ? 'ri-close-line' : 'ri-edit-line'} mr-2`}></i>
                  {showEditTools ? 'Cerrar Edición' : 'Editar Imagen'}
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vista previa de la imagen con zoom */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-100 rounded-xl p-6 mb-4 overflow-hidden">
                    <div className="relative" style={{ height: '500px' }}>
                      <div 
                        className="absolute inset-0 flex items-center justify-center overflow-hidden"
                        style={{
                          transform: `scale(${imageZoom / 100}) rotate(${imageRotation}deg)`,
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <img
                          src={generatedContent}
                          alt="Imagen generada por IA"
                          className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                          style={{
                            filter: `brightness(${imageBrightness}%) contrast(${imageContrast}%) saturate(${imageSaturation}%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Controles de zoom rápidos */}
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <button
                      onClick={() => setImageZoom(Math.max(50, imageZoom - 10))}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                      title="Alejar"
                    >
                      <i className="ri-zoom-out-line text-gray-700"></i>
                    </button>
                    
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{imageZoom}%</span>
                    </div>
                    
                    <button
                      onClick={() => setImageZoom(Math.min(200, imageZoom + 10))}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                      title="Acercar"
                    >
                      <i className="ri-zoom-in-line text-gray-700"></i>
                    </button>
                    
                    <button
                      onClick={() => setImageRotation((imageRotation - 90) % 360)}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                      title="Rotar izquierda"
                    >
                      <i className="ri-anticlockwise-line text-gray-700"></i>
                    </button>
                    
                    <button
                      onClick={() => setImageRotation((imageRotation + 90) % 360)}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                      title="Rotar derecha"
                    >
                      <i className="ri-clockwise-line text-gray-700"></i>
                    </button>
                    
                    <button
                      onClick={resetImageEdits}
                      className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                      title="Resetear todo"
                    >
                      <i className="ri-refresh-line text-red-600"></i>
                    </button>
                  </div>

                  {creativePrompt && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Tu solicitud:</h4>
                      <p className="text-blue-700 italic">"{creativePrompt}"</p>
                      <p className="text-sm text-blue-600 mt-2">Estilo: {imageStyle}</p>
                    </div>
                  )}
                </div>

                {/* Panel de herramientas de edición */}
                <div className="lg:col-span-1">
                  {showEditTools ? (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <i className="ri-tools-line text-purple-600 mr-2"></i>
                          Herramientas de Edición
                        </h4>
                      </div>

                      {/* Control de Zoom */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                          <span className="flex items-center">
                            <i className="ri-zoom-in-line text-purple-600 mr-2"></i>
                            Zoom
                          </span>
                          <span className="text-purple-600 font-bold">{imageZoom}%</span>
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={imageZoom}
                          onChange={(e) => setImageZoom(Number(e.target.value))}
                          className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(imageZoom - 50) / 1.5}%, #e9d5ff ${(imageZoom - 50) / 1.5}%, #e9d5ff 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>50%</span>
                          <span>200%</span>
                        </div>
                      </div>

                      {/* Control de Rotación */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                          <span className="flex items-center">
                            <i className="ri-rotate-lock-line text-pink-600 mr-2"></i>
                            Rotación
                          </span>
                          <span className="text-pink-600 font-bold">{imageRotation}°</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={imageRotation}
                          onChange={(e) => setImageRotation(Number(e.target.value))}
                          className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(imageRotation / 360) * 100}%, #fce7f3 ${(imageRotation / 360) * 100}%, #fce7f3 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0°</span>
                          <span>360°</span>
                        </div>
                      </div>

                      {/* Control de Brillo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                          <span className="flex items-center">
                            <i className="ri-sun-line text-yellow-600 mr-2"></i>
                            Brillo
                          </span>
                          <span className="text-yellow-600 font-bold">{imageBrightness}%</span>
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="150"
                          value={imageBrightness}
                          onChange={(e) => setImageBrightness(Number(e.target.value))}
                          className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #eab308 0%, #eab308 ${(imageBrightness - 50)}%, #fef3c7 ${(imageBrightness - 50)}%, #fef3c7 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>50%</span>
                          <span>150%</span>
                        </div>
                      </div>

                      {/* Control de Contraste */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                          <span className="flex items-center">
                            <i className="ri-contrast-line text-blue-600 mr-2"></i>
                            Contraste
                          </span>
                          <span className="text-blue-600 font-bold">{imageContrast}%</span>
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="150"
                          value={imageContrast}
                          onChange={(e) => setImageContrast(Number(e.target.value))}
                          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(imageContrast - 50)}%, #dbeafe ${(imageContrast - 50)}%, #dbeafe 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>50%</span>
                          <span>150%</span>
                        </div>
                      </div>

                      {/* Control de Saturación */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                          <span className="flex items-center">
                            <i className="ri-palette-line text-green-600 mr-2"></i>
                            Saturación
                          </span>
                          <span className="text-green-600 font-bold">{imageSaturation}%</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={imageSaturation}
                          onChange={(e) => setImageSaturation(Number(e.target.value))}
                          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${(imageSaturation / 2)}%, #dcfce7 ${(imageSaturation / 2)}%, #dcfce7 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span>200%</span>
                        </div>
                      </div>

                      {/* Botón de resetear */}
                      <button
                        onClick={resetImageEdits}
                        className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
                      >
                        <i className="ri-refresh-line"></i>
                        <span>Resetear Todo</span>
                      </button>

                      <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <div className="text-xs text-gray-600 space-y-1">
                          <p className="font-semibold text-purple-700 mb-2">💡 Consejos de edición:</p>
                          <p>• Usa zoom para ver detalles</p>
                          <p>• Ajusta brillo si está muy oscura</p>
                          <p>• Aumenta contraste para más impacto</p>
                          <p>• Reduce saturación para look vintage</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="ri-image-edit-line text-white text-2xl"></i>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Vista Previa</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Revisa tu imagen y edítala si lo necesitas
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <i className="ri-zoom-in-line text-blue-600"></i>
                            <span className="text-sm font-medium text-gray-700">Zoom</span>
                          </div>
                          <p className="text-xs text-gray-600">Acerca o aleja la imagen para ver detalles</p>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <i className="ri-rotate-lock-line text-blue-600"></i>
                            <span className="text-sm font-medium text-gray-700">Rotación</span>
                          </div>
                          <p className="text-xs text-gray-600">Gira la imagen en cualquier ángulo</p>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <i className="ri-contrast-line text-blue-600"></i>
                            <span className="text-sm font-medium text-gray-700">Ajustes</span>
                          </div>
                          <p className="text-xs text-gray-600">Brillo, contraste y saturación</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowEditTools(true)}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
                      >
                        <i className="ri-edit-line"></i>
                        <span>Abrir Editor</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de confirmación */}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => confirmGeneratedImage(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
                >
                  <i className="ri-close-line text-xl"></i>
                  <span>No me gusta, crear otra</span>
                </button>
                
                <button
                  onClick={() => confirmGeneratedImage(true)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
                >
                  <i className="ri-check-line text-xl"></i>
                  <span>¡Perfecto! Crear producto</span>
                </button>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <i className="ri-lightbulb-line text-orange-600"></i>
                  <span className="font-semibold text-orange-900">Consejos para mejores resultados:</span>
                </div>
                <div className="text-sm text-orange-700 space-y-1">
                  <p>• Usa el zoom para verificar todos los detalles de tu imagen</p>
                  <p>• Ajusta el brillo si la imagen está muy oscura o clara</p>
                  <p>• Aumenta el contraste para que los colores destaquen más</p>
                  <p>• Rota la imagen si necesitas cambiar la orientación</p>
                  <p>• Si no te gusta el resultado, puedes generar otra imagen diferente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Creador de IA */}
      {showAICreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <i className="ri-magic-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Creador de Imágenes IA</h3>
                    <p className="text-gray-600">Describe tu idea y la IA creará la imagen exacta</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAICreator(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Estilo de imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Estilo de imagen
                  </label>
                  <select
                    value={imageStyle}
                    onChange={(e) => setImageStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="realistic">Realista</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="artistic">Artístico</option>
                    <option value="minimalist">Minimalista</option>
                    <option value="vintage">Vintage</option>
                    <option value="modern">Moderno</option>
                  </select>
                </div>

                {/* Prompt creativo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe tu imagen con detalle
                  </label>
                  <textarea
                    value={creativePrompt}
                    onChange={(e) => setCreativePrompt(e.target.value)}
                    placeholder="Ej: Un gatito naranja muy tierno ofreciendo un hueso grande a un perrito golden retriever, ambos sonriendo, en un jardín con flores, colores vibrantes y alegres..."
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{creativePrompt.length}/500 caracteres</p>
                </div>

                {/* Ejemplos mejorados */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <h5 className="font-semibold text-purple-900 mb-2">💡 Ejemplos de prompts efectivos</h5>
                  <div className="space-y-2 text-sm text-purple-700">
                    <div>🐱 "Un gatito siamés muy tierno ofreciendo un hueso grande a un perrito beagle, ambos sonriendo, en un parque con césped verde y flores amarillas"</div>
                    <div>🎨 "Logo minimalista para una tienda de mascotas, colores azul y naranja, con siluetas de perro y gato, fondo blanco limpio"</div>
                    <div>👑 "Gato persa blanco con corona dorada brillante, sentado en un cojín rojo elegante, fondo con cortinas rojas, estilo renacentista"</div>
                    <div>🌈 "Perro labrador dorado corriendo en una playa al atardecer, olas suaves, cielo con colores naranjas y rosas, estilo fotográfico"</div>
                  </div>
                </div>

                {/* Botón generar */}
                <button
                  onClick={generateWithAI}
                  disabled={!creativePrompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-lg font-bold text-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center space-x-3"
                >
                  {isGenerating ? (
                    <>
                      <i className="ri-loader-4-line text-xl animate-spin"></i>
                      <span>Generando Imagen...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-image-line text-xl"></i>
                      <span>Generar Imagen con IA</span>
                      <i className="ri-sparkle-line text-xl"></i>
                    </>
                  )}
                </button>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="ri-information-line text-orange-600"></i>
                    <span className="font-semibold text-orange-900">Importante:</span>
                  </div>
                  <div className="text-sm text-orange-700 space-y-1">
                    <p>• La IA creará exactamente lo que describes</p>
                    <p>• Sé específico con colores, poses y detalles</p>
                    <p>• Podrás revisar la imagen antes de crear productos</p>
                    <p>• Si no te gusta, puedes generar otra diferente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Selección de Producto */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Seleccionar Producto</h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <p className="text-gray-600 mt-2">Elige el producto donde aplicar tu diseño procesado con IA</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productTypes.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => selectProductAndProceed(product.id)}
                    className="border-2 border-gray-200 hover:border-orange-300 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">€{product.finalPrice}</div>
                      <div className="text-sm text-gray-500 mt-1">Precio final</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago y Procesamiento de Orden */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Procesar Orden</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <p className="text-gray-600 mt-2">Completa la información para procesar la orden</p>
            </div>

            <div className="p-6">
              {isProcessing ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Procesando Orden</h4>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    {processingSteps.map((step) => (
                      <div key={step.id} className="flex items-center space-x-3 text-left">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-green-100' :
                          step.status === 'processing' ? 'bg-blue-100' :
                          'bg-gray-100'
                        }`}>
                          {step.status === 'completed' ? (
                            <i className="ri-check-line text-green-600"></i>
                          ) : step.status === 'processing' ? (
                            <i className="ri-loader-4-line text-blue-600 animate-spin"></i>
                          ) : (
                            <i className="ri-time-line text-gray-400"></i>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            step.status === 'completed' ? 'text-green-700' :
                            step.status === 'processing' ? 'text-blue-700' :
                            'text-gray-500'
                          }`}>
                            {step.name}
                          </div>
                          <div className="text-sm text-gray-500">{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Resumen del producto - SIN INFORMACIÓN DE COMISIONES */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">📦 Resumen del Pedido</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Producto:</span>
                        <span className="font-semibold">{productTypes.find(p => p.id === selectedProduct)?.name}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">€{finalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Información del cliente */}
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-gray-900">👤 Información del Cliente</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="maria@ejemplo.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección de envío *
                      </label>
                      <textarea
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Calle, número, ciudad, código postal, país"
                        rows={3}
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="+34 123 456 789"
                      />
                    </div>
                  </div>

                  {/* Información de envío - SIN DETALLES DE COMISIONES */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-truck-line text-blue-600"></i>
                      <span className="font-semibold text-blue-900">Información de Envío</span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>📦 Envío estándar incluido</p>
                      <p>🚚 Entrega en 3-7 días laborables</p>
                      <p>📧 Recibirás confirmación por email</p>
                      <p>🔍 Número de seguimiento incluido</p>
                    </div>
                  </div>

                  <button
                    onClick={processFullOrder}
                    disabled={!customerInfo.name || !customerInfo.email || !customerInfo.address}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 px-6 rounded-lg font-bold text-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center space-x-2"
                  >
                    <i className="ri-shopping-cart-line"></i>
                    <span>Procesar Pedido - €{finalPrice}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
