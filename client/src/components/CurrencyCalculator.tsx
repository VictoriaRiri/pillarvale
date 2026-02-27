import React, { useState, useEffect } from 'react';

const CurrencyCalculator = () => {
  const [amount, setAmount] = useState(5000);
  const rate = 127.00;
  const fee = 1.00;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase text-gray-400">You Send</label>
          <div className="flex items-center border-b-2 border-black py-2">
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              className="text-3xl font-bold w-full outline-none"
            />
            <span className="font-bold">USD</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Exchange Rate</span>
            <span className="font-mono">1 USD = {rate} KES</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fee</span>
            <span className="font-mono">${fee.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-400">Recipient Gets</label>
          <div className="flex items-center border-b-2 border-gray-200 py-2">
            <div className="text-3xl font-bold w-full">
              {((amount - fee) * rate).toLocaleString()}
            </div>
            <span className="font-bold text-gray-400">KES</span>
          </div>
        </div>

        <button className="w-full bg-stripe-blue text-white py-4 rounded-xl font-bold text-lg hover:brightness-110 transition shadow-lg">
          Start Settlement
        </button>
        <p className="text-center text-green-600 text-sm font-medium">
          Saving 2-4 KES vs Traditional Banks
        </p>
      </div>
    </div>
  );
};
export default CurrencyCalculator.tsx;
