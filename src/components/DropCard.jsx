import Card, { ImagePlaceholder } from './Card.jsx';

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

export default function DropCard({ drop }) {
  const badge = statusColor[drop.status] || statusColor.upcoming;
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{drop.accent}</span>
        <span className={`px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${badge}`}>
          {drop.status}
        </span>
      </div>

      <div className="mt-5">
        <ImagePlaceholder accent={drop.category} label={drop.name} ratio="frame" />
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{drop.brand}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{drop.category}</p>
      </div>
      <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight">{drop.name}</h3>

      <div className="mt-auto flex items-end justify-between pt-6">
        <div>
          <p className="eyebrow">Drop Date</p>
          <p className="mt-1 font-sans font-bold tracking-tight text-lg">{formatDate(drop.date)}</p>
        </div>
        <button className="btn-ghost">{drop.cta}</button>
      </div>
    </Card>
  );
}
