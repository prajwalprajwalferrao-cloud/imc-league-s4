import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Player } from '@/lib/types';

const PLAYERS_COLLECTION = 'players';

export async function getPlayers(teamId?: string, seasonId?: string): Promise<Player[]> {
  let q = query(collection(db, PLAYERS_COLLECTION), where('isActive', '==', true), orderBy('name'));
  
  // Note: Firestore requires composite indexes if chaining where clauses on different fields.
  // We'll just filter client side if needed for this simple setup, or assume indexes are built.
  // For safety, let's just fetch by teamId if provided, else all active.
  
  if (teamId) {
     q = query(collection(db, PLAYERS_COLLECTION), where('isActive', '==', true), where('teamId', '==', teamId));
  }
  
  const snapshot = await getDocs(q);
  let players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
  
  if (seasonId) {
     players = players.filter(p => p.seasonId === seasonId);
  }
  
  return players.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPlayer(id: string): Promise<Player | null> {
  const docRef = doc(db, PLAYERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Player) : null;
}

export async function createPlayer(data: Omit<Player, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, PLAYERS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePlayer(id: string, data: Partial<Player>): Promise<void> {
  const docRef = doc(db, PLAYERS_COLLECTION, id);
  await updateDoc(docRef, data);
}

export async function deletePlayer(id: string): Promise<void> {
  const docRef = doc(db, PLAYERS_COLLECTION, id);
  await updateDoc(docRef, { isActive: false });
}

export async function checkDuplicateJersey(teamId: string, jerseyNumber: number, excludePlayerId?: string): Promise<boolean> {
  const q = query(
    collection(db, PLAYERS_COLLECTION), 
    where('teamId', '==', teamId), 
    where('jerseyNumber', '==', jerseyNumber),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return false;
  if (!excludePlayerId) return true;
  
  // If editing, exclude current player
  return snapshot.docs.some(doc => doc.id !== excludePlayerId);
}
