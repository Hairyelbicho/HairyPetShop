import { Link } from 'react-router-dom';

const linkClass = 'text-gray-700 hover:text-blue-900 transition-colors cursor-pointer whitespace-nowrap';

export default function MainNav() {
  return (
    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
      <a href="/#productos" className={linkClass}>
        Productos
      </a>
      <Link to="/partners" className={`${linkClass} font-semibold text-blue-900`}>
        Partners / Proveedores
      </Link>
      <Link to="/sobre-nosotros" className={linkClass}>
        Sobre nosotros
      </Link>
      <Link to="/hairy-home" className={linkClass}>
        Hairy Home
      </Link>
      <Link to="/hairy-tools" className="text-blue-600 font-bold hover:text-blue-900 transition-colors cursor-pointer flex items-center space-x-1">
        <img src="/HairyTools_Icon.png" alt="" className="w-6 h-6 rounded-md object-cover shadow-sm" />
        <span>Hairy Tools</span>
      </Link>
      <Link to="/hairy-wallet" className={linkClass}>
        Hairy Wallet
      </Link>
    </nav>
  );
}
