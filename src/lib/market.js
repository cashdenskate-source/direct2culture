import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase.js';

export function subscribeSongs(onChange) {
  if (!hasFirebaseConfig || !db) {
    onChange([]);
    return () => {};
  }
  const q = query(collection(db, 'songs'), orderBy('totalStreams', 'desc'));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeArtists(onChange) {
  if (!hasFirebaseConfig || !db) {
    onChange([]);
    return () => {};
  }
  const q = query(collection(db, 'artists'), orderBy('totalStreams', 'desc'));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function getSongByTicker(ticker) {
  if (!hasFirebaseConfig || !db) return null;
  const snap = await getDocs(query(collection(db, 'songs'), where('ticker', '==', ticker.toUpperCase())));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getArtistByTicker(ticker) {
  if (!hasFirebaseConfig || !db) return null;
  const snap = await getDocs(query(collection(db, 'artists'), where('ticker', '==', ticker.toUpperCase())));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getStreamHistory(songId, days = 30) {
  if (!hasFirebaseConfig || !db) return [];
  const snap = await getDocs(
    query(
      collection(db, 'streamHistory'),
      where('songId', '==', songId),
      orderBy('date', 'desc'),
    ),
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .slice(0, days)
    .reverse();
}

export async function getSongsByArtist(artistId) {
  if (!hasFirebaseConfig || !db) return [];
  const snap = await getDocs(
    query(collection(db, 'songs'), where('artistId', '==', artistId), orderBy('totalStreams', 'desc')),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createSong(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, 'songs'), {
    ...data,
    ticker: (data.ticker || '').toUpperCase(),
    totalStreams: Number(data.totalStreams || 0),
    streamsToday: Number(data.streamsToday || 0),
    change7d: Number(data.change7d || 0),
    change30d: Number(data.change30d || 0),
    createdAt: serverTimestamp(),
  });
}

export async function updateSong(id, patch) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await updateDoc(doc(db, 'songs', id), {
    ...patch,
    ...(patch.ticker ? { ticker: patch.ticker.toUpperCase() } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSong(id) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await deleteDoc(doc(db, 'songs', id));
}

export async function createArtist(data) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  return addDoc(collection(db, 'artists'), {
    ...data,
    ticker: (data.ticker || '').toUpperCase(),
    monthlyListeners: Number(data.monthlyListeners || 0),
    totalStreams: Number(data.totalStreams || 0),
    fanGrowthPct: Number(data.fanGrowthPct || 0),
    trendScore: Number(data.trendScore || 0),
    createdAt: serverTimestamp(),
  });
}

export async function updateArtist(id, patch) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  await updateDoc(doc(db, 'artists', id), {
    ...patch,
    ...(patch.ticker ? { ticker: patch.ticker.toUpperCase() } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function recordDailyStreams(songId, dateIso, streams) {
  if (!hasFirebaseConfig || !db) throw new Error('Firebase not configured.');
  const id = `${songId}_${dateIso}`;
  await setDoc(doc(db, 'streamHistory', id), {
    songId,
    date: dateIso,
    streams: Number(streams),
    createdAt: serverTimestamp(),
  });
}

export function formatNum(n) {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

export function trendStatus(change7d) {
  if (change7d > 5) return 'rising';
  if (change7d < -5) return 'falling';
  return 'stable';
}

// Fetch YouTube view count using the project's Google Cloud API key.
// Reuses VITE_FIREBASE_API_KEY since Firebase keys are Google Cloud keys.
// Requires YouTube Data API v3 to be enabled on the project.
export async function fetchYouTubeViews(videoId) {
  if (!videoId) throw new Error('No videoId');
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) throw new Error('API key missing');
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${encodeURIComponent(videoId)}&key=${apiKey}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error?.message || `HTTP ${res.status}`;
    if (/API has not been used|disabled/i.test(msg)) {
      throw new Error('YouTube Data API v3 is disabled. Enable it in Google Cloud Console for the project.');
    }
    throw new Error(msg);
  }
  const views = Number(json?.items?.[0]?.statistics?.viewCount);
  if (Number.isNaN(views)) throw new Error('No view count returned (video may be private or removed)');
  return views;
}

export async function refreshYouTubeForSong(song) {
  const views = await fetchYouTubeViews(song.youtubeVideoId);
  const today = new Date().toISOString().slice(0, 10);
  await updateSong(song.id, {
    youtubeViews: views,
    totalStreams: views, // simple MVP: total = YT views when YT is only source
    streamsToday: Math.max(0, views - Number(song.youtubeViews || 0)),
  });
  await recordDailyStreams(song.id, today, views);
  return views;
}
