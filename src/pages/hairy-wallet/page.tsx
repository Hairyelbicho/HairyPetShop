import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function HairyWalletPage() {
  const navigate = useNavigate();
  const [showInstallModal, setShowInstallModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <i className="ri-wallet-3-fill text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: '"Pacifico", serif' }}>HairyWallet</h1>
              <span className="text-sm text-gray-400 hidden sm:inline">Tu wallet de Solana</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInstallModal(true)}
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-purple-50 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-download-line"></i>
                Instalar Ahora
              </button>
              <button
                onClick={() => navigate('/wallet-login')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/wallet-register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer"
              >
                Registrarse
              </button>
              <button
                onClick={() => navigate('/hairy-home')}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-arrow-left-line"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
            <i className="ri-wallet-3-fill text-white text-7xl"></i>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Bienvenido a HairyWallet
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Tu wallet de Solana para el ecosistema Hairy
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {/* Create Wallet */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 border-purple-400/50"
               onClick={() => navigate('/hairy-wallet/crear')}>
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-add-circle-fill text-white text-5xl"></i>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Crear Nueva Wallet</h3>
            <p className="text-purple-100 mb-6">
              Genera una nueva wallet de Solana con tu frase de recuperación única
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-purple-50 transition-all flex items-center gap-2 whitespace-nowrap">
              Empezar ahora
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>

          {/* Import Wallet */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 border-blue-400/50"
               onClick={() => navigate('/hairy-wallet/importar')}>
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-download-cloud-fill text-white text-5xl"></i>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Importar Wallet Existente</h3>
            <p className="text-blue-100 mb-6">
              Importa tu wallet usando tu frase de recuperación de 12 o 24 palabras
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all flex items-center gap-2 whitespace-nowrap">
              Importar ahora
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            ¿Por qué usar HairyWallet?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <i className="ri-shield-check-line text-green-400 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Segura</h3>
              <p className="text-gray-300">
                Tus claves se guardan encriptadas localmente
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
                <i className="ri-flashlight-fill text-yellow-400 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Rápida</h3>
              <p className="text-gray-300">
                Transacciones instantáneas en Solana
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                <i className="ri-links-fill text-purple-400 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Integrada</h3>
              <p className="text-gray-300">
                Conectada con todo el ecosistema Hairy
              </p>
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-3xl p-12 border border-purple-500/30 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Descarga HairyWallet en tu dispositivo
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Disponible como App Web (PWA) para todos los dispositivos o como aplicación de escritorio para Windows
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/download-wallet')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg transition-all flex items-center gap-3 whitespace-nowrap cursor-pointer shadow-xl"
            >
              <i className="ri-download-line text-2xl"></i>
              Ver Opciones de Descarga
            </button>
            <button
              onClick={() => setShowInstallModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-full font-bold text-lg transition-all flex items-center gap-3 whitespace-nowrap cursor-pointer border-2 border-white/30"
            >
              <i className="ri-information-line text-2xl"></i>
              Cómo Instalar
            </button>
          </div>
        </div>
      </section>

      {/* Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Cómo Instalar HairyWallet</h3>
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="space-y-8">
                {/* Chrome/Edge Desktop */}
                <div>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <i className="ri-computer-line text-blue-400"></i>
                    Chrome / Edge (Windows/Mac/Linux)
                  </h4>
                  <ol className="space-y-3 text-gray-300">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                      <span>Busca el icono de instalación <i className="ri-download-line"></i> en la barra de direcciones</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                      <span>Haz clic en "Instalar HairyWallet"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                      <span>¡Listo! La app se abrirá en una ventana independiente</span>
                    </li>
                  </ol>
                </div>

                {/* Safari iOS */}
                <div>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <i className="ri-smartphone-line text-blue-400"></i>
                    Safari (iPhone/iPad)
                  </h4>
                  <ol className="space-y-3 text-gray-300">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                      <span>Toca el botón de compartir <i className="ri-share-line"></i></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                      <span>Selecciona "Añadir a pantalla de inicio"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                      <span>Toca "Añadir"</span>
                    </li>
                  </ol>
                </div>

                {/* Chrome Android */}
                <div>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <i className="ri-android-line text-green-400"></i>
                    Chrome (Android)
                  </h4>
                  <ol className="space-y-3 text-gray-300">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                      <span>Toca el menú <i className="ri-more-2-fill"></i></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                      <span>Selecciona "Instalar aplicación"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                      <span>Toca "Instalar"</span>
                    </li>
                  </ol>
                </div>

                {/* Windows Desktop */}
                <div className="bg-blue-500/20 rounded-xl p-6 border border-blue-500/30">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <i className="ri-windows-fill text-blue-400"></i>
                    Windows Desktop (.EXE)
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Para la versión de escritorio nativa de Windows, visita la página de descargas.
                  </p>
                  <button
                    onClick={() => {
                      setShowInstallModal(false);
                      navigate('/download-wallet');
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-download-line mr-2"></i>
                    Ir a Descargas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
