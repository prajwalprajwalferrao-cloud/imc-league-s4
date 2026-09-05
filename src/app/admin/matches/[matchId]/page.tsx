'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMatch, updateMatch, subscribeToMatch } from '@/lib/supabase/matches';
import { getTeams } from '@/lib/supabase/teams';
import { getPlayers } from '@/lib/supabase/players';
import { completeMatch } from '@/lib/supabase/completeMatch';
import { Match, Team, Player } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminMatchControl({ params }: { params: { matchId: string } }) {
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;
    
    async function loadData() {
      try {
        const initialMatch = await getMatch(params.matchId);
        if (!initialMatch) {
          toast.error('Match not found');
          router.push('/admin/fixtures');
          return;
        }

        const [t, p] = await Promise.all([getTeams(), getPlayers()]);
        
        setHomeTeam(t.find(team => team.id === initialMatch.home_team_id) || null);
        setAwayTeam(t.find(team => team.id === initialMatch.away_team_id) || null);
        setPlayers(p.filter(player => player.team_id === initialMatch.home_team_id || player.team_id === initialMatch.away_team_id));
        
        unsubscribe = subscribeToMatch(params.matchId, (m) => {
          setMatch(m);
          setLoading(false);
        });
      } catch (err) {
        toast.error('Failed to load match data');
      }
    }
    
    loadData();
    return () => { if (unsubscribe) unsubscribe(); };
  }, [params.matchId]);

  const handleUpdateScore = async (team: 'home' | 'away', type: 'runs' | 'wickets' | 'overs', value: number) => {
    if (!match) return;
    const field = `${team}_${type === "runs" ? "score" : type}`;
    try {
      await updateMatch(match.id, { [field]: value });
    } catch (err) {
      toast.error('Failed to update score');
    }
  };

  const handleCompleteMatch = async () => {
    if (!match) return;
    if (confirm('Are you sure you want to complete this match? This will update all standings and player stats permanently.')) {
      try {
        await completeMatch(match.id);
        toast.success('Match completed successfully');
        router.push('/admin/fixtures');
      } catch (err) {
        toast.error('Failed to complete match');
        console.error(err);
      }
    }
  };

  if (loading || !match || !homeTeam || !awayTeam) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white uppercase">Match Control</h1>
        <div className="flex gap-4">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white text-sm font-bold">Back</button>
          {match.status !== 'Completed' && (
            <button onClick={handleCompleteMatch} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-md">
              Complete Match
            </button>
          )}
        </div>
      </div>

      <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center w-1/3">
            <h2 className="text-xl font-bold text-white">{homeTeam.name}</h2>
            <div className="mt-4 flex flex-col gap-4 items-center">
              <div>
                <label className="block text-xs text-gray-400 uppercase">Runs</label>
                <input type="number" value={match.home_score} onChange={e => handleUpdateScore('home', 'runs', parseInt(e.target.value) || 0)} className="w-20 text-center bg-[#0B0E14] border border-[#2D384E] rounded p-2 text-xl font-bold text-white" />
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase">Wickets</label>
                  <input type="number" value={match.home_wickets} max="10" onChange={e => handleUpdateScore('home', 'wickets', parseInt(e.target.value) || 0)} className="w-16 text-center bg-[#0B0E14] border border-[#2D384E] rounded p-1 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase">Overs</label>
                  <input type="number" step="0.1" value={match.home_overs} onChange={e => handleUpdateScore('home', 'overs', parseFloat(e.target.value) || 0)} className="w-16 text-center bg-[#0B0E14] border border-[#2D384E] rounded p-1 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center w-1/3">
            <div className="text-3xl font-black text-[#E5A93C]">VS</div>
            <div className={`mt-2 px-3 py-1 inline-block rounded-full text-xs font-bold border ${match.status === 'Live' ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
              {match.status}
            </div>
          </div>
          
          <div className="text-center w-1/3">
            <h2 className="text-xl font-bold text-white">{awayTeam.name}</h2>
            <div className="mt-4 flex flex-col gap-4 items-center">
              <div>
                <label className="block text-xs text-gray-400 uppercase">Runs</label>
                <input type="number" value={match.away_score} onChange={e => handleUpdateScore('away', 'runs', parseInt(e.target.value) || 0)} className="w-20 text-center bg-[#0B0E14] border border-[#2D384E] rounded p-2 text-xl font-bold text-white" />
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase">Wickets</label>
                  <input type="number" value={match.away_wickets} max="10" onChange={e => handleUpdateScore('away', 'wickets', parseInt(e.target.value) || 0)} className="w-16 text-center bg-[#0B0E14] border border-[#2D384E] rounded p-1 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase">Overs</label>
                  <input type="number" step="0.1" value={match.away_overs} onChange={e => handleUpdateScore('away', 'overs', parseFloat(e.target.value) || 0)} className="w-16 text-center bg-[#0B0E14] border border-[#2D384E] rounded p-1 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
