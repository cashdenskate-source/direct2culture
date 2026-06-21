import { Link } from 'react-router-dom';
import ChangeBadge from './ChangeBadge.jsx';
import LivePulse from './LivePulse.jsx';

export default function SongCard({ song, rank }) {
  return (
    <Link
      to={`/market/song/${song.ticker}`}
      className="group flex items-center gap-4 border-b border-ink/10 py-4 hover:bg-ink/5 transition-colors px-2 -mx-2"
    >
      <p className="w-8 font-mono text-[11px] text-ash tabular-nums">
        {String(rank).padStart(2, '0')}
      </p>
      <div className="h-12 w-12 shrink-0 overflow-hidden border border-ink/20 bg-ink/5">
        {song.coverURL ? (
          <img src={song.coverURL} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
            {song.ticker?.slice(0, 2)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-bold tracking-tight truncate group-hover:underline">
          ${song.ticker} <span className="text-ash font-normal">· {song.title}</span>
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
          {song.artistName}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-sans font-bold tabular-nums">
          <LivePulse value={song.totalStreams} rate={Math.max(30, (song.streamsToday || 80) * 0.6)} intervalMs={2200} />
        </p>
        <ChangeBadge value={song.change7d} />
      </div>
    </Link>
  );
}
