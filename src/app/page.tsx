'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getMatches } from '@/lib/supabase/matches';
import { getTeams } from '@/lib/supabase/teams';
import { getAnnouncements } from '@/lib/supabase/announcements';
import { calculateStandings } from '@/lib/standings';
import { Match, Team, Announcement, StandingRow } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StandingsTable from '@/components/StandingsTable';
import MatchCard from '@/components/MatchCard';

/* ── Animated Counter ── */
function CountUp({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [t, m, a] = await Promise.all([getTeams(), getMatches(), getAnnouncements(true)]);
        setTeams(t); setMatches(m); setAnnouncements(a);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  const standings = calculateStandings(teams, matches);
  const liveMatches = matches.filter(m => m.status === 'Live');
  const upcomingMatches = matches.filter(m => m.status === 'Upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completedMatches = matches.filter(m => m.status === 'Completed').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const nextMatch = upcomingMatches[0];

  return (
    <div className="space-y-16 pb-16">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden min-h-[520px] flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#141923] via-[#0D111A] to-[#0B0E14]" />
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-[#E5A93C]/5 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-100px] left-[-50px] w-[400px] h-[400px] bg-[#E5A93C]/3 rounded-full blur-[100px]" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #E5A93C 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left: Text */}
            <div className="max-w-2xl text-center lg:text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-[#E5A93C] text-[11px] font-black tracking-[0.2em] uppercase mb-6">
                <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-pulse" />
                OFFICIAL TOURNAMENT PLATFORM
              </div>

              <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase">
                IMC<br/>
                <span className="text-gradient-gold inline-block" style={{fontSize: '1.1em'}}>
                  LEAGUE
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-black text-gray-500 mt-2 tracking-widest uppercase">Season 04</p>

              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mt-6 max-w-lg">
                Live scoring, dynamic NRR standings, instant match updates, and complete team statistics — all in one place.
              </p>

              <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
                <Link href="/fixtures" className="px-8 py-3.5 rounded-xl gradient-gold text-black font-black text-sm glow-gold hover:brightness-110 transition-all uppercase tracking-wider">
                  Explore Fixtures
                </Link>
                <Link href="/standings" className="px-8 py-3.5 rounded-xl glass-card text-white font-bold text-sm hover:bg-[#1C2333] transition-all uppercase tracking-wider">
                  View Standings
                </Link>
              </div>
            </div>

            {/* Right: Featured Match Card */}
            <div className="w-full lg:w-auto min-w-[320px] max-w-md" style={{animationDelay: '0.2s'}}>
              {liveMatches.length > 0 ? (
                <div className="space-y-3 animate-slide-up">
                  <div className="flex items-center gap-2 text-xs font-black text-red-500 uppercase tracking-widest px-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 live-dot" /> LIVE NOW
                  </div>
                  <MatchCard match={liveMatches[0]} />
                </div>
              ) : nextMatch ? (
                <div className="space-y-3 animate-slide-up">
                  <div className="text-xs font-black text-[#E5A93C] uppercase tracking-widest px-1">
                    🏏 NEXT MATCH
                  </div>
                  <MatchCard match={nextMatch} />
                </div>
              ) : (
                <div className="glass-card p-8 rounded-2xl text-center animate-slide-up">
                  <div className="text-4xl mb-3">🏏</div>
                  <p className="text-lg font-bold text-white">Season 04</p>
                  <p className="text-sm text-gray-500 mt-1">Check back soon for match announcements</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STATS BAR ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Teams', value: teams.length, icon: '🏆' },
            { label: 'Matches', value: matches.length, icon: '🏏' },
            { label: 'Completed', value: completedMatches.length, icon: '✅' },
            { label: 'Live Now', value: liveMatches.length, icon: '⚡' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-5 text-center hover:border-[#E5A93C]/30 transition-all group">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-black text-white group-hover:text-[#E5A93C] transition-colors">
                <CountUp target={stat.value} />
              </div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ STANDINGS + RECENT RESULTS ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Standings */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">League <span className="text-[#E5A93C]">Standings</span></h2>
                <p className="text-xs text-gray-500 mt-1">Live ranking based on NRR</p>
              </div>
              <Link href="/standings" className="text-xs font-black text-[#E5A93C] hover:underline uppercase tracking-wider">
                Full Table →
              </Link>
            </div>
            <StandingsTable standings={standings} limit={5} />
          </div>

          {/* Recent Results */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Recent Results</h3>
              <Link href="/results" className="text-xs font-bold text-[#E5A93C] hover:underline">All →</Link>
            </div>
            <div className="space-y-3">
              {completedMatches.length > 0 ? (
                completedMatches.slice(0, 3).map(match => <MatchCard key={match.id} match={match} showDetails={false} />)
              ) : (
                <div className="glass-card rounded-xl p-6 text-center text-sm text-gray-500">
                  No results yet
                </div>
              )}
            </div>

            {/* Upcoming */}
            {upcomingMatches.length > 0 && (
              <>
                <div className="flex items-end justify-between pt-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Upcoming</h3>
                  <Link href="/fixtures" className="text-xs font-bold text-[#E5A93C] hover:underline">All →</Link>
                </div>
                <div className="space-y-3">
                  {upcomingMatches.slice(0, 2).map(match => <MatchCard key={match.id} match={match} showDetails={false} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
