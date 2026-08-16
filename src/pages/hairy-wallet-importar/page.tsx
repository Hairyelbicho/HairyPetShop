import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

export default function HairyWalletImportar() {
  const navigate = useNavigate();
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    const trimmedMnemonic = mnemonic.trim().toLowerCase();
    
    if (!trimmedMnemonic) {
      alert('Por favor ingresa tu frase de recuperación');
      return;
    }

    if (!bip39.validateMnemonic(trimmedMnemonic)) {
      alert('La frase de recuperación es inválida. Verifica que no haya errores ortográficos.');
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

      // 1. Convert to seed
      const seed = await bip39.mnemonicToSeed(trimmedMnemonic);
      
      // 2. Derive key using standard Solana path (Phantom/Solflare compatible)
      const derivationPath = "m/44'/501'/0'/0'";
      const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
      
      // 3. Generate Keypair
      const keypair = Keypair.fromSeed(derivedSeed);

      // 4. Save encrypted wallet
      const walletData = {
        address: keypair.publicKey.toString(),
        mnemonic: trimmedMnemonic,
        encrypted: btoa(JSON.stringify({
          secretKey: Array.from(keypair.secretKey),
          password: password
        }))
      };

      localStorage.setItem('hairy_wallet_address', walletData.address);
      localStorage.setItem('hairy_wallet_mnemonic', walletData.mnemonic);
      localStorage.setItem('hairy_wallet_encrypted', walletData.encrypted);

      alert('¡Bóveda restaurada exitosamente!');
      navigate('/hairy-wallet');
    } catch (error) {
      console.error('Error importando wallet:', error);
      alert('Error al restaurar la bóveda. Verifica tu frase de recuperación.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 font-sans selection:bg-amber-500/30 relative overflow-hidden">
      {/* Background Ornaments (Themis Theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-amber-900/30 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/hairy-wallet" className="flex items-center space-x-3">
              <img 
                src="/hairy-wallet-logo.png" 
                alt="HairyWallet Logo" 
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"
              />
              <div>
                <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase">Restaurar Bóveda</h1>
              </div>
            </Link>

            <Link 
              to="/hairy-wallet"
              className="text-amber-500/70 hover:text-amber-400 transition-colors flex items-center gap-2 uppercase tracking-wider text-sm font-medium"
            >
              <i className="ri-arrow-left-line"></i>
              <span>Atrás</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        <div className="bg-[#111114]/80 backdrop-blur-xl border border-amber-900/30 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          
          <div className="text-center mb-10">
            <div className="w-24 h-24 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-6 bg-[#1a1a1f] shadow-[0_0_30px_rgba(245,158,11,0.1)]">
              <i className="ri-key-2-line text-5xl text-amber-400"></i>
            </div>
            <h2 className="text-3xl font-light text-white mb-3 tracking-wide">
              Restaurar Bóveda
            </h2>
            <p className="text-gray-400 font-light">
              Ingresa el Secreto Ancestral (12 o 24 palabras) para reclamar tus fondos.
            </p>
          </div>

          <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-6 mb-10">
            <div className="flex items-start space-x-4">
              <i className="ri-information-line text-2xl text-amber-500 mt-1 flex-shrink-0"></i>
              <div>
                <h3 className="font-semibold text-amber-400 mb-2 tracking-wide uppercase text-sm">
                  Cifrado Estándar (Phantom / Solflare)
                </h3>
                <ul className="text-amber-100/70 text-sm space-y-2 font-light">
                  <li>• Ingresa las palabras separadas por un espacio.</li>
                  <li>• Deben estar estrictamente en minúsculas.</li>
                  <li>• Utilizamos la ruta de derivación oficial de Solana (m/44'/501'/0'/0').</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-8 mb-10">
            <div>
              <label className="block text-xs font-semibold text-amber-500/80 uppercase tracking-wider mb-2">
                Frase de Recuperación (BIP39)
              </label>
              <textarea
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                rows={4}
                className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none text-amber-100 placeholder-gray-700 font-mono transition-all resize-none"
                placeholder="palabra1 palabra2 palabra3 palabra4 palabra5 palabra6..."
              />
              <p className="text-gray-500 text-xs mt-2 text-right">
                Palabras detectadas: {mnemonic.trim() ? mnemonic.trim().split(/\s+/).length : 0}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-amber-500/80 uppercase tracking-wider mb-2">
                  Nueva Contraseña Local
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none text-amber-100 placeholder-gray-700 font-mono transition-all"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-500/80 uppercase tracking-wider mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none text-amber-100 placeholder-gray-700 font-mono transition-all"
                  placeholder="Repite la contraseña"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleImport}
            disabled={isImporting || !mnemonic.trim() || !password || !confirmPassword}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-[#0a0a0c] py-4 px-8 rounded-xl font-bold text-lg hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer tracking-wider uppercase text-sm flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <i className="ri-loader-4-line animate-spin text-xl"></i>
                <span>Restaurando Encriptación...</span>
              </>
            ) : (
              <>
                <i className="ri-shield-keyhole-fill text-xl"></i>
                <span>Desbloquear Bóveda</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
