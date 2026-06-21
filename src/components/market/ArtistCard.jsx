import { Link } from 'react-router-dom';
import ChangeBadge from './ChangeBadge.jsx';
import { formatNum } from '../../lib/market.js';

export default function ArtistCard({ artist }) {
  return (
    <Link
      to={`/market/artist/${artist.ticker}`}
      className="group flex items-center gap-4 border border-ink/10 p-4 hover:bg-ink hover:text-bone transition-colors"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden border border-current/20 bg-current/5">
        {artist.photoURL ? (
          <img src={artist.photoURL} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em]">
            {artist.ticker?.slice(0, 2)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-bold tracking-tight truncate">
          ${artist.ticker} <span className="opacity-60 font-normal">· {artist.name}</span>
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">
          {formatNum(artist.monthlyListeners)} monthly · {formatNum(artist.totalStreams)} total
        </p>
      </div>
      <ChangeBadge value={artist.fanGrowthPct} />
    </Link>
  );
}
