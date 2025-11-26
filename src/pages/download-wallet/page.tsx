import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function DownloadWalletPage() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar si la PWA ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capturar el evento de instalación de PWA
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar cuando se instala la PWA
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('La instalación de PWA no está disponible en este momento. Intenta desde Chrome, Edge o Safari.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA instalada correctamente');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDownloadEXE = () => {
    // ✅ ACTUALIZADO: Ahora apunta al instalador real
    window.location.href = '/downloads/HairyWallet-Setup-1.0.0.exe';
    
    // Mostrar mensaje de descarga iniciada
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    message.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="ri-download-cloud-line text-2xl"></i>
        <div>
          <div class="font-bold">¡Descarga iniciada!</div>
          <div class="text-sm">HairyWallet-Setup-1.0.0.exe</div>
        </div>
      </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <i className="ri-wallet-3-fill text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-white">HairyWallet</h1>
            </div>
            <button
              onClick={() => navigate('/hairy-wallet')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all whitespace-nowrap cursor-pointer"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Volver
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <i className="ri-wallet-3-fill text-white text-7xl"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Descarga HairyWallet
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Elige la versión que prefieras: App Web (PWA) o Escritorio (Windows)
          </p>
        </div>

        {/* Download Options */}
        <div className="max-w-4xl mx-auto space-y-6 mb-16">
          {/* PWA - Recomendado */}
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              ⭐ Recomendado
            </div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-purple-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="ri-global-line text-purple-300 text-5xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">App Web (PWA)</h3>
                <p className="text-gray-300 mb-4">
                  Instala HairyWallet como una app nativa. Funciona en Windows, Mac, Linux, Android e iOS. Sin descargas, actualización automática.
                </p>
                <div className="flex flex-wrap gap-3">
                  {isInstalled ? (
                    <div className="px-8 py-4 bg-green-500/20 text-green-300 rounded-xl font-bold text-lg flex items-center gap-2 whitespace-nowrap">
                      <i className="ri-checkbox-circle-fill"></i>
                      Ya instalada
                    </div>
                  ) : isInstallable ? (
                    <button
                      onClick={handleInstallPWA}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-bold text-lg transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-download-line mr-2"></i>
                      Instalar App Web
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/hairy-wallet')}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-bold text-lg transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-arrow-right-line mr-2"></i>
                      Abrir Wallet Web
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const modal = document.getElementById('pwa-instructions-modal');
                      if (modal) modal.classList.remove('hidden');
                    }}
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-information-line mr-2"></i>
                    Ver Instrucciones
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Windows Desktop */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="ri-windows-fill text-blue-400 text-5xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Windows Desktop (.EXE)</h3>
                <p className="text-gray-400 mb-4">
                  Aplicación nativa para Windows 10/11. Instalador completo con acceso directo en escritorio y menú inicio.
                </p>
                <button
                  onClick={handleDownloadEXE}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold text-lg transition-all whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-download-line mr-2"></i>
                  Descargar Instalador
                </button>
                <p className="text-gray-500 text-sm mt-3">
                  📝 Nota: Debes compilar el instalador primero con <code className="bg-black/30 px-2 py-1 rounded">npm run electron:build</code>
                </p>
              </div>
            </div>
          </div>

          {/* macOS */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 opacity-60">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="ri-apple-fill text-gray-400 text-5xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">macOS Desktop (.DMG)</h3>
                <p className="text-gray-400 mb-4">
                  Aplicación nativa para macOS. Compatible con Intel y Apple Silicon.
                </p>
                <button
                  disabled
                  className="px-8 py-4 bg-gray-500/20 text-gray-400 rounded-xl font-bold text-lg cursor-not-allowed whitespace-nowrap"
                >
                  <i className="ri-time-line mr-2"></i>
                  Próximamente
                </button>
              </div>
            </div>
          </div>

          {/* Linux */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 opacity-60">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="ri-ubuntu-fill text-gray-400 text-5xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Linux Desktop (.AppImage)</h3>
                <p className="text-gray-400 mb-4">
                  Aplicación universal para distribuciones Linux. Compatible con Ubuntu, Fedora, Debian, etc.
                </p>
                <button
                  disabled
                  className="px-8 py-4 bg-gray-500/20 text-gray-400 rounded-xl font-bold text-lg cursor-not-allowed whitespace-nowrap"
                >
                  <i className="ri-time-line mr-2"></i>
                  Próximamente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Comparación de Versiones
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-4 px-6 text-white font-bold">Característica</th>
                  <th className="py-4 px-6 text-white font-bold text-center">App Web (PWA)</th>
                  <th className="py-4 px-6 text-white font-bold text-center">Windows Desktop</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">Instalación</td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-checkbox-circle-fill text-green-400 text-xl"></i>
                    <div className="text-sm">1 clic desde el navegador</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-checkbox-circle-fill text-green-400 text-xl"></i>
                    <div className="text-sm">Instalador .EXE</div>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">Actualizaciones</td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-checkbox-circle-fill text-green-400 text-xl"></i>
                    <div className="text-sm">Automáticas</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-information-line text-yellow-400 text-xl"></i>
                    <div className="text-sm">Manual</div>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">Funciona Offline</td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-checkbox-circle-fill text-green-400 text-xl"></i>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-checkbox-circle-fill text-green-400 text-xl"></i>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">Notificaciones Push</td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-checkbox-circle-fill text-green-400 text-xl"></i>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-checkbox-circle-fill text-green-400 text-xl"></i>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">Icono en Bandeja</td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-close-circle-fill text-red-400 text-xl"></i>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-checkbox-circle-fill text-green-400 text-xl"></i>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">Atajos de Teclado</td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-information-line text-yellow-400 text-xl"></i>
                    <div className="text-sm">Limitados</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-checkbox-circle-fill text-green-400 text-xl"></i>
                    <div className="text-sm">Completos</div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6">Multiplataforma</td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-checkbox-circle-fill text-green-400 text-xl"></i>
                    <div className="text-sm">Todas las plataformas</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="ri-information-line text-yellow-400 text-xl"></i>
                    <div className="text-sm">Solo Windows</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-check-line text-purple-400 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Seguridad Total</h3>
            <p className="text-gray-400">
              Tus claves privadas nunca salen de tu dispositivo. Encriptación de nivel bancario.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-qr-code-line text-blue-400 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Pagos QR</h3>
            <p className="text-gray-400">
              Genera códigos QR para recibir pagos instantáneos de forma sencilla.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-refresh-line text-green-400 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Sincronización</h3>
            <p className="text-gray-400">
              Sincroniza tu wallet entre web y escritorio automáticamente en tiempo real.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <i className="ri-question-line text-purple-400"></i>
                ¿Cuál versión debo elegir?
              </h4>
              <p className="text-gray-400 pl-7">
                Recomendamos la App Web (PWA) porque se actualiza automáticamente, funciona en todas las plataformas y es más fácil de instalar. La versión de escritorio es ideal si prefieres una app nativa de Windows con icono en la bandeja del sistema.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <i className="ri-question-line text-purple-400"></i>
                ¿Es seguro instalar la PWA?
              </h4>
              <p className="text-gray-400 pl-7">
                Sí, completamente seguro. Las PWA son tecnología estándar de navegadores modernos. Tu wallet se guarda encriptada localmente en tu dispositivo.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <i className="ri-question-line text-purple-400"></i>
                ¿Puedo usar la misma cuenta en ambas versiones?
              </h4>
              <p className="text-gray-400 pl-7">
                Sí, tu cuenta se sincroniza automáticamente entre la versión web y la de escritorio si inicias sesión con tu email.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <i className="ri-question-line text-purple-400"></i>
                ¿Cómo compilo el instalador .EXE?
              </h4>
              <p className="text-gray-400 pl-7">
                Necesitas Node.js instalado en tu PC. Luego ejecuta: <code className="bg-black/30 px-2 py-1 rounded">npm install</code> y después <code className="bg-black/30 px-2 py-1 rounded">npm run electron:build</code>. El instalador se generará en la carpeta <code className="bg-black/30 px-2 py-1 rounded">release/</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Instructions Modal */}
      <div id="pwa-instructions-modal" className="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Cómo Instalar la App Web</h3>
              <button
                onClick={() => {
                  const modal = document.getElementById('pwa-instructions-modal');
                  if (modal) modal.classList.add('hidden');
                }}
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
                    <span>Busca el icono de instalación <i className="ri-download-line"></i> en la barra de direcciones (esquina derecha)</span>
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
                    <span>Toca el botón de compartir <i className="ri-share-line"></i> (abajo en el centro)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                    <span>Desplázate y selecciona "Añadir a pantalla de inicio"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                    <span>Toca "Añadir" en la esquina superior derecha</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                    <span>¡Listo! Verás el icono de HairyWallet en tu pantalla de inicio</span>
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
                    <span>Toca el menú <i className="ri-more-2-fill"></i> (tres puntos arriba a la derecha)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                    <span>Selecciona "Instalar aplicación" o "Añadir a pantalla de inicio"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                    <span>Toca "Instalar"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                    <span>¡Listo! La app se instalará en tu dispositivo</span>
                  </li>
                </ol>
              </div>
            </div>

            <div className="mt-8 p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <p className="text-gray-300 text-sm">
                <i className="ri-information-line text-purple-400 mr-2"></i>
                <strong>Nota:</strong> Si no ves la opción de instalación, asegúrate de estar usando un navegador compatible (Chrome, Edge, Safari) y que estés en la página principal de HairyWallet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
