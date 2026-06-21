import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Boolean(firebaseConfig.projectId);

let app = null;
let db = null;
let auth = null;

if (hasFirebaseConfig) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth, hasFirebaseConfig };

export async function submitToCollection(collectionName, data) {
  if (!hasFirebaseConfig || !db) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (typeof window !== 'undefined') {
      const key = `d2c_${collectionName}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ ...data, _localTimestamp: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    }
    return { ok: true, local: true };
  }
  const ref = collection(db, collectionName);
  const doc = await addDoc(ref, { ...data, createdAt: serverTimestamp() });
  return { ok: true, id: doc.id };
}
