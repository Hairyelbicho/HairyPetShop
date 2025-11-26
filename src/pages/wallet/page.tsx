import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import WalletConnect from './components/WalletConnect';
import WalletBalance from './components/WalletBalance';
import TransactionHistory from './components/TransactionHistory';
import QRPayment from './components/QRPayment';

export default function WalletPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'balance' | 'transactions' | 'qr'>('balance');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/wallet/login');
        return;
      }
      setUser(session.user);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/wallet/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/wallet/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">
          <i className="ri-loader-4-line animate-spin text-4xl"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <i className="ri-wallet-3-fill text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-white">HairyWallet</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/hairy-home')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-home-4-line mr-2"></i>
                Inicio
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-logout-box-line mr-2"></i>
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.email}</h2>
              <p className="text-gray-400 text-sm">Usuario verificado</p>
            </div>
          </div>
        </div>

        {/* Wallet Connect */}
        <WalletConnect />

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('balance')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'balance'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <i className="ri-wallet-3-line mr-2"></i>
            Balance
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <i className="ri-exchange-line mr-2"></i>
            Transacciones
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <i className="ri-qr-code-line mr-2"></i>
            Pagar con QR
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'balance' && <WalletBalance />}
        {activeTab === 'transactions' && <TransactionHistory />}
        {activeTab === 'qr' && <QRPayment />}
      </main>
    </div>
  );
}
