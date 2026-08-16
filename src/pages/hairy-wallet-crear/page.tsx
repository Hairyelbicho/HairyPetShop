import { useState } from 'react';
import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { useNavigate } from 'react-router-dom';

export default function HairyWalletCrear() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mnemonic, setMnemonic] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [secretKey, setSecretKey] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWallet = async () => {
    setIsGenerating(true);
    
    try {
      // 1. Generate real BIP39 mnemonic (12 words)
      const newMnemonic = bip39.generateMnemonic(128); 
      setMnemonic(newMnemonic);
      
      // 2. Convert to seed
      const seed = await bip39.mnemonicToSeed(newMnemonic);
      
      // 3. Derive key using standard Solana path (Phantom/Solflare compatible)
      const derivationPath = "m/44'/501'/0'/0'";
      const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
      
      // 4. Generate Keypair
      const keypair = Keypair.fromSeed(derivedSeed);
      
      setWalletAddress(keypair.publicKey.toString());
      setSecretKey(Array.from(keypair.secretKey));
      
      setStep(2);
    } catch (error) {
      console.error('Error generando wallet:', error);
      alert('Error al generar la wallet. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateWallet = () => {
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!confirmed) {
      alert('Debes confirmar que guardaste tu frase de recuperación');
      return;
    }

    const walletData = {
      address: walletAddress,
      secretKey: secretKey,
      mnemonic: mnemonic,
      password: password,
      createdAt: new Date().toISOString()
    };

    const encryptedData = btoa(JSON.stringify(walletData));
    localStorage.setItem('hairy_wallet_encrypted', encryptedData);
    localStorage.setItem('hairy_wallet_address', walletAddress);

    navigate('/hairy-wallet');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 font-sans selection:bg-amber-500/30 relative overflow-hidden">
      {/* Background Ornaments (Themis Theme: Dark & Gold) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 border-b border-amber-900/30 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/hairy-wallet')}
              className="flex items-center gap-2 text-amber-500/70 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xl"></i>
              <span className="font-medium uppercase tracking-wider text-sm">Atrás</span>
            </button>
            <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase">
              Creación Segura
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        {/* Step 1: Generar Wallet */}
        {step === 1 && (
          <div className="bg-[#111114]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-10 border border-amber-900/30 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
            
            <div className="text-center mb-10">
              <div className="w-24 h-24 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-6 bg-[#1a1a1f] shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                <i className="ri-shield-keyhole-line text-5xl text-amber-400"></i>
              </div>
              <h2 className="text-3xl font-light text-white mb-3 tracking-wide">
                Forjar Nueva Wallet
              </h2>
              <p className="text-gray-400 font-light">
                Genera una bóveda impenetrable en la red Solana.
              </p>
            </div>

            <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-6 mb-10">
              <div className="flex gap-4">
                <i className="ri-scales-3-line text-3xl text-amber-500 flex-shrink-0 mt-1"></i>
                <div>
                  <h3 className="font-semibold text-amber-400 mb-2 tracking-wide">
                    El Pacto de Seguridad (BIP39 Estándar)
                  </h3>
                  <ul className="text-sm text-amber-100/70 space-y-2 font-light">
                    <li>• Se generará una Semilla Criptográfica única para ti.</li>
                    <li>• Tendrás el control absoluto sobre tus claves privadas.</li>
                    <li>• Total compatibilidad con Phantom y Solflare.</li>
                    <li>• Custodia tu frase de recuperación como tu mayor tesoro.</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={generateWallet}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-[#0a0a0c] py-4 rounded-xl font-bold text-lg hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-wider uppercase text-sm"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <i className="ri-loader-4-line animate-spin text-xl"></i>
                  Forjando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <i className="ri-hammer-line text-xl"></i>
                  Generar Claves
                </span>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Mostrar Frase de Recuperación */}
        {step === 2 && (
          <div className="bg-[#111114]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-10 border border-amber-900/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-6 bg-[#1a1a1f]">
                <i className="ri-eye-line text-4xl text-amber-400"></i>
              </div>
              <h2 className="text-3xl font-light text-white mb-2 tracking-wide">
                El Secreto Ancestral
              </h2>
              <p className="text-gray-400 font-light">
                Anota estas 12 palabras en orden exacto. Es tu única forma de recuperar tus fondos.
              </p>
            </div>

            <div className="bg-[#0a0a0c] border border-amber-900/50 rounded-xl p-8 mb-8 shadow-inner">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {mnemonic.split(' ').map((word, index) => (
                  <div
                    key={index}
                    className="bg-[#15151a] rounded-lg p-3 text-center border border-white/5 relative group"
                  >
                    <span className="absolute top-1 left-2 text-[10px] text-amber-500/50 font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-amber-100 tracking-wider mt-2 block">{word}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={copyToClipboard}
                className="w-full bg-transparent border border-amber-500/50 text-amber-400 py-3 rounded-lg font-medium hover:bg-amber-500/10 transition-colors cursor-pointer uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <i className="ri-check-double-line text-lg"></i>
                    Semilla Copiada
                  </>
                ) : (
                  <>
                    <i className="ri-file-copy-line text-lg"></i>
                    Copiar al Portapapeles
                  </>
                )}
              </button>
            </div>

            <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-6 mb-8">
              <div className="flex gap-4">
                <i className="ri-error-warning-line text-2xl text-red-500 flex-shrink-0"></i>
                <div>
                  <h3 className="font-semibold text-red-400 mb-1 tracking-wide uppercase text-sm">
                    Advertencia Crítica
                  </h3>
                  <p className="text-sm text-red-200/70 font-light">
                    Quien posea estas palabras, poseerá tus fondos. Nunca las ingreses en sitios desconocidos. HairyPetShop jamás te las pedirá.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#15151a] border border-white/5 rounded-xl p-5 mb-8">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="w-5 h-5 appearance-none border border-amber-500/50 rounded bg-transparent checked:bg-amber-500 transition-colors cursor-pointer"
                  />
                  {confirmed && <i className="ri-check-line absolute text-[#0a0a0c] text-sm pointer-events-none"></i>}
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors font-light">
                  Juro solemnemente que he resguardado esta frase de recuperación en un entorno seguro y offline. Comprendo que la pérdida de la misma resulta en la pérdida irreversible de mis activos.
                </span>
              </label>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!confirmed}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-[#0a0a0c] py-4 rounded-xl font-bold text-lg hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-wider uppercase text-sm"
            >
              Proceder
            </button>
          </div>
        )}

        {/* Step 3: Crear Contraseña */}
        {step === 3 && (
          <div className="bg-[#111114]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-10 border border-amber-900/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-6 bg-[#1a1a1f]">
                <i className="ri-lock-password-line text-4xl text-amber-400"></i>
              </div>
              <h2 className="text-3xl font-light text-white mb-2 tracking-wide">
                El Sello Final
              </h2>
              <p className="text-gray-400 font-light">
                Establece una contraseña para cifrar tu bóveda en este dispositivo.
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div>
                <label className="block text-xs font-semibold text-amber-500/80 uppercase tracking-wider mb-2">
                  Contraseña de Cifrado
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none text-amber-100 placeholder-gray-600 font-mono transition-all"
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
                  placeholder="Repite la contraseña"
                  className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none text-amber-100 placeholder-gray-600 font-mono transition-all"
                />
              </div>
            </div>

            <div className="bg-[#15151a] border border-white/5 rounded-xl p-5 mb-8 flex items-center gap-4">
              <i className="ri-fingerprint-line text-3xl text-amber-500/50"></i>
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dirección Pública Asignada</p>
                <p className="text-sm font-mono text-amber-200/80 truncate">
                  {walletAddress}
                </p>
              </div>
            </div>

            <button
              onClick={handleCreateWallet}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-[#0a0a0c] py-4 rounded-xl font-bold text-lg hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer tracking-wider uppercase text-sm flex items-center justify-center gap-3"
            >
              <i className="ri-secure-payment-line text-xl"></i>
              Sellar y Finalizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
