import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Phone, Wallet, Landmark, CheckCircle2 } from 'lucide-react';

const ReceiverDetails = () => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState<'bank' | 'alipay' | 'paypal' | 'mpesa'>('bank');

    const handleFinish = () => {
        alert("Transaction Initialized Successfully!");
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30">
            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
                    <Link to="/sender-details" className="flex items-center gap-3">
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
                                <div key={i} className={'w-8 h-1 rounded-full bg-primary shadow-[0_0_10px_rgba(10,36,99,0.5)]'}></div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Step 3 of 3</span>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
                <div className="space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-white">Who is <span className="text-primary italic">receiving?</span></h1>
                        <p className="text-gray-400 font-medium">Select destination and enter recipient details.</p>
                    </div>

                    <div className="glass-panel p-8 md:p-12 space-y-10 relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-green/10 blur-[100px] pointer-events-none group-hover:bg-accent-green/20 transition-colors"></div>

                        <div className="space-y-8 relative z-10">
                            {/* Destination Selection */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Destination Method</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { id: 'bank', icon: Landmark, label: 'Bank' },
                                        { id: 'alipay', icon: Globe, label: 'Alipay' },
                                        { id: 'paypal', icon: Wallet, label: 'PayPal' },
                                        { id: 'mpesa', icon: Phone, label: 'M-PESA' },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setDestination(item.id as any)}
                                            className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${destination === item.id ? 'bg-white/10 border-primary shadow-xl scale-105' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'}`}
                                        >
                                            <item.icon className={`w-6 h-6 ${destination === item.id ? 'text-primary' : 'text-gray-500'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${destination === item.id ? 'text-white' : 'text-gray-500'}`}>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recipient Details */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Recipient Name</label>
                                    <div className="relative">
                                        <input type="text" className="glass-input w-full pl-4" placeholder="Full Name or Business Name" />
                                    </div>
                                </div>

                                {destination === 'bank' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Bank Name</label>
                                            <input type="text" className="glass-input w-full" placeholder="EcoBank" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Account Number</label>
                                            <input type="text" className="glass-input w-full" placeholder="0123456789" />
                                        </div>
                                    </div>
                                )}

                                {destination === 'alipay' && (
                                    <div className="space-y-2 animate-fade-in">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Alipay ID (Phone or Email)</label>
                                        <input type="text" className="glass-input w-full" placeholder="+86..." />
                                    </div>
                                )}

                                {destination === 'paypal' && (
                                    <div className="space-y-2 animate-fade-in">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">PayPal Email</label>
                                        <input type="email" className="glass-input w-full" placeholder="recipient@paypal.com" />
                                    </div>
                                )}

                                {destination === 'mpesa' && (
                                    <div className="space-y-2 animate-fade-in">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">M-PESA Number</label>
                                        <input type="text" className="glass-input w-full" placeholder="254..." />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 relative z-10 pt-4">
                            <Link to="/sender-details" className="btn-secondary !py-5 flex-1 text-center font-black text-sm uppercase tracking-[0.2em]">Back</Link>
                            <button
                                onClick={handleFinish}
                                className="btn-primary !py-5 flex-[2] !rounded-3xl shadow-xl group !bg-accent-green hover:!bg-green-700 border-none"
                            >
                                Confirm & Settle
                                <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center p-8 bg-white/[0.01] rounded-[3rem] border border-white/5">
                        <div className="text-center space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-2">Estimated delivery</p>
                            <p className="text-2xl font-black italic text-white">UNDER 15 MINUTES</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiverDetails;
