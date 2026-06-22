import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../lib/firebase.js';

const FALLBACK = [
  { ticker: 'GENZ',    change: 22.0, href: '/market/song/GENZ' },
  { ticker: 'RICH',    change: 18.0, href: '/market/song/RICH' },
  { ticker: 'NENO',    change: 15.0, href: '/creator/neno' },
  { ticker: 'BSAIN',   change: 11.0, href: '/market/brand/BSAIN' },
  { ticker: 'DJKAIRO', change:  9.0, href: '/market/djs' },
  { ticker: 'RSKATE',  change:  7.0, href: '/market/brand/RSKTR' },
];

export default function CultureTicker() {
  const [rows, setRows] = useState(FALLBACK);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) return;
    (async () => {
      try {
        const [songsSnap, brandsSnap] = await Promise.all([
          getDocs(collection(db, 'songs')),
          getDocs(collection(db, 'brands')),
        ]);
        const songs = songsSnap.docs.map((d) => d.data())
          .sort((a, b) => (b.change7d || 0) - (a.change7d || 0))
          .slice(0, 4)
          .map((s) => ({ ticker: s.ticker, change: s.change7d || 0, href: `/market/song/${s.ticker}` }));
        const brands = brandsSnap.docs.map((d) => d.data())
          .sort((a, b) => (b.growthPct || 0) - (a.growthPct || 0))
          .slice(0, 3)
          .map((b) => ({ ticker: b.ticker, change: b.growthPct || 0, href: `/market/brand/${b.ticker}` }));
        const merged = [...songs, ...brands];
        if (merged.length > 0) setRows(merged);
      } catch {}
    })();
  }, []);

  const doubled = [...rows, ...rows];

  return (
    <div className="border-b border-ink/10 bg-ink text-bone overflow-hidden">
      <div className="ct-track flex items-center gap-8 py-2.5 whitespace-nowrap">
        {doubled.map((r, i) => (
          <Link
            key={`${r.ticker}-${i}`}
            to={r.href}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] hover:text-white"
          >
            <span className="font-bold">${r.ticker}</span>
            <span className={(r.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}>
              {(r.change || 0) >= 0 ? '+' : ''}{(r.change || 0).toFixed(1)}%
            </span>
            <span className="text-bone/30 ml-3">·</span>
          </Link>
        ))}
      </div>
      <style>{`
        @keyframes ct-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ct-track { animation: ct-slide 50s linear infinite; width: max-content; }
        .ct-track:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
