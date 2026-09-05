-- IMC League S4 Supabase Schema

-- 1. Create Tables
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id TEXT NOT NULL DEFAULT 'season-4',
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  logo_url TEXT,
  colour TEXT,
  captain TEXT,
  manager TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id TEXT NOT NULL DEFAULT 'season-4',
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  photo_url TEXT,
  jersey_number INTEGER NOT NULL,
  position TEXT NOT NULL,
  runs_scored INTEGER DEFAULT 0,
  balls_faced INTEGER DEFAULT 0,
  wickets_taken INTEGER DEFAULT 0,
  overs_bowled REAL DEFAULT 0,
  runs_conceded INTEGER DEFAULT 0,
  catches INTEGER DEFAULT 0,
  run_outs INTEGER DEFAULT 0,
  appearances INTEGER DEFAULT 0,
  motm INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id TEXT NOT NULL DEFAULT 'season-4',
  round INTEGER DEFAULT 1,
  home_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  home_score INTEGER DEFAULT 0,
  home_wickets INTEGER DEFAULT 0,
  home_overs REAL DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  away_wickets INTEGER DEFAULT 0,
  away_overs REAL DEFAULT 0,
  batting_first_team_id UUID REFERENCES teams(id),
  toss_winner_id UUID REFERENCES teams(id),
  status TEXT DEFAULT 'Upcoming',
  venue TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Setup Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create an admin check function
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Everyone can read
CREATE POLICY "Public read access for teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access for players" ON players FOR SELECT USING (true);
CREATE POLICY "Public read access for matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access for announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Users can read own role" ON user_roles FOR SELECT USING (auth.uid() = id);

-- Only Admins can insert/update/delete
CREATE POLICY "Admin write teams" ON teams FOR ALL USING (is_admin());
CREATE POLICY "Admin write players" ON players FOR ALL USING (is_admin());
CREATE POLICY "Admin write matches" ON matches FOR ALL USING (is_admin());
CREATE POLICY "Admin write announcements" ON announcements FOR ALL USING (is_admin());

-- 3. Trigger to auto-create user_roles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (id, role)
  VALUES (new.id, 'viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

