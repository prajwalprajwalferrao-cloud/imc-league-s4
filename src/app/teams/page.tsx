'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTeams } from '@/lib/firestore/teams';
import { Team } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeams().then(t => {
      setTeams(t);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Franchise <span className="text-[#E5A93C]">Teams</span></h1>
        <p className="text-gray-400 text-sm">The official squads competing in Season 4.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teams.map(team => (
          <Link key={team.id} href={`/teams/${team.id}`} className="group">
            <div className="bg-[#141923] border border-[#232B3E] rounded-xl overflow-hidden hover:border-[#E5A93C] transition-all">
              <div 
                className="h-24 w-full relative"
                style={{ backgroundColor: team.colour || '#1C2333' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#141923] to-transparent opacity-80" />
              </div>
              
              <div className="px-6 pb-6 pt-0 relative">
                <div className="flex justify-center -mt-12 mb-4 relative z-10">
                  <div className="w-24 h-24 rounded-full border-4 border-[#141923] bg-[#0B0E14] flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                    {team.logoUrl ? (
                      <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-white">{team.shortName}</span>
                    )}
                  </div>
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-wide group-hover:text-[#E5A93C] transition-colors">{team.name}</h3>
                  <p className="text-xs font-bold text-gray-500">{team.shortName}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-[#232B3E] grid grid-cols-2 gap-2 text-center text-xs">
                  <div>
                    <p className="text-gray-500 uppercase font-black">Captain</p>
                    <p className="text-white font-bold truncate">{team.captain || 'TBA'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase font-black">Manager</p>
                    <p className="text-white font-bold truncate">{team.manager || 'TBA'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
