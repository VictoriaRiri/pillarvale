import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, ArrowRight, Phone, Landmark, ShieldCheck } from 'lucide-react';

const SenderDetails = () => {
    const navigate = useNavigate();
    const [source, setSource] = useState<'bank' | 'mpesa'>('bank');

    const handleNext = () => {
        navigate('/receiver-details');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30">
            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
                    <Link to="/send" className="flex items-center gap-3">
                        <div className="bg-secondary/15 p-2 rounded-xl border border-secondary/20">
                            <Globe className="text-secondary w-6 h-6" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                            PILLAR<span className="text-secondary">VALE</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-8 h-1 rounded-full ${i <= 2 ? 'bg-primary shadow-[0_0_10px_rgba(10,36,99,0.5)]' : 'bg-white/10'}`}></div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Step 2 of 3</span>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
                <div className="space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-white">Your <span className="text-primary italic">Details</span></h1>
                        <p className="text-gray-400 font-medium">Verify your information and select payment source.</p>
                    </div>

                    <div className="glass-panel p-8 md:p-12 space-y-10 relative overflow-hidden group">
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 blur-[100px] pointer-events-none group-hover:bg-secondary/20 transition-colors"></div>

                        <div className="space-y-8 relative z-10">
                            {/* Personal Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Full legal Name</label>
                                    <div className="relative">
                                        <input type="text" className="glass-input w-full pl-4" placeholder="John Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <input type="text" className="glass-input w-full pl-4" placeholder="+1 (555) 000-0000" />
                                    </div>
                                </div>
                            </div>

                            {/* Source Selection */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Payment Source</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setSource('bank')}
                                        className={`flex items-center gap-4 p-6 rounded-3xl border transition-all text-left group ${source === 'bank' ? 'bg-white/10 border-primary shadow-xl ring-2 ring-primary/20' : 'bg-white/[0.03] border-white/10 hover:bg-white/5'}`}
                                    >
                                        <div className={`p-3 rounded-2xl ${source === 'bank' ? 'bg-primary/20 border border-primary/30' : 'bg-white/5'}`}>
                                            <Landmark className={source === 'bank' ? 'text-primary w-6 h-6' : 'text-gray-500 w-6 h-6'} />
                                        </div>
                                        <div>
                                            <p className={`font-black text-sm uppercase tracking-widest ${source === 'bank' ? 'text-white' : 'text-gray-400'}`}>Bank Transfer</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global Banks</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setSource('mpesa')}
                                        className={`flex items-center gap-4 p-6 rounded-3xl border transition-all text-left group ${source === 'mpesa' ? 'bg-white/10 border-secondary shadow-xl ring-2 ring-secondary/20' : 'bg-white/[0.03] border-white/10 hover:bg-white/5'}`}
                                    >
                                        <div className={`p-3 rounded-2xl ${source === 'mpesa' ? 'bg-secondary/20 border border-secondary/30' : 'bg-white/5'}`}>
                                            <Phone className={source === 'mpesa' ? 'text-secondary w-6 h-6' : 'text-gray-500 w-6 h-6'} />
                                        </div>
                                        <div>
                                            <p className={`font-black text-sm uppercase tracking-widest ${source === 'mpesa' ? 'text-white' : 'text-gray-400'}`}>M-PESA</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Instant STK Push</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {source === 'bank' ? (
                                <div className="space-y-6 pt-4 animate-fade-in">
                                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                                        <p className="text-[10px] font-black tracking-widest text-primary uppercase">Bank Instructions</p>
                                        <p className="text-xs text-gray-400 leading-relaxed">After clicking continue, you will be provided with unique banking details to fund this transaction via wire transfer.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 pt-4 animate-fade-in">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">M-PESA Number for STK Push</label>
                                        <div className="relative">
                                            <input type="text" className="glass-input w-full pl-4" placeholder="254712345678" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 relative z-10 pt-4">
                            <Link to="/send" className="btn-secondary !py-5 flex-1 text-center font-black text-sm uppercase tracking-[0.2em]">Back</Link>
                            <button
                                onClick={handleNext}
                                className="btn-primary !py-5 flex-[2] !rounded-3xl shadow-xl group"
                            >
                                Receiver Info
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center py-8">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5">
                            <ShieldCheck className="w-4 h-4 text-accent-green" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Encrypted transmission</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SenderDetails;
