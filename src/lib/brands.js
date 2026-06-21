import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase.js';

export function subscribeBrands(onChange) {
  if (!hasFirebaseConfig || !db) { onChange([]); return () => {}; }
  const q = query(collection(db, 'brands'), orderBy('followersIG', 'desc'));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function getBrandByTicker(ticker) {
  if (!hasFirebaseConfig || !db) return null;
  const snap = await getDocs(query(collection(db, 'brands'), where('ticker', '==', ticker.toUpperCase())));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function createBrand(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, 'brands'), {
    ...data,
    ticker: (data.ticker || '').toUpperCase(),
    followersIG: Number(data.followersIG || 0),
    followersTT: Number(data.followersTT || 0),
    growthPct: Number(data.growthPct || 0),
    trendScore: Number(data.trendScore || 0),
    createdAt: serverTimestamp(),
  });
}

export async function updateBrand(id, patch) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await updateDoc(doc(db, 'brands', id), {
    ...patch,
    ...(patch.ticker ? { ticker: patch.ticker.toUpperCase() } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBrand(id) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await deleteDoc(doc(db, 'brands', id));
}

export async function recordBrandSnapshot(brandId, dateIso, { followersIG, followersTT, growthPct }) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  const id = `${brandId}_${dateIso}`;
  await setDoc(doc(db, 'brandHistory', id), {
    brandId,
    date: dateIso,
    followers: Number(followersIG || 0) + Number(followersTT || 0),
    followersIG: Number(followersIG || 0),
    followersTT: Number(followersTT || 0),
    growthPct: Number(growthPct || 0),
    createdAt: serverTimestamp(),
  });
}

export function subscribeBrandHistory(brandId, onChange) {
  if (!brandId || !hasFirebaseConfig || !db) { onChange([]); return () => {}; }
  const q = query(
    collection(db, 'brandHistory'),
    where('brandId', '==', brandId),
    orderBy('date', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data(), streams: d.data().followers })));
  });
}
