import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Announcement } from '@/lib/types';

const ANNOUNCEMENTS_COLLECTION = 'announcements';

export async function getAnnouncements(activeOnly?: boolean): Promise<Announcement[]> {
  let q = query(collection(db, ANNOUNCEMENTS_COLLECTION), orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(q);
  let announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
  
  if (activeOnly) {
    announcements = announcements.filter(a => a.isActive);
  }
  
  return announcements;
}

export async function getAnnouncement(id: string): Promise<Announcement | null> {
  const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Announcement) : null;
}

export async function createAnnouncement(data: Omit<Announcement, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, ANNOUNCEMENTS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<void> {
  const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
  await updateDoc(docRef, data);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
  await deleteDoc(docRef);
}
