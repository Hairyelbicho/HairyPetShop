export default function MatrizBar({ product = 'HairyPetShop' }: { product?: string }) {
  return (
    <div className="border-t border-gray-800 mt-8 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-gray-400 text-sm">
          © 2026 {product}. Todos los derechos reservados.
        </p>
        <a
          href="https://arkadium88holdingssl.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <img
            src="/Arkadium-logo.jpg"
            alt="Arkadium88 Holdings SL"
            className="w-10 h-10 rounded-full object-cover border border-gray-600 shadow-md bg-[#1a1f2e] flex-shrink-0"
          />
          <div className="text-left max-w-md">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Matriz · Sociedad Limitada</p>
            <p className="text-sm text-gray-300">
              {product} es una división especializada de{' '}
              <span className="font-semibold text-gray-200">Arkadium88 Holdings SL</span>, dedicada a la innovación en bienestar animal.
            </p>
            <p className="text-[11px] text-gray-500">
              arkadium88holdingssl.com · ark88@arkadium88holdingssl.com
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
