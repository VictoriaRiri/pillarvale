import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowRight } from 'lucide-react';

interface AuthProps {
  setIsAuthenticated: (val: boolean) => void;
}

const LoginPage = ({ setIsAuthenticated }: AuthProps) => {
  const [key, setKey] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === '7700') {
      setIsAuthenticated(true);
      navigate('/dashboard');
    } else {
      alert("ACCESS_DENIED");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
      <div className="w-full max-w-md bg-zinc-900/40 border border-white/5 backdrop-blur-2xl p-12 rounded-[2.5rem] shadow-2xl">
        <header className="mb-12 text-center">
          <h1 className="glitch-text text-5xl italic mb-2">PORTAL ACCESS</h1>
          <p className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Provide 4-digit Security Key</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-6 text-zinc-700">
              <KeyRound size={40} strokeWidth={1} />
            </div>
            <input 
              autoFocus
              type="password"
              placeholder="••••"
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-center font-mono text-white text-3xl tracking-[0.8em] focus:border-white/30 outline-none transition-all shadow-inner"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          
          <button type="submit" className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 hover:bg-zinc-200 transition-all">
            Authorize Entry <ArrowRight size={20} />
          </button>
        </form>

        <footer className="mt-12 text-center">
          <Link to="/register" className="text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-colors">
            No Account? <span className="text-white border-b border-white/20 pb-1">Create New Account</span>
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
