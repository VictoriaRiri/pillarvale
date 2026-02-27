import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Zap } from 'lucide-react';

const PillNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Initialize', path: '/initialize', icon: <Zap size={18} /> },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-1.5 rounded-full shadow-2xl flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              location.pathname === item.path 
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-500 hover:text-black hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span className="hidden md:inline">{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default PillNav;
