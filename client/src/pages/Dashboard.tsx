import { Trash2, Wallet } from 'lucide-react';

const Dashboard = ({ balance, transactions, setTransactions }: any) => {
  const removeTransaction = (id: number) => {
    setTransactions(transactions.filter((tx: any) => tx.id !== id));
  };

  return (
    <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto space-y-12 relative z-10">
      <div className="bg-white text-black p-12 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-lg">
              <Wallet size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Wallet_Account_Total</span>
          </div>
          <h2 className="glitch-text text-7xl md:text-8xl italic tracking-tighter leading-none">
            ${balance.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="bg-zinc-950/50 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="glitch-text text-3xl italic">LEDGER_LOG</h2>
          <button onClick={() => setTransactions([])} className="text-[10px] text-zinc-600 hover:text-red-500 uppercase tracking-widest font-black transition-colors">Wipe_All</button>
        </div>

        <div className="space-y-4">
          {transactions.map((tx: any) => (
            <div key={tx.id} className="group flex items-center justify-between p-7 rounded-2rem bg-white/2 border border-white/5 hover:bg-white/5 transition-all">
              <div className="flex flex-col">
                <span className="font-black text-white uppercase italic tracking-tight text-2xl leading-none mb-1">{tx.name}</span>
                <span className="text-[10px] text-zinc-600 font-mono tracking-tighter">{tx.date}</span>
              </div>
              <div className="flex items-center gap-10">
                <div className="text-right">
                  <p className="font-black text-2xl tracking-tighter text-white">${Math.abs(tx.amount).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => removeTransaction(tx.id)}
                  className="p-3 bg-red-500/0 hover:bg-red-500/10 text-zinc-700 hover:text-red-500 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;