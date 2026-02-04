import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, User, Building2, Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const [regType, setRegType] = useState<'personal' | 'business'>('personal');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate registration
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#020617] relative flex items-center justify-center p-4 overflow-hidden py-12">
            {/* Architectural Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/90 to-[#020617]"></div>

            <div className="relative z-10 w-full max-w-xl">
                {/* Large Logo Header */}
                <div className="flex flex-col items-center mb-10">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="bg-secondary/15 p-3 rounded-2xl border border-secondary/20 shadow-[0_0_30px_rgba(244,161,39,0.15)] group-hover:scale-105 transition-transform duration-500">
                            <Globe className="text-secondary w-10 h-10" />
                        </div>
                        <span className="text-4xl font-black tracking-tighter text-white uppercase">
                            PILLAR<span className="text-secondary">VALE</span>
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
                    {/* Left Side Info */}
                    <div className="md:col-span-2 hidden md:block space-y-8 pt-10">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-white italic tracking-tight">JOIN THE FUTURE</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Build your global trade account and start moving money in minutes.</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                'Real-time FX rates',
                                'Blockchain security',
                                'Instant settlement',
                                'Low transaction fees'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 group">
                                    <div className="bg-accent-green/10 p-1.5 rounded-full border border-accent-green/20 group-hover:bg-accent-green/20 transition-colors">
                                        <CheckCircle2 className="w-4 h-4 text-accent-green" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors uppercase tracking-widest">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side Form */}
                    <div className="md:col-span-3 glass-panel p-8 w-full border border-white/10 relative overflow-hidden">
                        <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[100px] transition-colors duration-500 ${regType === 'business' ? 'bg-primary/20' : 'bg-secondary/10'}`}></div>

                        <div className="mb-6 relative z-10">
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Create Account</h2>
                            <p className="text-gray-400 text-xs font-medium">Join the future of global trade finance</p>
                        </div>

                        {/* Reg Type Selector */}
                        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 mb-8 relative z-10">
                            <button
                                onClick={() => setRegType('personal')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-[10px] uppercase tracking-[0.2em] ${regType === 'personal' ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <User className="w-4 h-4" />
                                Personal
                            </button>
                            <button
                                onClick={() => setRegType('business')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-[10px] uppercase tracking-[0.2em] ${regType === 'business' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Building2 className="w-4 h-4" />
                                Business
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            {regType === 'business' ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Company Name</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input type="text" required className="glass-input w-full pl-12 h-12" placeholder="Acme Inc." />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Company Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input type="email" required className="glass-input w-full pl-12 h-12" placeholder="admin@company.com" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input type="text" required className="glass-input w-full pl-12 h-12" placeholder="John Doe" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input type="email" required className="glass-input w-full pl-12 h-12" placeholder="your@email.com" />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input type="password" required className="glass-input w-full pl-12 h-12" placeholder="••••••••" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-4 rounded-xl text-white font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 ${regType === 'business' ? 'bg-primary hover:bg-primary/90 shadow-primary/20' : 'bg-secondary hover:bg-secondary/90 shadow-secondary/20'}`}
                            >
                                Register <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="mt-6 text-center relative z-10 border-t border-white/5 pt-6">
                            <p className="text-gray-500 text-xs font-medium">
                                Already have an account? <Link to="/login" className="text-white hover:text-primary transition-colors font-bold">Sign In</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="mt-10 flex justify-center">
                    <div className="px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 animate-fade-in">
                        <ShieldCheck className="w-4 h-4 text-accent-green" />
                        <span className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Your data is encrypted and secure</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
