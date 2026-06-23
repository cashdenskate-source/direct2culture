import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase.js';
import { lookupCity, SEED_CITIES } from './cityCoords.js';

// Subscribe to recent Firestore activity and surface as culture events.
// Each event = { id, kind, label, city, lat, lng, color, at }
//
// kind ∈ users | releases | presaves | djSpins | brandHistory | submissions
//
// color hint:
//   white  = signups, brand snapshots
//   green  = pre-saves, spins, releases approved
//   amber  = pending submissions, new release queued

const COLOR = {
  white: [1, 1, 1],
  green: [0.16, 0.74, 0.43],
  amber: [0.95, 0.65, 0.18],
  red:   [0.86, 0.31, 0.31],
};

const SOURCES = [
  { coll: 'users',         color: COLOR.white, cityFrom: (d) => d.city,                            label: (d) => `new sign-up · ${d.name || d.email || 'fan'}` },
  { coll: 'releases',      color: COLOR.amber, cityFrom: (d) => d.city,                            label: (d) => `release queued · ${d.title || 'untitled'}` },
  { coll: 'djSpins',       color: COLOR.green, cityFrom: (d) => d.city,                            label: (d) => `dj spin · ${d.songTicker ? '$' + d.songTicker : d.songTitle || 'track'}` },
  { coll: 'brandHistory',  color: COLOR.white, cityFrom: () => null,                                label: (d) => `brand snapshot · ${d.brandId || ''}` },
  { coll: 'submissions',   color: COLOR.amber, cityFrom: (d) => d.city,                            label: (d) => `submission · ${d.type || 'brand'}` },
  { coll: 'creatorNotifications', color: COLOR.green, cityFrom: () => null,                        label: (d) => `notify-me · ${d.creatorName || 'creator'}` },
  { coll: 'ticketSignups', color: COLOR.green, cityFrom: (d) => d.city,                            label: (d) => `richskater signup · ${d.email || ''}` },
  { coll: 'dropSignups',   color: COLOR.green, cityFrom: (d) => d.city,                            label: (d) => `barelysain signup · ${d.email || ''}` },
];

export function subscribeCultureEvents(onEvent) {
  if (!hasFirebaseConfig || !db) return () => {};
  const seenByColl = new Map(); // coll → Set of ids already emitted
  const unsubs = SOURCES.map((src) => {
    seenByColl.set(src.coll, new Set());
    const q = query(collection(db, src.coll), orderBy('createdAt', 'desc'), limit(15));
    return onSnapshot(
      q,
      (snap) => {
        const seen = seenByColl.get(src.coll);
        const isInitial = seen.size === 0;
        snap.docChanges().forEach((change) => {
          if (change.type !== 'added') return;
          const id = change.doc.id;
          if (seen.has(id)) return;
          seen.add(id);
          if (isInitial) return; // don't fire pings for backlog on first load
          const data = change.doc.data();
          const cityName = src.cityFrom(data);
          const coords = cityName ? lookupCity(cityName) : null;
          // Fallback: random D2C city so the globe still pings
          const place = coords || pick(SEED_CITIES);
          onEvent({
            id: `${src.coll}_${id}`,
            kind: src.coll,
            label: src.label(data),
            city: place?.label || '—',
            lat: place?.lat,
            lng: place?.lng,
            color: src.color,
            at: Date.now(),
          });
        });
        // Mark initial backlog as seen
        if (isInitial) snap.forEach((d) => seen.add(d.id));
      },
      () => {},
    );
  });
  return () => unsubs.forEach((u) => u());
}

// Simulated pings for when Firestore is quiet — every ~6s a random
// D2C city pings white, with occasional green flair.
export function startSimulatedPings(onEvent, intervalMs = 6000) {
  const labels = [
    'culture signal', 'song pulse', 'new follower', 'drop alert', 'spin logged',
    'sign-up', 'pre-save', 'brand pulse', 'creator view', 'newsletter join',
  ];
  const id = setInterval(() => {
    const city = pick(SEED_CITIES);
    const color = Math.random() < 0.25 ? COLOR.green : COLOR.white;
    onEvent({
      id: `sim_${Date.now()}`,
      kind: 'simulated',
      label: `${city.label.toLowerCase()} · ${pick(labels)}`,
      city: city.label,
      lat: city.lat,
      lng: city.lng,
      color,
      at: Date.now(),
      simulated: true,
    });
  }, intervalMs);
  return () => clearInterval(id);
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
