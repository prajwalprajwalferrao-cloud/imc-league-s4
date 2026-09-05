import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Match, MatchStatus } from '@/lib/types';

const MATCHES_COLLECTION = 'matches';

export async function getMatches(seasonId?: string, status?: MatchStatus): Promise<Match[]> {
  let q = query(collection(db, MATCHES_COLLECTION), orderBy('date', 'desc'), orderBy('time', 'desc'));
  
  // Client side filtering for simplicity without requiring composite indexes immediately
  const snapshot = await getDocs(q);
  let matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
  
  if (seasonId) {
    matches = matches.filter(m => m.seasonId === seasonId);
  }
  if (status) {
    matches = matches.filter(m => m.status === status);
  }
  
  return matches;
}

export async function getMatch(id: string): Promise<Match | null> {
  const docRef = doc(db, MATCHES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Match) : null;
}

export async function createMatch(data: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, MATCHES_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateMatch(id: string, data: Partial<Match>): Promise<void> {
  const docRef = doc(db, MATCHES_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToMatch(id: string, callback: (match: Match | null) => void): () => void {
  const docRef = doc(db, MATCHES_COLLECTION, id);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Match);
    } else {
      callback(null);
    }
  });
}

export function subscribeToLiveMatches(seasonId: string, callback: (matches: Match[]) => void): () => void {
  const q = query(collection(db, MATCHES_COLLECTION), where('status', '==', 'Live'));
  return onSnapshot(q, (snapshot) => {
    const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
    const seasonMatches = matches.filter(m => m.seasonId === seasonId);
    callback(seasonMatches);
  });
}
