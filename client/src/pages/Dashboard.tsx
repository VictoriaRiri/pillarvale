import { useUser, useClerk } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, LogOut, TrendingUp, Wallet, History, ArrowRight, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

const Dashboard = () => {
    const isConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    const { user, isLoaded, isSignedIn } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();

    useEffect(() => {
        if (isConfigured && isLoaded && !isSignedIn) {
            navigate('/login');
        }
    }, [isConfigured, isLoaded, isSignedIn, navigate]);

    if (!isConfigured) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="glass-card p-8 text-center max-w-md">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Auth Configuration Required</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        The Clerk authentication key is missing. Please add VITE_CLERK_PUBLISHABLE_KEY to your environment variables to access the dashboard.
                    </p>
                    <Link to="/" className="text-primary hover:underline">Return to Home</Link>
                </div>
            </div>
        );
    }

    if (!isLoaded || !isSignedIn) return null;

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <Globe className="text-primary w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-white">PILLAR<span className="text-primary">VALE</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-300">{user?.primaryEmailAddress?.emailAddress}</span>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400 mb-8">Welcome back, {user?.firstName || user?.username || 'User'}</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-primary/20 p-3 rounded-lg">
                                    <Wallet className="text-primary w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Total Locked</p>
                                    <p className="text-2xl font-bold text-white">$0.00</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-secondary/20 p-3 rounded-lg">
                                    <TrendingUp className="text-secondary w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Savings This Month</p>
                                    <p className="text-2xl font-bold text-white">$0.00</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-accent/20 p-3 rounded-lg">
                                    <History className="text-accent w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Active Locks</p>
                                    <p className="text-2xl font-bold text-white">0</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card p-6 mb-8">
                        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/trade" className="glass-button inline-flex items-center gap-2">
                                Start New Trade <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                        <p className="text-gray-400">No recent activity. Start your first trade to see it here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
