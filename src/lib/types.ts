export type MatchStatus = 'Upcoming' | 'Live' | 'Completed' | 'Postponed' | 'Cancelled';
export type PlayerPosition = 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
export type EventType = 'wicket' | 'boundary_4' | 'boundary_6' | 'catch' | 'run_out' | 'no_ball' | 'wide' | 'penalty_run' | 'runs';
export type DismissalType = 'bowled' | 'caught' | 'lbw' | 'run_out' | 'stumped' | 'hit_wicket' | 'retired';
export type Priority = 'normal' | 'high' | 'urgent';
export type UserRole = 'admin' | 'viewer';
export type SeasonStatus = 'upcoming' | 'active' | 'completed';
export type TournamentFormat = 'T20' | 'ODI' | 'Custom';

export interface Season {
  id: string;
  name: string;
  seasonNumber: number;
  status: SeasonStatus;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  format: TournamentFormat;
  totalOvers: number;
  pointsWin: number;
  pointsNoResult: number;
  pointsLoss: number;
  enableMotm: boolean;
  venue: string;
  createdAt: string;
}

export interface Team {
  id: string;
  seasonId: string;
  name: string;
  shortName: string;
  logoUrl: string;
  colour: string;
  captain: string;
  manager: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface Player {
  id: string;
  seasonId: string;
  teamId: string;
  name: string;
  photoUrl: string;
  jerseyNumber: number;
  position: PlayerPosition;
  runsScored: number;
  ballsFaced: number;
  wicketsTaken: number;
  oversBowled: number;
  runsConceded: number;
  catches: number;
  runOuts: number;
  appearances: number;
  motm: number;
  isActive: boolean;
  createdAt: string;
}

export interface Match {
  id: string;
  seasonId: string;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  homeWickets: number;
  homeOvers: number;
  awayScore: number;
  awayWickets: number;
  awayOvers: number;
  battingFirstTeamId: string | null;
  tossWinnerId: string | null;
  status: MatchStatus;
  venue: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  seasonId: string;
  battingTeamId: string;
  bowlingTeamId: string;
  type: EventType;
  batsmanId: string | null;
  bowlerId: string | null;
  fielderId: string | null;
  runs: number;
  over: number;
  ball: number;
  dismissalType: DismissalType | null;
  notes: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: Priority;
  isActive: boolean;
  imageUrl: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export interface LeagueSettings {
  id: string;
  leagueName: string;
  seasonName: string;
  logoUrl: string;
  currentSeasonId: string;
  pointsWin: number;
  pointsNoResult: number;
  pointsLoss: number;
  enableMotm: boolean;
  defaultVenue: string;
  totalOvers: number;
}

export interface StandingRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  lost: number;
  noResult: number;
  runsScored: number;
  runsConceded: number;
  oversFaced: number;
  oversBowled: number;
  nrr: number;
  points: number;
  recentForm: ('W' | 'L' | 'NR')[];
}
