import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 px-6 py-3 rounded-full shadow-xl flex items-center gap-8">
        <div className="font-bold text-xl tracking-tighter">PILLARVALE</div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-black transition">Solutions</a>
          <a href="#" className="hover:text-black transition">Developers</a>
          <a href="#" className="hover:text-black transition">Company</a>
        </div>
        <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition">
          Sign In
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
