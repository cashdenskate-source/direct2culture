import { readFileSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { GoogleAuth } from 'google-auth-library';

const EMAIL = process.argv[2] || 'cashdenskate@gmail.com';
const KEY_PATH = new URL('../serviceAccountKey.json', import.meta.url);

const serviceAccount = JSON.parse(readFileSync(KEY_PATH, 'utf-8'));
const PROJECT_ID = serviceAccount.project_id;

initializeApp({ credential: cert(serviceAccount) });
const user = await getAuth().getUserByEmail(EMAIL);

const googleAuth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/datastore'],
});
const client = await googleAuth.getClient();
const token = (await client.getAccessToken()).token;

const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${user.uid}?updateMask.fieldPaths=role&updateMask.fieldPaths=email&updateMask.fieldPaths=uid&updateMask.fieldPaths=name&updateMask.fieldPaths=newsletterOptIn&updateMask.fieldPaths=updatedAt&updateMask.fieldPaths=createdAt`;

const nowIso = new Date().toISOString();
const body = {
  fields: {
    role: { stringValue: 'admin' },
    email: { stringValue: user.email },
    uid: { stringValue: user.uid },
    name: { stringValue: user.displayName || 'Cashden' },
    newsletterOptIn: { booleanValue: true },
    updatedAt: { timestampValue: nowIso },
    createdAt: { timestampValue: nowIso },
  },
};

const res = await fetch(url, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

if (!res.ok) {
  console.error('Firestore write failed:', res.status, await res.text());
  process.exit(1);
}

console.log(`✓ ${EMAIL} is now admin (uid: ${user.uid})`);
process.exit(0);
