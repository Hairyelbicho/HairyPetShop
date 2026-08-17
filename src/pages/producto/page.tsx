import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StripePayment from '../../components/payments/StripePayment';
import MatrizBar from '../../components/layout/MatrizBar';
import MainNav from '../../components/layout/MainNav';
import { getProductBySlug } from '../../data/products';

const TREASURY_WALLET = '7XF6rG8P3C5Fm9S1g3vA8k6L4N9jB5T2m1qWxP8yK5rN';

export default function ProductoFicha() {
  const { slug = '' } = useParams();
  const product = getProductBySlug(slug);
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showStripe, setShowStripe] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ficha no encontrada</h1>
          <Link to="/" className="text-blue-800 font-semibold">Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/hairypetshop-logo.png" alt="HairyPetShop" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-blue-900" style={{ fontFamily: '"Pacifico", serif' }}>HairyPetShop</h1>
            </Link>
            <MainNav />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:underline">Catálogo</Link>
          <span> / </span>
          <span className="text-gray-800">{product.name}</span>
        </p>

        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          <div className="relative">
            <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded-3xl shadow-lg" />
            {product.ownBrand && (
              <div className="absolute top-4 left-4 bg-blue-900 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                Línea propia · Delmocán
              </div>
            )}
          </div>
          <div>
            {product.ownBrand && (
              <p className="text-[11px] uppercase tracking-widest font-bold text-orange-600 mb-2">Ficha técnica profesional</p>
            )}
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h2>
            {product.manufacturer && <p className="text-sm text-gray-600 mb-4">{product.manufacturer}</p>}
            <p className="text-3xl font-black text-blue-900 mb-1">€{product.price.toFixed(2)}</p>
            {product.originalPrice > product.price && (
              <p className="text-sm text-gray-400 line-through mb-4">€{product.originalPrice.toFixed(2)}</p>
            )}
            <dl className="grid grid-cols-2 gap-3 text-sm mb-6">
              {product.sku && <div><dt className="text-gray-500">SKU</dt><dd className="font-semibold">{product.sku}</dd></div>}
              {product.ean && <div><dt className="text-gray-500">EAN / GTIN</dt><dd className="font-semibold">{product.ean}</dd></div>}
              {product.species && <div><dt className="text-gray-500">Especie</dt><dd className="font-semibold">{product.species}</dd></div>}
              {product.stage && <div><dt className="text-gray-500">Etapa</dt><dd className="font-semibold">{product.stage}</dd></div>}
            </dl>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowCheckout(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold">
                Comprar
              </button>
              {product.ownBrand && (
                <Link to="/partners" className="border border-blue-900 text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50">
                  Solicitar condiciones B2B
                </Link>
              )}
            </div>
          </div>
        </div>

        {product.ownBrand && (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 p-8">
              <h3 className="text-xl font-bold mb-4">Composición</h3>
              <p className="text-gray-700 leading-relaxed">{product.composition}</p>
            </section>

            {product.analytical && (
              <section className="bg-white rounded-2xl border border-gray-100 p-8">
                <h3 className="text-xl font-bold mb-4">Constituyentes analíticos</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {product.analytical.map((row) => (
                      <tr key={row.label} className="border-b border-gray-100">
                        <td className="py-2 text-gray-600">{row.label}</td>
                        <td className="py-2 font-semibold text-right">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {product.additives && (
              <section className="bg-white rounded-2xl border border-gray-100 p-8">
                <h3 className="text-xl font-bold mb-4">Aditivos nutricionales (por kg)</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                  {product.additives.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </section>
            )}

            <section className="bg-[#0f1219] text-white rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-2">Certificación de fábrica</h3>
              <p className="text-sm text-gray-400 mb-6">Visible en esta ficha. Documentación de planta para supermercado o fábrica partner.</p>
              <div className="grid md:grid-cols-3 gap-4">
                {product.certifications?.map((c) => (
                  <div key={c.name} className="bg-[#1a1f2e] rounded-xl p-4 border border-gray-700">
                    <p className="text-[10px] uppercase tracking-widest text-orange-400 font-bold mb-1">
                      {c.status === 'nda' ? 'Bajo NDA' : 'Visible'}
                    </p>
                    <h4 className="font-bold mb-2">{c.name}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{c.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            {product.formats && (
              <section className="bg-white rounded-2xl border border-gray-100 p-8">
                <h3 className="text-xl font-bold mb-4">Formatos</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">{product.formats.map((f) => <li key={f}>{f}</li>)}</ul>
                {product.feedingGuide && <p className="mt-4 text-sm text-gray-600"><span className="font-semibold">Pauta de ración: </span>{product.feedingGuide}</p>}
                {product.storage && <p className="mt-2 text-sm text-gray-600"><span className="font-semibold">Conservación: </span>{product.storage}</p>}
              </section>
            )}

            {product.b2b && (
              <section className="bg-blue-50 rounded-2xl border border-blue-100 p-8">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Condiciones para partners (fábrica / retail)</h3>
                <dl className="grid md:grid-cols-2 gap-4 text-sm">
                  <div><dt className="text-gray-500">Pedido mínimo</dt><dd className="font-semibold">{product.b2b.moq}</dd></div>
                  <div><dt className="text-gray-500">Paletizado</dt><dd className="font-semibold">{product.b2b.pallet}</dd></div>
                  <div><dt className="text-gray-500">Incoterm</dt><dd className="font-semibold">{product.b2b.incoterm}</dd></div>
                  <div><dt className="text-gray-500">Plazo de producción</dt><dd className="font-semibold">{product.b2b.leadTime}</dd></div>
                </dl>
                <Link to="/partners" className="inline-block mt-6 bg-blue-900 text-white px-6 py-3 rounded-xl font-bold">
                  Abrir canal Partners / Proveedores
                </Link>
              </section>
            )}
          </div>
        )}

        {!product.ownBrand && product.shortTech && (
          <section className="bg-white rounded-2xl border border-gray-100 p-8">
            <h3 className="text-xl font-bold mb-2">Datos técnicos</h3>
            <p className="text-gray-700">{product.shortTech}</p>
            {product.sku && <p className="text-sm text-gray-500 mt-2">SKU {product.sku}</p>}
          </section>
        )}
      </div>

      <footer className="bg-[#0f1219] text-gray-400 py-10 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <MatrizBar product="HairyPetShop" />
        </div>
      </footer>

      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Método de pago</h3>
              <button type="button" onClick={() => setShowCheckout(false)} className="bg-transparent border-none cursor-pointer">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <button
              type="button"
              onClick={() => { setShowCheckout(false); setShowStripe(true); }}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mb-3"
            >
              Pagar con tarjeta
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCheckout(false);
                navigate('/hairy-wallet/enviar', {
                  state: {
                    amount: (product.price / 150).toFixed(4),
                    recipient: TREASURY_WALLET,
                    concept: `Compra: ${product.name}`,
                  },
                });
              }}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold"
            >
              Pagar con HairyWallet (SOL)
            </button>
          </div>
        </div>
      )}
      {showStripe && <StripePayment product={product} onClose={() => setShowStripe(false)} />}
    </div>
  );
}
