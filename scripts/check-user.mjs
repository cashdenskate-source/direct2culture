import { readFileSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const EMAIL = process.argv[2] || 'cashdenskate@gmail.com';
const serviceAccount = JSON.parse(
  readFileSync(new URL('../serviceAccountKey.json', import.meta.url), 'utf-8'),
);
initializeApp({ credential: cert(serviceAccount) });

const user = await getAuth().getUserByEmail(EMAIL);
console.log({
  uid: user.uid,
  email: user.email,
  emailVerified: user.emailVerified,
  disabled: user.disabled,
  providerData: user.providerData.map((p) => p.providerId),
  metadata: {
    creationTime: user.metadata.creationTime,
    lastSignInTime: user.metadata.lastSignInTime,
  },
});
process.exit(0);
