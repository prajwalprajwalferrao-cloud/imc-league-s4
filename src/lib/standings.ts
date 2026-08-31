import { Match, StandingRow, Team, Season } from './types';

export function calculateStandings(teams: Team[], matches: Match[], season?: Season): StandingRow[] {
  const pointsWin = season?.points_per_win ?? 3;
  const pointsDraw = season?.points_per_draw ?? 1;
  const pointsLoss = season?.points_per_loss ?? 0;

  const standingsMap: Record<string, StandingRow> = {};

  teams.forEach((team) => {
    standingsMap[team.id] = {
      position: 0,
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      recentForm: [],
    };
  });

  // Filter completed matches sorted by date ascending for form tracking
  const completedMatches = matches
    .filter((m) => m.status === 'Completed')
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());

  completedMatches.forEach((match) => {
    const home = standingsMap[match.home_team_id];
    const away = standingsMap[match.away_team_id];

    if (!home || !away) return;

    home.played += 1;
    away.played += 1;

    home.goalsFor += match.home_score;
    home.goalsAgainst += match.away_score;
    away.goalsFor += match.away_score;
    away.goalsAgainst += match.home_score;

    if (match.home_score > match.away_score) {
      home.won += 1;
      home.points += pointsWin;
      home.recentForm.push('W');

      away.lost += 1;
      away.points += pointsLoss;
      away.recentForm.push('L');
    } else if (match.home_score < match.away_score) {
      away.won += 1;
      away.points += pointsWin;
      away.recentForm.push('W');

      home.lost += 1;
      home.points += pointsLoss;
      home.recentForm.push('L');
    } else {
      home.drawn += 1;
      home.points += pointsDraw;
      home.recentForm.push('D');

      away.drawn += 1;
      away.points += pointsDraw;
      away.recentForm.push('D');
    }
  });

  const standings = Object.values(standingsMap).map((item) => ({
    ...item,
    goalDifference: item.goalsFor - item.goalsAgainst,
    recentForm: item.recentForm.slice(-5), // Keep last 5 matches
  }));

  // Sort standings: 1. Points, 2. GD, 3. GF, 4. Team Name
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.name.localeCompare(b.team.name);
  });

  return standings.map((item, index) => ({
    ...item,
    position: index + 1,
  }));
}
