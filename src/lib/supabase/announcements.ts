import { createClient } from './client';
import { Announcement } from '../types';

export async function getAnnouncements(activeOnly = true): Promise<Announcement[]> {
  const supabase = createClient();
  let query = supabase.from('announcements').select('*').order('created_at', { ascending: false });
  if (activeOnly) query = query.eq('is_active', true);
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
