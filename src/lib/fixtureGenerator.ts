import { Match } from './types';

export function generateFixtures(
  teamIds: string[],
  format: 'single' | 'double',
  startDate: Date,
  venue: string,
  timeSlots: string[],
  seasonId: string,
  matchesPerDay: number
): Omit<Match, 'id' | 'createdAt' | 'updatedAt'>[] {
  
  if (teamIds.length < 2) return [];

  const teams = [...teamIds];
  if (teams.length % 2 !== 0) {
    teams.push('BYE');
  }

  const numTeams = teams.length;
  const numRounds = numTeams - 1;
  const matchesPerRound = numTeams / 2;
  
  const fixtures: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  let currentDate = new Date(startDate);
  let matchesAddedToDay = 0;

  for (let r = 0; r < numRounds; r++) {
    for (let m = 0; m < matchesPerRound; m++) {
      const home = (r + m) % (numTeams - 1);
      let away = (numTeams - 1 - m + r) % (numTeams - 1);
      
      if (m === 0) {
        away = numTeams - 1;
      }
      
      if (teams[home] !== 'BYE' && teams[away] !== 'BYE') {
        const timeSlotIndex = matchesAddedToDay % timeSlots.length;
        
        fixtures.push({
          seasonId,
          round: r + 1,
          homeTeamId: teams[home],
          awayTeamId: teams[away],
          homeScore: 0,
          homeWickets: 0,
          homeOvers: 0,
          awayScore: 0,
          awayWickets: 0,
          awayOvers: 0,
          battingFirstTeamId: null,
          tossWinnerId: null,
          status: 'Upcoming',
          venue,
          date: currentDate.toISOString().split('T')[0],
          time: timeSlots[timeSlotIndex],
          notes: ''
        });
        
        matchesAddedToDay++;
        if (matchesAddedToDay >= matchesPerDay) {
          matchesAddedToDay = 0;
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }
  }

  if (format === 'double') {
    const singleRoundFixtures = [...fixtures];
    const reverseFixtures = singleRoundFixtures.map(f => ({
      ...f,
      round: f.round + numRounds,
      homeTeamId: f.awayTeamId,
      awayTeamId: f.homeTeamId,
      // dates/times would need adjusting in a real scenario
    }));
    return [...fixtures, ...reverseFixtures];
  }

  return fixtures;
}
