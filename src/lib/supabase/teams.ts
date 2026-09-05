import { createClient } from './client';
import { Team } from '../types';

export async function getTeams(): Promise<Team[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('teams').select('*').eq('is_deleted', false).order('name');
  if (error) throw error;
  return data;
}

export async function getTeam(id: string): Promise<Team | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('teams').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createTeam(team: Omit<Team, 'id' | 'created_at'>): Promise<Team> {
  const supabase = createClient();
  const { data, error } = await supabase.from('teams').insert(team).select().single();
  if (error) throw error;
  return data;
}

export async function softDeleteTeam(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('teams').update({ is_deleted: true }).eq('id', id);
  if (error) throw error;
}
