import React from 'react';
import { Trash2, Wallet, ArrowUpRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const Dashboard = ({ balance, transactions, setTransactions }: any) => {
  
  const removeTransaction = (id: number) => {
    setTransactions(transactions.filter((tx: any) => tx.id !== id));
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'in process':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header / Balance Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stripe-blue font-bold text-xs uppercase tracking-widest">
              <Wallet size={14} />
              Available Balance
            </div>
            <h1 className="text-6xl font-bold tracking-tighter text-noir-black">
              ${balance?.toLocaleString() ?? '0.00'}
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-lg shadow-black/10">
              Add Funds
            </button>
            <button 
              onClick={() => setTransactions([])}
              className="px-6 py-3 rounded-xl font-bold text-sm border border-gray-200 hover:bg-red-50 hover:text-red-600 transition"
            >
              Clear Ledger
            </button>
          </div>
        </header>

        {/* Transaction Ledger */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-noir-black">Transaction Ledger</h3>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
              {transactions.length} Total Activities
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Recipient / Details</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4 text-right">Amount (USD)</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx: any) => (
                  <tr key={tx.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(tx.status || 'Delivered')}`}>
                        {tx.status === 'Failed' ? <AlertCircle size={12}/> : tx.status === 'In Process' ? <Clock size={12}/> : <CheckCircle2 size={12}/>}
                        {tx.status || 'Delivered'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-noir-black uppercase text-sm tracking-tight">{tx.name || 'Global Settlement'}</div>
                      <div className="text-xs text-gray-400 font-mono">ID: #{tx.id.toString().slice(-4)}</div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                      {tx.date}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="font-bold text-noir-black text-lg tracking-tighter">
                        ${Math.abs(tx.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => removeTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-400 italic">
                      No recent transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
