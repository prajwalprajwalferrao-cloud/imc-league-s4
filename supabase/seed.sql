-- Seed Data for Development & Initial Demonstration

INSERT INTO public.seasons (id, name, season_number, start_date, end_date, format, status, is_active, points_per_win, points_per_draw, points_per_loss)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'IMC LEAGUE - SEASON 04', 4, '2026-08-01', '2026-10-31', 'Round Robin', 'Active', true, 3, 1, 0)
ON CONFLICT DO NOTHING;

-- Teams
INSERT INTO public.teams (id, season_id, name, short_name, color_hex, captain_name, vice_captain_name, description)
VALUES
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'IMC Warriors', 'WAR', '#E5A93C', 'Alex Mercer', 'Jordan Cole', 'Defending champions of Season 03'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'IMC Titans', 'TIT', '#FF3B30', 'David Vance', 'Marcus Ray', 'Aggressive offensive dynamic team'),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'IMC Falcons', 'FAL', '#30D158', 'Leo Sterling', 'Chris Evans', 'Tactical masterminds with high defense'),
  ('22222222-2222-2222-2222-222222222224', '11111111-1111-1111-1111-111111111111', 'IMC Royals', 'ROY', '#0A84FF', 'Ethan Hunt', 'Sam Wilson', 'Young dynamic squad with high stamina')
ON CONFLICT DO NOTHING;

-- Sample Completed & Live Matches
INSERT INTO public.matches (id, season_id, home_team_id, away_team_id, home_score, away_score, match_date, venue, status, current_minute, round_number)
VALUES
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 2, 1, NOW() - INTERVAL '2 hours', 'Central Arena', 'Live', '68''', 1),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222224', 3, 1, NOW() - INTERVAL '1 day', 'East Stadium', 'Completed', '90''', 1),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222223', 0, 0, NOW() + INTERVAL '2 days', 'Central Arena', 'Scheduled', '0', 2)
ON CONFLICT DO NOTHING;

-- Announcements
INSERT INTO public.announcements (title, description, priority, is_active)
VALUES 
  ('Season 04 Kickoff Announcement!', 'Welcome to IMC League Season 04! Catch all live scoring and updates directly on our official platform.', 'Urgent', true),
  ('Schedule Confirmation', 'Round 2 fixtures have been updated. Check the fixtures tab for match venues and timings.', 'Normal', true)
ON CONFLICT DO NOTHING;
