import Card, { ImagePlaceholder } from './Card.jsx';
import { effectiveDropStatus, pad, useCountdown } from '../hooks/useCountdown.js';

const statusColor = {
  upcoming: 'bg-bone text-ink border border-ink/30',
  live: 'bg-ink text-bone',
  'sold out': 'bg-ash/20 text-ash border border-ash/40',
};

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  } catch {
    return d;
  }
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[11px] w-[11px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function DropCard({ drop }) {
  const { days, hours, minutes, seconds, done } = useCountdown(drop.releaseAt);
  const locked = Boolean(drop.releaseAt) && !done && drop.status !== 'sold out';
  const status = effectiveDropStatus(drop);
  const badge = statusColor[status] || statusColor.upcoming;

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{drop.accent}</span>
        <div className="flex items-center gap-2">
          {locked && (
            <span className="inline-flex items-center gap-1.5 border border-ink/30 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
              <LockIcon /> Locked
            </span>
          )}
          <span className={`px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${badge}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <ImagePlaceholder accent={drop.category} label={drop.name} ratio="frame" />
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{drop.brand}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{drop.category}</p>
      </div>
      <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight">{drop.name}</h3>

      <div className="mt-auto flex items-end justify-between pt-6 gap-4">
        <div className="min-w-0">
          {locked ? (
            <>
              <p className="eyebrow">Unlocks In</p>
              <p className="mt-1 font-mono text-lg font-bold tabular-nums tracking-tight whitespace-nowrap">
                {days > 0 && `${pad(days)}d `}
                {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow">Drop Date</p>
              <p className="mt-1 font-sans text-lg font-bold tracking-tight">{formatDate(drop.date)}</p>
            </>
          )}
        </div>
        <button
          type="button"
          disabled={locked}
          className={`btn-ghost shrink-0 ${locked ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          {drop.cta}
        </button>
      </div>
    </Card>
  );
}
