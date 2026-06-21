import { readFileSync, writeFileSync } from 'node:fs';
import { GoogleAuth } from 'google-auth-library';

const serviceAccount = JSON.parse(
  readFileSync(new URL('../serviceAccountKey.json', import.meta.url), 'utf-8'),
);
const PROJECT_ID = serviceAccount.project_id;

const googleAuth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/firebase'],
});
const client = await googleAuth.getClient();
const token = (await client.getAccessToken()).token;

const listRes = await fetch(
  `https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps`,
  { headers: { Authorization: `Bearer ${token}` } },
);
if (!listRes.ok) {
  console.error('List webApps failed:', listRes.status, await listRes.text());
  process.exit(1);
}
const { apps = [] } = await listRes.json();
if (apps.length === 0) {
  console.error('No web apps found in project. Create one in Firebase Console.');
  process.exit(1);
}
const app = apps[0];
console.log(`Using web app: ${app.displayName || app.appId}`);

const configRes = await fetch(
  `https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps/${app.appId.split('/').pop()}/config`,
  { headers: { Authorization: `Bearer ${token}` } },
);
if (!configRes.ok) {
  console.error('Get config failed:', configRes.status, await configRes.text());
  process.exit(1);
}
const cfg = await configRes.json();

const envLines = [
  `VITE_FIREBASE_API_KEY=${cfg.apiKey}`,
  `VITE_FIREBASE_AUTH_DOMAIN=${cfg.authDomain}`,
  `VITE_FIREBASE_PROJECT_ID=${cfg.projectId}`,
  `VITE_FIREBASE_STORAGE_BUCKET=${cfg.storageBucket}`,
  `VITE_FIREBASE_MESSAGING_SENDER_ID=${cfg.messagingSenderId}`,
  `VITE_FIREBASE_APP_ID=${cfg.appId}`,
  '',
];

writeFileSync(
  new URL('../.env.local', import.meta.url),
  envLines.join('\n'),
);
console.log('✓ Wrote .env.local with', envLines.length - 1, 'vars');
process.exit(0);
