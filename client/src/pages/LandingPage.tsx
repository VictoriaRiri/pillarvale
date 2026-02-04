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

                            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter">
                                Bridge the <br />
                                Gap in <span className="text-secondary">Global</span> <br />
                                <span className="text-accent-green">Trade</span>
                            </h1>

                            <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-medium">
                                Stop losing 5–10% on cross-border payments. PillarVale uses blockchain settlement rails to help businesses move money globally in 15 minutes, not 3-7 days.
                            </p>

                            <div className="flex flex-wrap gap-6 pt-4">
                                <Link to="/register" className="btn-primary !py-5 !px-12 !rounded-xl group text-sm shadow-[0_20px_50px_rgba(10,36,99,0.4)]">
                                    For Businesses <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform ml-2" />
                                </Link>
                                <Link to="/login" className="btn-secondary !py-5 !px-12 !rounded-xl text-sm hover:bg-white/5 transition-colors bg-[#0F172A]/50 border-white/5">
                                    For Banks
                                </Link>
                            </div>
                        </div>

                        {/* FX Quote Card */}
                        <div className="bg-[#1E293B]/40 backdrop-blur-xl p-10 space-y-8 max-w-md mx-auto lg:ml-auto w-full relative rounded-[2.5rem] border border-white/10">
                            <div className="relative space-y-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-white tracking-tight">Instance FX Quote</h3>
                                    <span className="text-[10px] text-accent-green flex items-center gap-2 font-black tracking-widest uppercase">
                                        <span className="w-2 h-2 rounded-full bg-accent-green"></span> Live Rates
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    <div className="bg-[#020617]/50 rounded-2xl p-6 border border-white/5">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-2">YOU SEND</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-4xl font-black">5000</span>
                                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                                <span className="text-xs font-black uppercase tracking-widest">US</span>
                                                <span className="text-xs font-black text-gray-400">USD</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center -my-4 relative z-10">
                                        <div className="bg-[#1E293B] p-2 rounded-full border border-white/10">
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="bg-[#020617]/50 rounded-2xl p-6 border border-white/5">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-2">RECIPIENT GETS</p>
                                        <div className="flex justify-between items-center text-accent-green">
                                            <span className="text-4xl font-black">635,000</span>
                                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-white">
                                                <span className="text-xs font-black uppercase tracking-widest">KE</span>
                                                <span className="text-xs font-black text-gray-400">KES</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 text-[10px] font-black uppercase tracking-[0.2em] px-2">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Exchange Rate</span>
                                        <span className="text-white">1 USD = 127.00 KES</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Processing Fee</span>
                                        <span className="text-white">$1.00</span>
                                    </div>
                                </div>

                                <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-xl text-center">
                                    <p className="text-secondary text-[10px] font-black flex items-center justify-center gap-3 uppercase tracking-[0.2em]">
                                        <Zap className="w-4 h-4 fill-secondary" /> Saving 17,500 KES vs Banks
                                    </p>
                                </div>

                                <Link to="/register" className="btn-primary w-full py-5 rounded-xl !bg-[#0A2463] hover:!bg-[#0C2D7A] shadow-xl text-[10px] font-black uppercase tracking-[0.2em]">
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
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">Why Businesses Choose PillarVale</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-lg font-medium">
                                Moving money at the speed of trade. We've built the blockchain infrastructure layer for global commerce.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { icon: Zap, title: '15-Minute Settlement', desc: 'Blockchain rails ensure funds arrive in minutes, not days. Real-time Alipay and M-Pesa settlement.', color: 'secondary' },
                                { icon: Shield, title: 'Infrastructure as a Service', desc: 'White-label solutions for banks to offer cross-border payments without capital intensive builds.', color: 'primary' },
                                { icon: Globe2, title: 'USDC Native', desc: 'Stop losing 2-3% on forced conversions. Settle directly from stablecoins to local currency.', color: 'accent-green' }
                            ].map((f, i) => (
                                <div key={i} className="bg-[#1E293B]/30 backdrop-blur-md p-10 rounded-[2rem] border border-white/5 text-left space-y-8 group hover:bg-[#1E293B]/40 transition-all duration-500">
                                    <div className={`bg-${f.color}/10 w-16 h-16 flex items-center justify-center rounded-2xl border border-${f.color}/20`}>
                                        <f.icon className={`text-${f.color} w-8 h-8 ${f.color === 'secondary' ? 'fill-secondary' : ''}`} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white">{f.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                        {f.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Banner */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-[#1E293B]/40 backdrop-blur-xl p-20 md:p-32 text-center space-y-12 relative overflow-hidden rounded-[3rem] border border-white/10">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-accent-green to-primary"></div>

                            <h2 className="text-5xl md:text-8xl font-black text-white max-w-5xl mx-auto leading-[1.1] tracking-tighter">
                                Building the Future of Trade Finance
                            </h2>

                            <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium">
                                PillarVale is the foundation for international commerce, connecting businesses, banks, and blockchain.
                            </p>

                            <div className="flex justify-center pt-8">
                                <Link to="/register" className="btn-primary inline-flex !py-5 !px-12 !rounded-xl !bg-[#0A2463] hover:!bg-[#0C2D7A] shadow-2xl">
                                    Get Started <ArrowRight className="w-6 h-6 ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-24 px-6 border-t border-white/5 bg-black/20">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                            <Logo iconSize={32} textSize="text-3xl" />

                            <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
                                <a href="#" className="hover:text-white transition-all">Home</a>
                                <a href="#" className="hover:text-white transition-all">Features</a>
                                <a href="#" className="hover:text-white transition-all">Pricing</a>
                            </div>

                            <Link to="/register" className="btn-primary !text-[10px] !py-3 !px-8 !rounded-xl !bg-[#0A2463]">
                                Get Started <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
                            <div className="flex items-center gap-2">
                                <Logo iconSize={16} textSize="text-sm" />
                                <span>© 2024 PillarVale. Nairobi, Kenya.</span>
                            </div>
                            <div className="flex gap-12">
                                <a href="#" className="hover:text-white transition-colors">Trade</a>
                                <a href="#" className="hover:text-white transition-colors">Partners</a>
                                <a href="#" className="hover:text-white transition-colors">Crypto</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
