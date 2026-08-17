import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import MatrizBar from '../../components/layout/MatrizBar';
import MainNav from '../../components/layout/MainNav';
import { ownApi } from '../../utils/ownApi';

const partnerTypes = [
  { id: 'fabrica', label: 'Fábrica / fabricante (p. ej. nutrición animal)' },
  { id: 'supermercado', label: 'Supermercado / central de compras / retail' },
  { id: 'distribuidor', label: 'Distribuidor / mayorista' },
  { id: 'clinica', label: 'Clínica veterinaria / cadena' },
  { id: 'otro', label: 'Otro partner estratégico' },
];

export default function Partners() {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    company: '',
    cif: '',
    name: '',
    role: '',
    email: '',
    phone: '',
    partnerType: 'fabrica',
    website: '',
    message: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await ownApi('/api/leads', {
        name: `${form.company} · ${form.name}`,
        email: form.email,
        phone: form.phone,
        source: 'partners',
        interest: form.partnerType,
        message: [
          `CIF/NIF: ${form.cif || '—'}`,
          `Cargo: ${form.role || '—'}`,
          `Web: ${form.website || '—'}`,
          '',
          form.message,
        ].join('\n'),
      });
      setOk(true);
    } catch {
      setError('No se pudo enviar. Escríbenos a ark88@arkadium88holdingssl.com o WhatsApp +34 744 403 191.');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-orange-400 font-bold mb-3">Canal B2B</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Partners / Proveedores</h2>
          <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
            Canal para fábricas, supermercados y distribuidores. HairyPetShop es una división especializada de Arkadium88 Holdings SL, dedicada a la innovación en bienestar animal. Aquí se reciben propuestas de negocio, no solo pedidos de consumidor.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Qué buscamos</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Fabricación de línea propia (nutrición y accesorios), con ficha técnica y certificación de planta visibles.</li>
                <li>Referencias para lineal de supermercado y central de compras.</li>
                <li>Distribución peninsular e islas con MOQ y paletizado claros.</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Interlocutor societario</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Contratos a nombre de Arkadium88 Holdings SL. Documentación técnica de línea propia:{' '}
                <Link to="/producto/hairy-nutrition-adulto-pollo-arroz" className="text-blue-800 font-semibold hover:underline">
                  Hairy Nutrition Adult
                </Link>
                .
              </p>
              <p className="text-sm text-gray-500">ark88@arkadium88holdingssl.com</p>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
            {ok ? (
              <div className="text-center py-12">
                <i className="ri-checkbox-circle-line text-5xl text-green-600"></i>
                <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Propuesta recibida</h3>
                <p className="text-gray-600">La matriz revisará el expediente y responderemos a tu correo corporativo.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900">Propuesta de colaboración</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Empresa *
                    <input name="company" value={form.company} onChange={onChange} required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Razón social" />
                  </label>
                  <label className="block text-sm font-semibold text-gray-700">
                    CIF / NIF
                    <input name="cif" value={form.cif} onChange={onChange} className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="B00000000" />
                  </label>
                  <label className="block text-sm font-semibold text-gray-700">
                    Persona de contacto *
                    <input name="name" value={form.name} onChange={onChange} required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl" />
                  </label>
                  <label className="block text-sm font-semibold text-gray-700">
                    Cargo
                    <input name="role" value={form.role} onChange={onChange} className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Compras, dirección, exportación…" />
                  </label>
                  <label className="block text-sm font-semibold text-gray-700">
                    Email corporativo *
                    <input type="email" name="email" value={form.email} onChange={onChange} required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl" />
                  </label>
                  <label className="block text-sm font-semibold text-gray-700">
                    Teléfono *
                    <input type="tel" name="phone" value={form.phone} onChange={onChange} required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl" />
                  </label>
                </div>
                <label className="block text-sm font-semibold text-gray-700">
                  Tipo de partner *
                  <select name="partnerType" value={form.partnerType} onChange={onChange} className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl bg-white">
                    {partnerTypes.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-gray-700">
                  Web de la empresa
                  <input name="website" value={form.website} onChange={onChange} className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="https://" />
                </label>
                <label className="block text-sm font-semibold text-gray-700">
                  Propuesta *
                  <textarea name="message" value={form.message} onChange={onChange} required rows={5} className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Capacidad de planta, referencias de lineal, MOQ, certificaciones, catálogo…" />
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={submitting} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 disabled:opacity-60">
                  {submitting ? 'Enviando…' : 'Enviar propuesta a la matriz'}
                </button>
              </form>
            )}
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
