import { Link } from 'react-router-dom';
import MatrizBar from '../../components/layout/MatrizBar';
import MainNav from '../../components/layout/MainNav';

export default function SobreNosotros() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/hairypetshop-logo.png" alt="HairyPetShop" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-blue-900" style={{ fontFamily: '"Pacifico", serif' }}>
                HairyPetShop
              </h1>
            </Link>
            <MainNav />
          </div>
        </div>
      </header>

      <section className="bg-[#0f1219] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-orange-400 font-bold mb-4">Arkadium88 Holdings SL</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Sobre HairyPetShop y Arkadium88 Holdings SL</h2>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 space-y-5">
            <p className="text-gray-700 leading-relaxed text-lg">
              HairyPetShop es la división especializada en bienestar y nutrición animal de{' '}
              <a href="https://arkadium88holdingssl.com" className="font-bold text-blue-900 hover:underline" target="_blank" rel="noopener noreferrer">
                Arkadium88 Holdings SL
              </a>
              . Como holding tecnológico, nuestra misión en Arkadium88 es transformar sectores tradicionales mediante la implementación de soluciones digitales avanzadas, automatización de procesos y optimización de la experiencia del cliente.
            </p>
            <p className="text-gray-700 leading-relaxed">
              En HairyPetShop, unimos esta capacidad tecnológica con nuestra pasión por los animales. Nos dedicamos a seleccionar y desarrollar soluciones de nutrición de alta calidad y productos inteligentes que facilitan el cuidado diario de las mascotas. Nuestra estructura, respaldada por la visión estratégica y el rigor operativo de{' '}
              <span className="font-bold text-gray-900">Arkadium88 Holdings SL</span>, nos permite ofrecer un estándar de servicio superior, garantizando transparencia, innovación y confianza tanto para nuestros clientes finales como para nuestros socios estratégicos.
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-8 md:p-10">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Visión</h3>
            <p className="text-gray-700 leading-relaxed">
              Nuestra visión es convertirnos en el referente tecnológico del sector retail en alimentación animal en España.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Interlocutor societario</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><span className="font-semibold text-gray-800">Matriz:</span> Arkadium88 Holdings SL</li>
              <li><span className="font-semibold text-gray-800">Web corporativa:</span> arkadium88holdingssl.com</li>
              <li><span className="font-semibold text-gray-800">Correo matriz:</span> ark88@arkadium88holdingssl.com</li>
              <li><span className="font-semibold text-gray-800">Tienda:</span> hairyelbicho.com · WhatsApp +34 744 403 191</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/partners" className="bg-blue-900 text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-blue-800">
              Partners / Proveedores
            </Link>
            <Link to="/producto/hairy-nutrition-adulto-pollo-arroz" className="border border-gray-300 px-6 py-3 rounded-full font-semibold text-center hover:bg-white">
              Ver ficha técnica de línea propia
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#0f1219] text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <MatrizBar product="HairyPetShop" />
        </div>
      </footer>
    </div>
  );
}
