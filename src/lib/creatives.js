import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDocs,
  onSnapshot, orderBy, query, where, serverTimestamp,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase.js';

export const CATEGORIES = ['model', 'director', 'editor', 'photographer'];

export function subscribeCreatives(category, onChange) {
  if (!hasFirebaseConfig || !db) { onChange([]); return () => {}; }
  const base = collection(db, 'creatives');
  const q = category
    ? query(base, where('category', '==', category), orderBy('cultureScore', 'desc'))
    : query(base, orderBy('cultureScore', 'desc'));
  return onSnapshot(q, (s) => onChange(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export async function getCreativeByTicker(ticker) {
  if (!hasFirebaseConfig || !db) return null;
  const snap = await getDocs(query(collection(db, 'creatives'), where('ticker', '==', ticker.toUpperCase())));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function createCreative(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, 'creatives'), {
    ...data,
    ticker: (data.ticker || '').toUpperCase(),
    projects: Number(data.projects || 0),
    bookings: Number(data.bookings || 0),
    followers: Number(data.followers || 0),
    totalViews: Number(data.totalViews || 0),
    growthScore: Number(data.growthScore || 0),
    cultureScore: Number(data.cultureScore || 0),
    verified: !!data.verified,
    createdAt: serverTimestamp(),
  });
}

export async function updateCreative(id, patch) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await updateDoc(doc(db, 'creatives', id), {
    ...patch,
    ...(patch.ticker ? { ticker: patch.ticker.toUpperCase() } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCreative(id) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await deleteDoc(doc(db, 'creatives', id));
}
