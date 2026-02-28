import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const CurrencyCalculator = () => {
  const [amount, setAmount] = useState<number | string>(5000);
  const [rate, setRate] = useState(128.50);

  return (
    <div className="noir-card p-10 rounded-[3rem] w-full max-w-md">
      <div className="flex justify-between items-center mb-10">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Global Rail V1.0</span>
        <span className="text-[10px] font-mono font-bold text-black/40 italic flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
           LIVE MARKET: 1 USD = {rate} KES
        </span>
      </div>

      <div className="space-y-4 relative">
        {/* Input Box */}
        <div className="p-8 bg-gray-50/50 rounded-[2rem] border border-black/5">
          <label className="block text-[10px] font-bold text-black/30 uppercase mb-2">Transfer Amount</label>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold tracking-tighter">USD</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-5xl font-bold tracking-tighter w-full outline-none text-right"
            />
          </div>
        </div>

        {/* The Connection Icon */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
          <div className="w-12 h-12 bg-white rounded-full border border-black/5 shadow-xl flex items-center justify-center">
            <ArrowDown size={20} className="text-black/20" />
          </div>
        </div>

        {/* Output Box */}
        <div className="p-8 bg-black rounded-[2rem] text-white">
          <label className="block text-[10px] font-bold text-white/30 uppercase mb-2">Recipient Receives</label>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold tracking-tighter">KES</span>
            <div className="text-5xl font-bold tracking-tighter w-full text-right truncate">
              {(Number(amount) * rate).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <button className="w-full mt-8 bg-black text-white py-6 rounded-3xl font-bold text-xl hover:bg-zinc-800 transition-all active:scale-[0.98]">
        Initialize Settlement
      </button>
    </div>
  );
};

export default CurrencyCalculator;
