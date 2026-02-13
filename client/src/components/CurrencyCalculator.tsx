import { useState } from 'react';

export const CurrencyCalculator = () => {
  const [amount, setAmount] = useState(5000);
  const rate = 127.00; 

  return (
    <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
      <div className="space-y-6">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-2">YOU SEND</label>
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-transparent text-3xl font-bold outline-none w-full text-white"
            />
            <span className="text-xl font-bold text-gray-400">USD</span>
          </div>
        </div>

        <div className="border-l-2 border-indigo-500/30 ml-6 py-1 px-4 text-sm">
          <div className="flex justify-between text-gray-400"><span>Exchange Rate</span><span className="text-white">1 USD = {rate.toFixed(2)} KES</span></div>
          <div className="flex justify-between text-gray-400"><span>Processing Fee</span><span className="text-emerald-400">$1.00</span></div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-2">RECIPIENT GETS</label>
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="text-3xl font-bold text-white">
              {((amount - 1) * rate).toLocaleString()}
            </div>
            <span className="text-xl font-bold text-gray-400">KES</span>
          </div>
          <p className="text-[11px] text-emerald-500/80 font-medium mt-3 text-center">
            Saving 17,500 KES vs Banks
          </p>
        </div>

        <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-gray-200 transition-all">
          Start Settlement
        </button>
      </div>
    </div>
  );
};