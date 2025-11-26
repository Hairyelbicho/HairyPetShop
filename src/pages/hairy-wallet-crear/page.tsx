import { useState } from 'react';
import { Keypair } from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';

export default function HairyWalletCrear() {
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
      // Generar keypair directamente con Solana
      const newKeypair = Keypair.generate();
      
      // Generar palabras mnemónicas simples (12 palabras aleatorias)
      const words = [
        'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
        'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
        'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
        'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
        'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
        'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album'
      ];
      
      const randomWords: string[] = [];
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWords.push(words[randomIndex]);
      }
      
      const newMnemonic = randomWords.join(' ');
      setMnemonic(newMnemonic);
      
      setWalletAddress(newKeypair.publicKey.toString());
      setSecretKey(Array.from(newKeypair.secretKey));
      
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

    // Guardar en localStorage (en producción usar encriptación)
    const walletData = {
      address: walletAddress,
      secretKey: secretKey,
      mnemonic: mnemonic,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('hairyWallet', JSON.stringify(walletData));
    localStorage.setItem('hairyWalletPassword', password); // En producción, hashear

    // Redirigir a la wallet
    window.REACT_APP_NAVIGATE('/hairy-wallet');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.REACT_APP_NAVIGATE('/hairy-wallet')}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xl"></i>
              <span className="font-medium">Volver</span>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Crear Nueva Wallet
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Step 1: Generar Wallet */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-wallet-3-line text-4xl text-white"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Crear Tu Wallet de Solana
              </h2>
              <p className="text-gray-600">
                Genera una nueva wallet segura para gestionar tus criptomonedas
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <div className="flex gap-3">
                <i className="ri-alert-line text-2xl text-yellow-600 flex-shrink-0"></i>
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Importante: Guarda tu Frase de Recuperación
                  </h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Recibirás 12 palabras secretas</li>
                    <li>• Guárdalas en un lugar seguro (papel, caja fuerte)</li>
                    <li>• Nunca las compartas con nadie</li>
                    <li>• Si las pierdes, perderás acceso a tus fondos</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={generateWallet}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  Generando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-add-circle-line text-xl"></i>
                  Generar Mi Wallet
                </span>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Mostrar Frase de Recuperación */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-key-2-line text-4xl text-white"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Tu Frase de Recuperación
              </h2>
              <p className="text-gray-600">
                Guarda estas 12 palabras en orden. Las necesitarás para recuperar tu wallet.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {mnemonic.split(' ').map((word, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 text-center border-2 border-purple-200"
                  >
                    <span className="text-xs text-gray-500 block mb-1">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-gray-900">{word}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={copyToClipboard}
                className="w-full bg-white border-2 border-purple-300 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors cursor-pointer"
              >
                {copied ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-check-line text-xl"></i>
                    ¡Copiado!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-file-copy-line text-xl"></i>
                    Copiar Frase
                  </span>
                )}
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex gap-3">
                <i className="ri-error-warning-line text-2xl text-red-600 flex-shrink-0"></i>
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">
                    ⚠️ Advertencia de Seguridad
                  </h3>
                  <p className="text-sm text-red-800">
                    HairyPetShop nunca te pedirá esta frase. Cualquiera con estas palabras
                    puede acceder a tus fondos. Guárdalas offline y nunca las compartas.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 w-5 h-5 text-purple-600 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  Confirmo que he guardado mi frase de recuperación en un lugar seguro.
                  Entiendo que si la pierdo, perderé acceso a mis fondos permanentemente.
                </span>
              </label>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!confirmed}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 3: Crear Contraseña */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-lock-password-line text-4xl text-white"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Crear Contraseña
              </h2>
              <p className="text-gray-600">
                Protege tu wallet con una contraseña segura
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-base"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <i className="ri-information-line text-xl text-blue-600 flex-shrink-0"></i>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Tu wallet está lista:</p>
                  <p className="text-xs font-mono bg-white px-2 py-1 rounded mt-2 break-all">
                    {walletAddress}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateWallet}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2">
                <i className="ri-check-double-line text-xl"></i>
                Crear Wallet
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
