import { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { supabase } from '../../../utils/supabase';

export default function WalletBalance() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
        await fetchBalance(data.address);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async (address: string) => {
    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'));
      const publicKey = new PublicKey(address);
      const balanceInLamports = await connection.getBalance(publicKey);
      setBalance(balanceInLamports / 1e9);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleRefresh = async () => {
    if (!walletAddress) return;
    setRefreshing(true);
    await fetchBalance(walletAddress);
    setRefreshing(false);
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
        <i className="ri-wallet-line text-6xl text-gray-600 mb-4"></i>
        <p className="text-gray-400">Conecta tu wallet para ver el balance</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Balance Principal</h3>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all cursor-pointer"
          >
            <i className={`ri-refresh-line text-white ${refreshing ? 'animate-spin' : ''}`}></i>
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-5xl font-bold text-white mb-2">
            {balance.toFixed(4)} <span className="text-3xl text-purple-300">SOL</span>
          </p>
          <p className="text-2xl text-gray-300">
            ≈ ${(balance * 150).toFixed(2)} USD
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button className="py-3 px-4 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer">
            <i className="ri-arrow-down-line mr-2"></i>
            Recibir
          </button>
          <button className="py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer">
            <i className="ri-arrow-up-line mr-2"></i>
            Enviar
          </button>
          <button className="py-3 px-4 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer">
            <i className="ri-exchange-line mr-2"></i>
            Swap
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-down-line text-green-400"></i>
            </div>
            <p className="text-gray-400">Recibido</p>
          </div>
          <p className="text-2xl font-bold text-white">+2.45 SOL</p>
          <p className="text-sm text-gray-400">Este mes</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-up-line text-red-400"></i>
            </div>
            <p className="text-gray-400">Enviado</p>
          </div>
          <p className="text-2xl font-bold text-white">-1.23 SOL</p>
          <p className="text-sm text-gray-400">Este mes</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <i className="ri-exchange-line text-blue-400"></i>
            </div>
            <p className="text-gray-400">Transacciones</p>
          </div>
          <p className="text-2xl font-bold text-white">47</p>
          <p className="text-sm text-gray-400">Total</p>
        </div>
      </div>
    </div>
  );
}
