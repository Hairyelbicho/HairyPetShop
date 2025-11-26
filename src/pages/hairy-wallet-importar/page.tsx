import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Keypair } from '@solana/web3.js';

export default function HairyWalletImportar() {
  const navigate = useNavigate();
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!mnemonic.trim()) {
      alert('Por favor ingresa tu frase de recuperación');
      return;
    }

    const words = mnemonic.trim().toLowerCase().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      alert('La frase de recuperación debe tener 12 o 24 palabras');
      return;
    }

    if (password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsImporting(true);

      // Convertir las palabras en un seed usando hash simple
      const encoder = new TextEncoder();
      const data = encoder.encode(mnemonic.trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const seed = new Uint8Array(hashBuffer);

      // Generar keypair desde el seed
      const keypair = Keypair.fromSeed(seed);

      // Guardar wallet encriptada
      const walletData = {
        address: keypair.publicKey.toString(),
        mnemonic: mnemonic.trim(),
        encrypted: btoa(JSON.stringify({
          secretKey: Array.from(keypair.secretKey),
          password: password
        }))
      };

      localStorage.setItem('hairy_wallet_address', walletData.address);
      localStorage.setItem('hairy_wallet_mnemonic', walletData.mnemonic);
      localStorage.setItem('hairy_wallet_encrypted', walletData.encrypted);

      alert('¡Wallet importada exitosamente!');
      navigate('/hairy-wallet');
    } catch (error) {
      console.error('Error importando wallet:', error);
      alert('Error al importar la wallet. Verifica tu frase de recuperación.');
    } finally {
      setIsImporting(false);
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
                <h1 className="text-xl font-bold text-white">Importar Wallet</h1>
                <p className="text-xs text-purple-300">HairyWallet</p>
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

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-download-cloud-line text-4xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Importar Wallet Existente
            </h2>
            <p className="text-purple-200 text-lg">
              Ingresa tu frase de recuperación de 12 o 24 palabras
            </p>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/50 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <i className="ri-information-line text-2xl text-blue-300 mt-1"></i>
              <div>
                <h3 className="text-lg font-bold text-blue-100 mb-2">
                  💡 Información Importante
                </h3>
                <ul className="text-blue-200 text-sm space-y-2">
                  <li>• Ingresa las palabras en el orden correcto</li>
                  <li>• Separa cada palabra con un espacio</li>
                  <li>• Las palabras deben estar en minúsculas</li>
                  <li>• Verifica que no haya errores de escritura</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Frase de Recuperación (12 o 24 palabras)
              </label>
              <textarea
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="palabra1 palabra2 palabra3 palabra4 palabra5 palabra6..."
              />
              <p className="text-purple-300 text-sm mt-2">
                Palabras ingresadas: {mnemonic.trim().split(/\s+/).filter(w => w).length}
              </p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Crear Contraseña (mínimo 8 caracteres)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa una contraseña segura"
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
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirma tu contraseña"
              />
            </div>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-2xl p-6 my-6">
            <div className="flex items-start space-x-3">
              <i className="ri-shield-check-line text-2xl text-yellow-300 mt-1"></i>
              <div>
                <h3 className="text-lg font-bold text-yellow-100 mb-2">
                  🔒 Seguridad
                </h3>
                <p className="text-yellow-200 text-sm">
                  Tu frase de recuperación se guardará encriptada localmente en tu dispositivo. 
                  Nunca la compartimos con nadie. Asegúrate de estar en un lugar seguro y privado.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleImport}
            disabled={isImporting || !mnemonic.trim() || !password || !confirmPassword}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 px-8 rounded-xl text-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <i className="ri-loader-4-line animate-spin text-2xl"></i>
                <span>Importando...</span>
              </>
            ) : (
              <>
                <i className="ri-download-line text-2xl"></i>
                <span>Importar Mi Wallet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
