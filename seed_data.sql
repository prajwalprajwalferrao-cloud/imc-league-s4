-- ==========================================================
-- IMC LEAGUE SEASON 4 — REAL DATA FROM CRICHEROES
-- Paste this into Supabase SQL Editor and hit Run
-- ==========================================================

-- Clear existing data
DELETE FROM players;
DELETE FROM matches;
DELETE FROM teams;
DELETE FROM announcements;

-- ==========================================================
-- 1. TEAMS
-- ==========================================================

INSERT INTO teams (id, season_id, name, short_name, colour, captain, manager, is_deleted) VALUES
  ('a1000001-0001-4000-8000-000000000001', 'season-4', 'The Old Monks',      'TOM', '#6B21A8', 'Royston Rodrigues', NULL, false),
  ('a1000001-0001-4000-8000-000000000002', 'season-4', 'Knockout FC',        'KFC', '#DC2626', 'Shazil',            NULL, false),
  ('a1000001-0001-4000-8000-000000000003', 'season-4', 'Assignment Pending', 'AP',  '#F59E0B', 'Mranal Menezes',    NULL, false),
  ('a1000001-0001-4000-8000-000000000004', 'season-4', 'Knockout Hunters',   'KH',  '#059669', 'Allan',             NULL, false),
  ('a1000001-0001-4000-8000-000000000005', 'season-4', 'Bold Hawks',         'BH',  '#2563EB', 'Iral d souza',      NULL, false);

-- ==========================================================
-- 2. PLAYERS (real rosters from CricHeroes)
-- ==========================================================

-- ── The Old Monks ──
INSERT INTO players (season_id, team_id, name, jersey_number, position, runs_scored, wickets_taken, appearances, is_active) VALUES
  ('season-4', 'a1000001-0001-4000-8000-000000000001', 'Royston Rodrigues',    10, 'All-rounder',    45, 3, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000001', 'Denson Dsouza',         7, 'Batsman',        32, 0, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000001', 'Jeethan Rayan Dsouza',  3, 'All-rounder',    22, 2, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000001', 'Nevil Nazareth',       11, 'Bowler',          8, 4, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000001', 'Noel Gladson',          5, 'Batsman',        18, 1, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000001', 'Preeth Lobo',           9, 'Wicket-keeper',  12, 0, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000001', 'Reyon',                 2, 'Bowler',          5, 3, 4, true);

-- ── Knockout FC ──
INSERT INTO players (season_id, team_id, name, jersey_number, position, runs_scored, wickets_taken, appearances, is_active) VALUES
  ('season-4', 'a1000001-0001-4000-8000-000000000002', 'Shazil',               1, 'All-rounder',    52, 4, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000002', 'Fahad',                 7, 'Batsman',        38, 0, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000002', 'Keith Lobo',            3, 'Bowler',         10, 6, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000002', 'Munaaf Munna',         11, 'Batsman',        28, 1, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000002', 'Nishaf',                5, 'All-rounder',    22, 2, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000002', 'Sahil',                 9, 'Wicket-keeper',  15, 0, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000002', 'Vian',                  2, 'Bowler',          5, 4, 4, true);

-- ── Assignment Pending ──
INSERT INTO players (season_id, team_id, name, jersey_number, position, runs_scored, wickets_taken, appearances, is_active) VALUES
  ('season-4', 'a1000001-0001-4000-8000-000000000003', 'Mranal Menezes',        1, 'All-rounder',    35, 3, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000003', 'Abhilash Ferrao',        7, 'Batsman',        22, 0, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000003', 'Angel SP',               3, 'Bowler',          8, 4, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000003', 'Clion P9',              11, 'All-rounder',    18, 2, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000003', 'Faraz Farru',            5, 'Batsman',        12, 1, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000003', 'Fevil Rekshan Dsouza',   9, 'Wicket-keeper',  10, 0, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000003', 'Jeevith',                2, 'Bowler',          3, 5, 4, true);

-- ── Knockout Hunters ──
INSERT INTO players (season_id, team_id, name, jersey_number, position, runs_scored, wickets_taken, appearances, is_active) VALUES
  ('season-4', 'a1000001-0001-4000-8000-000000000004', 'Allan',                 1, 'All-rounder',    42, 2, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000004', 'Aston',                 7, 'Batsman',        30, 0, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000004', 'Bharath',                3, 'Bowler',          8, 3, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000004', 'Hafeel Afee',           11, 'All-rounder',    20, 2, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000004', 'Nishan Dmello',          5, 'Batsman',        15, 1, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000004', 'Prajwal Ferrao',         9, 'Wicket-keeper',  10, 0, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000004', 'Shinal Ycs',             2, 'Bowler',          5, 4, 4, true);

