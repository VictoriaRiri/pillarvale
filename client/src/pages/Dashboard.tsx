import { Link, useNavigate } from 'react-router-dom';
import { Globe, LogOut, TrendingUp, Wallet, History, Zap, Send } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    // Simulated user data
    const user = {
        firstName: 'John',
        primaryEmailAddress: { emailAddress: 'john@example.com' }
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30">
            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4 px-6 md:px-8">
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="bg-secondary/15 p-2 rounded-xl border border-secondary/20 shadow-[0_0_15px_rgba(244,161,39,0.1)]">
                            <Globe className="text-secondary w-7 h-7" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">
                            PILLAR<span className="text-secondary">VALE</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Authenticated as</p>
                            <p className="text-sm font-medium text-gray-300">{user.primaryEmailAddress.emailAddress}</p>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition-all font-bold text-sm uppercase tracking-widest group">
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-5xl font-black tracking-tight text-white mb-2 italic underline decoration-primary decoration-4 underline-offset-8">DASHBOARD</h1>
                        <p className="text-gray-400 text-lg font-medium">Welcome back, <span className="text-white">{user.firstName}</span></p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="glass-card group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-6 text-left">
                                <div className="bg-primary/20 p-4 rounded-2xl border border-primary/30 group-hover:bg-primary/30 transition-colors shadow-[0_0_20px_rgba(10,36,99,0.1)]">
                                    <Wallet className="text-primary w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">Total Locked</p>
                                    <p className="text-3xl font-black text-white">$12,450.00</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card group hover:bg-white/10 transition-colors text-left">
                            <div className="flex items-center gap-6">
                                <div className="bg-secondary/20 p-4 rounded-2xl border border-secondary/30 group-hover:bg-secondary/30 transition-colors shadow-[0_0_20px_rgba(244,161,39,0.15)]">
                                    <TrendingUp className="text-secondary w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">Total Savings</p>
                                    <p className="text-3xl font-black text-white">$1,240.20</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card group hover:bg-white/10 transition-colors text-left">
                            <div className="flex items-center gap-6">
                                <div className="bg-accent-green/20 p-4 rounded-2xl border border-accent-green/30 group-hover:bg-accent-green/30 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                                    <History className="text-accent-green w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">Active Locks</p>
                                    <p className="text-3xl font-black text-white">4</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="glass-card p-8 text-center">
                                <h2 className="text-xl font-bold text-white mb-8 flex items-center justify-center gap-2">
                                    <Zap className="w-5 h-5 text-secondary fill-secondary/20" />
                                    Quick Actions
                                </h2>
                                <div className="space-y-4">
                                    <Link to="/send" className="btn-primary w-full !py-5 group bg-gradient-to-r from-primary to-blue-800 border-none">
                                        Send Money Now
                                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Link>
                                    <button className="btn-secondary w-full !py-4 hover:bg-white/10">
                                        View History
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent activity */}
                        <div className="lg:col-span-2">
                            <div className="glass-card p-8 h-full min-h-[400px]">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                                    <button className="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">See All</button>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { to: 'Alice Johnson', amount: '$1,200', date: '2 hours ago', status: 'Completed' },
                                        { to: 'Global Biz Ltd', amount: '$4,500', date: '1 day ago', status: 'Pending' },
                                        { to: 'Bob Smith', amount: '$300', date: '3 days ago', status: 'Completed' },
                                    ].map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-primary/10 p-2.5 rounded-lg text-primary group-hover:scale-110 transition-transform">
                                                    <Send className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{tx.to}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{tx.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-white">{tx.amount}</p>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest ${tx.status === 'Completed' ? 'text-accent-green' : 'text-secondary'}`}>{tx.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
