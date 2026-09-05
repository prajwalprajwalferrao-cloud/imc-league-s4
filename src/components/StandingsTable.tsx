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
    <div className="bg-[#141923] border border-[#232B3E] rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#2D384E]">
          <thead className="bg-[#0B0E14]">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider w-12">Pos</th>
              <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">Club</th>
              <th className="px-3 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-wider hidden sm:table-cell">Played</th>
              <th className="px-3 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-wider">W</th>
              <th className="px-3 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-wider">L</th>
              <th className="px-3 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-wider hidden md:table-cell">NR</th>
              <th className="px-4 py-3 text-center text-[10px] font-black text-[#E5A93C] uppercase tracking-wider">NRR</th>
              <th className="px-4 py-3 text-center text-[10px] font-black text-white uppercase tracking-wider bg-[#1C2333]/50">Pts</th>
              <th className="px-4 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-wider hidden lg:table-cell">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D384E]">
            {displayStandings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                  No standings available yet.
                </td>
              </tr>
            ) : (
              displayStandings.map((row) => (
                <tr key={row.team.id} className="hover:bg-[#1C2333] transition-colors group">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-400">
                    {row.position}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link href={`/teams/${row.team.id}`} className="flex items-center group-hover:text-[#E5A93C] transition-colors">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full border border-[#2D384E] bg-[#0B0E14] overflow-hidden flex items-center justify-center">
                        {row.team.logoUrl ? (
                          <img src={row.team.logoUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[8px] font-bold" style={{ color: row.team.colour || '#fff' }}>{row.team.shortName}</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <span className="text-sm font-bold text-white hidden sm:block">{row.team.name}</span>
                        <span className="text-sm font-bold text-white sm:hidden">{row.team.shortName}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-gray-300 hidden sm:table-cell">{row.played}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-gray-300">{row.won}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-gray-300">{row.lost}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-gray-300 hidden md:table-cell">{row.noResult}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-[#E5A93C]">
                    {row.nrr > 0 ? '+' : ''}{row.nrr.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-black text-white bg-[#1C2333]/30">
                    {row.points}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center hidden lg:table-cell">
                    <FormGuide form={row.recentForm} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
