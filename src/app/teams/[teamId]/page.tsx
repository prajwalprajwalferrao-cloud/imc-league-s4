'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTeams, getTeam } from '@/lib/supabase/teams';
import { getPlayers } from '@/lib/supabase/players';
import { getMatches } from '@/lib/supabase/matches';
import { Team, Player, Match } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import MatchCard from '@/components/MatchCard';

export default function TeamDetailPage({ params }: { params: { teamId: string } }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [allTeams, allPlayers, allMatches] = await Promise.all([
          getTeams(),
          getPlayers(),
          getMatches()
        ]);
        const currentTeam = allTeams.find(t => t.id === params.teamId) || null;
        setTeam(currentTeam);
        setPlayers(allPlayers.filter(p => p.team_id === params.teamId));
        setMatches(allMatches.filter(m => m.home_team_id === params.teamId || m.away_team_id === params.teamId));
      } catch (err) {
        console.error('Failed to load team details', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.teamId]);

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;
  if (!team) return (
    <div className="py-20 text-center text-gray-400">
      <h2 className="text-xl font-bold">Team not found</h2>
      <Link href="/teams" className="text-[#E5A93C] hover:underline mt-4 inline-block">Back to Teams</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-slide-up">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-[#232B3E] shadow-2xl">
        <div 
          className="h-40 sm:h-52 w-full relative"
          style={{ backgroundColor: team.colour || '#1C2333' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E131E] via-[#0E131E]/60 to-transparent" />
        </div>

        <div className="px-6 sm:px-10 pb-8 relative -mt-16 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            <div 
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-[#0B0E14] border-4 border-[#141923] flex items-center justify-center overflow-hidden shadow-2xl"
              style={{ borderColor: team.colour || '#E5A93C' }}
            >
              {team.logo_url ? (
                <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl sm:text-4xl font-black" style={{ color: team.colour || '#E5A93C' }}>
                  {team.short_name}
                </span>
              )}
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C]/20 mb-2">
                FRANCHISE SQUAD
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">{team.name}</h1>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">{team.short_name} • IMC SEASON 4</p>
            </div>
          </div>

          <div className="flex gap-4 text-center">
            <div className="glass-card px-5 py-3 rounded-xl border border-[#232B3E]">
              <span className="text-[10px] font-black uppercase text-gray-500 block">Captain</span>
              <span className="text-sm font-bold text-white">{team.captain || 'TBA'}</span>
            </div>
            <div className="glass-card px-5 py-3 rounded-xl border border-[#232B3E]">
              <span className="text-[10px] font-black uppercase text-gray-500 block">Manager</span>
              <span className="text-sm font-bold text-white">{team.manager || 'TBA'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Squad Players */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#232B3E] pb-4">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Team <span className="text-[#E5A93C]">Roster</span></h2>
            <p className="text-xs text-gray-400 mt-1">Official registered players for this franchise ({players.length} players)</p>
          </div>
          <Link href="/players" className="text-xs font-bold text-[#E5A93C] hover:underline uppercase">All League Players →</Link>
        </div>

        {players.length === 0 ? (
          <div className="glass-card p-10 rounded-2xl text-center text-gray-500">
            No players assigned to this team yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {players.map(player => (
              <div key={player.id} className="glass-card rounded-2xl p-5 border border-[#232B3E] hover:border-[#E5A93C]/50 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0B0E14] border border-[#2D384E] flex items-center justify-center overflow-hidden">
                    {player.photo_url ? (
                      <img src={player.photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <span className="text-2xl font-black font-mono text-gray-600 group-hover:text-[#E5A93C] transition-colors">
                    #{player.jersey_number.toString().padStart(2, '0')}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base truncate">{player.name}</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#1C2333] text-gray-300 border border-[#2D384E]">
                  {player.position}
                </span>

                <div className="mt-4 pt-4 border-t border-[#1F2637] flex justify-between text-xs font-bold">
                  <span className="text-gray-400">Runs: <strong className="text-white">{player.runs_scored}</strong></span>
                  <span className="text-gray-400">Wickets: <strong className="text-[#E5A93C]">{player.wickets_taken}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Match Fixtures for this team */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Team <span className="text-[#E5A93C]">Matches</span></h2>
        {matches.length === 0 ? (
          <div className="glass-card p-10 rounded-2xl text-center text-gray-500">
            No matches scheduled for this team yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
