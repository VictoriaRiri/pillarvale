import React from 'react';
import { Wallet, Plus, ArrowUpRight, Trash2, XCircle } from 'lucide-react';

const Dashboard = ({ balance = 0, transactions = [], setTransactions }: any) => {
  
  // Function to remove a specific transaction by its ID
  const removeTransaction = (id: number | string) => {
    setTransactions(transactions.filter((tx: any) => tx.id !== id));
  };

  // Function to wipe the entire ledger
  const clearLedger = () => {
    if (window.confirm("Are you sure you want to clear the entire ledger?")) {
      setTransactions([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stripe-blue font-bold text-xs uppercase tracking-widest">
              <Wallet size={14} />
              Account Balance
            </div>
            <h1 className="text-6xl font-bold tracking-tighter text-noir-black">
              ${balance.toLocaleString()}
            </h1>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={clearLedger}
              className="flex-1 md:flex-none px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-wider border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              Clear Ledger
            </button>
            <button className="bg-black text-white p-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center">
              <Plus size={24} />
            </button>
          </div>
        </header>

        {/* Ledger Section */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm min-h-[450px] flex flex-col overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-noir-black">Activity Ledger</h3>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
              {transactions.length} Records
            </span>
          </div>
          
          <div className="flex-grow">
            {transactions.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {transactions.map((tx: any) => (
                  <div key={tx.id} className="group flex items-center justify-between p-8 hover:bg-gray-50/50 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-noir-black text-lg tracking-tight uppercase italic">
                        {tx.name || 'Settlement'}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{tx.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="font-bold text-xl tracking-tighter text-noir-black">
                          ${tx.amount?.toLocaleString()}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeTransaction(tx.id)}
                        className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                  <ArrowUpRight size={32} />
                </div>
                <div>
                  <p className="text-noir-black font-bold">No Activity Found</p>
                  <p className="text-gray-400 text-sm max-w-[200px] mx-auto">
                    Your transaction history will appear here once you start a settlement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
