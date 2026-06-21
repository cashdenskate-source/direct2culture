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

function fsValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  }
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  throw new Error('Unsupported value type: ' + typeof v);
}

function toFsFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    fields[k] = fsValue(v);
  }
  return fields;
}

async function writeDoc(collection, id, data) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${id}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFsFields(data) }),
  });
  if (!res.ok) {
    console.error('Write failed', collection, id, await res.text());
    throw new Error('write failed');
  }
}

// ---- Data ----
const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);

const ARTISTS = [
  { id: 'cashden',     name: 'Cashden',       ticker: 'CSHDN',  monthlyListeners: 184_320, totalStreams: 4_280_000, fanGrowthPct: 27.4, trendScore: 92, bio: 'Direct2Culture flagship artist. Sound design, raw cadence, no algorithm chasing.' },
  { id: 'aiyana',      name: 'Aiyana Rose',   ticker: 'AIYA',   monthlyListeners: 92_104,  totalStreams: 1_870_000, fanGrowthPct: 12.1, trendScore: 78 },
  { id: 'rico-mvp',    name: 'Rico MVP',      ticker: 'RICOM',  monthlyListeners: 56_900,  totalStreams: 902_000,   fanGrowthPct: 18.7, trendScore: 71 },
  { id: 'kobe-st',     name: 'Kobe St.',      ticker: 'KOBE',   monthlyListeners: 38_400,  totalStreams: 612_000,   fanGrowthPct: -4.2, trendScore: 55 },
  { id: 'midas-blue',  name: 'Midas Blue',    ticker: 'MIDAS',  monthlyListeners: 144_500, totalStreams: 3_120_000, fanGrowthPct: 8.9,  trendScore: 84 },
  { id: 'lola-saint',  name: 'Lola Saint',    ticker: 'LOLA',   monthlyListeners: 71_200,  totalStreams: 1_410_000, fanGrowthPct: 33.0, trendScore: 88 },
];

const SONGS = [
  { id: 'cashden-genz',    title: 'GENZ',        ticker: 'GENZ',   artistId: 'cashden',    genre: 'Hip-Hop',  releaseDate: '2025-09-12', totalStreams: 1_840_000, streamsToday: 12_430, change7d: 18.4, change30d: 41.2, featured: true },
  { id: 'cashden-nohook',  title: 'NOHOOK',      ticker: 'NOHK',   artistId: 'cashden',    genre: 'Hip-Hop',  releaseDate: '2025-11-03', totalStreams: 1_120_000, streamsToday: 8_910,  change7d: 9.6,  change30d: 22.7, featured: true },
  { id: 'cashden-rich',    title: 'RICH',        ticker: 'RICH',   artistId: 'cashden',    genre: 'Hip-Hop',  releaseDate: '2026-02-14', totalStreams: 720_000,   streamsToday: 6_220,  change7d: 24.1, change30d: 58.0 },
  { id: 'cashden-drama',   title: 'DRAMA',       ticker: 'DRMA',   artistId: 'cashden',    genre: 'Hip-Hop',  releaseDate: '2026-05-01', totalStreams: 412_000,   streamsToday: 9_400,  change7d: 47.2, change30d: 112.5, featured: true },
  { id: 'aiyana-bloom',    title: 'Bloom',       ticker: 'BLOM',   artistId: 'aiyana',     genre: 'R&B',      releaseDate: '2025-10-22', totalStreams: 980_000,   streamsToday: 5_100,  change7d: 4.3,  change30d: 11.0 },
  { id: 'rico-velvet',     title: 'Velvet',      ticker: 'VLVT',   artistId: 'rico-mvp',   genre: 'Hip-Hop',  releaseDate: '2026-01-09', totalStreams: 520_000,   streamsToday: 4_220,  change7d: 14.8, change30d: 31.6 },
  { id: 'kobe-amber',      title: 'Amber Lake',  ticker: 'AMBR',   artistId: 'kobe-st',    genre: 'Alt-Rap',  releaseDate: '2025-08-30', totalStreams: 410_000,   streamsToday: 1_700,  change7d: -8.2, change30d: -3.4 },
  { id: 'midas-luxe',      title: 'Luxe Run',    ticker: 'LUXE',   artistId: 'midas-blue', genre: 'Pop',      releaseDate: '2025-12-05', totalStreams: 2_180_000, streamsToday: 7_840,  change7d: 6.2,  change30d: 17.3, featured: true },
  { id: 'midas-skyline',   title: 'Skyline',     ticker: 'SKY',    artistId: 'midas-blue', genre: 'Pop',      releaseDate: '2026-03-19', totalStreams: 640_000,   streamsToday: 5_600,  change7d: 12.7, change30d: 28.4 },
  { id: 'lola-altar',      title: 'Altar',       ticker: 'ALTR',   artistId: 'lola-saint', genre: 'R&B',      releaseDate: '2026-04-04', totalStreams: 880_000,   streamsToday: 11_240, change7d: 36.4, change30d: 78.9, featured: true },
];

function genHistory(song, days = 90) {
  const out = [];
  // Walk backwards from totalStreams, decreasing by ~streamsToday * randomness
  let running = song.totalStreams;
  for (let i = 0; i < days; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const dateIso = iso(d);
    const noise = 0.7 + Math.random() * 0.6; // 0.7 .. 1.3
    const daily = Math.max(50, Math.round(song.streamsToday * noise * (1 - i / (days * 1.6))));
    out.push({ date: dateIso, streams: Math.max(0, Math.round(running)) });
    running -= daily;
  }
  return out.reverse(); // ascending by date
}

// ---- Run ----
console.log(`Seeding ${ARTISTS.length} artists, ${SONGS.length} songs, ${SONGS.length * 90} history points…`);

for (const a of ARTISTS) {
  await writeDoc('artists', a.id, {
    name: a.name, ticker: a.ticker.toUpperCase(),
    monthlyListeners: a.monthlyListeners, totalStreams: a.totalStreams,
    fanGrowthPct: a.fanGrowthPct, trendScore: a.trendScore,
    bio: a.bio || '', photoURL: '',
    createdAt: today,
  });
  console.log('  artist', a.ticker);
}

for (const s of SONGS) {
  const artist = ARTISTS.find((a) => a.id === s.artistId);
  await writeDoc('songs', s.id, {
    title: s.title, ticker: s.ticker.toUpperCase(),
    artistId: s.artistId, artistName: artist.name, artistTicker: artist.ticker.toUpperCase(),
    coverURL: '',
    totalStreams: s.totalStreams, streamsToday: s.streamsToday,
    change7d: s.change7d, change30d: s.change30d,
    genre: s.genre, releaseDate: s.releaseDate,
    featured: !!s.featured,
    createdAt: today,
  });
  console.log('  song', s.ticker);

  const history = genHistory(s, 90);
  for (const h of history) {
    await writeDoc('streamHistory', `${s.id}_${h.date}`, {
      songId: s.id, date: h.date, streams: h.streams,
    });
  }
}

console.log('✓ Seed complete.');
process.exit(0);
