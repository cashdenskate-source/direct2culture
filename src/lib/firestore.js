import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase.js';

function ensureDb() {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase is not configured.');
}

export async function listAll(collectionName, { orderField = 'createdAt', orderDir = 'desc', max } = {}) {
  ensureDb();
  let q = collection(db, collectionName);
  const clauses = [];
  if (orderField) clauses.push(orderBy(orderField, orderDir));
  if (max) clauses.push(limit(max));
  if (clauses.length) q = query(q, ...clauses);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listWhere(collectionName, conditions, opts = {}) {
  ensureDb();
  let q = collection(db, collectionName);
  const clauses = conditions.map((c) => where(...c));
  if (opts.orderField) clauses.push(orderBy(opts.orderField, opts.orderDir || 'desc'));
  if (opts.max) clauses.push(limit(opts.max));
  if (clauses.length) q = query(q, ...clauses);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getOne(collectionName, id) {
  ensureDb();
  const snap = await getDoc(doc(db, collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createDoc(collectionName, data) {
  ensureDb();
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function setDocById(collectionName, id, data) {
  ensureDb();
  await setDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateOne(collectionName, id, patch) {
  ensureDb();
  await updateDoc(doc(db, collectionName, id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOne(collectionName, id) {
  ensureDb();
  await deleteDoc(doc(db, collectionName, id));
}

export async function countCollection(collectionName) {
  ensureDb();
  const snap = await getDocs(collection(db, collectionName));
  return snap.size;
}

export async function logActivity(actorUid, action, details = {}) {
  if (!hasFirebaseConfig || !db) return;
  try {
    await addDoc(collection(db, 'activityLogs'), {
      actorUid,
      action,
      details,
      createdAt: serverTimestamp(),
    });
  } catch {}
}
