import { doc, getDoc, writeBatch, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Match, MatchEvent } from '@/lib/types';
import { getMatchEvents } from './matchEvents';
import { getWinner } from '../matchUtils';

export async function completeMatch(matchId: string): Promise<void> {
  const matchRef = doc(db, 'matches', matchId);
  const matchSnap = await getDoc(matchRef);
  
  if (!matchSnap.exists()) {
    throw new Error('Match not found');
  }
  
  const match = { id: matchSnap.id, ...matchSnap.data() } as Match;
  
  if (match.status === 'Completed') {
    throw new Error('Match is already completed');
  }
  
  const events = await getMatchEvents(matchId);
  
  // Calculate per-player stats from events
  const playerStats: Record<string, { runsScored: number; wicketsTaken: number; catches: number; runOuts: number; ballsFaced: number }> = {};
  
  const initPlayer = (id: string) => {
    if (!playerStats[id]) {
      playerStats[id] = { runsScored: 0, wicketsTaken: 0, catches: 0, runOuts: 0, ballsFaced: 0 };
    }
  };
  
  events.forEach((event) => {
    if (event.type === 'runs' || event.type === 'boundary_4' || event.type === 'boundary_6') {
      if (event.batsmanId) {
        initPlayer(event.batsmanId);
        playerStats[event.batsmanId].runsScored += event.runs;
        playerStats[event.batsmanId].ballsFaced += 1;
      }
    }
    
    if (event.type === 'wicket') {
      if (event.batsmanId) {
        initPlayer(event.batsmanId);
        playerStats[event.batsmanId].ballsFaced += 1;
      }
      
      if (event.bowlerId && event.dismissalType !== 'run_out') {
        initPlayer(event.bowlerId);
        playerStats[event.bowlerId].wicketsTaken += 1;
      }
      
      if (event.fielderId && event.dismissalType === 'caught') {
        initPlayer(event.fielderId);
        playerStats[event.fielderId].catches += 1;
      }
      
      if (event.fielderId && event.dismissalType === 'run_out') {
        initPlayer(event.fielderId);
        playerStats[event.fielderId].runOuts += 1;
      }
    }
    
    // Track balls faced for dot balls or other non-run events if we add them
  });
  
  const batch = writeBatch(db);
  
  // Update match status
  batch.update(matchRef, { 
    status: 'Completed',
    updatedAt: new Date()
  });
  
  // Update player stats
  // Note: For a production app we'd also need to track appearances (played in this match)
  // For now, we update stats for anyone who was involved in an event
  for (const [playerId, stats] of Object.entries(playerStats)) {
    const playerRef = doc(db, 'players', playerId);
    
    const updates: any = {};
    if (stats.runsScored > 0) updates.runsScored = increment(stats.runsScored);
    if (stats.wicketsTaken > 0) updates.wicketsTaken = increment(stats.wicketsTaken);
    if (stats.catches > 0) updates.catches = increment(stats.catches);
    if (stats.runOuts > 0) updates.runOuts = increment(stats.runOuts);
    if (stats.ballsFaced > 0) updates.ballsFaced = increment(stats.ballsFaced);
    
    // Assuming if they have stats, they made an appearance. 
    // Ideally we'd have a starting XI array on the match object.
    updates.appearances = increment(1); 
    
    if (Object.keys(updates).length > 0) {
      batch.update(playerRef, updates);
    }
  }
  
  await batch.commit();
}
