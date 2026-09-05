import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Season } from '@/lib/types';

const SEASONS_COLLECTION = 'seasons';

export async function getSeasons(): Promise<Season[]> {
  const q = query(collection(db, SEASONS_COLLECTION), orderBy('seasonNumber', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Season));
}

export async function getActiveSeason(): Promise<Season | null> {
  const q = query(collection(db, SEASONS_COLLECTION), where('isActive', '==', true));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Season;
}

export async function getSeason(id: string): Promise<Season | null> {
  const docRef = doc(db, SEASONS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Season) : null;
}

export async function createSeason(data: Omit<Season, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, SEASONS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSeason(id: string, data: Partial<Season>): Promise<void> {
  const docRef = doc(db, SEASONS_COLLECTION, id);
  await updateDoc(docRef, data);
}

export async function setActiveSeason(id: string): Promise<void> {
  // Batch write to set all seasons to isActive: false, then set target to true
  const q = query(collection(db, SEASONS_COLLECTION));
  const snapshot = await getDocs(q);
  
  const batch = writeBatch(db);
  
  snapshot.docs.forEach((docSnap) => {
    const docRef = doc(db, SEASONS_COLLECTION, docSnap.id);
    if (docSnap.id === id) {
      batch.update(docRef, { isActive: true, status: 'active' });
    } else {
      batch.update(docRef, { isActive: false });
    }
  });
  
  await batch.commit();
}
