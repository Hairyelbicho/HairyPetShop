import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

export default function WalletRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Registro, 2: Crear/Importar Wallet

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // Registrar usuario en Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Guardar email temporalmente
        localStorage.setItem('hairy_user_email', email);
        localStorage.setItem('hairy_user_id', data.user.id);
        
        // Pasar al paso 2: crear o importar wallet
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png" 
                  alt="HairyWallet Logo" 
                  className="w-10 h-10"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">HairyWallet</h1>
                  <p className="text-xs text-purple-300">Configurar Wallet</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-checkbox-circle-line text-4xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              ¡Cuenta Creada! 🎉
            </h2>
            <p className="text-purple-200 mb-2">
              Ahora configura tu wallet de Solana
            </p>
            <p className="text-purple-300 text-sm">
              Registrado como: {email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/hairy-wallet/crear"
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <i className="ri-add-circle-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Crear Nueva Wallet
              </h3>
              <p className="text-purple-200 mb-4">
                Genera una nueva wallet de Solana con tu frase de recuperación única
              </p>
              <div className="flex items-center text-green-400 font-semibold">
                <span>Crear ahora</span>
                <i className="ri-arrow-right-line ml-2"></i>
              </div>
            </Link>

            <Link
              to="/hairy-wallet/importar"
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                <i className="ri-download-cloud-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Importar Wallet Existente
              </h3>
              <p className="text-purple-200 mb-4">
                Importa tu wallet usando tu frase de recuperación de 12 o 24 palabras
              </p>
              <div className="flex items-center text-blue-400 font-semibold">
                <span>Importar ahora</span>
                <i className="ri-arrow-right-line ml-2"></i>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
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
                <p className="text-xs text-purple-300">Crear Cuenta</p>
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

      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-user-add-line text-4xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Crear Cuenta
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

          <form onSubmit={handleRegister} className="space-y-6">
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
                minLength={8}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Repite tu contraseña"
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
                  Creando cuenta...
                </>
              ) : (
                <>
                  <i className="ri-user-add-line"></i>
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-purple-200 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link to="/wallet-login" className="text-white font-semibold hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-purple-200 text-sm text-center mb-4">
              O crea una wallet sin registro:
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
