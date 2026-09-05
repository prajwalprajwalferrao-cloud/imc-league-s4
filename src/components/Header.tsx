'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

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
    <header className="bg-[#0D111A] border-b border-[#232B3E] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-black text-white tracking-tight uppercase">
                IMC <span className="text-[#E5A93C]">League</span>
              </span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold uppercase tracking-wider ${
                    isActive(link.href) && link.href !== '/' || (link.href === '/' && pathname === '/')
                      ? 'border-[#E5A93C] text-white'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 border border-[#E5A93C] text-[#E5A93C] hover:bg-[#E5A93C] hover:text-black text-sm font-bold rounded-md transition-colors uppercase tracking-wider"
              >
                Admin Panel
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#141923] border-b border-[#232B3E]">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-bold uppercase ${
                  isActive(link.href) && link.href !== '/' || (link.href === '/' && pathname === '/')
                    ? 'bg-[#1C2333] border-[#E5A93C] text-white'
                    : 'border-transparent text-gray-400 hover:bg-[#1C2333] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-bold uppercase text-[#E5A93C] hover:bg-[#1C2333]"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
