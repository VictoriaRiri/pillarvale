import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface AuthProps {
  setIsAuthenticated: (val: boolean) => void;
}

const RegisterPage = ({ setIsAuthenticated }: AuthProps) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate node registration
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6">
      <div className="w-full max-w-md bg-zinc-950/50 border border-white/10 p-12 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
        <h2 className="glitch-text text-4xl mb-8 italic text-center text-white">Register_Node</h2>
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-4">Gmail_Anchor</label>
            <input 
              required
              type="email"
              placeholder="user@gmail.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-mono text-white focus:border-white/30 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] hover:bg-zinc-200 transition-all">
            Provision_Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
            Already_Have_Access?_Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;