import {
  collection, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc,
  onSnapshot, orderBy, query, where, serverTimestamp,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase.js';

// ─── Stories (editor-managed long-form) ────────────────────────────────────
export function subscribeStories(onChange) {
  if (!hasFirebaseConfig || !db) { onChange([]); return () => {}; }
  return onSnapshot(query(collection(db, 'stories'), orderBy('createdAt', 'desc')), (s) =>
    onChange(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
  );
}

export async function createStory(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, 'stories'), { ...data, status: data.status || 'draft', createdAt: serverTimestamp() });
}

export async function updateStory(id, patch) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await updateDoc(doc(db, 'stories', id), { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteStory(id) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await deleteDoc(doc(db, 'stories', id));
}

// ─── Submissions (public-create) ───────────────────────────────────────────
export async function submitStorySubmission(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, 'storySubmissions'), { ...data, status: 'submitted', createdAt: serverTimestamp() });
}

export async function submitCreatorVideo(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, 'videoSubmissions'), { ...data, status: 'submitted', createdAt: serverTimestamp() });
}

export async function submitTicketSignup(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, 'ticketSignups'), { ...data, createdAt: serverTimestamp() });
}

export async function submitDropSignup(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, 'dropSignups'), { ...data, createdAt: serverTimestamp() });
}

// ─── Curation: weekly Single/Drop/Featured Story ───────────────────────────
const CURATION_DOC = doc(db || {}, 'featuredContent', 'weekly');

export async function getCurated() {
  if (!hasFirebaseConfig || !db) return null;
  const snap = await getDoc(doc(db, 'featuredContent', 'weekly'));
  return snap.exists() ? snap.data() : null;
}

export async function setCurated(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await setDoc(doc(db, 'featuredContent', 'weekly'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// Suppress unused warning for the placeholder ref above
void CURATION_DOC;
