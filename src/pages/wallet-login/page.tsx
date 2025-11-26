import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

export default function WalletLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Login con Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Obtener wallet del usuario desde Supabase
        const { data: walletData, error: walletError } = await supabase
          .from('wallet_addresses')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();

        if (walletError) {
          setError('No se encontró una wallet asociada a esta cuenta');
          setIsLoading(false);
          return;
        }

        // Guardar wallet en localStorage
        localStorage.setItem('hairy_wallet_address', walletData.address);
        localStorage.setItem('hairy_wallet_encrypted', walletData.encrypted_private_key);
        localStorage.setItem('hairy_user_email', email);

        // Redirigir a la wallet
        navigate('/hairy-wallet');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/hairy-wallet" className="flex items-center space-x-3">
              <img 
                src="https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png" 
                alt="HairyWallet Logo" 
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-xl font-bold text-white">HairyWallet</h1>
                <p className="text-xs text-purple-300">Iniciar Sesión</p>
              </div>
            </Link>

            <Link 
              to="/hairy-wallet"
              className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
            >
              <i className="ri-arrow-left-line"></i>
              <span>Volver</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Formulario de Login */}
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-login-box-line text-4xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-purple-200">
              Accede a tu wallet desde cualquier dispositivo
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
              <p className="text-red-200 text-sm flex items-center gap-2">
                <i className="ri-error-warning-line"></i>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line"></i>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-purple-200 text-sm">
              ¿No tienes cuenta?{' '}
              <Link to="/wallet-register" className="text-white font-semibold hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-purple-200 text-sm text-center mb-4">
              O accede sin registro:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/hairy-wallet/crear"
                className="bg-white/10 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all text-center text-sm whitespace-nowrap"
              >
                Crear Wallet
              </Link>
              <Link
                to="/hairy-wallet/importar"
                className="bg-white/10 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all text-center text-sm whitespace-nowrap"
              >
                Importar Wallet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
