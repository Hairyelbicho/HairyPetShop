import { useEffect, useState } from 'react';
import { ownApi } from '../../utils/ownApi';

export default function HairyBotPanel() {
  const [health, setHealth] = useState<{ groq?: boolean; postgres?: boolean; ok?: boolean } | null>(null);

  useEffect(() => {
    ownApi('/api/health')
      .then((data) => setHealth(data))
      .catch(() => setHealth({ ok: false, groq: false }));
  }, []);

  const groqOn = Boolean(health?.groq);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <img src="/hairy-bot.png" alt="HairyBot" className="w-16 h-16 rounded-full object-cover border-2 border-[#1a1f2e] bg-[#c4a574]" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">HairyBot (Hairy IA)</h3>
            <p className="text-sm text-gray-600">Asistente de tienda con Groq · API propia Arkadium88</p>
          </div>
          <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${groqOn ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {groqOn ? 'GROQ ACTIVO' : 'ESPERANDO API'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Motor</p>
            <p className="font-semibold text-gray-900">Groq · Llama 3.3 70B</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Sabe de</p>
            <p className="font-semibold text-gray-900">Catálogo, Hairy Home, Wallet, Tools</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Canal</p>
            <p className="font-semibold text-gray-900">Widget Talk with Us en toda la web</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 mb-6">
          <li className="flex items-center gap-2"><i className="ri-check-line text-green-500"></i> Precios y categorías de HairyPetShop</li>
          <li className="flex items-center gap-2"><i className="ri-check-line text-green-500"></i> Pagos Stripe, PayPal y HairyWallet (SOL)</li>
          <li className="flex items-center gap-2"><i className="ri-check-line text-green-500"></i> Hairy Home pet-friendly</li>
          <li className="flex items-center gap-2"><i className="ri-check-line text-green-500"></i> Printify / Hairy Tools</li>
          <li className="flex items-center gap-2"><i className="ri-check-line text-green-500"></i> WhatsApp +34 744 403 191</li>
          <li className="flex items-center gap-2"><i className="ri-check-line text-green-500"></i> Matriz Arkadium88 Holdings SL</li>
        </ul>

        <p className="text-sm text-gray-500">
          El cliente habla con Hairy desde la pastilla negra de la esquina. Las respuestas salen de Groq con el catálogo inyectado en el backend (`/api/chat`). No usa n8n ni Readdy.
        </p>
      </div>
    </div>
  );
}
