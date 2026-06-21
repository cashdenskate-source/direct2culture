import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase.js';

// Watchlist items live at users/{uid}/watchlist/{kind_id}
// kind: 'song' | 'artist' | 'brand' | 'dj' | 'creative'

function key(kind, id) {
  return `${kind}_${id}`;
}

export async function addToWatchlist(uid, { kind, id, ticker, title, subtitle, imageURL, href }) {
  if (!hasFirebaseConfig || !db || !uid) throw new Error('Not signed in.');
  await setDoc(doc(db, 'users', uid, 'watchlist', key(kind, id)), {
    kind, id, ticker: ticker || '', title: title || '', subtitle: subtitle || '',
    imageURL: imageURL || '', href: href || '',
    addedAt: serverTimestamp(),
  });
}

export async function removeFromWatchlist(uid, kind, id) {
  if (!hasFirebaseConfig || !db || !uid) return;
  await deleteDoc(doc(db, 'users', uid, 'watchlist', key(kind, id)));
}

export async function isOnWatchlist(uid, kind, id) {
  if (!hasFirebaseConfig || !db || !uid) return false;
  const snap = await getDoc(doc(db, 'users', uid, 'watchlist', key(kind, id)));
  return snap.exists();
}

export function subscribeWatchlist(uid, onChange) {
  if (!hasFirebaseConfig || !db || !uid) { onChange([]); return () => {}; }
  const q = query(collection(db, 'users', uid, 'watchlist'), orderBy('addedAt', 'desc'));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ docId: d.id, ...d.data() })));
  });
}
