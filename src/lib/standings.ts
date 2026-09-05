import { Team, Match, StandingRow } from './types';
import { calculateNRR } from './matchUtils';

export function calculateStandings(
  teams: Team[],
  matches: Match[],
  settings = { pointsWin: 2, pointsNoResult: 1, pointsLoss: 0 }
): StandingRow[] {
  const standingsMap = new Map<string, StandingRow>();

  // Initialize
  teams.forEach(team => {
    standingsMap.set(team.id, {
      position: 0,
      team,
      played: 0,
      won: 0,
      lost: 0,
      noResult: 0,
      runsScored: 0,
      runsConceded: 0,
      oversFaced: 0,
      oversBowled: 0,
      nrr: 0,
      points: 0,
      recentForm: []
    });
  });

  const completedMatches = matches
    .filter(m => m.status === 'Completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  completedMatches.forEach(match => {
    const home = standingsMap.get(match.home_team_id);
    const away = standingsMap.get(match.away_team_id);
    if (!home || !away) return;

    home.played += 1;
    away.played += 1;
    
    home.runsScored += match.home_score;
    home.runsConceded += match.away_score;
    home.oversFaced += match.home_overs;
    home.oversBowled += match.away_overs;

    away.runsScored += match.away_score;
    away.runsConceded += match.home_score;
    away.oversFaced += match.away_overs;
    away.oversBowled += match.home_overs;

    if (match.home_score > match.away_score) {
      home.won += 1;
      home.points += settings.pointsWin;
      home.recentForm.unshift('W');
      away.lost += 1;
      away.points += settings.pointsLoss;
      away.recentForm.unshift('L');
    } else if (match.away_score > match.home_score) {
      away.won += 1;
      away.points += settings.pointsWin;
      away.recentForm.unshift('W');
      home.lost += 1;
      home.points += settings.pointsLoss;
      home.recentForm.unshift('L');
    } else {
      home.noResult += 1;
      home.points += settings.pointsNoResult;
      home.recentForm.unshift('NR');
      away.noResult += 1;
      away.points += settings.pointsNoResult;
      away.recentForm.unshift('NR');
    }

    // Keep only last 5
    if (home.recentForm.length > 5) home.recentForm.pop();
    if (away.recentForm.length > 5) away.recentForm.pop();
  });

  const standingsList = Array.from(standingsMap.values());

  // Calculate NRR
  standingsList.forEach(row => {
    row.nrr = calculateNRR(row.runsScored, row.oversFaced, row.runsConceded, row.oversBowled);
  });

  // Sort
  standingsList.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.nrr !== a.nrr) return b.nrr - a.nrr;
    if (b.runsScored !== a.runsScored) return b.runsScored - a.runsScored;
    return a.team.name.localeCompare(b.team.name);
  });

  // Assign position
  standingsList.forEach((row, index) => {
    row.position = index + 1;
  });

  return standingsList;
}
