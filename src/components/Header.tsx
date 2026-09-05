'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show header on admin pages (admin has its own sidebar)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') return null;

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Standings', href: '/standings' },
    { name: 'Fixtures', href: '/fixtures' },
    { name: 'Results', href: '/results' },
    { name: 'Teams', href: '/teams' },
    { name: 'Players', href: '/players' },
    { name: 'Stats', href: '/statistics' },
  ];

  return (
    <header className="bg-[#0D111A]/95 backdrop-blur-md border-b border-[#232B3E] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg gradient-gold flex items-center justify-center shadow-lg">
              <span className="text-black font-black text-sm">IMC</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black text-white tracking-tight">
                IMC <span className="text-[#E5A93C]">LEAGUE</span>
              </span>
              <span className="block text-[10px] text-gray-500 -mt-1 font-bold tracking-widest">SEASON 04</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C]/20'
                    : 'text-gray-400 hover:text-white hover:bg-[#1C2333]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-2 px-4 py-2 gradient-gold text-black text-xs font-black rounded-lg glow-gold transition-all hover:brightness-110 uppercase tracking-wider"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                Admin
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#1C2333] transition-colors"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0D111A] border-t border-[#232B3E] animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider ${
                  isActive(link.href)
                    ? 'bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C]/20'
                    : 'text-gray-400 hover:bg-[#1C2333] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-black gradient-gold text-center mt-3"
              >
                ⚙️ Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
