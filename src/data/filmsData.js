// Seed films. Replace with Firestore-backed admin entries in Phase B.
const day = 24 * 60 * 60 * 1000;
const now = Date.now();

export const films = [
  {
    id: 'fl-03',
    slug: 'last-light-at-crossfade',
    title: 'Last Light at Crossfade',
    director: 'Ari Okafor',
    directorSlug: 'ari-okafor',
    publishedAt: new Date(now - 2 * day).toISOString(),
    runtime: '04:48',
    format: 'music video',
    description:
      'A field recording becomes a song becomes a four-minute reel. The first official Crossfade Studio music video — shot in one night across three rooftops in Brooklyn.',
    vimeoURL: '#',
    youtubeURL: '#',
    accent: 'FL / 03',
  },
  {
    id: 'fl-02',
    slug: 'black-salt-the-process',
    title: 'Black Salt: The Process',
    director: 'Solange Beaumont',
    directorSlug: 'solange-beaumont',
    publishedAt: new Date(now - 6 * day).toISOString(),
    runtime: '18:21',
    format: 'mini-doc',
    description:
      'The making of Maison Noir\'s Black Salt Capsule, from raw cotton in Antwerp to the fitting room in Paris. Eighteen minutes of pure process — no music, no voiceover, no commentary.',
    vimeoURL: '#',
    youtubeURL: '#',
    accent: 'FL / 02',
  },
  {
    id: 'fl-01',
    slug: 'tokyo-after-midnight',
    title: 'Tokyo After Midnight',
    director: 'Daichi Mori',
    directorSlug: 'daichi-mori',
    publishedAt: new Date(now - 12 * day).toISOString(),
    runtime: '12:34',
    format: 'short film',
    description:
      'VX1000 footage cut against night-train silence. Twelve minutes inside Tokyo\'s after-hours bowl culture, narrated only by board sound and ambient city.',
    vimeoURL: '#',
    youtubeURL: '#',
    accent: 'FL / 01',
  },
];

export function filmBySlug(slug) {
  return films.find((f) => f.slug === slug) || null;
}

export function latestFilm() {
  return films[0] || null;
}
