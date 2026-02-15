import { Link, useLocation } from 'react-router-dom';

interface PillNavProps {
  isAuthenticated: boolean;
}

const PillNav = ({ isAuthenticated }: PillNavProps) => {
  const location = useLocation();

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-100 w-auto">
      <div className="bg-black/60 backdrop-blur-3xl border border-white/10 p-2 rounded-full flex items-center gap-1 shadow-2xl">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 pl-4 pr-3 border-r border-white/10 group">
          <img src="/favicon.ico" alt="PV" className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        </Link>

        {/* Home Button */}
        <Link 
          to="/" 
          className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            location.pathname === '/' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Home
        </Link>

        {/* Conditional Buttons: Only show if Logged In */}
        {isAuthenticated && (
          <>
            <Link 
              to="/dashboard" 
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                location.pathname === '/dashboard' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Account
            </Link>
            
            <Link 
              to="/send" 
              className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all ml-1 shadow-md"
            >
              Initialize
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PillNav;