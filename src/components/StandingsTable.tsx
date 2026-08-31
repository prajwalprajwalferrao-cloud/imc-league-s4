import React from 'react';
import { StandingRow } from '@/lib/types';
import Link from 'next/link';

interface StandingsTableProps {
  standings: StandingRow[];
  limit?: number;
}

export function StandingsTable({ standings, limit }: StandingsTableProps) {
  const displayRows = limit ? standings.slice(0, limit) : standings;

  return (
    <div className="bg-[#141923] border border-[#232B3E] rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#0B0E14] text-gray-400 font-bold uppercase tracking-wider text-[11px] border-b border-[#232B3E]">
            <tr>
              <th className="py-3 px-3 sm:px-4 text-center">POS</th>
              <th className="py-3 px-3 sm:px-4">TEAM</th>
              <th className="py-3 px-2 sm:px-3 text-center">P</th>
              <th className="py-3 px-2 sm:px-3 text-center">W</th>
              <th className="py-3 px-2 sm:px-3 text-center">D</th>
              <th className="py-3 px-2 sm:px-3 text-center">L</th>
              <th className="py-3 px-2 sm:px-3 text-center hidden sm:table-cell">GF</th>
              <th className="py-3 px-2 sm:px-3 text-center hidden sm:table-cell">GA</th>
              <th className="py-3 px-2 sm:px-3 text-center">GD</th>
              <th className="py-3 px-3 sm:px-4 text-center text-[#E5A93C] font-extrabold">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C2333]">
            {displayRows.map((row) => (
              <tr key={row.team.id} className="hover:bg-[#1C2333]/60 transition-colors">
                <td className="py-3.5 px-3 sm:px-4 text-center font-extrabold">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                    row.position === 1 ? 'bg-[#E5A93C] text-black font-black' :
                    row.position === 2 ? 'bg-gray-300 text-black font-black' :
                    row.position === 3 ? 'bg-amber-700 text-white font-bold' : 'text-gray-400'
                  }`}>
                    {row.position}
                  </span>
                </td>

                <td className="py-3.5 px-3 sm:px-4 font-bold text-white">
                  <Link href={`/teams/${row.team.id}`} className="flex items-center space-x-3 group">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-black shadow-sm group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: row.team.color_hex }}
                    >
                      {row.team.short_name}
                    </div>
                    <span className="group-hover:text-[#E5A93C] transition-colors truncate">
                      {row.team.name}
                    </span>
                  </Link>
                </td>

                <td className="py-3.5 px-2 sm:px-3 text-center text-gray-300 font-semibold">{row.played}</td>
                <td className="py-3.5 px-2 sm:px-3 text-center text-emerald-400 font-semibold">{row.won}</td>
                <td className="py-3.5 px-2 sm:px-3 text-center text-gray-400 font-semibold">{row.drawn}</td>
                <td className="py-3.5 px-2 sm:px-3 text-center text-rose-400 font-semibold">{row.lost}</td>
                <td className="py-3.5 px-2 sm:px-3 text-center text-gray-400 hidden sm:table-cell">{row.goalsFor}</td>
                <td className="py-3.5 px-2 sm:px-3 text-center text-gray-400 hidden sm:table-cell">{row.goalsAgainst}</td>
                <td className="py-3.5 px-2 sm:px-3 text-center font-bold text-gray-200">
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center font-black text-base text-[#E5A93C]">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
