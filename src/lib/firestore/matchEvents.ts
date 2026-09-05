import { collection, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MatchEvent } from '@/lib/types';

const EVENTS_COLLECTION = 'matchEvents';

export async function getMatchEvents(matchId: string): Promise<MatchEvent[]> {
  const q = query(
    collection(db, EVENTS_COLLECTION),
    where('matchId', '==', matchId),
    orderBy('createdAt', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchEvent));
}

export async function addMatchEvent(data: Omit<MatchEvent, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteMatchEvent(id: string): Promise<void> {
  const docRef = doc(db, EVENTS_COLLECTION, id);
  await deleteDoc(docRef);
}

export function subscribeToMatchEvents(matchId: string, callback: (events: MatchEvent[]) => void): () => void {
  const q = query(
    collection(db, EVENTS_COLLECTION),
    where('matchId', '==', matchId),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatchEvent));
    callback(events);
  });
}
