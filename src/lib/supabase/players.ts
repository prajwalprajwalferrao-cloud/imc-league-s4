import { createClient } from './client';
import { Player } from '../types';

export async function getPlayers(): Promise<Player[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('players').select('*').eq('is_active', true).order('name');
  if (error) throw error;
  return data;
}

export async function createPlayer(player: Omit<Player, 'id' | 'created_at'>): Promise<Player> {
  const supabase = createClient();
  const { data, error } = await supabase.from('players').insert(player).select().single();
  if (error) throw error;
  return data;
}

export async function checkDuplicateJersey(teamId: string, jersey: number): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.from('players')
    .select('id')
    .eq('team_id', teamId)
    .eq('jersey_number', jersey)
    .eq('is_active', true);
  if (error) throw error;
  return data.length > 0;
}

export async function deletePlayer(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('players').update({ is_active: false }).eq('id', id);
  if (error) throw error;
}
