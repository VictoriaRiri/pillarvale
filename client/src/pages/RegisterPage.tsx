import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic: Create user account -> Redirect to dashboard or login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <h2 className="text-4xl font-bold tracking-tighter text-center">Create Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-4 rounded-xl border border-gray-100 bg-white outline-none" required />
          <input type="email" placeholder="Work Email" className="w-full p-4 rounded-xl border border-gray-100 bg-white outline-none" required />
          <input type="password" placeholder="Create Password" className="w-full p-4 rounded-xl border border-gray-100 bg-white outline-none" required />
          <button type="submit" className="w-full bg-stripe-blue text-white py-4 rounded-xl font-bold shadow-lg hover:brightness-110 transition">
            Start Settlement Now
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Already have an account? <button onClick={() => navigate('/login')} className="text-black font-bold underline">Sign In</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
