import React, { useState, useEffect } from 'react';

const Loader = ({ onFinished }: { onFinished: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinished, 500); // Slight delay for smooth exit
          return 100;
        }
        return prev + 1;
      });
    }, 30); // Speed of the count

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-xs space-y-4">
        <div className="flex justify-between items-end">
          <span className="font-bold tracking-tighter text-2xl">PILLARVALE</span>
          <span className="font-mono text-sm font-bold text-stripe-blue">{progress}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
          <div 
            className="h-full bg-black transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold animate-pulse">
          Initializing Blockchain Rails
        </p>
      </div>
    </div>
  );
};

export default Loader;
