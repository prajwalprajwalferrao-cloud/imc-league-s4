import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Team } from '@/lib/types';

const TEAMS_COLLECTION = 'teams';

export async function getTeams(seasonId?: string): Promise<Team[]> {
  let q = query(collection(db, TEAMS_COLLECTION), where('isDeleted', '==', false), orderBy('name'));
  if (seasonId) {
    q = query(collection(db, TEAMS_COLLECTION), where('isDeleted', '==', false), where('seasonId', '==', seasonId), orderBy('name'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
}

export async function getTeam(id: string): Promise<Team | null> {
  const docRef = doc(db, TEAMS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Team) : null;
}

export async function createTeam(data: Omit<Team, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, TEAMS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateTeam(id: string, data: Partial<Team>): Promise<void> {
  const docRef = doc(db, TEAMS_COLLECTION, id);
  await updateDoc(docRef, data);
}

export async function softDeleteTeam(id: string): Promise<void> {
  const docRef = doc(db, TEAMS_COLLECTION, id);
  await updateDoc(docRef, { isDeleted: true });
}
