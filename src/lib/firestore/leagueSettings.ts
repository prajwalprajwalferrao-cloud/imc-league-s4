import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LeagueSettings } from '@/lib/types';

const SETTINGS_COLLECTION = 'leagueSettings';
const SETTINGS_DOC = 'config';

const defaults: Omit<LeagueSettings, 'id'> = {
  leagueName: 'IMC League',
  seasonName: 'Season 4',
  logoUrl: '',
  currentSeasonId: '',
  pointsWin: 2,
  pointsNoResult: 1,
  pointsLoss: 0,
  enableMotm: true,
  defaultVenue: 'Main Stadium',
  totalOvers: 20,
};

export async function getLeagueSettings(): Promise<LeagueSettings> {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as LeagueSettings;
  } else {
    // If it doesn't exist, create it with defaults
    await setDoc(docRef, defaults);
    return { id: SETTINGS_DOC, ...defaults };
  }
}

export async function updateLeagueSettings(data: Partial<LeagueSettings>): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
  
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    await setDoc(docRef, { ...defaults, ...data });
  } else {
    await updateDoc(docRef, data);
  }
}
