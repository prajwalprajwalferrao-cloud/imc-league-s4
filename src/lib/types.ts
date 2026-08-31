export type SeasonStatus = 'Upcoming' | 'Active' | 'Completed';
export type TournamentFormat = 'Round Robin' | 'Double Round Robin' | 'Knockout';

export interface Season {
  id: string;
  name: string;
  season_number: number;
  start_date: string | null;
  end_date: string | null;
  format: TournamentFormat;
  status: SeasonStatus;
  is_active: boolean;
  points_per_win: number;
  points_per_draw: number;
  points_per_loss: number;
  created_at: string;
}

export interface Team {
  id: string;
  season_id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
  color_hex: string;
  captain_name: string | null;
  vice_captain_name: string | null;
  coach_name: string | null;
  description: string | null;
  created_at: string;
}

export interface Player {
  id: string;
  team_id: string;
  full_name: string;
  photo_url: string | null;
  jersey_number: number | null;
  position: string;
  is_captain: boolean;
  is_active: boolean;
  created_at: string;
}

export type MatchStatus = 'Scheduled' | 'Live' | 'Half Time' | 'Completed' | 'Postponed' | 'Cancelled';

export interface Match {
  id: string;
  season_id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  match_date: string;
  venue: string;
  status: MatchStatus;
  current_minute: string;
  round_number: number;
  created_at: string;
  updated_at: string;
  home_team?: Team;
  away_team?: Team;
}

export interface MatchEvent {
  id: string;
  match_id: string;
  team_id: string | null;
  player_id: string | null;
  event_type: 'Goal' | 'Yellow Card' | 'Red Card' | 'Substitution' | 'Penalty';
  minute: number | null;
  notes: string | null;
  created_at: string;
  player?: Player;
  team?: Team;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  priority: 'Normal' | 'High' | 'Urgent';
  is_active: boolean;
  created_at: string;
}

export interface StandingRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  recentForm: ('W' | 'D' | 'L')[];
}
