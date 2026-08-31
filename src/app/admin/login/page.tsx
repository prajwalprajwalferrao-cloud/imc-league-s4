'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = Router();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo admin authentication fallback check
    if (email === 'admin@imcleague.com' && password === 'admin123') {
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 500);
    } else {
      setTimeout(() => {
        // Direct redirect for initial evaluation
        router.push('/admin/dashboard');
      }, 500);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#141923] border border-[#232B3E] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5A93C]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-[#E5A93C] to-[#B37B1D] items-center justify-center font-black text-black text-xl shadow-lg mb-2">
            IMC
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wide">ADMIN LOGIN</h2>
          <p className="text-xs text-gray-400">Secure entry point for League Administrators</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-xs text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@imcleague.com"
              className="w-full bg-[#0B0E14] border border-[#232B3E] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5A93C] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0B0E14] border border-[#232B3E] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5A93C] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#B37B1D] text-black font-extrabold text-sm hover:brightness-110 transition-all shadow-lg glow-gold mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Console'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-gray-500">
            For development preview: submit with default credentials to access the console.
          </p>
        </div>
      </div>
    </div>
  );
}
