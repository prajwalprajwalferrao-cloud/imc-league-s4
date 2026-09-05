'use client';

import AdminGuard from '@/components/auth/AdminGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Franchise Teams', href: '/admin/teams', icon: '🛡️' },
    { name: 'Player Roster', href: '/admin/players', icon: '👤' },
    { name: 'Fixtures & Schedule', href: '/admin/fixtures', icon: '🏏' },
    { name: 'Generate Schedule', href: '/admin/fixtures/generate', icon: '⚡' },
  ];

  return (
    <AdminGuard>
      <div className="flex h-screen bg-[#0B0E14] text-gray-100 overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0E131E] border-r border-[#232B3E] flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-[#232B3E]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center font-black text-black text-sm shadow-md group-hover:scale-105 transition-transform">
                IMC
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight block">
                  LEAGUE <span className="text-[#E5A93C]">ADMIN</span>
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block -mt-0.5">
                  Control Center
                </span>
              </div>
            </Link>

            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1C2333]"
            >
              ✕
            </button>
          </div>

          {/* Quick Info Badge */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-[#141923] border border-[#232B3E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-white">Online Mode</p>
                <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{user?.email || 'Administrator'}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/30">
              Admin
            </span>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E5A93C]/20 to-[#E5A93C]/5 text-[#E5A93C] border border-[#E5A93C]/40 shadow-sm'
                      : 'text-gray-400 hover:bg-[#161C2A] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] glow-gold" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#232B3E] space-y-2">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-[#141923] hover:bg-[#1C2333] border border-[#232B3E] transition-all uppercase tracking-wider"
            >
              <span>🌐</span> View Live Website
            </Link>

            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all uppercase tracking-wider"
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar for Mobile & Quick Actions */}
          <header className="h-16 bg-[#0E131E] border-b border-[#232B3E] flex items-center justify-between px-6 lg:px-8 flex-shrink-0">
            <div className="flex items-center gap-4">
              {/* Sidebar toggle button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-[#141923] border border-[#232B3E] text-gray-300 hover:text-white focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="hidden sm:block">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">IMC LEAGUE • SEASON 04</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/fixtures/generate"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold gradient-gold text-black hover:brightness-110 uppercase tracking-wider shadow-sm"
              >
                <span>⚡</span> Quick Schedule
              </Link>
            </div>
          </header>

          {/* Main scrollable body */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
