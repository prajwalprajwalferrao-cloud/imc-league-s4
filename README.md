# IMC LEAGUE - SEASON 04
## Complete Setup, Deployment & Supabase Guide

IMC LEAGUE Season 04 is a modern, mobile-first **League Management and Live Scoring Platform** built using Next.js 14, TypeScript, Tailwind CSS, and Supabase.

---

## 1. Local Setup Instructions

1. Clone or open the project folder in your terminal:
   ```bash
   cd imc-league
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Run development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Supabase Database & Security Configuration

1. Create a free project on [Supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Open `supabase/schema.sql` from this codebase and execute it. This creates:
   - `profiles`, `seasons`, `teams`, `players`, `matches`, `match_events`, `announcements` tables.
   - Postgres Row Level Security (RLS) policies giving **public read-only** access and restricting write access exclusively to users with `role = 'admin'`.
   - Realtime publication subscriptions on `matches` and `match_events`.
4. Run `supabase/seed.sql` to populate initial Season 04 data.

---

## 3. Creating the First Administrator Account

1. Go to **Authentication -> Users** in your Supabase Dashboard.
2. Click **Add User** -> **Create User**, enter an email and password.
3. Go to the **Table Editor** -> `profiles` table.
4. Locate the newly created profile row and set the `role` column to `'admin'`.

---

## 4. 24/7 Production Deployment to Vercel

To ensure the website runs independently 24/7 (even when your Mac or terminal is turned off):

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Log into [Vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your `imc-league` repository.
4. Add the following **Environment Variables** in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will host the website 24/7 on a global edge CDN.

---

## 5. Application Features & Route Index

### Public Area (Read Only)
- `/` - **Homepage**: Hero banner, live match badge indicator, upcoming fixtures preview, league announcements, and top standings.
- `/fixtures` - **Fixtures**: Filter by All, Live, Upcoming, Completed, and Teams.
- `/results` - **Results**: Finalized scores and archived match results.
- `/standings` - **Standings**: Auto-derived standings table (P, W, D, L, GF, GA, GD, PTS).
- `/teams` & `/teams/[id]` - **Teams & Roster**: Team cards, captains, coaches, and match stats.
- `/statistics` - **Statistics**: League leaderboards, goals scored, and team rankings.

### Admin Area (Secure Management)
- `/admin/login` - **Admin Authentication**.
- `/admin/dashboard` - **Dashboard**: KPI summary cards and quick management actions.
- `/admin/seasons` - **Season Manager**: Create new seasons (Season 05, Season 06) without code changes.
- `/admin/teams` - **Team Manager**: Create/Delete teams, select colors, set captains.
- `/admin/players` - **Player Manager**: Squad rosters, jersey numbers, positions.
- `/admin/fixtures` - **Automatic Schedule Generator**: Generate Round Robin or Knockout schedules with preview.
- `/admin/live-score/[id]` - **Touch Live Scoring Console**: Big `+` / `-` touch buttons, match state switches (`START MATCH`, `HALF TIME`, `RESUME`, `FINISH MATCH`).
- `/admin/announcements` - **Announcements**: Publish news & priority announcements.
