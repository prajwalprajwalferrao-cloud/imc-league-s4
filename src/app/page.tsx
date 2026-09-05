'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMatches, subscribeToLiveMatches } from '@/lib/firestore/matches';
import { getTeams } from '@/lib/firestore/teams';
import { getAnnouncements } from '@/lib/firestore/announcements';
import { calculateStandings } from '@/lib/standings';
import { Match, Team, Announcement, StandingRow } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Placeholder components, to be implemented
const MatchCard = ({ match, showDetails }: any) => <div className="p-4 bg-[#141923] border border-[#232B3E] rounded-xl text-center text-sm">Match Card Placeholder: {match.id}</div>;
const StandingsTable = ({ standings, limit }: any) => <div className="p-4 bg-[#141923] border border-[#232B3E] rounded-xl text-center text-sm">Standings Table Placeholder</div>;

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [t, m, a] = await Promise.all([
          getTeams(),
          getMatches(),
          getAnnouncements(true)
        ]);
        setTeams(t);
        setMatches(m);
        setAnnouncements(a);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    // Assuming 'active_season_id' for now, or just global
    const unsubscribe = subscribeToLiveMatches('', (live) => {
      setLiveMatches(live);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  const standings = calculateStandings(teams, matches);
  const liveMatch = liveMatches.length > 0 ? liveMatches[0] : null;
  const upcomingMatches = matches.filter((m) => m.status === 'Upcoming').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completedMatches = matches.filter((m) => m.status === 'Completed').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const nextMatch = upcomingMatches[0];

  return (
    <div className="space-y-12 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#141923] via-[#0D111A] to-[#0B0E14] border-b border-[#232B3E] pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E5A93C]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          <div className="space-y-4 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] text-xs font-black tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-ping"></span>
              <span>OFFICIAL LEAGUE PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none">
              IMC LEAGUE <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFC857] via-[#E5A93C] to-[#B37B1D]">
                SEASON 04
              </span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Experience modern live scoring, instant match updates, dynamic NRR standings, and complete team statistics 24/7.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link
                href="/fixtures"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#B37B1D] text-black font-extrabold text-sm hover:brightness-110 transition-all shadow-lg glow-gold"
              >
                Explore Fixtures
              </Link>
              <Link
                href="/standings"
                className="px-6 py-3 rounded-lg bg-[#1C2333] hover:bg-[#252E42] text-white font-bold text-sm border border-[#2D384E] transition-all"
              >
                View Full Standings
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto min-w-[320px] max-w-md">
            {liveMatch ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#FF3B30] uppercase tracking-wider px-1">
                  <span>⚡ LIVE MATCH IN PROGRESS</span>
                </div>
                <MatchCard match={liveMatch} />
              </div>
            ) : nextMatch ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#E5A93C] uppercase tracking-wider px-1">
                  <span>🗓️ NEXT UPCOMING MATCH</span>
                </div>
                <MatchCard match={nextMatch} />
              </div>
            ) : (
              <div className="bg-[#141923] p-6 rounded-xl border border-[#232B3E] text-center">
                <p className="text-sm font-bold text-gray-300">Season 04 in progress</p>
                <p className="text-xs text-gray-500 mt-1">Check back soon for upcoming match announcements</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-wide uppercase">LEAGUE STANDINGS</h2>
                <p className="text-xs text-gray-400">Live derived ranking based on match results</p>
              </div>
              <Link href="/standings" className="text-xs font-extrabold text-[#E5A93C] hover:underline">
                View Full Table →
              </Link>
            </div>
            <StandingsTable standings={standings} limit={5} />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">RECENT RESULTS</h3>
                <Link href="/results" className="text-xs font-bold text-[#E5A93C] hover:underline">All</Link>
              </div>
              <div className="space-y-3">
                {completedMatches.slice(0, 2).map((match) => (
                  <MatchCard key={match.id} match={match} showDetails={false} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
