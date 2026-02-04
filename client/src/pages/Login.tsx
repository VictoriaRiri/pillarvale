import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, User, Building2, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [loginType, setLoginType] = useState<'personal' | 'business'>('personal');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#020617] relative flex items-center justify-center p-4 overflow-hidden">
            {/* Architectural Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/90 to-[#020617]"></div>

            <div className="relative z-10 w-full max-w-md">
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

                <div className="glass-panel p-8 w-full border border-white/10 relative overflow-hidden">
                    {/* Background glow based on type */}
                    <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[100px] transition-colors duration-500 ${loginType === 'business' ? 'bg-primary/20' : 'bg-secondary/10'}`}></div>

                    <div className="mb-8 text-center relative z-10">
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase italic mb-2">Welcome Back</h2>
                        <p className="text-gray-400 text-sm font-medium">Select your account type to sign in</p>
                    </div>

                    {/* Login Type Selector */}
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 mb-8 relative z-10">
                        <button
                            onClick={() => setLoginType('personal')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${loginType === 'personal' ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <User className="w-4 h-4" />
                            Personal
                        </button>
                        <button
                            onClick={() => setLoginType('business')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${loginType === 'business' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Building2 className="w-4 h-4" />
                            Business
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    className="glass-input w-full pl-12"
                                    placeholder={loginType === 'business' ? 'name@company.com' : 'your@email.com'}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password</label>
                                <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="password"
                                    required
                                    className="glass-input w-full pl-12"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-4 rounded-xl text-white font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 ${loginType === 'business' ? 'bg-primary hover:bg-primary/90 shadow-primary/20' : 'bg-secondary hover:bg-secondary/90 shadow-secondary/20'}`}
                        >
                            Log In <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-8 text-center relative z-10">
                        <p className="text-gray-500 text-xs font-medium">
                            Don't have an account? <Link to="/register" className="text-white hover:text-primary transition-colors font-bold border-b border-primary/30">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
