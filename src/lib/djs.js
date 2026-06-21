import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  onSnapshot, orderBy, query, where, serverTimestamp,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase.js';

export function subscribeDJs(onChange) {
  if (!hasFirebaseConfig || !db) { onChange([]); return () => {}; }
  return onSnapshot(query(collection(db, 'djs'), orderBy('influenceScore', 'desc')), (s) =>
    onChange(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
  );
}

export async function getDJByHandle(handle) {
  if (!hasFirebaseConfig || !db) return null;
  const snap = await getDocs(query(collection(db, 'djs'), where('handle', '==', handle.toLowerCase())));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function createDJ(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, 'djs'), {
    ...data,
    handle: (data.handle || '').toLowerCase(),
    totalSpins: Number(data.totalSpins || 0),
    influenceScore: Number(data.influenceScore || 0),
    cultureScore: Number(data.cultureScore || 0),
    verified: !!data.verified,
    createdAt: serverTimestamp(),
  });
}

export async function updateDJ(id, patch) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await updateDoc(doc(db, 'djs', id), { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteDJ(id) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await deleteDoc(doc(db, 'djs', id));
}
