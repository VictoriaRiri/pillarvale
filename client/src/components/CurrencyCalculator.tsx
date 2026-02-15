import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const CurrencyCalculator = () => {
  const [amount, setAmount] = useState<string>("1000");
  const rates = { USDC: 1, KES: 128.5, NGN: 1550, EUR: 0.92 };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Input Side */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-2">Send_Amount</label>
          <div className="relative">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-mono text-xl focus:outline-none focus:border-white/30 transition-all"
              placeholder="0.00"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black font-mono">USDC</div>
          </div>
        </div>

        {/* Output Side */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-2">Estimated_Receive (KES)</label>
          <div className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 font-mono text-xl text-green-500">
            {(Number(amount) * rates.KES).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          <ArrowRightLeft size={12} />
          Rate: 1 USDC = 128.50 KES
        </div>
        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          Slippage: 0.01%
        </div>
      </div>
    </div>
  );
};

export default CurrencyCalculator;