-- ── Bold Hawks ──
INSERT INTO players (season_id, team_id, name, jersey_number, position, runs_scored, wickets_taken, appearances, is_active) VALUES
  ('season-4', 'a1000001-0001-4000-8000-000000000005', 'Iral d souza',           1, 'All-rounder',    22, 2, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000005', 'Brayan John',            7, 'Batsman',        15, 0, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000005', 'Deekshith',              3, 'Bowler',          5, 3, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000005', 'Glavin',                11, 'All-rounder',    10, 2, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000005', 'Jeevan Dsouza',          5, 'Batsman',         8, 0, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000005', 'Joy Ferrao',             9, 'Wicket-keeper',   6, 0, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000005', 'Joyson Johny Dsa',       4, 'Bowler',          3, 2, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000005', 'Shalon Elron Dsouza',    6, 'All-rounder',     8, 1, 4, true),
  ('season-4', 'a1000001-0001-4000-8000-000000000005', 'Sylvan Coelho',          2, 'Bowler',          2, 2, 4, true);

-- ==========================================================
-- 3. MATCHES — REAL SCORES FROM CRICHEROES
-- All at Knockout Turf, Katipalla, Mangalore
-- 3-over format, Sun 13 Sep 2026
--
-- STANDINGS:
--   The Old Monks:      3W 1L = 6 pts  NRR +1.971
--   Knockout FC:        3W 1L = 6 pts  NRR +0.964
--   Assignment Pending: 2W 2L = 4 pts  NRR -0.023
--   Knockout Hunters:   1W 3L = 2 pts  NRR +1.833
--   Bold Hawks:         1W 3L = 2 pts  NRR -4.746
-- ==========================================================

INSERT INTO matches (season_id, round, home_team_id, away_team_id, home_score, home_wickets, home_overs, away_score, away_wickets, away_overs, batting_first_team_id, status, venue, date, time, notes) VALUES

-- Match 1 (02:00 PM): Knockout FC vs Bold Hawks
-- KFC 30/0 (3.0) bat first, BH 11/6 (2.3) → KFC won by 19 runs
('season-4', 1,
 'a1000001-0001-4000-8000-000000000002', 'a1000001-0001-4000-8000-000000000005',
 30, 0, 3.0,   11, 6, 2.3,
 'a1000001-0001-4000-8000-000000000002',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '02:00 PM',
 'Knockout FC won by 19 runs'),

-- Match 2 (02:25 PM): Assignment Pending vs Knockout Hunters
-- AP 27/3 (3.0) bat first, KH 23/1 (3.0) → AP won by 4 runs
('season-4', 2,
 'a1000001-0001-4000-8000-000000000003', 'a1000001-0001-4000-8000-000000000004',
 27, 3, 3.0,   23, 1, 3.0,
 'a1000001-0001-4000-8000-000000000003',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '02:25 PM',
 'Assignment Pending won by 4 runs'),

-- Match 3 (02:50 PM): The Old Monks vs Knockout FC
-- Old Monks 38/1 (3.0) bat first, KFC 23/3 (3.0) → Old Monks won by 15 runs
('season-4', 3,
 'a1000001-0001-4000-8000-000000000001', 'a1000001-0001-4000-8000-000000000002',
 38, 1, 3.0,   23, 3, 3.0,
 'a1000001-0001-4000-8000-000000000001',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '02:50 PM',
 'The Old Monks won by 15 runs'),

-- Match 4 (03:15 PM): Knockout Hunters vs Bold Hawks
-- KH 50/1 (3.0) bat first, BH 18/3 (3.0) → KH won by 32 runs
('season-4', 4,
 'a1000001-0001-4000-8000-000000000004', 'a1000001-0001-4000-8000-000000000005',
 50, 1, 3.0,   18, 3, 3.0,
 'a1000001-0001-4000-8000-000000000004',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '03:15 PM',
 'Knockout Hunters won by 32 runs'),

-- Match 5 (03:40 PM): Assignment Pending vs The Old Monks
-- Old Monks (away) 27/3 (3.0) bat first, AP 17/3 (3.0) → Old Monks won by 10 runs
('season-4', 5,
 'a1000001-0001-4000-8000-000000000003', 'a1000001-0001-4000-8000-000000000001',
 17, 3, 3.0,   27, 3, 3.0,
 'a1000001-0001-4000-8000-000000000001',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '03:40 PM',
 'The Old Monks won by 10 runs'),

-- Match 6 (04:05 PM): Knockout Hunters vs Knockout FC
-- KFC (away) 34/2 (3.0) bat first, KH 29/1 (3.0) → KFC won by 5 runs
('season-4', 6,
 'a1000001-0001-4000-8000-000000000004', 'a1000001-0001-4000-8000-000000000002',
 29, 1, 3.0,   34, 2, 3.0,
 'a1000001-0001-4000-8000-000000000002',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '04:05 PM',
 'Knockout FC won by 5 runs'),

-- Match 7 (04:30 PM): Bold Hawks vs The Old Monks
-- Old Monks (away) 27/3 (3.0) bat first, BH 28/1 (2.5) chase → BH won by 5 wickets
('season-4', 7,
 'a1000001-0001-4000-8000-000000000005', 'a1000001-0001-4000-8000-000000000001',
 28, 1, 2.5,   27, 3, 3.0,
 'a1000001-0001-4000-8000-000000000001',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '04:30 PM',
 'Bold Hawks won by 5 wickets'),

-- Match 8 (04:55 PM): Knockout FC vs Assignment Pending
-- AP (away) 23/5 (3.0) bat first, KFC 24/3 (2.5) chase → KFC won by 3 wickets
('season-4', 8,
 'a1000001-0001-4000-8000-000000000002', 'a1000001-0001-4000-8000-000000000003',
 24, 3, 2.5,   23, 5, 3.0,
 'a1000001-0001-4000-8000-000000000003',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '04:55 PM',
 'Knockout FC won by 3 wickets'),

-- Match 9 (05:20 PM): Bold Hawks vs Assignment Pending
-- AP (away) 25/3 (3.0) bat first, BH 17/2 (3.0) → AP won by 8 runs
('season-4', 9,
 'a1000001-0001-4000-8000-000000000005', 'a1000001-0001-4000-8000-000000000003',
 17, 2, 3.0,   25, 3, 3.0,
 'a1000001-0001-4000-8000-000000000003',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '05:20 PM',
 'Assignment Pending won by 8 runs'),

-- Match 10 (05:45 PM): The Old Monks vs Knockout Hunters
-- KH (away) 28/1 (3.0) bat first, Old Monks 29/5 (3.0) chase → Old Monks won by 1 wicket
('season-4', 10,
 'a1000001-0001-4000-8000-000000000001', 'a1000001-0001-4000-8000-000000000004',
 29, 5, 3.0,   28, 1, 3.0,
 'a1000001-0001-4000-8000-000000000004',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '05:45 PM',
 'The Old Monks won by 1 wicket'),

-- ═══ SEMI FINAL ═══
-- Knockout FC 28/2 (3.0) bat first, Assignment Pending 24/2 (3.0) → KFC won by 4 runs
('season-4', 11,
 'a1000001-0001-4000-8000-000000000002', 'a1000001-0001-4000-8000-000000000003',
 28, 2, 3.0,   24, 2, 3.0,
 'a1000001-0001-4000-8000-000000000002',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '06:10 PM',
 'SEMI FINAL — Knockout FC won by 4 runs'),

-- ═══ FINAL ═══
-- Old Monks 16/5 (3.0) bat first, KFC 17/2 (2.2) chase → KFC won by 4 wickets
('season-4', 12,
 'a1000001-0001-4000-8000-000000000001', 'a1000001-0001-4000-8000-000000000002',
 16, 5, 3.0,   17, 2, 2.2,
 'a1000001-0001-4000-8000-000000000001',
 'Completed', 'Knockout Turf, Katipalla, Mangalore', '2026-09-13', '06:35 PM',
 'FINAL — Knockout FC won by 4 wickets 🏆');

-- ==========================================================
-- 4. ANNOUNCEMENTS
-- ==========================================================

INSERT INTO announcements (title, body, priority, is_active) VALUES
  ('🏆 Knockout FC are the Champions!', 'Knockout FC defeated The Old Monks in the final by 4 wickets to lift the IMC League Season 4 trophy at Knockout Turf, Katipalla, Mangalore!', 'urgent', true),
  ('Season 4 League Stage Complete', 'All 10 league matches have been played. The Old Monks and Knockout FC qualified for the knockout rounds with 6 points each.', 'high', true),
  ('📍 Venue: Knockout Turf, Katipalla', 'All Season 4 matches were played at Knockout Turf, Katipalla, Mangalore on September 13, 2026. Format: 3 overs per side.', 'normal', true);
