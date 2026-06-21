import { Link } from 'react-router-dom';
import LivePulse from './LivePulse.jsx';
import ChangeBadge from './ChangeBadge.jsx';

export default function CreativeCard({ creative, rank }) {
  return (
    <Link
      to={`/market/creative/${creative.ticker}`}
      className="group flex items-center gap-4 border-b border-ink/10 py-4 hover:bg-ink/5 transition-colors px-2 -mx-2"
    >
      {rank != null && (
        <p className="w-8 font-mono text-[11px] text-ash tabular-nums">{String(rank).padStart(2, '0')}</p>
      )}
      <div className="h-12 w-12 shrink-0 overflow-hidden border border-ink/20 bg-ink/5">
        {creative.photoURL ? (
          <img src={creative.photoURL} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
            {(creative.ticker || creative.name || '?').slice(0, 2)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-bold tracking-tight truncate group-hover:underline">
          ${creative.ticker} {creative.verified && <span className="text-blue-600">·✓</span>}
          <span className="text-ash font-normal"> · {creative.name}</span>
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
          {creative.category}{creative.city ? ` · ${creative.city}` : ''}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-sans font-bold tabular-nums">
          <LivePulse value={creative.followers || 0} rate={Math.max(10, (creative.followers || 0) * 0.001)} intervalMs={2400} />
        </p>
        <ChangeBadge value={creative.growthScore} />
      </div>
    </Link>
  );
}
