import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  from_address: string;
  to_address: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  signature: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' ? true : tx.type === filter
  );

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
        <i className="ri-loader-4-line animate-spin text-4xl text-white"></i>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
            filter === 'all'
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('receive')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
            filter === 'receive'
              ? 'bg-green-500/20 text-green-300'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <i className="ri-arrow-down-line mr-2"></i>
          Recibidas
        </button>
        <button
          onClick={() => setFilter('send')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
            filter === 'send'
              ? 'bg-red-500/20 text-red-300'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <i className="ri-arrow-up-line mr-2"></i>
          Enviadas
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <i className="ri-file-list-line text-6xl text-gray-600 mb-4"></i>
            <p className="text-gray-400">No hay transacciones aún</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 hover:bg-white/5 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      tx.type === 'receive' 
                        ? 'bg-green-500/20' 
                        : 'bg-red-500/20'
                    }`}>
                      <i className={`text-xl ${
                        tx.type === 'receive'
                          ? 'ri-arrow-down-line text-green-400'
                          : 'ri-arrow-up-line text-red-400'
                      }`}></i>
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {tx.type === 'receive' ? 'Recibido' : 'Enviado'}
                      </p>
                      <p className="text-gray-400 text-sm font-mono">
                        {tx.type === 'receive' 
                          ? `De: ${tx.from_address.slice(0, 8)}...${tx.from_address.slice(-8)}`
                          : `A: ${tx.to_address.slice(0, 8)}...${tx.to_address.slice(-8)}`
                        }
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(tx.created_at).toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      tx.type === 'receive' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tx.type === 'receive' ? '+' : '-'}{tx.amount.toFixed(4)} SOL
                    </p>
                    <div className="flex items-center gap-2 justify-end mt-1">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tx.status === 'completed' 
                          ? 'bg-green-500/20 text-green-300'
                          : tx.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {tx.status === 'completed' ? 'Completada' : 
                         tx.status === 'pending' ? 'Pendiente' : 'Fallida'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
