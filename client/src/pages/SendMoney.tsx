import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Zap } from 'lucide-react';

const SendMoney = ({ balance, setBalance, setTransactions }: any) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleAuthorize = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return alert("INVALID_AMOUNT");
    if (numAmount > balance) return alert("INSUFFICIENT_LIQUIDITY");

    // Process Transaction
    setBalance((prev: number) => prev - numAmount);
    setTransactions((prev: any) => [
      {
        id: Date.now(),
        name: recipient || 'UNKNOWN_NODE',
        amount: -numAmount,
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        status: 'SETTLED'
      },
      ...prev
    ]);

    alert("PROTOCOL_SUCCESS: SETTLEMENT_AUTHORIZED");
    navigate('/dashboard');
  };

  return (
    <div className="pt-40 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Return_to_Node</span>
        </button>

        <div className="bg-zinc-950/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 space-y-10">
          <div className="text-center">
            <h2 className="glitch-text text-4xl mb-2">Initialize_Settlement</h2>
            <p className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase">Secure_Gateway_Active</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-4">Recipient_Node_Address</label>
              <input 
                type="text" 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="PV-XXXX-XXXX"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-mono text-white focus:outline-none focus:border-white/30 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-4">Settlement_Amount (USDC)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 font-mono text-4xl text-center focus:outline-none focus:border-white/30 transition-all"
              />
              <p className="text-center text-[10px] text-zinc-600 mt-2 font-mono">AVAILABLE: ${balance.toLocaleString()}</p>
            </div>
          </div>

          <button 
            onClick={handleAuthorize}
            className="w-full bg-white text-black py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 group"
          >
            Authorize_Transaction
            <Zap size={18} className="group-hover:scale-125 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-2 text-zinc-600">
            <ShieldCheck size={14} />
            <span className="text-[9px] font-mono uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;