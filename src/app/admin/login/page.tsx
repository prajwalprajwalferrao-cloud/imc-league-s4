'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error('Invalid credentials');
      setLoading(false);
    } else {
      toast.success('Logged in successfully');
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0E14]">
      <div className="max-w-md w-full space-y-8 bg-[#141923] p-8 rounded-xl border border-[#232B3E]">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-black text-white uppercase tracking-tight">Admin <span className="text-[#E5A93C]">Access</span></h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to manage the league</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-[#2D384E] bg-[#0B0E14] text-white focus:outline-none focus:border-[#E5A93C] sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-[#2D384E] bg-[#0B0E14] text-white focus:outline-none focus:border-[#E5A93C] sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-black bg-[#E5A93C] hover:bg-[#FFC857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E5A93C] uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
