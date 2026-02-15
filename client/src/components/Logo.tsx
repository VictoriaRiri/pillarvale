// client/src/components/Logo.tsx
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      {/* This pulls from public/favicon.ico */}
      <img 
        src="/favicon.ico" 
        alt="Pillarvale Logo" 
        className="w-8 h-8 object-contain group-hover:rotate-12 transition-transform"
      />
      <span className="font-black tracking-[0.3em] text-sm uppercase glitch-text">
        Pillarvale
      </span>
    </Link>
  );
};

export default Logo;