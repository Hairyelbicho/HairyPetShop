
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';

export default function HairyWalletEnviar() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const savedWallet = localStorage.getItem('hairy_wallet_address');
    if (!savedWallet) {
      alert('No tienes una wallet configurada');
      navigate('/hairy-wallet');
      return;
    }
    setWalletAddress(savedWallet);
    loadBalance(savedWallet);
  }, [navigate]);

  const loadBalance = async (address: string) => {
    try {
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const publicKey = new PublicKey(address);
      const balanceLamports = await connection.getBalance(publicKey);
      setBalance(balanceLamports / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error cargando balance:', error);
    }
  };

  const handleSend = async () => {
    if (!recipient.trim()) {
      alert('Por favor ingresa la dirección del destinatario');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor ingresa una cantidad válida');
      return;
    }

    if (parseFloat(amount) > balance) {
      alert('No tienes suficiente balance');
      return;
    }

    if (!password) {
      alert('Por favor ingresa tu contraseña');
      return;
    }

    try {
      setIsSending(true);

      // Recuperar keypair
      const encryptedData = localStorage.getItem('hairy_wallet_encrypted');
      if (!encryptedData) {
        throw new Error('No se encontró la wallet encriptada');
      }

      const decrypted = JSON.parse(atob(encryptedData));
      if (decrypted.password !== password) {
        throw new Error('Contraseña incorrecta');
      }

      const keypair = Keypair.fromSecretKey(new Uint8Array(decrypted.secretKey));

      // Crear transacción
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const recipientPubkey = new PublicKey(recipient);
      const amountLamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: recipientPubkey,
          lamports: amountLamports,
        })
      );

      // Enviar transacción
      const signature = await connection.sendTransaction(transaction, [keypair]);
      await connection.confirmTransaction(signature);

      alert(`¡Transacción exitosa!\\n\\nSignature: ${signature}`);
      
      // Limpiar formulario
      setRecipient('');
      setAmount('');
      setPassword('');
      
      // Actualizar balance
      if (walletAddress) {
        loadBalance(walletAddress);
      }

      // Volver a la wallet principal
      setTimeout(() => navigate('/hairy-wallet'), 2000);
    } catch (error: any) {
      console.error('Error enviando transacción:', error);
      if (error.message === 'Contraseña incorrecta') {
        alert('Contraseña incorrecta');
      } else {
        alert('Error al enviar la transacción. Verifica los datos e intenta de nuevo.');
      }
    } finally {
      setIsSending(false);
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
                <h1 className="text-xl font-bold text-white">Enviar SOL</h1>
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
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-send-plane-line text-4xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Enviar SOL
            </h2>
            <p className="text-purple-200 text-lg">
              Balance disponible: {balance.toFixed(4)} SOL
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Dirección del Destinatario
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                placeholder="Dirección de Solana del destinatario"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Cantidad (SOL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.0001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.0000"
                />
                <button
                  onClick={() => setAmount(balance.toString())}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Máximo
                </button>
              </div>
              {amount && (
                <p className="text-purple-300 text-sm mt-2">
                  ≈ ${(parseFloat(amount) * 150).toFixed(2)} USD
                </p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Contraseña de tu Wallet
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-2xl p-6 my-6">
            <div className="flex items-start space-x-3">
              <i className="ri-alert-line text-2xl text-yellow-300 mt-1"></i>
              <div>
                <h3 className="text-lg font-bold text-yellow-100 mb-2">
                  ⚠️ Verifica Antes de Enviar
                </h3>
                <ul className="text-yellow-200 text-sm space-y-1">
                  <li>• Verifica que la dirección del destinatario sea correcta</li>
                  <li>• Las transacciones en blockchain son irreversibles</li>
                  <li>• Se cobrará una pequeña comisión de red</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={isSending || !recipient || !amount || !password}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-4 px-8 rounded-xl text-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <i className="ri-loader-4-line animate-spin text-2xl"></i>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <i className="ri-send-plane-fill text-2xl"></i>
                <span>Enviar SOL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
