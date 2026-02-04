import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Globe, AlertTriangle } from 'lucide-react';

const Login = () => {
    const isConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

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

                <div className="flex justify-center">
                    {isConfigured ? (
                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] w-full p-8",
                                    headerTitle: "text-3xl font-black text-white text-center tracking-tight",
                                    headerSubtitle: "text-gray-400 text-center mt-2 font-medium",
                                    socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl py-3 transition-all",
                                    formButtonPrimary: "btn-primary w-full !bg-primary hover:!bg-primary/90 !py-4 !rounded-xl text-lg font-bold shadow-[0_10px_30px_rgba(10,36,99,0.4)]",
                                    formFieldLabel: "text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2",
                                    formFieldInput: "glass-input !bg-white/5 !border-white/10 focus:!border-primary/50 !h-12 !rounded-xl !text-white",
                                    footerActionText: "text-gray-500 font-medium",
                                    footerActionLink: "text-primary hover:text-primary/80 font-bold transition-colors",
                                    identityPreviewText: "text-white",
                                    identityPreviewEditButtonIcon: "text-primary",
                                    formFieldInputShowPasswordButton: "text-gray-500 hover:text-white"
                                },
                                layout: {
                                    privacyPageUrl: "https://clerk.com/privacy",
                                    helpPageUrl: "https://clerk.com/support"
                                }
                            }}
                            signUpUrl="/register"
                        />
                    ) : (
                        <div className="glass-panel p-10 text-center w-full">
                            <AlertTriangle className="w-16 h-16 text-secondary mx-auto mb-6" />
                            <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">Auth Config Required</h2>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
                                The Clerk authentication key is missing. Please add <code className="text-primary bg-primary/10 px-1 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> to your environment variables to enable login.
                            </p>
                            <Link to="/" className="btn-secondary w-full">
                                Return to Home
                            </Link>
                        </div>
                    )}
                </div>

                {/* Trusted Badge from Screenshot */}
                <div className="mt-12 flex flex-col items-center gap-4 animate-fade-in">
                    <div className="flex -space-x-3 overflow-hidden">
                        {[1, 2, 3, 4].map(i => (
                            <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-[#020617] grayscale opacity-50" src={`https://i.pravatar.cc/100?img=${i}`} alt="" />
                        ))}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-gray-500 ring-2 ring-[#020617] backdrop-blur-sm border border-white/10">
                            +2k
                        </div>
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase">Trusted by 2,000+ businesses</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
