import { createClient } from './client';

export async function completeMatch(matchId: string): Promise<void> {
  const supabase = createClient();
  // Simplified for now - just marks it completed.
  const { error } = await supabase.from('matches').update({ status: 'Completed' }).eq('id', matchId);
  if (error) throw error;
}
