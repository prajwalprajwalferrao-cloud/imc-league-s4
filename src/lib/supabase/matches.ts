import { createClient } from './client';
import { Match } from '../types';

export async function getMatches(): Promise<Match[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('matches').select('*').order('date');
  if (error) throw error;
  return data;
}

export async function getMatch(id: string): Promise<Match | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('matches').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function createMatch(match: Partial<Match>): Promise<Match> {
  const supabase = createClient();
  const { data, error } = await supabase.from('matches').insert(match).select().single();
  if (error) throw error;
  return data;
}

export async function updateMatch(id: string, updates: Partial<Match>): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('matches').update(updates).eq('id', id);
  if (error) throw error;
}

// Minimal subscription mock for now (realtime needs setup in supabase dashboard)
export function subscribeToMatch(id: string, callback: (match: Match | null) => void) {
  const supabase = createClient();
  const channel = supabase.channel(`match-${id}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${id}` }, (payload) => {
      callback(payload.new as Match);
    })
    .subscribe();
  
  return () => { supabase.removeChannel(channel); };
}

export function subscribeToLiveMatches(seasonId: string, callback: (matches: Match[]) => void) {
  const supabase = createClient();
  const channel = supabase.channel('live-matches')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'matches', filter: `status=eq.Live` }, () => {
      getMatches().then(m => callback(m.filter(x => x.status === 'Live')));
    })
    .subscribe();
  
  return () => { supabase.removeChannel(channel); };
}
