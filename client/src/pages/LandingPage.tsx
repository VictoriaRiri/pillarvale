import Navbar from '../components/Navbar';
import { ArrowRight, Zap, Shield, Globe2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#020617] selection:bg-primary/30 overflow-x-hidden">
            {/* Background patterns */}
            <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-10 grayscale pointer-events-none"></div>
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617] pointer-events-none"></div>

            <div className="relative z-10">
                <Navbar />

                {/* Hero Section */}
                <section className="pt-48 pb-20 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.3em]">
                                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(244,161,39,0.5)]"></span>
                                THE FOUNDATION FOR GLOBAL TRADE FINANCE
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1] tracking-tighter">
                                BRIDGE THE <br />
                                GAP IN <span className="text-gradient-gold italic">GLOBAL</span> <br />
                                <span className="text-gradient-green italic underline decoration-white/10 underline-offset-[12px]">TRADE</span>
                            </h1>

                            <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-medium">
                                Stop losing 5-10% on cross-border payments. PillarVale uses blockchain rails to move money globally in minutes, not days.
                            </p>

                            <div className="flex flex-wrap gap-6 pt-4">
                                <Link to="/register" className="btn-primary !py-5 !px-12 !rounded-full group text-sm shadow-[0_20px_50px_rgba(10,36,99,0.4)]">
                                    Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform ml-2" />
                                </Link>
                                <Link to="/login" className="btn-secondary !py-5 !px-12 !rounded-full text-sm hover:bg-white/5 transition-colors">
                                    Login to Portal
                                </Link>
                            </div>
                        </div>

                        {/* FX Quote Mockup */}
                        <div className="glass-panel p-10 space-y-8 max-w-md mx-auto lg:ml-auto w-full relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent-green/20 rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                            <div className="relative space-y-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black italic tracking-tight underline decoration-secondary decoration-4 underline-offset-8">FX QUOTE</h3>
                                    <span className="text-[10px] text-accent-green flex items-center gap-2 font-black tracking-widest uppercase">
                                        <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span> Live Rates
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/10 group-hover:border-white/20 transition-colors">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-2">You Send</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-4xl font-black">5,000</span>
                                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                                <span className="text-xs font-black uppercase tracking-widest">USD</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center -my-4 relative z-10">
                                        <div className="bg-[#020617] p-3 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/10 group-hover:border-white/20 transition-colors">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-2">Recipient Gets</p>
                                        <div className="flex justify-between items-center text-accent-green">
                                            <span className="text-4xl font-black">635,000</span>
                                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-white">
                                                <span className="text-xs font-black uppercase tracking-widest">KES</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Exchange Rate</span>
                                        <span className="text-white">1 USD = 127.00 KES</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Processing Fee</span>
                                        <span className="text-accent-green italic">$0.00 ZERO FEE</span>
                                    </div>
                                </div>

                                <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-2xl text-center shadow-[0_0_20px_rgba(244,161,39,0.1)]">
                                    <p className="text-secondary text-[10px] font-black flex items-center justify-center gap-3 uppercase tracking-[0.2em]">
                                        <Zap className="w-4 h-4 fill-secondary" /> SAVING 17,500 KES VS BANKS
                                    </p>
                                </div>

                                <Link to="/register" className="btn-primary w-full py-5 rounded-2xl !bg-[#0A2463] hover:!bg-[#0C2D7A] shadow-xl text-[10px] font-black uppercase tracking-[0.2em]">
                                    Start Settlement
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-40 px-6">
                    <div className="max-w-7xl mx-auto space-y-32">
                        <div className="text-center space-y-8">
                            <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">WHY PILLARVALE?</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-lg font-medium">
                                Moving money at the speed of trade. We've built the blockchain infrastructure layer for global commerce.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { icon: Zap, title: '15-Minute Settlement', desc: 'Blockchain rails ensure funds arrive in minutes, not days. Real-time Alipay and M-Pesa settlement.', color: 'secondary' },
                                { icon: Shield, title: 'Secure Infrastructure', desc: 'Enterprise-grade security and institutional custodian solutions for your cross-border trade assets.', color: 'primary' },
                                { icon: Globe2, title: 'Localized Payouts', desc: 'Stop losing 2-3% on forced conversions. Settle directly from stablecoins to 50+ local currencies.', color: 'accent-green' }
                            ].map((f, i) => (
                                <div key={i} className="glass-card text-left space-y-8 group hover:translate-y-[-8px] transition-all duration-500 pb-12">
                                    <div className={`bg-${f.color}/10 w-20 h-20 flex items-center justify-center rounded-[2rem] border border-${f.color}/20 group-hover:bg-${f.color}/20 group-hover:rotate-[10deg] transition-all`}>
                                        <f.icon className={`text-${f.color} w-10 h-10 ${f.color === 'secondary' ? 'fill-secondary' : ''}`} />
                                    </div>
                                    <h3 className="text-2xl font-black italic tracking-tight">{f.title.toUpperCase()}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                        {f.desc}
                                    </p>
                                    <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                                        Learn More <ArrowRight className="w-4 h-4 text-secondary" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Banner - MATCHING SCREENSHOT */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-panel p-20 md:p-32 text-center space-y-12 relative overflow-hidden group border-white/5">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary via-accent-green to-primary shadow-[0_5px_30px_rgba(244,161,39,0.5)]"></div>

                            <h2 className="text-5xl md:text-9xl font-black text-white max-w-5xl mx-auto leading-[0.9] italic tracking-tighter">
                                BUILDING THE <br />
                                <span className="text-gradient-gold">FUTURE</span> OF TRADE <br />
                                FINANCE
                            </h2>

                            <p className="text-gray-400 text-xl md:text-3xl max-w-3xl mx-auto font-bold italic tracking-tight">
                                PillarVale is the foundation for international commerce, connecting businesses, banks, and blockchain.
                            </p>

                            <div className="flex justify-center pt-8">
                                <Link to="/register" className="btn-primary inline-flex scale-150 shadow-[0_20px_60px_rgba(10,36,99,0.5)] !py-5 !px-12 !rounded-full">
                                    Get Started <ArrowRight className="w-6 h-6 ml-2" />
                                </Link>
                            </div>

                            {/* Decorative background elements */}
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full group-hover:bg-primary/20 transition-colors"></div>
                            <div className="absolute -top-20 -left-20 w-80 h-80 bg-secondary/10 blur-[120px] rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                        </div>
                    </div>
                </section>

                {/* Footer - MATCHING SCREENSHOT */}
                <footer className="py-24 px-6 border-t border-white/5 bg-black/20 relative">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                            <div className="flex flex-col items-center md:items-start gap-6">
                                <Logo iconSize={32} textSize="text-3xl" />
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">System Live</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">ISO 27001 Certified</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase">
                                <a href="#" className="hover:text-white hover:underline underline-offset-8 transition-all">Protocol</a>
                                <a href="#" className="hover:text-white hover:underline underline-offset-8 transition-all">Governance</a>
                                <a href="#" className="hover:text-white hover:underline underline-offset-8 transition-all">Infrastructure</a>
                                <a href="#" className="hover:text-white hover:underline underline-offset-8 transition-all">Documentation</a>
                            </div>

                            <div className="flex items-center gap-4">
                                <Link to="/register" className="btn-secondary !text-[10px] !py-3 !px-8 !rounded-full font-black uppercase tracking-widest outline outline-1 outline-white/10 hover:outline-white/30 transition-all">
                                    Join Network
                                </Link>
                            </div>
                        </div>

                        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                            <span className="text-gray-600 text-[10px] font-bold tracking-[0.2em] uppercase">© 2024 PILLARVALE. HEADQUARTERED IN NAIROBI, KENYA.</span>
                            <div className="flex gap-8">
                                <a href="#" className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacy Policy</a>
                                <a href="#" className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
