import { Match } from './types';

export function formatScore(runs: number, wickets: number, overs?: number): string {
  if (overs !== undefined) {
    return `${runs}/${wickets} (${overs} ov)`;
  }
  return `${runs}/${wickets}`;
}

export function parseOversToDecimal(overs: number): number {
  const fullOvers = Math.floor(overs);
  const balls = Math.round((overs - fullOvers) * 10);
  return fullOvers + (balls / 6);
}

export function calculateNRR(runsScored: number, oversFaced: number, runsConceded: number, oversBowled: number): number {
  const decimalOversFaced = oversFaced === 0 ? 0 : parseOversToDecimal(oversFaced);
  const decimalOversBowled = oversBowled === 0 ? 0 : parseOversToDecimal(oversBowled);
  
  const runsPerOverFor = decimalOversFaced > 0 ? runsScored / decimalOversFaced : 0;
  const runsPerOverAgainst = decimalOversBowled > 0 ? runsConceded / decimalOversBowled : 0;
  
  return runsPerOverFor - runsPerOverAgainst;
}

export function getMatchResult(match: Match, homeShortName: string, awayShortName: string): string {
  if (match.status !== 'Completed') return '';

  if (match.home_score > match.away_score) {
    if (match.batting_first_team_id === match.home_team_id) {
      return `${homeShortName} won by ${match.home_score - match.away_score} runs`;
    } else {
      return `${homeShortName} won by ${10 - match.home_wickets} wickets`;
    }
  } else if (match.away_score > match.home_score) {
    if (match.batting_first_team_id === match.away_team_id) {
      return `${awayShortName} won by ${match.away_score - match.home_score} runs`;
    } else {
      return `${awayShortName} won by ${10 - match.away_wickets} wickets`;
    }
  }

  return 'Match Tied';
}
