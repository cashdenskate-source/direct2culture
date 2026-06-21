import { readFileSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];
if (!EMAIL || !PASSWORD) {
  console.error('Usage: node scripts/reset-password.mjs <email> <new-password>');
  process.exit(1);
}

const serviceAccount = JSON.parse(
  readFileSync(new URL('../serviceAccountKey.json', import.meta.url), 'utf-8'),
);
initializeApp({ credential: cert(serviceAccount) });

const user = await getAuth().getUserByEmail(EMAIL);
await getAuth().updateUser(user.uid, { password: PASSWORD });

console.log(`✓ Password updated for ${EMAIL}`);
process.exit(0);
