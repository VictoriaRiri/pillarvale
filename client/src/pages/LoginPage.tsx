import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
      alert("ACCESS_DENIED: INVALID_NODE_KEY");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6">
      <div className="w-full max-w-md bg-zinc-950/50 border border-white/10 p-12 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
        <h2 className="glitch-text text-4xl mb-8 italic text-center text-white">Node_Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-4">Access_Key</label>
            <input 
              autoFocus
              type="password"
              placeholder="••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-center font-mono text-white text-2xl tracking-[1em] focus:border-white/30 outline-none transition-all"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          
          <button type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] hover:bg-zinc-200 transition-all">
            Authorize_Entry
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/register" className="text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
            Request_New_Node_Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;