import { ShieldCheck, Zap, Coins, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative z-10 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors uppercase text-[10px] tracking-[0.2em]">
        <ArrowLeft size={16} /> Return to Terminal
      </Link>

      <header className="mb-20">
        <h1 className="text-6xl font-bold uppercase tracking-tighter italic mb-6">WHY PILLARVALE?</h1>
        <p className="text-xl text-zinc-400 leading-relaxed font-light">
          We are rebuilding the Asia-Africa financial corridor. No more 5-day waits, no more hidden bank fees. Just pure, instant infrastructure.
        </p>
      </header>

      <div className="space-y-12">
        {/* Feature 1: Rate Locking */}
        <section className="glass-section">
          <div className="flex items-center gap-4 mb-4 text-[#F2A93B]">
            <Lock size={32} />
            <h2 className="text-2xl font-bold uppercase italic">The 30-Day Rate Lock</h2>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            Exchange rates can crash in seconds. With Pillarvale, you can "freeze" a favorable rate for up to 30 days. We use automated hedging to ensure that the rate you see today is the rate you get next month.
          </p>
        </section>

        {/* Feature 2: Speed */}
        <section className="glass-section">
          <div className="flex items-center gap-4 mb-4 text-blue-400">
            <Zap size={32} />
            <h2 className="text-2xl font-bold uppercase italic">15-Minute Settlement</h2>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            Banks move money like it's 1980. We move it like it's the future. By using the XRP Ledger and Base L2 networks, we settle transactions in under 15 minutes instead of the traditional 3–5 days.
          </p>
        </section>

        {/* Feature 3: Better Rates */}
        <section className="glass-section">
          <div className="flex items-center gap-4 mb-4 text-emerald-400">
            <Coins size={32} />
            <h2 className="text-2xl font-bold uppercase italic">Eliminating the Bank Tax</h2>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            Our technology allows us to offer rates that are consistently 2–4 KES better per USD than traditional banks. By cutting out the middlemen, we keep that value in your pocket.
          </p>
        </section>

        {/* Feature 4: Security */}
        <section className="glass-section">
          <div className="flex items-center gap-4 mb-4 text-zinc-400">
            <ShieldCheck size={32} />
            <h2 className="text-2xl font-bold uppercase italic">Institutional Security</h2>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            Your trust is our foundation. We utilize AWS KMS for secure key management and maintain a blockchain audit trail for every single cent moved, ensuring total transparency and safety.
          </p>
        </section>
      </div>

      <footer className="mt-20 text-center border-t border-white/5 pt-12">
        <p className="text-zinc-500 text-sm mb-8 uppercase tracking-widest">Ready to initialize?</p>
        <Link to="/register" className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all">
          Provision Node Access
        </Link>
      </footer>
    </div>
  );
};

export default AboutPage;
