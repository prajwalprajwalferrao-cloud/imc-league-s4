import { Match } from './types';

export function generateFixtures(
  teamIds: string[],
  format: 'single' | 'double',
  startDate: Date,
  venue: string,
  timeSlots: string[],
  seasonId: string,
  matchesPerDay: number
): Partial<Match>[] {
  const fixtures: Partial<Match>[] = [];
  const totalTeams = teamIds.length;
  
  if (totalTeams < 2) return [];

  const teams = [...teamIds];
  if (totalTeams % 2 !== 0) {
    teams.push('BYE');
  }

  const numTeams = teams.length;
  const numRounds = numTeams - 1;
  const matchesPerRound = numTeams / 2;

  let currentDate = new Date(startDate);
  let matchCounter = 0;
  let currentRound = 1;

  const addFixture = (home: string, away: string, round: number) => {
    if (home === 'BYE' || away === 'BYE') return;

    const timeIndex = matchCounter % timeSlots.length;
    
    fixtures.push({
      season_id: seasonId,
      round,
      home_team_id: home,
      away_team_id: away,
      home_score: 0,
      home_wickets: 0,
      home_overs: 0,
      away_score: 0,
      away_wickets: 0,
      away_overs: 0,
      status: 'Upcoming',
      venue,
      date: currentDate.toISOString().split('T')[0],
      time: timeSlots[timeIndex]
    });

    matchCounter++;
    if (matchCounter >= matchesPerDay) {
      matchCounter = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  // Single Round Robin
  for (let round = 0; round < numRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const home = teams[match];
      const away = teams[numTeams - 1 - match];
      addFixture(home, away, currentRound);
    }
    teams.splice(1, 0, teams.pop()!);
    currentRound++;
  }

  // Double Round Robin
  if (format === 'double') {
    for (let round = 0; round < numRounds; round++) {
      for (let match = 0; match < matchesPerRound; match++) {
        const home = teams[numTeams - 1 - match];
        const away = teams[match];
        addFixture(home, away, currentRound);
      }
      teams.splice(1, 0, teams.pop()!);
      currentRound++;
    }
  }

  return fixtures;
}
