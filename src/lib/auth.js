import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from './firebase.js';

export async function signUpCustomer({ email, password, name, phone, photoFile, userType }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(cred.user, { displayName: name });
  }

  let photoURL = '';
  if (photoFile) {
    photoURL = await uploadAvatar(cred.user.uid, photoFile);
    await updateProfile(cred.user, { photoURL });
  }

  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email,
    name: name || '',
    phone: phone || '',
    photoURL,
    userType: userType || 'fan',
    role: 'customer',
    createdAt: serverTimestamp(),
    newsletterOptIn: true,
  });
  return { user: cred.user, role: 'customer' };
}

export async function uploadAvatar(uid, file) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const ref = storageRef(storage, `users/${uid}/avatar.${ext}`);
  await uploadBytes(ref, file, { contentType: file.type });
  return getDownloadURL(ref);
}

export async function removeAvatar(uid, currentPhotoURL) {
  if (!currentPhotoURL) return;
  try {
    const path = decodeURIComponent(currentPhotoURL.split('/o/')[1].split('?')[0]);
    await deleteObject(storageRef(storage, path));
  } catch {}
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
