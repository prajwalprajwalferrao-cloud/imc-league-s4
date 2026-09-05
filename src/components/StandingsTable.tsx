'use client';

import { StandingRow } from '@/lib/types';
import Link from 'next/link';
import FormGuide from './FormGuide';

interface Props {
  standings: StandingRow[];
  limit?: number;
}

export default function StandingsTable({ standings, limit }: Props) {
  const displayStandings = limit ? standings.slice(0, limit) : standings;

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-[#232B3E] shadow-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#232B3E]">
          <thead>
            <tr className="bg-[#0B0E14]/80 text-[10px] font-black uppercase tracking-wider text-gray-400">
              <th scope="col" className="px-4 py-3.5 text-center w-12">#</th>
              <th scope="col" className="px-4 py-3.5 text-left">Franchise</th>
              <th scope="col" className="px-3 py-3.5 text-center hidden sm:table-cell">P</th>
              <th scope="col" className="px-3 py-3.5 text-center text-emerald-400">W</th>
              <th scope="col" className="px-3 py-3.5 text-center text-rose-400">L</th>
              <th scope="col" className="px-3 py-3.5 text-center text-gray-400 hidden md:table-cell">NR</th>
              <th scope="col" className="px-4 py-3.5 text-center text-[#E5A93C]">NRR</th>
              <th scope="col" className="px-4 py-3.5 text-center text-white bg-[#1C2333]/50 font-black">PTS</th>
              <th scope="col" className="px-4 py-3.5 text-center hidden lg:table-cell">Recent Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2637]">
            {displayStandings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-500 font-medium">
                  No standings data available yet.
                </td>
              </tr>
            ) : (
              displayStandings.map((row, idx) => {
                const isTop4 = idx < 4;
                return (
                  <tr 
                    key={row.team.id} 
                    className="hover:bg-[#1A2130]/80 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap text-center text-xs font-black">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-black ${
                        idx === 0 
                          ? 'bg-[#E5A93C] text-black shadow-md glow-gold' 
                          : isTop4 
                            ? 'bg-[#1C2333] text-gray-200 border border-[#2D384E]' 
                            : 'text-gray-500'
                      }`}>
                        {row.position}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <Link href={`/teams`} className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg bg-[#0B0E14] border border-[#2D384E] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform"
                          style={{ borderColor: row.team.colour ? `${row.team.colour}60` : '#2D384E' }}
                        >
                          {row.team.logo_url ? (
                            <img src={row.team.logo_url} alt={row.team.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-black" style={{ color: row.team.colour || '#E5A93C' }}>
                              {row.team.short_name}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white group-hover:text-[#E5A93C] transition-colors block">
                            {row.team.name}
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            {row.team.short_name}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center text-xs font-bold text-gray-300 hidden sm:table-cell">
                      {row.played}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center text-xs font-bold text-emerald-400">
                      {row.won}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center text-xs font-bold text-rose-400">
                      {row.lost}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center text-xs font-bold text-gray-400 hidden md:table-cell">
                      {row.noResult}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-center font-mono text-xs font-black text-[#E5A93C]">
                      {row.nrr > 0 ? `+${row.nrr.toFixed(3)}` : row.nrr.toFixed(3)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-center text-sm font-black text-white bg-[#1C2333]/30">
                      <span className="px-2.5 py-1 rounded-md bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C]">
                        {row.points}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-center hidden lg:table-cell">
                      <FormGuide form={row.recentForm} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
