import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDocs,
  onSnapshot, orderBy, query, where, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase.js';

export function subscribeRecentSpins(onChange, limit = 25) {
  if (!hasFirebaseConfig || !db) { onChange([]); return () => {}; }
  return onSnapshot(query(collection(db, 'djSpins'), orderBy('spunAt', 'desc')), (s) =>
    onChange(s.docs.slice(0, limit).map((d) => ({ id: d.id, ...d.data() }))),
  );
}

export function subscribeSpinsByDJ(djId, onChange) {
  if (!hasFirebaseConfig || !db || !djId) { onChange([]); return () => {}; }
  return onSnapshot(query(collection(db, 'djSpins'), where('djId', '==', djId), orderBy('spunAt', 'desc')), (s) =>
    onChange(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
  );
}

export function subscribeSpinsBySong(songId, onChange) {
  if (!hasFirebaseConfig || !db || !songId) { onChange([]); return () => {}; }
  return onSnapshot(query(collection(db, 'djSpins'), where('songId', '==', songId), orderBy('spunAt', 'desc')), (s) =>
    onChange(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
  );
}

export async function logSpin(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, 'djSpins'), {
    djId: data.djId, djName: data.djName, djHandle: data.djHandle || '',
    songId: data.songId || null, songTitle: data.songTitle || '', songTicker: data.songTicker || '',
    artistName: data.artistName || '',
    venue: data.venue || '', city: data.city || '',
    spunAt: data.spunAt ? Timestamp.fromDate(new Date(data.spunAt)) : serverTimestamp(),
    notes: data.notes || '',
    createdAt: serverTimestamp(),
  });
}

export async function updateSpin(id, patch) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  const data = { ...patch };
  if (patch.spunAt) data.spunAt = Timestamp.fromDate(new Date(patch.spunAt));
  await updateDoc(doc(db, 'djSpins', id), data);
}

export async function deleteSpin(id) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await deleteDoc(doc(db, 'djSpins', id));
}

export async function recountDJSpins(djId) {
  if (!hasFirebaseConfig || !db) return 0;
  const snap = await getDocs(query(collection(db, 'djSpins'), where('djId', '==', djId)));
  return snap.size;
}
