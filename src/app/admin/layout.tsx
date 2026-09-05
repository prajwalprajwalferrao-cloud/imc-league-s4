import AdminGuard from '@/components/auth/AdminGuard';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#0B0E14]">
        {/* Sidebar */}
        <div className="w-64 bg-[#141923] border-r border-[#232B3E] flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-[#232B3E]">
            <span className="text-lg font-black text-white uppercase tracking-wider text-[#E5A93C]">Admin Panel</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <Link href="/admin" className="block px-4 py-2 text-sm font-bold text-gray-300 hover:bg-[#1C2333] hover:text-white rounded-md">Dashboard</Link>
            <Link href="/admin/teams" className="block px-4 py-2 text-sm font-bold text-gray-300 hover:bg-[#1C2333] hover:text-white rounded-md">Teams</Link>
            <Link href="/admin/players" className="block px-4 py-2 text-sm font-bold text-gray-300 hover:bg-[#1C2333] hover:text-white rounded-md">Players</Link>
            <Link href="/admin/fixtures" className="block px-4 py-2 text-sm font-bold text-gray-300 hover:bg-[#1C2333] hover:text-white rounded-md">Fixtures & Matches</Link>
            <Link href="/admin/announcements" className="block px-4 py-2 text-sm font-bold text-gray-300 hover:bg-[#1C2333] hover:text-white rounded-md">Announcements</Link>
            <Link href="/admin/settings" className="block px-4 py-2 text-sm font-bold text-gray-300 hover:bg-[#1C2333] hover:text-white rounded-md">Settings</Link>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
