import { Team, TournamentFormat } from './types';

export interface FixtureOptions {
  seasonId: string;
  format: TournamentFormat;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  matchDurationMinutes: number;
  breakMinutes: number;
  venue: string;
}

export interface GeneratedMatchPreview {
  homeTeam: Team;
  awayTeam: Team;
  matchDate: Date;
  venue: string;
  roundNumber: number;
}

export function generateFixtures(teams: Team[], options: FixtureOptions): GeneratedMatchPreview[] {
  if (teams.length < 2) return [];

  const previews: GeneratedMatchPreview[] = [];
  const teamList = [...teams];
  
  // If odd number of teams, add a dummy bye team
  const isOdd = teamList.length % 2 !== 0;
  if (isOdd) {
    teamList.push({
      id: 'BYE',
      season_id: options.seasonId,
      name: 'BYE',
      short_name: 'BYE',
      logo_url: null,
      color_hex: '#000000',
      captain_name: null,
      vice_captain_name: null,
      coach_name: null,
      description: null,
      created_at: new Date().toISOString()
    });
  }

  const numTeams = teamList.length;
  const numRounds = numTeams - 1;
  const matchesPerRound = numTeams / 2;

  let currentSlot = new Date(`${options.startDate}T${options.startTime}:00`);

  const generateRound = (roundIdx: number, isReturnLeg: boolean = false) => {
    for (let matchIdx = 0; matchIdx < matchesPerRound; matchIdx++) {
      const homeIdx = (roundIdx + matchIdx) % (numTeams - 1);
      let awayIdx = (numTeams - 1 - matchIdx + roundIdx) % (numTeams - 1);

      if (matchIdx === 0) {
        awayIdx = numTeams - 1;
      }

      let homeTeam = teamList[homeIdx];
      let awayTeam = teamList[awayIdx];

      if (isReturnLeg) {
        const temp = homeTeam;
        homeTeam = awayTeam;
        awayTeam = temp;
      }

      // Skip bye match
      if (homeTeam.id === 'BYE' || awayTeam.id === 'BYE') continue;

      previews.push({
        homeTeam,
        awayTeam,
        matchDate: new Date(currentSlot),
        venue: options.venue,
        roundNumber: isReturnLeg ? roundIdx + numRounds + 1 : roundIdx + 1,
      });

      // Increment slot time
      currentSlot = new Date(
        currentSlot.getTime() + (options.matchDurationMinutes + options.breakMinutes) * 60000
      );
    }
  };

  if (options.format === 'Knockout') {
    // Single elimination first round pairings
    for (let i = 0; i < Math.floor(teams.length / 2); i++) {
      previews.push({
        homeTeam: teams[i],
        awayTeam: teams[teams.length - 1 - i],
        matchDate: new Date(currentSlot),
        venue: options.venue,
        roundNumber: 1,
      });
      currentSlot = new Date(
        currentSlot.getTime() + (options.matchDurationMinutes + options.breakMinutes) * 60000
      );
    }
  } else {
    // Round Robin
    for (let round = 0; round < numRounds; round++) {
      generateRound(round, false);
    }
    if (options.format === 'Double Round Robin') {
      for (let round = 0; round < numRounds; round++) {
        generateRound(round, true);
      }
    }
  }

  return previews;
}
