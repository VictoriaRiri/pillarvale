export const PillNav = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 px-6 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
        <img src="/logo.png" alt="PillarVale" className="h-6 w-auto" />
        <div className="hidden md:flex gap-5 text-[10px] uppercase tracking-widest font-bold text-gray-400">
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#network" className="hover:text-white transition-colors">Network</a>
        </div>
        <button className="px-5 py-2 rounded-full bg-white text-black text-xs font-black hover:scale-105 transition-transform">
          Get Started
        </button>
      </div>
    </nav>
  );
};