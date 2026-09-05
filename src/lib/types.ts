export type MatchStatus = 'Upcoming' | 'Live' | 'Completed' | 'Postponed' | 'Cancelled';
export type PlayerPosition = 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
export type Priority = 'normal' | 'high' | 'urgent';

export interface Team {
  id: string;
  season_id: string;
  name: string;
  short_name: string;
  logo_url?: string;
  colour?: string;
  captain?: string;
  manager?: string;
  is_deleted: boolean;
  created_at: string;
}

export interface Player {
  id: string;
  season_id: string;
  team_id: string;
  name: string;
  photo_url?: string;
  jersey_number: number;
  position: PlayerPosition;
  runs_scored: number;
  balls_faced: number;
  wickets_taken: number;
  overs_bowled: number;
  runs_conceded: number;
  catches: number;
  run_outs: number;
  appearances: number;
  motm: number;
  is_active: boolean;
  created_at: string;
}

export interface Match {
  id: string;
  season_id: string;
  round: number;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  home_wickets: number;
  home_overs: number;
  away_score: number;
  away_wickets: number;
  away_overs: number;
  batting_first_team_id?: string;
  toss_winner_id?: string;
  status: MatchStatus;
  venue?: string;
  date: string;
  time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: Priority;
  is_active: boolean;
  image_url?: string;
  created_at: string;
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
