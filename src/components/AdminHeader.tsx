import React from 'react';
import Link from 'next/link';

export function AdminHeader() {
  return (
    <header className="bg-[#0B0E14] border-b border-[#232B3E] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E5A93C] to-[#B37B1D] flex items-center justify-center font-black text-black text-sm">
              IMC
            </div>
            <div>
              <span className="font-extrabold text-white text-base">ADMIN CONSOLE</span>
              <span className="text-[10px] font-bold text-[#E5A93C] block uppercase tracking-wider">IMC LEAGUE S04</span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold">
            <AdminLink href="/admin/dashboard" label="Dashboard" />
            <AdminLink href="/admin/seasons" label="Seasons" />
            <AdminLink href="/admin/teams" label="Teams" />
            <AdminLink href="/admin/players" label="Players" />
            <AdminLink href="/admin/fixtures" label="Fixtures & Generator" />
            <AdminLink href="/admin/announcements" label="Announcements" />
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold text-[#E5A93C] hover:underline flex items-center space-x-1"
            >
              <span>View Public Site</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile menu bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-[#1C2333] text-xs font-semibold overflow-x-auto no-scrollbar space-x-4">
          <Link href="/admin/dashboard" className="text-gray-300 hover:text-[#E5A93C]">Dashboard</Link>
          <Link href="/admin/seasons" className="text-gray-300 hover:text-[#E5A93C]">Seasons</Link>
          <Link href="/admin/teams" className="text-gray-300 hover:text-[#E5A93C]">Teams</Link>
          <Link href="/admin/players" className="text-gray-300 hover:text-[#E5A93C]">Players</Link>
          <Link href="/admin/fixtures" className="text-gray-300 hover:text-[#E5A93C]">Fixtures</Link>
          <Link href="/admin/announcements" className="text-gray-300 hover:text-[#E5A93C]">Announcements</Link>
        </div>
      </div>
    </header>
  );
}

function AdminLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-[#1C2333] transition-colors"
    >
      {label}
    </Link>
  );
}
