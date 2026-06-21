import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';

const BOOTSTRAP_ADMIN_EMAIL = (import.meta.env.VITE_BOOTSTRAP_ADMIN_EMAIL || '').toLowerCase().trim();

export async function signUpCustomer({ email, password, name }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(cred.user, { displayName: name });
  }
  const isBootstrapAdmin = BOOTSTRAP_ADMIN_EMAIL && email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL;
  const role = isBootstrapAdmin ? 'admin' : 'customer';
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email,
    name: name || '',
    role,
    createdAt: serverTimestamp(),
    newsletterOptIn: true,
  });
  return { user: cred.user, role };
}

export async function signIn({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signOut() {
  await fbSignOut(auth);
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function fetchUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function updateUserProfile(uid, patch) {
  await updateDoc(doc(db, 'users', uid), { ...patch, updatedAt: serverTimestamp() });
}
