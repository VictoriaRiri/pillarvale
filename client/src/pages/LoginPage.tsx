import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic: Validate user -> Set State -> Redirect
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <h2 className="text-4xl font-bold tracking-tighter text-center">Sign in</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 ring-black/5" required />
          <input type="password" placeholder="Password" className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 ring-black/5" required />
          <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg hover:bg-zinc-800 transition">
            Access Account
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          New to PillarVale? <button onClick={() => navigate('/register')} className="text-black font-bold underline">Register</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

