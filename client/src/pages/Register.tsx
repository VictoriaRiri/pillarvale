import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Globe, AlertTriangle } from 'lucide-react';

const Register = () => {
    const isConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

    return (
        <div className="min-h-screen bg-slate-900 bg-hero-pattern bg-cover bg-fixed flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/90"></div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-3 mb-8">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <Globe className="text-primary w-8 h-8" />
                    </div>
                    <span className="text-3xl font-bold text-white">
                        PILLAR<span className="text-primary">VALE</span>
                    </span>
                </Link>

                <div className="flex justify-center">
                    {isConfigured ? (
                        <SignUp
                            appearance={{
                                elements: {
                                    card: "bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl",
                                    headerTitle: "text-white",
                                    headerSubtitle: "text-gray-400",
                                    socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                                    formFieldLabel: "text-gray-300",
                                    formFieldInput: "bg-black/20 border-white/10 text-white",
                                    footerActionText: "text-gray-400",
                                    footerActionLink: "text-primary hover:text-primary/80"
                                }
                            }}
                            signInUrl="/login"
                        />
                    ) : (
                        <div className="glass-card p-8 text-center">
                            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2">Auth Configuration Required</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                The Clerk authentication key is missing. Please add VITE_CLERK_PUBLISHABLE_KEY to your environment variables.
                            </p>
                            <Link to="/" className="text-primary hover:underline">Return to Home</Link>
                        </div>
                    )}
                </div>

                {/* Trust Badge */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>🔒 Your data is encrypted and secure</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
