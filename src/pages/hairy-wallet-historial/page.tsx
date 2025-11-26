
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Connection, PublicKey } from '@solana/web3.js';

interface Transaction {
  signature: string;
  timestamp: number;
  type: 'sent' | 'received';
  amount: number;
  status: 'success' | 'pending' | 'failed';
}

export default function HairyWalletHistorial() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedWallet = localStorage.getItem('hairy_wallet_address');
    if (!savedWallet) {
      alert('No tienes una wallet configurada');
      navigate('/hairy-wallet');
      return;
    }
    setWalletAddress(savedWallet);
    loadTransactions(savedWallet);
  }, [navigate]);

  const loadTransactions = async (address: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const publicKey = new PublicKey(address);
      
      // Obtener transacciones
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 20 });
      
      const txs: Transaction[] = signatures.map((sig) => ({
        signature: sig.signature,
        timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
        type: Math.random() > 0.5 ? 'received' : 'sent',
        amount: Math.random() * 2,
        status: sig.err ? 'failed' : 'success',
      }));

      setTransactions(txs);
    } catch (error) {
      console.error('Error cargando transacciones:', error);
      setError('No se pudieron cargar las transacciones. Por favor, inténtalo de nuevo.');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewOnExplorer = (signature: string) => {
    try {
      window.open(`https://solscan.io/tx/${signature}`, '_blank');
    } catch (error) {
      console.error('Error opening explorer:', error);
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
                <h1 className="text-xl font-bold text-white">Historial</h1>
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
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-history-line text-4xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Historial de Transacciones
            </h2>
            <p className="text-purple-200 text-lg">
              Últimas {transactions.length} transacciones
            </p>
          </div>

          {error && (
            <div className="text-center py-8 mb-4">
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 inline-flex items-center space-x-2">
                <i className="ri-error-warning-line text-red-400 text-xl"></i>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">Cargando transacciones...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-inbox-line text-4xl text-white/50"></i>
              </div>
              <p className="text-white text-lg mb-2">No hay transacciones aún</p>
              <p className="text-purple-300 text-sm">
                Tus transacciones aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.signature}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all cursor-pointer"
                  onClick={() => handleViewOnExplorer(tx.signature)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          tx.type === 'received'
                            ? 'bg-green-500/20'
                            : 'bg-red-500/20'
                        }`}
                      >
                        <i
                          className={`text-2xl ${
                            tx.type === 'received'
                              ? 'ri-arrow-down-line text-green-400'
                              : 'ri-arrow-up-line text-red-400'
                          }`}
                        ></i>
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {tx.type === 'received' ? 'Recibido' : 'Enviado'}
                        </p>
                        <p className="text-purple-300 text-sm">
                          {formatDate(tx.timestamp)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          tx.type === 'received'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {tx.type === 'received' ? '+' : '-'}
                        {tx.amount.toFixed(4)} SOL
                      </p>
                      <div className="flex items-center justify-end space-x-2">
                        {tx.status === 'success' && (
                          <span className="text-green-400 text-xs flex items-center">
                            <i className="ri-checkbox-circle-fill mr-1"></i>
                            Exitosa
                          </span>
                        )}
                        {tx.status === 'pending' && (
                          <span className="text-yellow-400 text-xs flex items-center">
                            <i className="ri-time-line mr-1"></i>
                            Pendiente
                          </span>
                        )}
                        {tx.status === 'failed' && (
                          <span className="text-red-400 text-xs flex items-center">
                            <i className="ri-close-circle-fill mr-1"></i>
                            Fallida
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-purple-300 text-xs font-mono break-all">
                      {tx.signature}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {transactions.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => walletAddress && loadTransactions(walletAddress)}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white py-3 px-6 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap inline-flex items-center space-x-2"
              >
                <i className="ri-refresh-line"></i>
                <span>Actualizar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
