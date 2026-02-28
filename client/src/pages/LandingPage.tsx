import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PillNav from '../components/PillNav';
import CurrencyCalculator from '../components/CurrencyCalculator';
import About from './About';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user'); 
    if (user) setIsLoggedIn(true);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <PillNav />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Editorial Style Copy */}
          <div className="lg:col-span-7 space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-[clamp(3.5rem,8vw,6rem)] font-bold tracking-[-0.04em] leading-[0.9] mb-8">
                The new <br />
                <span className="text-black/20 italic font-serif">standard</span> <br />
                for liquidity.
              </h1>
              <p className="text-xl md:text-2xl text-black/50 max-w-lg leading-relaxed font-medium">
                PillarVale bridges the gap between traditional banking and blockchain rails. 15-minute global settlements.
              </p>
            </motion.div>

            {!isLoggedIn && (
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => navigate('/login')}
                  className="h-14 px-10 bg-black text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-black/20"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="text-black font-bold border-b-2 border-black/10 hover:border-black transition-colors pb-1"
                >
                  Contact Sales
                </button>
              </div>
            )}
          </div>

          {/* Right Side: The Interactive Component */}
          <div className="lg:col-span-5 relative">
            {/* Soft Glow Background */}
            <div className="absolute -inset-20 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              {isLoggedIn ? (
                <CurrencyCalculator />
              ) : (
                <div className="noir-card p-12 rounded-[3rem] text-center space-y-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl mx-auto flex items-center justify-center border border-black/5">
                    <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                  </div>
                  <h3 className="font-bold text-xl tracking-tight text-black/40">Secure Node Access</h3>
                  <p className="text-sm text-black/30">Connect your account to access real-time <br/> liquidity and settlement tools.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <About />
      
      {/* Editorial Footer Marquee */}
      <footer className="bg-black py-20 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-[12vw] font-black tracking-tighter text-white/10 uppercase italic mx-10 leading-none">
              PillarVale
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
