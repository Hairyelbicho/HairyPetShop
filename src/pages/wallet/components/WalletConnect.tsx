import { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { supabase } from '../../../utils/supabase';

export default function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    loadWalletFromDB();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      fetchBalance();
    }
  }, [walletAddress]);

  const loadWalletFromDB = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('wallet_addresses')
        .select('address')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setWalletAddress(data.address);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const fetchBalance = async () => {
    if (!walletAddress) return;
    
    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'));
      const publicKey = new PublicKey(walletAddress);
      const balanceInLamports = await connection.getBalance(publicKey);
      setBalance(balanceInLamports / 1e9); // Convert to SOL
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectPhantom = async () => {
    setConnecting(true);
    try {
      const { solana } = window as any;
      
      if (!solana?.isPhantom) {
        alert('Por favor instala Phantom Wallet desde https://phantom.app');
        window.open('https://phantom.app', '_blank');
        return;
      }

      const response = await solana.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);

      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('wallet_addresses')
          .upsert({
            user_id: user.id,
            address: address,
            wallet_type: 'phantom',
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error connecting Phantom:', error);
      alert('Error al conectar con Phantom Wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const { solana } = window as any;
      if (solana) {
        await solana.disconnect();
      }
      setWalletAddress(null);
      setBalance(0);

      // Remove from database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('wallet_addresses')
          .delete()
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  if (walletAddress) {
    return (
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <i className="ri-wallet-3-fill text-white text-xl"></i>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Wallet Conectada</p>
              <p className="text-white font-mono text-sm">
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
              </p>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            <i className="ri-link-unlink mr-2"></i>
            Desconectar
          </button>
        </div>
        
        <div className="bg-black/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Balance Total</p>
          <p className="text-3xl font-bold text-white">
            {balance.toFixed(4)} SOL
          </p>
          <p className="text-gray-400 text-sm mt-1">
            ≈ ${(balance * 150).toFixed(2)} USD
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/10 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="ri-wallet-3-line text-white text-4xl"></i>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Conecta tu Wallet</h3>
      <p className="text-gray-400 mb-6">
        Conecta tu wallet de Solana para empezar a realizar transacciones
      </p>
      
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        <button
          onClick={connectPhantom}
          disabled={connecting}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
        >
          {connecting ? (
            <>
              <i className="ri-loader-4-line animate-spin mr-2"></i>
              Conectando...
            </>
          ) : (
            <>
              <i className="ri-ghost-smile-line mr-2"></i>
              Conectar con Phantom
            </>
          )}
        </button>
        
        <button
          className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer"
          onClick={() => alert('Próximamente: Soporte para más wallets')}
        >
          <i className="ri-wallet-line mr-2"></i>
          Otras Wallets
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <p className="text-blue-300 text-sm">
          <i className="ri-information-line mr-2"></i>
          ¿No tienes Phantom? <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200 cursor-pointer">Descárgala aquí</a>
        </p>
      </div>
    </div>
  );
}
