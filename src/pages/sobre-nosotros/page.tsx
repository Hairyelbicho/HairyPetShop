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
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Sobre nosotros</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            HairyPetShop es una división especializada de Arkadium88 Holdings SL, dedicada a la innovación en bienestar animal.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Respaldo de holding</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              HairyPetShop no opera como un e-commerce suelto. Forma parte de{' '}
              <a href="https://arkadium88holdingssl.com" className="text-blue-800 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
                Arkadium88 Holdings SL
              </a>
              , sociedad limitada española que agrupa tienda, Hairy Home, Hairy Tools y HairyWallet. Para un proveedor o una central de compras, eso implica interlocutor societario, contrato y continuidad.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><span className="font-semibold text-gray-800">Matriz:</span> Arkadium88 Holdings SL</li>
              <li><span className="font-semibold text-gray-800">Web corporativa:</span> arkadium88holdingssl.com</li>
              <li><span className="font-semibold text-gray-800">Correo matriz:</span> ark88@arkadium88holdingssl.com</li>
              <li><span className="font-semibold text-gray-800">Tienda:</span> hairyelbicho.com · WhatsApp +34 744 403 191</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h4 className="font-bold text-gray-900 mb-2">Qué hacemos</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Productos para mascotas, línea propia de nutrición con fábrica partner, diseño e impresión, hogares pet-friendly y pagos (tarjeta y Solana).
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h4 className="font-bold text-gray-900 mb-2">A quién nos dirigimos</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Familias, clínicas y, de forma expresa, fábricas, supermercados y distribuidores que quieran un partner de marca, no solo un pedido suelto.
              </p>
            </div>
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
