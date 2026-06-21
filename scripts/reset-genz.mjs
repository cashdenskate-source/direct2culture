import { readFileSync } from 'node:fs';
import { GoogleAuth } from 'google-auth-library';

const serviceAccount = JSON.parse(
  readFileSync(new URL('../serviceAccountKey.json', import.meta.url), 'utf-8'),
);
const PROJECT_ID = serviceAccount.project_id;

const googleAuth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/datastore'],
});
const client = await googleAuth.getClient();
const token = (await client.getAccessToken()).token;

const SONG_ID = 'cashden-genz';
const TOTAL = 13; // real YouTube count
const today = new Date().toISOString().slice(0, 10);

// 1. Update song with real numbers
const songURL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/songs/${SONG_ID}?` +
  ['totalStreams', 'streamsToday', 'change7d', 'change30d', 'spotifyStreams', 'appleStreams', 'youtubeViews'].map((k) => `updateMask.fieldPaths=${k}`).join('&');
await fetch(songURL, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fields: {
      totalStreams: { integerValue: '13' },
      streamsToday: { integerValue: '13' },
      change7d: { doubleValue: 0 },
      change30d: { doubleValue: 0 },
      spotifyStreams: { integerValue: '0' },
      appleStreams: { integerValue: '0' },
      youtubeViews: { integerValue: '13' },
    },
  }),
});
console.log('✓ GENZ updated to real numbers (YouTube=13)');

// 2. Delete fake history docs (we know they were seeded as cashden-genz_YYYY-MM-DD)
const listRes = await fetch(
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`,
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'streamHistory' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'songId' },
            op: 'EQUAL',
            value: { stringValue: SONG_ID },
          },
        },
      },
    }),
  },
);
const rows = await listRes.json();
const docs = (rows || []).filter((r) => r.document).map((r) => r.document.name);
for (const name of docs) {
  await fetch(`https://firestore.googleapis.com/v1/${name}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
console.log(`✓ Deleted ${docs.length} fake history points`);

// 3. Write one real point for today
await fetch(
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/streamHistory/${SONG_ID}_${today}`,
  {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        songId: { stringValue: SONG_ID },
        date: { stringValue: today },
        streams: { integerValue: '13' },
      },
    }),
  },
);
console.log(`✓ Wrote real chart point for ${today}: 13 streams`);

process.exit(0);
