import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here. 
    // For now, we just redirect to show off your new Dashboard!
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-2xl bg-black text-white mb-6">
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-noir-black">Welcome back</h2>
          <p className="text-gray-500 mt-2">Enter your details to access your account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition"
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-black/10"
          >
            Sign in to PillarVale
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account? <a href="/register" className="text-black font-bold">Get started</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
