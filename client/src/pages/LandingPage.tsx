import Navbar from '../components/Navbar';
import { ArrowRight, Zap, Shield, Globe2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#020617] selection:bg-primary/30 overflow-x-hidden">
            {/* Background pattern */}
            <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-10 grayscale pointer-events-none"></div>
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617] pointer-events-none"></div>

            <div className="relative z-10">
                <Navbar />

                {/* Hero Section */}
                <section className="pt-40 pb-20 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                                THE FOUNDATION FOR GLOBAL TRADE FINANCE
                            </div>

                            <h1 className="text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                                Bridge the <br />
                                Gap in <span className="text-gradient-gold">Global</span> <br />
                                <span className="text-gradient-green">Trade</span>
                            </h1>

                            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                                Stop losing 5-10% on cross-border payments. PillarVale uses blockchain settlement rails to help businesses move money globally in 15 minutes, not 3-7 days.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/register" className="btn-primary group">
                                    Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/login" className="btn-secondary">
                                    Login to Account
                                </Link>
                            </div>
                        </div>

                        {/* FX Quote Mockup */}
                        <div className="glass-panel p-8 space-y-6 max-w-md mx-auto lg:ml-auto w-full relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2.1rem] blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                            <div className="relative space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold">Instance FX Quote</h3>
                                    <span className="text-[10px] text-accent-green flex items-center gap-1 font-bold italic">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span> Live Rates
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">You Send</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-3xl font-black">5000</span>
                                            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                                <span className="text-xs font-bold">US USD</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center -my-3 relative z-10">
                                        <div className="bg-[#0F172A] p-2 rounded-full border border-white/10 shadow-xl">
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Recipient Gets</p>
                                        <div className="flex justify-between items-center text-accent-green">
                                            <span className="text-3xl font-black">635,000</span>
                                            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-white">
                                                <span className="text-xs font-bold">KE KES</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Exchange Rate</span>
                                        <span className="font-mono text-white">1 USD = 127.00 KES</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Processing Fee</span>
                                        <span className="font-mono text-white">$5.00</span>
                                    </div>
                                </div>

                                <div className="bg-secondary/10 border border-secondary/20 p-3 rounded-xl text-center">
                                    <p className="text-secondary text-xs font-bold flex items-center justify-center gap-2">
                                        <Zap className="w-3 h-3 fill-secondary" /> SAVING 17,500 KES VS BANKS
                                    </p>
                                </div>

                                <button className="btn-primary w-full py-4 rounded-xl !bg-[#0A2463] hover:!bg-[#0C2D7A]">
                                    Start Settlement
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 px-6">
                    <div className="max-w-7xl mx-auto text-center space-y-24">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black text-white">Why Businesses Choose PillarVale</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-lg">
                                Moving money at the speed of trade. We've built the blockchain infrastructure layer for global commerce.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="glass-card text-left space-y-6 group scale-100 hover:scale-[1.02]">
                                <div className="bg-secondary/10 w-16 h-16 flex items-center justify-center rounded-2xl border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                                    <Zap className="text-secondary w-8 h-8 fill-secondary" />
                                </div>
                                <h3 className="text-2xl font-bold">15-Minute Settlement</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Blockchain rails ensure funds arrive in minutes, not days. Real-time Alipay and M-Pesa settlement.
                                </p>
                            </div>

                            <div className="glass-card text-left space-y-6 group scale-100 hover:scale-[1.02]">
                                <div className="bg-primary/20 w-16 h-16 flex items-center justify-center rounded-2xl border border-primary/30 group-hover:bg-primary/40 transition-colors">
                                    <Shield className="text-primary w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold">Infrastructure as a Service</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    White-label solutions for banks to offer cross-border payments without capital intensive builds.
                                </p>
                            </div>

                            <div className="glass-card text-left space-y-6 group scale-100 hover:scale-[1.02]">
                                <div className="bg-accent-green/10 w-16 h-16 flex items-center justify-center rounded-2xl border border-accent-green/20 group-hover:bg-accent-green/20 transition-colors">
                                    <Globe2 className="text-accent-green w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold">USDC Native</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Stop losing 2-3% on forced conversions. Settle directly from stablecoins to local currency.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Banner */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-panel p-16 md:p-24 text-center space-y-10 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-accent-green to-primary shadow-[0_5px_15px_rgba(244,161,39,0.3)]"></div>
                            <h2 className="text-4xl md:text-7xl font-black text-white max-w-4xl mx-auto leading-tight italic tracking-tighter">
                                BUILDING THE FUTURE OF TRADE FINANCE
                            </h2>
                            <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium">
                                PillarVale is the foundation for international commerce, connecting businesses, banks, and blockchain.
                            </p>
                            <Link to="/login" className="btn-primary inline-flex scale-125 shadow-[0_20px_50px_rgba(10,36,99,0.5)] !py-4 !px-10">
                                Get Started <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-16 px-6 border-t border-white/5 bg-black/20">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-secondary/15 p-1.5 rounded-lg">
                                    <Globe className="text-secondary w-5 h-5" />
                                </div>
                                <span className="text-xl font-black tracking-tighter text-white uppercase">PILLAR<span className="text-secondary">VALE</span></span>
                            </div>
                            <span className="text-gray-600 text-xs font-medium tracking-wide">© 2024 PILLARVALE. NAIROBI, KENYA.</span>
                        </div>
                        <div className="flex gap-12 text-xs font-black tracking-[0.2em] text-gray-500 uppercase">
                            <a href="#" className="hover:text-white transition-colors">Trade</a>
                            <a href="#" className="hover:text-white transition-colors">Partners</a>
                            <a href="#" className="hover:text-white transition-colors">Crypto</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

const Globe = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

export default LandingPage;
