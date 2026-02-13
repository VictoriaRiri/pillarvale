import { Zap, Globe, Shield, ArrowRight } from 'lucide-react';
import { PillNav } from './components/PillNav';
import { CurrencyCalculator } from './components/CurrencyCalculator';

function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans">
      <PillNav />

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Blockchain Settlement Rails
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter">
            Stop losing 5–10% on <br />
            <span className="text-gray-500">cross-border payments.</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
            PillarVale uses blockchain settlement rails to help businesses move money globally in <span className="text-white font-bold">15 minutes</span>, not 3-7 days.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <CurrencyCalculator />
        </div>
      </header>

      {/* Magic Bento Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[300px]">
          <div className="md:col-span-8 bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-indigo-500/50 transition-all">
            <Globe className="text-indigo-500" size={40} />
            <div>
              <h3 className="text-3xl font-bold mb-2">Global Liquidity</h3>
              <p className="text-gray-500 max-w-md text-lg">Direct settlement via XRP and AAVE protocols for instant reach.</p>
            </div>
          </div>

          <div className="md:col-span-4 bg-indigo-600 rounded-[3rem] p-10 flex flex-col justify-between">
            <Zap size={40} fill="white" />
            <h3 className="text-5xl font-black italic">15 MINS</h3>
            <p className="font-bold uppercase tracking-tighter">Average Delivery</p>
          </div>

          <div className="md:col-span-4 bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center">
            <Shield className="text-emerald-500 mb-4" size={48} />
            <h3 className="text-xl font-bold">Bank-Grade Security</h3>
          </div>

          <div className="md:col-span-8 bg-white text-black rounded-[3rem] p-10 flex items-center justify-between group cursor-pointer">
            <h3 className="text-4xl font-bold">Modernize your <br/> cash flow.</h3>
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center transition-transform group-hover:translate-x-2">
              <ArrowRight className="text-white" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;