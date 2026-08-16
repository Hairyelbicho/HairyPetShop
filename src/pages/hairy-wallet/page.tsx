import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function HairyWalletPage() {
  const navigate = useNavigate();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedWallet = localStorage.getItem('hairy_wallet_address');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      fetchBalance(savedWallet);
      const interval = setInterval(() => fetchBalance(savedWallet), 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchBalance = async (address: string) => {
    try {
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const pubKey = new PublicKey(address);
      const balanceInLamports = await connection.getBalance(pubKey);
      setBalance(balanceInLamports / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const disconnect = () => {
    localStorage.removeItem('hairy_wallet_address');
    localStorage.removeItem('hairy_wallet_encrypted');
    localStorage.removeItem('hairy_wallet_mnemonic');
    setWalletAddress(null);
    setBalance(0);
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (walletAddress) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-gray-200 font-sans selection:bg-amber-500/30 relative overflow-hidden">
        {/* Background Ornaments */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

        <header className="relative z-10 border-b border-amber-900/30 bg-black/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="/hairy-wallet-logo.png" 
                  alt="HairyWallet Logo" 
                  className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                />
                <div>
                  <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase">
                    HairyWallet
                  </h1>
                  <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-semibold">Themis Protocol</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/hairy-home')}
                  className="w-10 h-10 rounded-full bg-[#15151a] border border-white/5 flex items-center justify-center text-amber-500/70 hover:text-amber-400 hover:border-amber-500/30 transition-all cursor-pointer"
                >
                  <i className="ri-home-line text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="relative z-10 max-w-5xl mx-auto px-4 py-12">
          {/* Main Balance Card */}
          <div className="bg-[#111114]/80 backdrop-blur-xl rounded-3xl p-10 mb-8 border border-amber-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
              <div>
                <p className="text-amber-500/60 text-xs font-semibold uppercase tracking-widest mb-3">Balance de la Bóveda</p>
                <h2 className="text-5xl md:text-7xl font-light text-white tracking-tight flex items-baseline gap-4">
                  {balance.toFixed(4)} <span className="text-2xl text-amber-500 font-normal">SOL</span>
                </h2>
                <p className="text-gray-400 mt-2 font-mono text-lg">≈ ${(balance * 150).toFixed(2)} USD</p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={disconnect} 
                  className="bg-red-950/30 hover:bg-red-900/40 text-red-400 px-6 py-3 rounded-xl text-sm transition-all cursor-pointer border border-red-500/20 uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
                >
                  <i className="ri-lock-unlock-line"></i> Cerrar Bóveda
                </button>
              </div>
            </div>
            
            <div className="bg-[#0a0a0c] border border-amber-900/50 rounded-2xl p-5 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-12 h-12 bg-[#1a1a1f] border border-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-fingerprint-line text-amber-500 text-xl"></i>
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Identificador Público</p>
                  <p className="text-sm md:text-base text-amber-100/90 font-mono truncate">{walletAddress}</p>
                </div>
              </div>
              <button 
                onClick={copyAddress}
                className="ml-4 w-12 h-12 flex-shrink-0 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-[#0a0a0c] cursor-pointer transition-all flex items-center justify-center border border-amber-500/30"
              >
                <i className={copied ? "ri-check-line text-xl" : "ri-file-copy-line text-xl"}></i>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <button onClick={() => navigate('/hairy-wallet/enviar')} className="bg-[#111114]/80 backdrop-blur-xl border border-amber-900/30 rounded-2xl p-8 text-center hover:-translate-y-2 transition-all duration-300 shadow-xl cursor-pointer group">
              <div className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-5 bg-[#1a1a1f] group-hover:bg-amber-500/10 transition-colors">
                <i className="ri-arrow-right-up-line text-amber-400 text-3xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-200 uppercase tracking-wider mb-2">Enviar</h3>
              <p className="text-xs text-gray-500 font-light">Transferir fondos</p>
            </button>
            
            <button onClick={() => navigate('/hairy-wallet/recibir')} className="bg-[#111114]/80 backdrop-blur-xl border border-amber-900/30 rounded-2xl p-8 text-center hover:-translate-y-2 transition-all duration-300 shadow-xl cursor-pointer group">
              <div className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-5 bg-[#1a1a1f] group-hover:bg-amber-500/10 transition-colors">
                <i className="ri-qr-code-line text-amber-400 text-3xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-200 uppercase tracking-wider mb-2">Recibir</h3>
              <p className="text-xs text-gray-500 font-light">Mostrar código QR</p>
            </button>
            
            <button onClick={() => navigate('/hairy-wallet/historial')} className="bg-[#111114]/80 backdrop-blur-xl border border-amber-900/30 rounded-2xl p-8 text-center hover:-translate-y-2 transition-all duration-300 shadow-xl cursor-pointer group">
              <div className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-5 bg-[#1a1a1f] group-hover:bg-amber-500/10 transition-colors">
                <i className="ri-history-line text-amber-400 text-3xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-200 uppercase tracking-wider mb-2">Historial</h3>
              <p className="text-xs text-gray-500 font-light">Registro de red</p>
            </button>
          </div>

          {/* Market Chart */}
          <div className="bg-[#111114]/80 backdrop-blur-xl rounded-3xl p-8 border border-amber-900/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-amber-100 uppercase tracking-widest flex items-center gap-3">
                <i className="ri-pulse-line text-amber-500 text-2xl"></i> 
                Mercado en Tiempo Real (SOL/USDT)
              </h3>
            </div>
            <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0c]">
              <iframe 
                src="https://s.tradingview.com/widgetembed/?symbol=BINANCE%3ASOLUSDT&interval=15&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=0a0a0c&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%2mainSeriesProperties.candleStyle.upColor%22%3A%22%23f59e0b%22%2C%22mainSeriesProperties.candleStyle.downColor%22%3A%22%236b21a8%22%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=es&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=BINANCE%3ASOLUSDT"
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                className="filter contrast-125"
              ></iframe>
            </div>
          </div>

        </section>
      </div>
    );
  }

  // Landing View (Not Connected)
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 font-sans selection:bg-amber-500/30 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-amber-900/30 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/hairy-wallet-logo.png" 
                alt="HairyWallet Logo" 
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"
              />
              <div>
                <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase">
                  HairyWallet
                </h1>
                <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-semibold hidden sm:block">Custodia Absoluta</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/wallet-login')}
                className="hidden md:flex bg-transparent border border-amber-500/50 hover:bg-amber-500/10 text-amber-400 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all cursor-pointer items-center gap-2"
              >
                <i className="ri-login-circle-line text-lg"></i> Conectar
              </button>
              <button
                onClick={() => navigate('/hairy-home')}
                className="w-10 h-10 rounded-full bg-[#15151a] border border-white/5 flex items-center justify-center text-amber-500/70 hover:text-amber-400 hover:border-amber-500/30 transition-all cursor-pointer"
              >
                <i className="ri-arrow-left-line text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center mb-20">
          <div className="w-32 h-32 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-10 bg-[#1a1a1f] shadow-[0_0_50px_rgba(245,158,11,0.15)] relative">
            <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping"></div>
            <i className="ri-safe-2-line text-6xl text-amber-400"></i>
          </div>
          <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
            El Nuevo Estándar en <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">Custodia</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            HairyWallet implementa criptografía de grado institucional (BIP39/SLIP-10) en una interfaz elegante y descentralizada. Tus claves, tu patrimonio.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
          <div 
            className="bg-[#111114]/80 backdrop-blur-xl border border-amber-900/40 rounded-3xl p-10 hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-all duration-500 cursor-pointer group relative overflow-hidden"
            onClick={() => navigate('/hairy-wallet/crear')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[50px] group-hover:bg-amber-500/10 transition-colors"></div>
            <div className="w-16 h-16 rounded-2xl border border-amber-500/30 flex items-center justify-center mb-8 bg-[#1a1a1f] group-hover:scale-110 transition-transform duration-500">
              <i className="ri-hammer-line text-amber-400 text-3xl"></i>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4 tracking-wide">Forjar Nueva Bóveda</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed mb-8">
              Genera una nueva semilla criptográfica de 12 palabras. Máxima seguridad y compatibilidad con el ecosistema Solana.
            </p>
            <div className="flex items-center text-amber-500 text-sm font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
              Comenzar <i className="ri-arrow-right-line ml-2 text-lg"></i>
            </div>
          </div>

          <div 
            className="bg-[#111114]/80 backdrop-blur-xl border border-purple-900/40 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all duration-500 cursor-pointer group relative overflow-hidden"
            onClick={() => navigate('/hairy-wallet/importar')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[50px] group-hover:bg-purple-500/10 transition-colors"></div>
            <div className="w-16 h-16 rounded-2xl border border-purple-500/30 flex items-center justify-center mb-8 bg-[#1a1a1f] group-hover:scale-110 transition-transform duration-500">
              <i className="ri-key-2-line text-purple-400 text-3xl"></i>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4 tracking-wide">Restaurar Acceso</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed mb-8">
              Importa tu frase semilla (12 o 24 palabras) existente de Phantom o Solflare para acceder a tus fondos instantáneamente.
            </p>
            <div className="flex items-center text-purple-400 text-sm font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
              Importar <i className="ri-arrow-right-line ml-2 text-lg"></i>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
