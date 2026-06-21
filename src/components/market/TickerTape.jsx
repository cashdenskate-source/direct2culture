import { Link } from 'react-router-dom';
import ChangeBadge from './ChangeBadge.jsx';
import { formatNum } from '../../lib/market.js';

export default function TickerTape({ songs = [] }) {
  if (!songs.length) return null;
  const items = [...songs, ...songs]; // double for seamless scroll

  return (
    <div className="border-y border-ink/10 bg-ink text-bone overflow-hidden">
      <div className="ticker-track flex items-center gap-8 py-2 whitespace-nowrap">
        {items.map((s, i) => (
          <Link
            key={`${s.id}-${i}`}
            to={`/market/song/${s.ticker}`}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] hover:text-white"
          >
            <span className="font-bold">${s.ticker}</span>
            <span className="text-bone/60">{formatNum(s.totalStreams)}</span>
            <ChangeBadge value={s.change7d} />
            <span className="text-bone/30 ml-4">·</span>
          </Link>
        ))}
      </div>
      <style>{`
        @keyframes ticker-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-slide 60s linear infinite;
          width: max-content;
        }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
