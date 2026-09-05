import { Match, StandingRow, Team } from './types';
import { calculateNRR } from './matchUtils';

export function calculateStandings(teams: Team[], matches: Match[], settings?: { pointsWin: number, pointsNoResult: number, pointsLoss: number }): StandingRow[] {
  const pointsWin = settings?.pointsWin ?? 2;
  const pointsNoResult = settings?.pointsNoResult ?? 1;
  const pointsLoss = settings?.pointsLoss ?? 0;

  const standingsMap: Record<string, StandingRow> = {};

  teams.forEach((team) => {
    standingsMap[team.id] = {
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
      recentForm: [],
    };
  });

  const completedMatches = matches
    .filter((m) => m.status === 'Completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  completedMatches.forEach((match) => {
    const home = standingsMap[match.homeTeamId];
    const away = standingsMap[match.awayTeamId];

    if (!home || !away) return;

    home.played += 1;
    away.played += 1;

    home.runsScored += match.homeScore;
    home.runsConceded += match.awayScore;
    away.runsScored += match.awayScore;
    away.runsConceded += match.homeScore;
    
    // Simplification for over tracking - ideally we'd track legal balls
    home.oversFaced += match.homeOvers;
    home.oversBowled += match.awayOvers;
    away.oversFaced += match.awayOvers;
    away.oversBowled += match.homeOvers;

    if (match.homeScore > match.awayScore) {
      home.won += 1;
      home.points += pointsWin;
      home.recentForm.push('W');

      away.lost += 1;
      away.points += pointsLoss;
      away.recentForm.push('L');
    } else if (match.homeScore < match.awayScore) {
      away.won += 1;
      away.points += pointsWin;
      away.recentForm.push('W');

      home.lost += 1;
      home.points += pointsLoss;
      home.recentForm.push('L');
    } else {
      home.noResult += 1;
      home.points += pointsNoResult;
      home.recentForm.push('NR');

      away.noResult += 1;
      away.points += pointsNoResult;
      away.recentForm.push('NR');
    }
  });

  const standings = Object.values(standingsMap).map((item) => ({
    ...item,
    nrr: calculateNRR(item.runsScored, item.oversFaced, item.runsConceded, item.oversBowled),
    recentForm: item.recentForm.slice(-5), 
  }));

  // Sort standings: 1. Points, 2. NRR, 3. Runs Scored, 4. Team Name
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.nrr !== a.nrr) return b.nrr - a.nrr;
    if (b.runsScored !== a.runsScored) return b.runsScored - a.runsScored;
    return a.team.name.localeCompare(b.team.name);
  });

  return standings.map((item, index) => ({
    ...item,
    position: index + 1,
  }));
}
