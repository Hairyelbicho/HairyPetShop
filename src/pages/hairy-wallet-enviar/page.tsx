
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';

export default function HairyWalletEnviar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [recipient, setRecipient] = useState(location.state?.recipient || '');
  const [amount, setAmount] = useState(location.state?.amount || '');
  const concept = location.state?.concept || null;
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
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 font-sans selection:bg-amber-500/30 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-amber-900/30 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/hairy-wallet" className="flex items-center space-x-3">
              <img 
                src="/hairy-wallet-logo.png" 
                alt="HairyWallet Logo" 
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"
              />
              <div>
                <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase">Enviar SOL</h1>
                <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-semibold">Themis Protocol</p>
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <div className="bg-[#111114]/80 backdrop-blur-xl border border-amber-900/30 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-6 bg-[#1a1a1f] shadow-[0_0_30px_rgba(245,158,11,0.1)]">
              <i className="ri-send-plane-line text-4xl text-amber-400"></i>
            </div>
            <h2 className="text-3xl font-light text-white mb-3 tracking-wide">
              Transferencia Segura
            </h2>
            <p className="text-amber-500/80 font-mono text-lg tracking-widest">
              FONDOS: {balance.toFixed(4)} SOL
            </p>
          </div>

          {concept && (
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
               <i className="ri-shopping-cart-line text-amber-400 text-2xl"></i>
               <div>
                 <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-1">Orden de Pago Comercial</p>
                 <p className="text-amber-100/80 text-sm font-light">{concept}</p>
               </div>
            </div>
          )}

          <div className="space-y-8">
            <div>
              <label className="block text-xs font-semibold text-amber-500/80 uppercase tracking-wider mb-2">
                Identificador del Destinatario
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/10 rounded-xl text-amber-100 placeholder-gray-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 font-mono text-sm transition-all"
                placeholder="Dirección de Solana del destinatario"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-500/80 uppercase tracking-wider mb-2">
                Cantidad a Transferir (SOL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.0001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/10 rounded-xl text-amber-100 placeholder-gray-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 font-mono transition-all"
                  placeholder="0.0000"
                />
                <button
                  onClick={() => setAmount(balance.toString())}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Máximo
                </button>
              </div>
              {amount && (
                <p className="text-gray-500 text-xs mt-2 text-right font-mono">
                  ≈ ${(parseFloat(amount) * 150).toFixed(2)} USD
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-500/80 uppercase tracking-wider mb-2">
                Contraseña de Cifrado (Firma)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-[#0a0a0c] border border-white/10 rounded-xl text-amber-100 placeholder-gray-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 font-mono transition-all"
                placeholder="Ingresa tu contraseña para firmar"
              />
            </div>
          </div>

          <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 my-10">
            <div className="flex items-start space-x-4">
              <i className="ri-error-warning-line text-2xl text-red-500 mt-1"></i>
              <div>
                <h3 className="text-sm font-bold text-red-400 mb-2 uppercase tracking-widest">
                  Advertencia de Irreversibilidad
                </h3>
                <ul className="text-red-200/70 text-sm space-y-2 font-light">
                  <li>• Revisa minuciosamente la dirección del destinatario.</li>
                  <li>• Las transacciones en la red Solana son definitivas.</li>
                  <li>• Se deducirá una comisión mínima de red (gas).</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={isSending || !recipient || !amount || !password}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-[#0a0a0c] py-4 px-8 rounded-xl font-bold text-lg hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer tracking-wider uppercase text-sm flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <i className="ri-loader-4-line animate-spin text-xl"></i>
                <span>Firmando y Ejecutando...</span>
              </>
            ) : (
              <>
                <i className="ri-send-plane-fill text-xl"></i>
                <span>Ejecutar Transferencia</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
