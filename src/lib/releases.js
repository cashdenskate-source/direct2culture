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
  Timestamp,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase.js';

const COLLECTION = 'releases';

export function subscribeUpcoming(onChange) {
  if (!hasFirebaseConfig || !db) { onChange([]); return () => {}; }
  const q = query(
    collection(db, COLLECTION),
    where('status', 'in', ['pending', 'approved', 'live']),
    orderBy('releaseDate', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeApprovedUpcoming(onChange) {
  if (!hasFirebaseConfig || !db) { onChange([]); return () => {}; }
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'approved'),
    orderBy('releaseDate', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function getRelease(id) {
  if (!hasFirebaseConfig || !db) return null;
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createRelease(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, COLLECTION), {
    title: data.title || '',
    type: data.type || 'song',
    artistUid: data.artistUid || null,
    artistName: data.artistName || '',
    coverURL: data.coverURL || '',
    releaseDate: Timestamp.fromDate(new Date(data.releaseDate)),
    description: data.description || '',
    spotifyURL: data.spotifyURL || '',
    appleMusicURL: data.appleMusicURL || '',
    youtubeURL: data.youtubeURL || '',
    status: data.status || 'pending',
    presaveCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function updateRelease(id, patch) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  const data = { ...patch, updatedAt: serverTimestamp() };
  if (patch.releaseDate) data.releaseDate = Timestamp.fromDate(new Date(patch.releaseDate));
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteRelease(id) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function presaveRelease(releaseId, user) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  const ref = doc(db, COLLECTION, releaseId, 'presaves', user.uid);
  await setDoc(ref, {
    uid: user.uid,
    email: user.email,
    name: user.displayName || '',
    createdAt: serverTimestamp(),
  });
}

export async function hasPresaved(releaseId, uid) {
  if (!hasFirebaseConfig || !db) return false;
  const snap = await getDoc(doc(db, COLLECTION, releaseId, 'presaves', uid));
  return snap.exists();
}

export async function countPresaves(releaseId) {
  if (!hasFirebaseConfig || !db) return 0;
  const snap = await getDocs(collection(db, COLLECTION, releaseId, 'presaves'));
  return snap.size;
}
