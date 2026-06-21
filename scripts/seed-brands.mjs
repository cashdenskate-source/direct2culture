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
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  throw new Error('Unsupported: ' + typeof v);
}
function toFields(obj) {
  const f = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) f[k] = fsValue(v);
  return f;
}
async function writeDoc(collection, id, data) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${id}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFields(data) }),
  });
  if (!res.ok) { console.error('Write failed', collection, id, await res.text()); throw new Error('write'); }
}

const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);

const BRANDS = [
  {
    id: 'direct2culture',
    name: 'Direct2Culture',
    ticker: 'D2C',
    category: 'streetwear',
    hq: 'Atlanta, GA',
    founded: '2025',
    bio: 'In-house Direct2Culture line. Culture before the algorithm. Limited capsules and editorial drops.',
    followersIG: 8_400,
    followersTT: 2_100,
    growthPct: 14.2,
    trendScore: 78,
    instagramURL: 'https://instagram.com/direct2culture',
    websiteURL: 'https://direct2culture.com',
    featured: true,
  },
  {
    id: 'barelysain',
    name: 'BarelySain',
    ticker: 'BSAIN',
    category: 'streetwear',
    hq: '',
    founded: '',
    bio: 'BarelySain. Drop-driven, culture-first.',
    followersIG: 12_500,
    followersTT: 4_200,
    growthPct: 22.8,
    trendScore: 81,
    instagramURL: 'https://instagram.com/barelysain',
    featured: true,
  },
  {
    id: 'richskater',
    name: 'RichSkater',
    ticker: 'RSKTR',
    category: 'streetwear',
    hq: '',
    founded: '',
    bio: 'RichSkater. Rooted in skate culture, made for the wave.',
    followersIG: 18_900,
    followersTT: 7_300,
    growthPct: 31.4,
    trendScore: 88,
    instagramURL: 'https://instagram.com/richskater',
    featured: true,
  },
  {
    id: 'papermoney',
    name: 'PaperMoney',
    ticker: 'PAPR',
    category: 'streetwear',
    hq: '',
    founded: '',
    bio: 'PaperMoney. Currency of culture.',
    followersIG: 9_600,
    followersTT: 3_400,
    growthPct: 17.5,
    trendScore: 74,
    instagramURL: 'https://instagram.com/papermoney',
  },
  {
    id: 'lordbysmiff',
    name: 'LordBySmiff',
    ticker: 'LBSF',
    category: 'streetwear',
    hq: '',
    founded: '',
    bio: 'LordBySmiff. Tailored grit. Smiff-side luxury.',
    followersIG: 6_800,
    followersTT: 1_900,
    growthPct: 11.3,
    trendScore: 69,
    instagramURL: 'https://instagram.com/lordbysmiff',
  },
];

function genHistory(brand, days = 90) {
  const total = brand.followersIG + brand.followersTT;
  let running = total;
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const noise = 0.4 + Math.random() * 1.2;
    const daily = Math.max(2, Math.round((total * 0.005) * noise * (1 - i / (days * 1.6))));
    out.push({ date: iso(d), followers: Math.max(0, Math.round(running)) });
    running -= daily;
  }
  return out.reverse();
}

console.log(`Seeding ${BRANDS.length} brands with 90 days of history each…`);

for (const b of BRANDS) {
  await writeDoc('brands', b.id, {
    name: b.name, ticker: b.ticker,
    category: b.category, hq: b.hq, founded: b.founded, bio: b.bio,
    logoURL: '', storeURL: '', websiteURL: b.websiteURL || '',
    instagramURL: b.instagramURL || '', tiktokURL: '', shopifyHandle: '',
    followersIG: b.followersIG, followersTT: b.followersTT,
    growthPct: b.growthPct, trendScore: b.trendScore,
    featured: !!b.featured,
    createdAt: today,
  });
  console.log('  brand', b.ticker);

  const history = genHistory(b, 90);
  for (const h of history) {
    const splitIG = Math.round(h.followers * (b.followersIG / (b.followersIG + b.followersTT || 1)));
    const splitTT = h.followers - splitIG;
    await writeDoc('brandHistory', `${b.id}_${h.date}`, {
      brandId: b.id,
      date: h.date,
      followers: h.followers,
      followersIG: splitIG,
      followersTT: splitTT,
      growthPct: b.growthPct,
    });
  }
}

console.log('✓ Seed complete.');
process.exit(0);
