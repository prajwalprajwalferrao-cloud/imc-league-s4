import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0B0E14]/90 backdrop-blur-md border-b border-[#232B3E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E5A93C] to-[#B37B1D] flex items-center justify-center font-black text-black text-lg tracking-wider shadow-lg group-hover:scale-105 transition-transform">
              IMC
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-wide block leading-none">
                IMC LEAGUE
              </span>
              <span className="text-[10px] font-bold text-[#E5A93C] tracking-widest uppercase block mt-0.5">
                SEASON 04
              </span>
            </div>
          </Link>

          {/* Public Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink href="/" label="Home" />
            <NavLink href="/fixtures" label="Fixtures" />
            <NavLink href="/results" label="Results" />
            <NavLink href="/standings" label="Standings" />
            <NavLink href="/teams" label="Teams" />
            <NavLink href="/statistics" label="Stats" />
          </nav>

          {/* Admin Login Link */}
          <div>
            <Link
              href="/admin/login"
              className="text-xs font-semibold px-3.5 py-2 rounded-md bg-[#1C2333] hover:bg-[#E5A93C] text-gray-300 hover:text-black border border-[#2D384E] hover:border-[#E5A93C] transition-all shadow-sm flex items-center space-x-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Admin Area</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-[#1C2333] text-xs font-semibold overflow-x-auto no-scrollbar space-x-4 px-1">
          <Link href="/" className="text-gray-300 hover:text-[#E5A93C] whitespace-nowrap py-1">Home</Link>
          <Link href="/fixtures" className="text-gray-300 hover:text-[#E5A93C] whitespace-nowrap py-1">Fixtures</Link>
          <Link href="/results" className="text-gray-300 hover:text-[#E5A93C] whitespace-nowrap py-1">Results</Link>
          <Link href="/standings" className="text-gray-300 hover:text-[#E5A93C] whitespace-nowrap py-1">Standings</Link>
          <Link href="/teams" className="text-gray-300 hover:text-[#E5A93C] whitespace-nowrap py-1">Teams</Link>
          <Link href="/statistics" className="text-gray-300 hover:text-[#E5A93C] whitespace-nowrap py-1">Stats</Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-md text-sm font-semibold text-gray-300 hover:text-white hover:bg-[#1C2333] transition-colors"
    >
      {label}
    </Link>
  );
}
