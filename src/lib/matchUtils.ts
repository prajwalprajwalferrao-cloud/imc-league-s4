import { Match } from './types';

export function formatOvers(balls: number): string {
  const overs = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return `${overs}.${remainingBalls}`;
}

export function parseOversToDecimal(overs: number): number {
  const overStr = overs.toString();
  if (!overStr.includes('.')) return overs;
  const [completedOvers, balls] = overStr.split('.').map(Number);
  return completedOvers + (balls / 6);
}

export function calculateNRR(runsScored: number, oversFaced: number, runsConceded: number, oversBowled: number): number {
  const decimalOversFaced = parseOversToDecimal(oversFaced);
  const decimalOversBowled = parseOversToDecimal(oversBowled);
  
  const runsPerOverFor = decimalOversFaced > 0 ? runsScored / decimalOversFaced : 0;
  const runsPerOverAgainst = decimalOversBowled > 0 ? runsConceded / decimalOversBowled : 0;
  
  return runsPerOverFor - runsPerOverAgainst;
}

export function formatScore(runs: number, wickets: number, overs?: number): string {
  let score = `${runs}/${wickets}`;
  if (overs !== undefined) {
    score += ` (${overs} ov)`;
  }
  return score;
}

export function getWinner(match: Match): string | null {
  if (match.status !== 'Completed') return null;
  if (match.homeScore > match.awayScore) return match.homeTeamId;
  if (match.awayScore > match.homeScore) return match.awayTeamId;
  return null;
}

export function getMatchResult(match: Match, homeTeamName: string, awayTeamName: string): string {
  if (match.status !== 'Completed') return 'Not completed';
  
  const winnerId = getWinner(match);
  if (!winnerId) return 'Match Tied / No Result';
  
  const winnerName = winnerId === match.homeTeamId ? homeTeamName : awayTeamName;
  const runsDiff = Math.abs(match.homeScore - match.awayScore);
  
  // Basic display
  if (winnerId === match.homeTeamId) {
     return `${winnerName} won by ${runsDiff} runs or wickets`; // Simplified for now
  } else {
     return `${winnerName} won by ${runsDiff} runs or wickets`;
  }
}
