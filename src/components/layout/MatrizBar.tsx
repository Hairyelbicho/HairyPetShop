export default function MatrizBar({ product = 'HairyPetShop' }: { product?: string }) {
  return (
    <div className="border-t border-gray-800 mt-8 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-center md:text-left">
        <div className="max-w-xl">
          <p className="text-white font-semibold text-sm mb-2">
            {product} | Una marca de{' '}
            <a
              href="https://arkadium88holdingssl.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:underline"
            >
              Arkadium88 Holdings SL
            </a>
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            {product} es la plataforma de bienestar animal de{' '}
            <span className="font-bold text-gray-200">Arkadium88 Holdings SL</span>, un holding tecnológico dedicado a la innovación y digitalización de soluciones de mercado. Apostamos por la calidad, la automatización y la excelencia en cada uno de nuestros proyectos.
          </p>
          <p className="text-gray-500 text-sm mt-3">
            © 2026 <span className="font-bold text-gray-300">Arkadium88 Holdings SL</span>. Todos los derechos reservados.
          </p>
        </div>
        <a
          href="https://arkadium88holdingssl.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <img
            src="/Arkadium-logo.jpg"
            alt="Arkadium88 Holdings SL"
            className="w-12 h-12 rounded-full object-cover border border-gray-600 shadow-md bg-[#1a1f2e] flex-shrink-0"
          />
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Matriz</p>
            <p className="text-sm font-bold text-white">Arkadium88 Holdings SL</p>
            <p className="text-[11px] text-gray-500">
              arkadium88holdingssl.com · ark88@arkadium88holdingssl.com
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
