import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase.js';

const COLLECTION = 'appointments';

export function subscribeAppointments(onChange, onError) {
  if (!hasFirebaseConfig || !db) {
    onChange([]);
    return () => {};
  }
  const q = query(collection(db, COLLECTION), orderBy('start', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
    (err) => onError && onError(err),
  );
}

export async function createAppointment({ clientUid, clientName, clientEmail, title, start, end, notes }) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, COLLECTION), {
    clientUid: clientUid || null,
    clientName: clientName || '',
    clientEmail: clientEmail || '',
    title: title || 'Appointment',
    start: Timestamp.fromDate(new Date(start)),
    end: Timestamp.fromDate(new Date(end)),
    notes: notes || '',
    createdAt: serverTimestamp(),
  });
}

export async function updateAppointment(id, patch) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  const data = { ...patch };
  if (patch.start) data.start = Timestamp.fromDate(new Date(patch.start));
  if (patch.end) data.end = Timestamp.fromDate(new Date(patch.end));
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteAppointment(id) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await deleteDoc(doc(db, COLLECTION, id));
}
