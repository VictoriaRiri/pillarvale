import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, ArrowRight } from 'lucide-react';

interface AuthProps {
  setIsAuthenticated: (val: boolean) => void;
}

const RegisterPage = ({ setIsAuthenticated }: AuthProps) => {
  const [role, setRole] = useState<'personal' | 'enterprise'>('personal');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 relative z-10">
      <div className="w-full max-w-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-2xl p-12 rounded-[2.5rem] shadow-2xl">
        
        <header className="mb-10">
          <h1 className="glitch-text text-5xl italic mb-2">CREATE ACCOUNT</h1>
          <p className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Select your primary role</p>
        </header>

        {/* ROLE SELECTOR FROM SCREENSHOT */}
        <div className="flex p-1 bg-black/40 rounded-2xl mb-12 border border-white/5">
          <button 
            onClick={() => setRole('personal')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-300 font-black text-xs uppercase tracking-widest ${role === 'personal' ? 'bg-[#F2A93B] text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            <User size={16} /> Personal User
          </button>
          <button 
            onClick={() => setRole('enterprise')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-300 font-black text-xs uppercase tracking-widest ${role === 'enterprise' ? 'bg-[#1E3A8A] text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            <Building2 size={16} /> Enterprise
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase ml-2 tracking-tighter">
                {role === 'personal' ? 'Full Legal Name' : 'Company Name'}
              </label>
              <input required type="text" placeholder={role === 'personal' ? 'Johnathan Doe' : 'Entity Legal Name'} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:border-white/30 outline-none transition-all placeholder:text-zinc-700" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase ml-2 tracking-tighter">
                {role === 'personal' ? 'Email Identity' : 'Business Email'}
              </label>
              <input required type="email" placeholder="name@domain.com" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:border-white/30 outline-none transition-all placeholder:text-zinc-700" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase ml-2 tracking-tighter">Security Access Key</label>
            <input required type="password" placeholder="••••••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:border-white/30 outline-none transition-all tracking-[0.5em]" />
          </div>

          <button type="submit" className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 transition-all hover:scale-[1.01] active:scale-[0.98] ${role === 'personal' ? 'bg-[#F2A93B] text-black shadow-[0_0_30px_rgba(242,169,59,0.2)]' : 'bg-[#1E3A8A] text-white shadow-[0_0_30px_rgba(30,58,138,0.3)]'}`}>
            Initialize Account <ArrowRight size={20} />
          </button>
        </form>

        <footer className="mt-12 text-center">
          <Link to="/login" className="text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-colors">
            Already Registered? <span className="text-white border-b border-white/20 pb-1">Login to Portal</span>
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default RegisterPage;
