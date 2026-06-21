import { Link } from 'react-router-dom';
import LivePulse from './LivePulse.jsx';

export default function DJCard({ dj, rank }) {
  return (
    <Link
      to={`/market/dj/${dj.handle}`}
      className="group flex items-center gap-4 border-b border-ink/10 py-4 hover:bg-ink/5 transition-colors px-2 -mx-2"
    >
      {rank != null && (
        <p className="w-8 font-mono text-[11px] text-ash tabular-nums">{String(rank).padStart(2, '0')}</p>
      )}
      <div className="h-12 w-12 shrink-0 overflow-hidden border border-ink/20 bg-ink/5">
        {dj.photoURL ? (
          <img src={dj.photoURL} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
            {(dj.handle || dj.name || '?').slice(0, 2)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-bold tracking-tight truncate group-hover:underline">
          @{dj.handle} {dj.verified && <span className="text-blue-600">·✓</span>}
          <span className="text-ash font-normal"> · {dj.name}</span>
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
          {dj.city || 'no city'}{dj.genres?.length ? ` · ${dj.genres.slice(0, 2).join(', ')}` : ''}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-sans font-bold tabular-nums">
          <LivePulse value={dj.totalSpins || 0} rate={Math.max(5, (dj.totalSpins || 0) * 0.01)} intervalMs={2400} />
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ash">spins</p>
      </div>
    </Link>
  );
}
