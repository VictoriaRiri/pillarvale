import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';

const Register = () => {
    const [regType, setRegType] = useState<'personal' | 'business'>('personal');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#020617] relative flex flex-col items-center justify-center p-6 overflow-hidden py-24">
            {/* Architectural Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617] to-black"></div>

            <div className="relative z-10 w-full max-w-lg mb-12 flex flex-col items-center animate-fade-in-down">
                <Logo iconSize={36} textSize="text-4xl" className="mb-4 shadow-[0_0_50px_rgba(244,161,39,0.1)] p-4 rounded-3xl" />
                <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] italic">Infrastructure Registration</p>
            </div>

            <div className="relative z-10 w-full max-w-5xl animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-stretch">
                    {/* Left Panel - Value Prop */}
                    <div className="lg:col-span-2 glass-panel p-12 hidden lg:flex flex-col justify-between border-white/5 bg-white/[0.01]">
                        <div className="space-y-10">
                            <h3 className="text-4xl font-black text-white italic tracking-tighter leading-tight">JOIN THE <br /> FUTURE OF <br /> <span className="text-gradient-gold">TRADE.</span></h3>
                            <div className="space-y-8">
                                {[
                                    'Institutional-grade security',
                                    'Real-time FX liquidity',
                                    'Instant M-PESA & Alipay payout',
                                    'Zero transaction slippage'
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="bg-accent-green/10 p-2 rounded-xl border border-accent-green/20 group-hover:bg-accent-green/20 transition-all">
                                            <CheckCircle2 className="w-5 h-5 text-accent-green" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 group-hover:text-white transition-colors uppercase tracking-[0.2em]">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-12 border-t border-white/5">
                            <div className="flex items-center gap-4 opacity-50">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 leading-relaxed">System audited by <br /> leading cybersecurity firms.</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="lg:col-span-3 glass-panel p-12 border-white/10 shadow-2xl rounded-[3rem] relative overflow-hidden flex flex-col justify-center">
                        <div className={`absolute -top-24 -right-24 w-80 h-80 blur-[120px] transition-all duration-700 ${regType === 'business' ? 'bg-primary/20' : 'bg-secondary/15'}`}></div>

                        <div className="relative z-10">
                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-white tracking-tight uppercase italic mb-2">Create Account</h2>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Select your primary role</p>
                            </div>

                            {/* Role Switcher */}
                            <div className="flex p-1.5 bg-white/5 rounded-3xl border border-white/10 mb-10">
                                <button
                                    onClick={() => setRegType('personal')}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em] ${regType === 'personal' ? 'bg-secondary text-white shadow-xl scale-[1.02]' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <User className="w-4 h-4" />
                                    Personal User
                                </button>
                                <button
                                    onClick={() => setRegType('business')}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em] ${regType === 'business' ? 'bg-primary text-white shadow-xl scale-[1.02]' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <Building2 className="w-4 h-4" />
                                    Enterprise
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                {regType === 'business' ? (
                                    <>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Company Name</label>
                                            <input type="text" required className="glass-input w-full h-16 !bg-white/[0.02] border-white/5 !rounded-2xl" placeholder="Entity Legal Name" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Business Email</label>
                                            <input type="email" required className="glass-input w-full h-16 !bg-white/[0.02] border-white/5 !rounded-2xl" placeholder="admin@domain.com" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Full Legal Name</label>
                                            <input type="text" required className="glass-input w-full h-16 !bg-white/[0.02] border-white/5 !rounded-2xl" placeholder="Johnathan Doe" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Email Identity</label>
                                            <input type="email" required className="glass-input w-full h-16 !bg-white/[0.02] border-white/5 !rounded-2xl" placeholder="name@email.com" />
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Security Access Key</label>
                                    <input type="password" required className="glass-input w-full h-16 !bg-white/[0.02] border-white/5 !rounded-2xl" placeholder="••••••••••••" />
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <button
                                        type="submit"
                                        className={`w-full py-5 rounded-[2rem] text-white font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${regType === 'business' ? 'bg-primary hover:bg-primary/80 shadow-primary/30' : 'bg-secondary hover:bg-secondary/80 shadow-secondary/20'}`}
                                    >
                                        Initialize Account <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>

                            <div className="mt-10 text-center border-t border-white/5 pt-8">
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Already registered? <Link to="/login" className="text-white hover:text-primary transition-colors font-black">Login to portal</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
