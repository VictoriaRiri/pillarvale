import { Zap, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import CurrencyCalculator from '../components/CurrencyCalculator';
import PixelTransition from '../components/PixelTransition'; // Added the import

interface LandingProps {
  isAuthenticated: boolean;
}

const LandingPage = ({ isAuthenticated }: LandingProps) => {
  const features = [
    { title: "Settlement", desc: "Proprietary rails for high-speed cross-border transactions.", icon: <Zap size={20} /> },
    { title: "Infrastructure", desc: "Automated liquidity nodes for institutional providers.", icon: <Shield size={20} /> },
    { title: "Liquidity", desc: "Pure USDC native settlement eliminates currency slippage.", icon: <Globe size={20} /> }
  ];

  return (
    <div className="relative min-h-screen pt-44 pb-32 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">

        {/* HERO SECTION */}
        <section className="flex flex-col items-center">
          <h1 className="hero-title mb-16">PILLARVALE</h1>

          {isAuthenticated ? (
            <div className="w-full max-w-4xl bg-zinc-950/40 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-3xl">
              <div className="mb-8 text-center">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.5em]">Terminal_Active</p>
              </div>
              <CurrencyCalculator />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-5 w-full max-w-md">
              {/* FIXED LINE 36 BELOW: Added the missing '>' */}
              <Link to="/login" className="flex-1 bg-white text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-center hover:bg-zinc-200 transition-all">
                Login to Account
              </Link>
              <Link to="/register" className="flex-1 border border-white/20 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-center hover:bg-white/5 transition-all">
                Register New Account
              </Link>
            </div>
          )}
        </section>

        {/* FEATURES GRID - Now with PixelTransition and Mobile Fix */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="h-[300px] w-full"> 
              <PixelTransition
                gridSize={10}
                pixelColor='#ffffff'
                animationStepDuration={0.4}
                className="rounded-[2.5rem] overflow-hidden border border-white/5"
                firstContent={
                  <div className="w-full h-full p-10 bg-zinc-900/30 backdrop-blur-xl flex flex-col items-center justify-center text-center">
                     <div className="mb-6 p-3 bg-white/5 border border-white/10 w-fit rounded-xl text-white">
                        {f.icon}
                      </div>
                      <h3 className="text-white text-lg font-bold uppercase tracking-wider">{f.title}</h3>
                  </div>
                }
                secondContent={
                  <div className="w-full h-full p-10 bg-zinc-950 flex flex-col items-center justify-center text-center">
                    <p className="text-zinc-400 text-sm leading-relaxed font-mono uppercase tracking-tight">
                      {f.desc}
                    </p>
                  </div>
                }
              />
            </div>
          ))}
        </section>

        {/* TRUST LINK SECTION */}
        <div className="flex justify-center mt-20 pb-10">
          <Link 
            to="/about" 
            className="text-zinc-500 hover:text-white transition-all text-[10px] font-mono uppercase tracking-[0.3em] flex items-center gap-3 group border border-white/5 py-4 px-8 rounded-full bg-black/20 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-zinc-500 rounded-full group-hover:bg-white animate-pulse" />
            Here's why you should trust us <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">→</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
