
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
                <h1 className="text-xl font-bold text-white">Recibir SOL</h1>
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
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-qr-code-line text-4xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Recibir SOL
            </h2>
            <p className="text-purple-200 text-lg">
              Comparte tu código QR o dirección para recibir pagos
            </p>
          </div>

          {/* Código QR */}
          <div className="bg-white rounded-3xl p-8 mb-8 flex justify-center">
            <QRCodeSVG 
              value={walletAddress}
              size={280}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Dirección */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <p className="text-purple-200 text-sm mb-3 text-center">Tu dirección de Solana</p>
            <div className="bg-white/10 rounded-xl p-4 break-all">
              <p className="text-white font-mono text-center text-sm md:text-base">
                {walletAddress}
              </p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleCopyAddress}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
            >
              <i className="ri-file-copy-line text-xl"></i>
              <span>Copiar Dirección</span>
            </button>

            <button
              onClick={handleShare}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
            >
              <i className="ri-share-line text-xl"></i>
              <span>Compartir</span>
            </button>
          </div>

          {/* Información */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-2xl p-6 mt-6">
            <div className="flex items-start space-x-3">
              <i className="ri-information-line text-2xl text-blue-300 mt-1"></i>
              <div>
                <h3 className="text-lg font-bold text-blue-100 mb-2">
                  💡 Cómo Recibir SOL
                </h3>
                <ul className="text-blue-200 text-sm space-y-2">
                  <li>• Comparte tu código QR para que te escaneen</li>
                  <li>• O copia y envía tu dirección de wallet</li>
                  <li>• Los fondos llegarán en segundos</li>
                  <li>• Puedes usar esta dirección todas las veces que quieras</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
