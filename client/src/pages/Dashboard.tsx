import { Link, useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, Wallet, History, Send } from 'lucide-react';
import Logo from '../components/Logo';

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
                <div className="max-w-7xl mx-auto flex items-center justify-between p-4 px-6 md:px-8">
                    <Logo />
                    <div className="flex items-center gap-8">
                        <div className="hidden md:block text-right border-l border-white/10 pl-8">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] leading-none mb-1.5">Infrastructure Node</p>
                            <p className="text-sm font-bold text-gray-300">{user.primaryEmailAddress.emailAddress}</p>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-3 text-gray-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] group bg-white/5 py-3 px-6 rounded-2xl border border-white/10">
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Exit
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                        <div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 italic leading-none">TERMINAL</h1>
                            <p className="text-gray-500 text-xl font-bold italic tracking-tight uppercase">Session active for: <span className="text-white">{user.firstName.toUpperCase()}</span></p>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-4 px-8">
                                <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Node Secure</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="glass-card group hover:bg-white/5 transition-all p-10 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[60px] group-hover:bg-primary/20 transition-colors"></div>
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="bg-primary/15 p-5 rounded-[2rem] border border-primary/20 shadow-[0_0_20px_rgba(10,36,99,0.1)] group-hover:scale-110 group-hover:rotate-6 transition-all">
                                    <Wallet className="text-primary w-10 h-10" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total Volume</p>
                                    <p className="text-4xl font-black text-white italic tracking-tighter">$12,450.00</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card group hover:bg-white/5 transition-all p-10 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 blur-[60px] group-hover:bg-secondary/20 transition-colors"></div>
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="bg-secondary/15 p-5 rounded-[2rem] border border-secondary/20 shadow-[0_0_20px_rgba(244,161,39,0.15)] group-hover:scale-110 group-hover:-rotate-6 transition-all">
                                    <TrendingUp className="text-secondary w-10 h-10" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Slippage Saved</p>
                                    <p className="text-4xl font-black text-white italic tracking-tighter">$1,240.20</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card group hover:bg-white/5 transition-all p-10 relative overflow-hidden text-left">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-green/10 blur-[60px] group-hover:bg-accent-green/20 transition-colors"></div>
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="bg-accent-green/15 p-5 rounded-[2rem] border border-accent-green/20 shadow-[0_0_20px_rgba(34,197,94,0.1)] group-hover:scale-110 group-hover:rotate-12 transition-all">
                                    <History className="text-accent-green w-10 h-10" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Active Trade</p>
                                    <p className="text-4xl font-black text-white italic tracking-tighter">04</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Quick Action Terminal */}
                        <div className="lg:col-span-1 space-y-10">
                            <div className="glass-card p-10 border-white/10 shadow-2xl">
                                <h2 className="text-2xl font-black text-white mb-10 italic tracking-tight underline decoration-primary decoration-4 underline-offset-8">COMMANDS</h2>
                                <div className="space-y-6">
                                    <Link to="/send" className="btn-primary w-full !py-6 !rounded-[2rem] group flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] shadow-primary/20 hover:shadow-primary/40 transition-all border-none overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        Initialize Trade
                                        <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                    </Link>
                                    <button className="btn-secondary w-full !py-5 !rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all outline outline-1 outline-white/10 border-none">
                                        Audit History
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Ledger */}
                        <div className="lg:col-span-2">
                            <div className="glass-card p-10 h-full min-h-[500px] border-white/5">
                                <div className="flex justify-between items-center mb-12">
                                    <h2 className="text-2xl font-black text-white italic tracking-tight">LEDGER</h2>
                                    <button className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-white transition-colors underline decoration-2 underline-offset-8">Full Archive</button>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { to: 'Alice Johnson', amount: '$1,200', date: '02.04.2024', status: 'Settled', icon: 'KES' },
                                        { to: 'Global Biz Ltd', amount: '$4,500', date: '01.04.2024', status: 'Routing', icon: 'CNY' },
                                        { to: 'Bob Smith', amount: '$300', date: '28.03.2024', status: 'Settled', icon: 'KES' },
                                        { to: 'Zhong Tech', amount: '$8,900', date: '25.03.2024', status: 'Settled', icon: 'CNY' },
                                    ].map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group cursor-pointer">
                                            <div className="flex items-center gap-6">
                                                <div className="bg-white/5 w-12 h-12 flex items-center justify-center rounded-2xl font-black text-[10px] text-gray-500 group-hover:text-white transition-colors">
                                                    {tx.icon}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white group-hover:text-primary transition-colors italic tracking-tight">{tx.to.toUpperCase()}</p>
                                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-1">{tx.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-white text-lg tracking-tighter">{tx.amount}</p>
                                                <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-1 ${tx.status === 'Settled' ? 'text-accent-green' : 'text-secondary animate-pulse'}`}>{tx.status}</p>
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
