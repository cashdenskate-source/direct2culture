import { readFileSync } from 'node:fs';
import { GoogleAuth } from 'google-auth-library';

const BRAND_ID = process.argv[2];
if (!BRAND_ID) { console.error('Usage: node scripts/update-brand.mjs <brandId> field=value ...'); process.exit(1); }

const patch = {};
for (let i = 3; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (!arg.includes('=')) continue;
  const [k, ...rest] = arg.split('=');
  patch[k] = rest.join('=');
}
if (Object.keys(patch).length === 0) { console.error('No fields.'); process.exit(1); }

const serviceAccount = JSON.parse(readFileSync(new URL('../serviceAccountKey.json', import.meta.url), 'utf-8'));
const PROJECT_ID = serviceAccount.project_id;

const googleAuth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/datastore'],
});
const client = await googleAuth.getClient();
const token = (await client.getAccessToken()).token;

const mask = Object.keys(patch).map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/brands/${BRAND_ID}?${mask}`;
const fields = {};
for (const [k, v] of Object.entries(patch)) fields[k] = { stringValue: String(v) };

const res = await fetch(url, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ fields }),
});
if (!res.ok) { console.error('Update failed:', res.status, await res.text()); process.exit(1); }
console.log(`✓ Updated brands/${BRAND_ID}:`, patch);
process.exit(0);
