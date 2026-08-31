import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#080A0E] border-t border-[#1C2333] py-10 mt-16 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#E5A93C] flex items-center justify-center font-extrabold text-black text-sm">
              IMC
            </div>
            <div>
              <p className="text-sm font-bold text-white">IMC LEAGUE – SEASON 04</p>
              <p className="text-gray-500">Official Management & Live Scoring Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-[#E5A93C]">Home</Link>
            <Link href="/fixtures" className="hover:text-[#E5A93C]">Fixtures</Link>
            <Link href="/standings" className="hover:text-[#E5A93C]">Standings</Link>
            <Link href="/teams" className="hover:text-[#E5A93C]">Teams</Link>
            <Link href="/admin/login" className="hover:text-[#E5A93C] text-gray-300">Admin Login</Link>
          </div>
        </div>

        <div className="border-t border-[#141A26] mt-8 pt-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} IMC LEAGUE. All rights reserved. Real-time scores and statistics powered by Supabase.</p>
        </div>
      </div>
    </footer>
  );
}
