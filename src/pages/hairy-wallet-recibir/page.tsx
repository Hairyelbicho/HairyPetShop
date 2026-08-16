
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

export default function HairyWalletRecibir() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const savedWallet = localStorage.getItem('hairy_wallet_address');
    if (!savedWallet) {
      alert('No tienes una wallet configurada');
      navigate('/hairy-wallet');
      return;
    }
    setWalletAddress(savedWallet);
  }, [navigate]);

  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        alert('¡Dirección copiada al portapapeles!');
      } catch (error) {
        console.error('Error al copiar dirección:', error);
        alert('No se pudo copiar la dirección');
      }
    }
  };

  const handleShare = async () => {
    if (!walletAddress) return;

    const shareData = {
      title: 'Mi HairyWallet',
      text: `Envíame SOL a mi HairyWallet:\n${walletAddress}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error compartiendo:', error);
        // Fallback to copy if share fails
        await handleCopyAddress();
      }
    } else {
      await handleCopyAddress();
    }
  };

  if (!walletAddress) {
    return null;
  }

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
                <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase">Recibir SOL</h1>
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
              <i className="ri-qr-code-line text-4xl text-amber-400"></i>
            </div>
            <h2 className="text-3xl font-light text-white mb-3 tracking-wide">
              Recepción de Fondos
            </h2>
            <p className="text-gray-400 font-light">
              Muestra este código QR o comparte tu identificador para recibir SOL.
            </p>
          </div>

          {/* Código QR */}
          <div className="bg-[#1a1a1f] border border-amber-500/20 rounded-3xl p-8 mb-10 flex justify-center shadow-inner relative group">
            <div className="absolute inset-0 rounded-3xl border border-amber-500/50 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="bg-white p-4 rounded-2xl">
              <QRCodeSVG 
                value={walletAddress}
                size={240}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-[#0a0a0c] border border-amber-900/50 rounded-2xl p-6 mb-8 flex flex-col items-center shadow-inner">
            <p className="text-amber-500/60 text-xs uppercase tracking-widest font-semibold mb-3">Identificador Público</p>
            <div className="w-full bg-[#15151a] border border-white/5 rounded-xl p-4 break-all text-center">
              <p className="text-amber-100/90 font-mono text-sm md:text-base">
                {walletAddress}
              </p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={handleCopyAddress}
              className="bg-transparent border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-sm transition-all cursor-pointer flex items-center justify-center space-x-3"
            >
              <i className="ri-file-copy-line text-xl"></i>
              <span>Copiar al Portapapeles</span>
            </button>

            <button
              onClick={handleShare}
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-[#0a0a0c] py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer flex items-center justify-center space-x-3"
            >
              <i className="ri-share-line text-xl"></i>
              <span>Compartir Bóveda</span>
            </button>
          </div>

          {/* Información */}
          <div className="bg-amber-900/10 border border-amber-500/20 rounded-2xl p-6 mt-10">
            <div className="flex items-start space-x-4">
              <i className="ri-information-line text-2xl text-amber-500 mt-1"></i>
              <div>
                <h3 className="text-sm font-bold text-amber-400 mb-2 uppercase tracking-widest">
                  Protocolo de Recepción
                </h3>
                <ul className="text-amber-100/70 text-sm space-y-2 font-light">
                  <li>• Los emisores deben escanear el QR o usar tu Identificador Público.</li>
                  <li>• Asegúrate de que los envíos se realicen por la red Solana.</li>
                  <li>• Los fondos se reflejarán instantáneamente en tu balance.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
