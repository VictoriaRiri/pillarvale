import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, ArrowRight, ChevronDown, Zap, ShieldCheck } from 'lucide-react';

const SendMoney = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('1000');
    const [sendCurrency] = useState('USD');
    const [receiveCurrency] = useState('KES');

    const handleNext = () => {
        navigate('/sender-details');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30">
            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="bg-secondary/15 p-2 rounded-xl border border-secondary/20 group">
                            <Globe className="text-secondary w-6 h-6 group-hover:rotate-12 transition-transform" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                            PILLAR<span className="text-secondary">VALE</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-8 h-1 rounded-full ${i === 1 ? 'bg-primary shadow-[0_0_10px_rgba(10,36,99,0.5)]' : 'bg-white/10'}`}></div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Step 1 of 3</span>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
                <div className="space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-white">How much would you like to <span className="text-primary italic">send?</span></h1>
                        <p className="text-gray-400 font-medium">Get the best real-time FX rates on the blockchain.</p>
                    </div>

                    <div className="glass-panel p-8 md:p-12 space-y-8 relative overflow-hidden group">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-colors"></div>

                        <div className="space-y-6 relative z-10">
                            {/* Send Section */}
                            <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 focus-within:border-primary/50 transition-all">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 ml-2">YOU SEND</p>
                                <div className="flex items-center justify-between gap-4">
                                    <input
                                        type="text"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="bg-transparent border-none text-4xl md:text-5xl font-black text-white focus:outline-none w-full placeholder:text-white/20"
                                        placeholder="0.00"
                                    />
                                    <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 px-4 rounded-2xl border border-white/10 transition-all active:scale-95">
                                        <span className="font-black text-lg">{sendCurrency}</span>
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Divider with Swap Icon */}
                            <div className="flex justify-center -my-9 relative z-20">
                                <div className="bg-[#020617] p-3 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
                                    <Zap className="w-6 h-6 text-secondary fill-secondary/20" />
                                </div>
                            </div>

                            {/* Receive Section */}
                            <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 ml-2">RECIPIENT GETS</p>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-4xl md:text-5xl font-black text-accent-green">
                                        {(parseFloat(amount || '0') * 127).toLocaleString()}
                                    </span>
                                    <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 px-4 rounded-2xl border border-white/10 transition-all">
                                        <span className="font-black text-lg">{receiveCurrency}</span>
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* FX Details */}
                        <div className="space-y-3 px-2">
                            <div className="flex justify-between text-xs font-bold tracking-widest uppercase">
                                <span className="text-gray-500">Exchange Rate</span>
                                <span className="text-white">1 USD = 127.00 KES</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold tracking-widest uppercase">
                                <span className="text-gray-500">Transaction Fee</span>
                                <span className="text-accent-green">$0.00 (Zero Fee)</span>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full btn-primary !py-5 !rounded-3xl shadow-[0_20px_50px_rgba(10,36,99,0.3)] group"
                        >
                            Continue to Details
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    {/* Trust Indicator */}
                    <div className="flex flex-col items-center gap-4 py-8 border-t border-white/5">
                        <div className="flex items-center gap-2 text-gray-500">
                            <ShieldCheck className="w-5 h-5 text-accent-green" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">SECURE BLOCKCHAIN SETTLEMENT</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendMoney;
