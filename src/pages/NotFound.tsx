
import { Link } from 'react-router-dom';

export default function NotFound() {
  const handleWhatsAppContact = () => {
    const message = '¡Hola! Llegué a una página que no existe. ¿Podrías ayudarme a encontrar lo que busco?';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <img 
            src="https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png" 
            alt="HairyPetShop Logo" 
            className="w-12 h-12"
            loading="lazy"
          />
          <h1 className="text-3xl font-bold text-blue-900" style={{ fontFamily: '"Pacifico", serif' }}>
            HairyPetShop
          </h1>
        </div>

        {/* Error 404 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-error-warning-line text-4xl text-orange-600"></i>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Ups! Página no encontrada
          </h2>
          
          <p className="text-gray-600 mb-6">
            La página que buscas no existe o ha sido movida. Pero no te preocupes, 
            podemos ayudarte a encontrar lo que necesitas para tu mascota.
          </p>

          <div className="space-y-4">
            <Link
              to="/"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
            >
              <i className="ri-home-line"></i>
              <span>Volver al Inicio</span>
            </Link>

            <button
              onClick={handleWhatsAppContact}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
            >
              <i className="ri-whatsapp-line"></i>
              <span>Ayuda por WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Enlaces útiles */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Enlaces útiles</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              to="/automation"
              className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <i className="ri-robot-line"></i>
              <span>Automatización</span>
            </Link>
            <Link
              to="/hairy-tools"
              className="text-orange-600 hover:text-orange-700 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <i className="ri-brush-line"></i>
              <span>HairyTools</span>
            </Link>
            <button
              onClick={() => {
                const message = 'Hola! Me interesa ver el catálogo completo de productos para mascotas.';
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
              }}
              className="text-green-600 hover:text-green-700 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <i className="ri-shopping-bag-line"></i>
              <span>Productos</span>
            </button>
            <button
              onClick={() => {
                const message = 'Hola! Necesito ayuda para encontrar centros veterinarios en mi zona.';
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/34744403191?text=${encodedMessage}`, '_blank');
              }}
              className="text-purple-600 hover:text-purple-700 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <i className="ri-stethoscope-line"></i>
              <span>Veterinarios</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 HairyPetShop. Todos los derechos reservados.
          </p>
          <a 
            href="https://readdy.ai/?origin=logo" 
            className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Readdy
          </a>
        </div>
      </div>
    </div>
  );
}
