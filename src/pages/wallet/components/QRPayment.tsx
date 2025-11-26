import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../../../utils/supabase';

export default function QRPayment() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('wallet_addresses')
        .select('address')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setWalletAddress(data.address);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePaymentURL = () => {
    if (!walletAddress) return '';
    const baseURL = `solana:${walletAddress}`;
    if (amount && parseFloat(amount) > 0) {
      return `${baseURL}?amount=${amount}`;
    }
    return baseURL;
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      alert('Dirección copiada al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
        <i className="ri-loader-4-line animate-spin text-4xl text-white"></i>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
        <i className="ri-qr-code-line text-6xl text-gray-600 mb-4"></i>
        <p className="text-gray-400">Conecta tu wallet para generar códigos QR</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QR Code Card */}
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Recibir Pago con QR
        </h3>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-semibold">
            Monto (opcional)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white text-lg focus:outline-none focus:border-purple-500 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
              SOL
            </span>
          </div>
          {amount && parseFloat(amount) > 0 && (
            <p className="text-gray-400 text-sm mt-2">
              ≈ ${(parseFloat(amount) * 150).toFixed(2)} USD
            </p>
          )}
        </div>

        {/* QR Code */}
        <div className="bg-white p-8 rounded-2xl mb-6 flex items-center justify-center">
          <QRCodeSVG
            value={generatePaymentURL()}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Wallet Address */}
        <div className="bg-black/30 rounded-xl p-4 mb-4">
          <p className="text-gray-400 text-sm mb-2">Tu dirección de wallet:</p>
          <div className="flex items-center gap-2">
            <p className="text-white font-mono text-sm flex-1 break-all">
              {walletAddress}
            </p>
            <button
              onClick={copyAddress}
              className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
            >
              <i className="ri-file-copy-line text-purple-300"></i>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <p className="text-blue-300 text-sm">
            <i className="ri-information-line mr-2"></i>
            Comparte este código QR para recibir pagos en Solana. El pagador puede escanearlo con cualquier wallet compatible.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
              const url = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = 'hairy-wallet-qr.png';
              link.href = url;
              link.click();
            }
          }}
          className="py-4 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer"
        >
          <i className="ri-download-line mr-2"></i>
          Descargar QR
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Mi Wallet de Solana',
                text: `Envíame SOL a: ${walletAddress}`,
                url: generatePaymentURL()
              });
            } else {
              alert('Compartir no disponible en este navegador');
            }
          }}
          className="py-4 px-6 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer"
        >
          <i className="ri-share-line mr-2"></i>
          Compartir
        </button>
      </div>
    </div>
  );
}
