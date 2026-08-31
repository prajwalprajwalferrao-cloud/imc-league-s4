'use client';

import React from 'react';
import { AdminHeader } from '@/components/AdminHeader';
import { MOCK_TEAMS, MOCK_MATCHES } from '@/lib/mockData';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const liveMatches = MOCK_MATCHES.filter((m) => m.status === 'Live' || m.status === 'Half Time');
  const upcomingMatches = MOCK_MATCHES.filter((m) => m.status === 'Scheduled');
  const completedMatches = MOCK_MATCHES.filter((m) => m.status === 'Completed');

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-100 pb-16">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#232B3E] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
              ADMINISTRATOR DASHBOARD
            </h1>
            <p className="text-xs text-gray-400">IMC LEAGUE – SEASON 04 Management Console</p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/fixtures"
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#B37B1D] text-black font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center space-x-2"
            >
              <span>⚡ Generate Schedule</span>
            </Link>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Total Teams" value={MOCK_TEAMS.length} subtitle="Active in Season 04" icon="🛡️" />
          <KpiCard title="Live Matches" value={liveMatches.length} subtitle="Requires live scoring" icon="🔴" isLive={liveMatches.length > 0} />
          <KpiCard title="Upcoming Matches" value={upcomingMatches.length} subtitle="Scheduled games" icon="🗓️" />
          <KpiCard title="Completed Matches" value={completedMatches.length} subtitle="Finalized scores" icon="✅" />
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-white uppercase tracking-wider">Quick Management Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              title="Teams & Logos"
              desc="Create teams, upload logos, set captains"
              href="/admin/teams"
              icon="🛡️"
            />
            <QuickActionCard
              title="Players & Photos"
              desc="Manage squad rosters & player info"
              href="/admin/players"
              icon="🏃"
            />
            <QuickActionCard
              title="Fixture Generator"
              desc="Auto-generate Round Robin & Knockouts"
              href="/admin/fixtures"
              icon="📅"
            />
            <QuickActionCard
              title="Announcements"
              desc="Post news & priority league alerts"
              href="/admin/announcements"
              icon="📢"
            />
          </div>
        </div>

        {/* Active Matches Scoring Console Access */}
        <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] animate-ping"></span>
              <span>Matches Available for Scoring</span>
            </h2>
            <Link href="/admin/fixtures" className="text-xs font-bold text-[#E5A93C] hover:underline">
              Manage All Fixtures →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {MOCK_MATCHES.map((match) => (
              <div key={match.id} className="bg-[#0B0E14] border border-[#232B3E] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    match.status === 'Live' ? 'bg-rose-500/20 text-rose-400' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {match.status}
                  </span>
                  <h4 className="font-extrabold text-white text-sm mt-1">
                    {match.home_team?.name} vs {match.away_team?.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Score: {match.home_score} - {match.away_score}
                  </p>
                </div>

                <Link
                  href={`/admin/live-score/${match.id}`}
                  className="px-3.5 py-2 rounded bg-[#E5A93C] hover:bg-[#FFC857] text-black font-extrabold text-xs transition-all shadow-md"
                >
                  Score Console ⚡
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function KpiCard({ title, value, subtitle, icon, isLive }: { title: string; value: number; subtitle: string; icon: string; isLive?: boolean }) {
  return (
    <div className={`bg-[#141923] border ${isLive ? 'border-[#FF3B30] glow-live' : 'border-[#232B3E]'} rounded-xl p-5 space-y-1`}>
      <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase">
        <span>{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="text-[11px] text-gray-500">{subtitle}</div>
    </div>
  );
}

function QuickActionCard({ title, desc, href, icon }: { title: string; desc: string; href: string; icon: string }) {
  return (
    <Link
      href={href}
      className="bg-[#141923] border border-[#232B3E] hover:border-[#E5A93C] rounded-xl p-5 transition-all group space-y-2"
    >
      <div className="text-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-extrabold text-white text-sm group-hover:text-[#E5A93C] transition-colors">{title}</h3>
      <p className="text-xs text-gray-400">{desc}</p>
    </Link>
  );
}
