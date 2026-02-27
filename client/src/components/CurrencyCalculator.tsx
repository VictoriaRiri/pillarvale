import React, { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

const CurrencyCalculator = () => {
  // Amount defaults to 5000, but is fully editable by the user
  const [amount, setAmount] = useState<number | string>(5000);
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch Live Market Rate
  const fetchLiveRate = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await response.json();
      if (data.rates && data.rates.KES) {
        setRate(data.rates.KES);
      }
    } catch (error) {
      console.error("Market data fetch failed:", error);
      setRate(128.50); // Fallback rate if API fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRate();
  }, []);

  // Calculate conversion
  const conversionResult = Number(amount) * rate;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 w-full max-w-md animate-in fade-in zoom-in duration-500">
      <div className="space-y-6">
        
        {/* Market Status Header */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-stripe-blue">Live Market Data</span>
          <button 
            onClick={fetchLiveRate}
            className="flex items-center gap-2 group"
          >
            <RefreshCcw size={12} className={`text-gray-400 group-hover:text-black transition-all ${loading ? 'animate-spin' : ''}`} />
            <span className="font-mono text-xs font-bold text-noir-black">
              1 USD = {loading ? '...' : rate.toFixed(2)} KES
            </span>
          </button>
        </div>

        {/* Input Field (User Toggles This) */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Amount to Send</label>
          <div className="relative group">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full text-5xl font-bold py-2 outline-none border-b-2 border-gray-100 focus:border-black transition-colors bg-transparent text-noir-black"
            />
            <span className="absolute right-0 bottom-3 font-bold text-gray-400 group-focus-within:text-black transition-colors">USD</span>
          </div>
        </div>

        {/* Live Conversion Output */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Recipient Receives</label>
          <div className="flex justify-between items-end border-b border-gray-50 pb-2">
            <span className={`text-5xl font-bold tracking-tighter ${loading ? 'text-gray-200' : 'text-noir-black'}`}>
              {loading ? '---' : conversionResult.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className="font-bold text-gray-400">KES</span>
          </div>
        </div>

        {/* Summary Details */}
        <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-400">Guaranteed Rate</span>
            <span className="text-noir-black font-bold">15 Minutes</span>
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-400">Processing Fee</span>
            <span className="text-green-600 font-bold">$0.00 USD</span>
          </div>
        </div>

        <button 
          disabled={loading || !amount}
          className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-xl active:scale-[0.98] disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Initialize Settlement
        </button>
      </div>
    </div>
  );
};

export default CurrencyCalculator;
