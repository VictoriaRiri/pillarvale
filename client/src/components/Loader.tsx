import { useState, useEffect } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

const Loader = ({ onComplete }: LoaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-999 bg-black flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-5xl flex flex-col items-center space-y-16">
        
        {/* USES THE NEW RESPONSIVE HERO-TITLE CLASS */}
        <h1 className="hero-title animate-pulse">PILLARVALE</h1>
        
        <div className="w-full max-w-md space-y-5">
          <div className="flex justify-between items-end font-mono text-[9px] tracking-[0.4em] text-zinc-600 uppercase">
            <span>Synchronizing_Nodes</span>
            <span className="text-white text-xl font-bold">{progress}%</span>
          </div>
          
          <div className="w-full h-px bg-white/10 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-white shadow-[0_0_20px_white] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;