import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0B0E14] border-t border-[#232B3E] py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-black text-white tracking-tight uppercase">
              IMC <span className="text-[#E5A93C]">League</span>
            </span>
            <p className="text-xs text-gray-500 mt-1">Season 4 • Cricket Tournament</p>
          </div>
          
          <div className="flex space-x-6">
            <Link href="/standings" className="text-gray-400 hover:text-[#E5A93C] text-sm">Standings</Link>
            <Link href="/fixtures" className="text-gray-400 hover:text-[#E5A93C] text-sm">Fixtures</Link>
            <Link href="/teams" className="text-gray-400 hover:text-[#E5A93C] text-sm">Teams</Link>
            <Link href="/players" className="text-gray-400 hover:text-[#E5A93C] text-sm">Players</Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#232B3E] text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} IMC League. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
