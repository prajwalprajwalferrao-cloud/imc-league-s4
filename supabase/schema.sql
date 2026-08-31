-- ==========================================
-- IMC LEAGUE - SEASON 04 COMPLETE SQL SCHEMA
-- Execute in Supabase SQL Editor
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Tied to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'public' CHECK (role IN ('admin', 'public')),
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function to handle new user signup and create a profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'public'),
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. SEASONS TABLE
CREATE TABLE IF NOT EXISTS public.seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  season_number INT NOT NULL,
  start_date DATE,
  end_date DATE,
  format TEXT NOT NULL DEFAULT 'Round Robin' CHECK (format IN ('Round Robin', 'Double Round Robin', 'Knockout')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Upcoming', 'Active', 'Completed')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  points_per_win INT NOT NULL DEFAULT 3,
  points_per_draw INT NOT NULL DEFAULT 1,
  points_per_loss INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  logo_url TEXT,
  color_hex TEXT DEFAULT '#E5A93C',
  captain_name TEXT,
  vice_captain_name TEXT,
  coach_name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  jersey_number INT,
  position TEXT DEFAULT 'Forward',
  is_captain BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  home_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  home_score INT NOT NULL DEFAULT 0,
  away_score INT NOT NULL DEFAULT 0,
  match_date TIMESTAMPTZ NOT NULL,
  venue TEXT DEFAULT 'Main Arena',
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Live', 'Half Time', 'Completed', 'Postponed', 'Cancelled')),
  current_minute TEXT DEFAULT '0',
  round_number INT DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. MATCH EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.match_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('Goal', 'Yellow Card', 'Red Card', 'Substitution', 'Penalty')),
  minute INT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'Normal' CHECK (priority IN ('Normal', 'High', 'Urgent')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies if re-running script to avoid 42710 already exists error
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Read Seasons" ON public.seasons;
DROP POLICY IF EXISTS "Public Read Teams" ON public.teams;
DROP POLICY IF EXISTS "Public Read Players" ON public.players;
DROP POLICY IF EXISTS "Public Read Matches" ON public.matches;
DROP POLICY IF EXISTS "Public Read Match Events" ON public.match_events;
DROP POLICY IF EXISTS "Public Read Announcements" ON public.announcements;

DROP POLICY IF EXISTS "Admin All Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin All Seasons" ON public.seasons;
DROP POLICY IF EXISTS "Admin All Teams" ON public.teams;
DROP POLICY IF EXISTS "Admin All Players" ON public.players;
DROP POLICY IF EXISTS "Admin All Matches" ON public.matches;
DROP POLICY IF EXISTS "Admin All Match Events" ON public.match_events;
DROP POLICY IF EXISTS "Admin All Announcements" ON public.announcements;

-- Public READ access on all tables
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Seasons" ON public.seasons FOR SELECT USING (true);
CREATE POLICY "Public Read Teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public Read Players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Public Read Matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public Read Match Events" ON public.match_events FOR SELECT USING (true);
CREATE POLICY "Public Read Announcements" ON public.announcements FOR SELECT USING (true);

-- Admin WRITE access (INSERT, UPDATE, DELETE)
CREATE POLICY "Admin All Profiles" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Seasons" ON public.seasons FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Teams" ON public.teams FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Players" ON public.players FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Matches" ON public.matches FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Match Events" ON public.match_events FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Announcements" ON public.announcements FOR ALL USING (public.is_admin());

-- Realtime Publication Enable
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'matches'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'match_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.match_events;
  END IF;
END $$;
