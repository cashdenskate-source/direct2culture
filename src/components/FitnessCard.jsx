import { Link } from 'react-router-dom';
import Card, { ImagePlaceholder } from './Card.jsx';
import { TYPE_LABELS } from '../data/fitnessData.js';

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
}

function ctaLabel(item) {
  if (item.type === 'drop' && item.externalURL && item.externalURL !== '#') return 'Shop →';
  if (item.type === 'campaign') return 'View →';
  return 'Read →';
}

function imageAccent(item) {
  if (item.type === 'drop' || item.type === 'campaign') return item.brand || TYPE_LABELS[item.type];
  if (item.type === 'profile') return item.athlete || item.city || TYPE_LABELS[item.type];
  return item.city || TYPE_LABELS[item.type];
}

function metaLine(item) {
  if (item.type === 'drop' || item.type === 'campaign') {
    return [item.brand, item.city].filter(Boolean).join(' · ');
  }
  if (item.type === 'profile') {
    return [item.athlete, item.city].filter(Boolean).join(' · ');
  }
  return item.city || '';
}

export default function FitnessCard({ item }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{item.accent}</span>
        <span className="border border-ink/30 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
          {TYPE_LABELS[item.type]}
        </span>
      </div>

      <div className="mt-5">
        <ImagePlaceholder accent={imageAccent(item)} label={item.title} ratio="frame" />
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash truncate">{metaLine(item)}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash shrink-0">
          {formatDate(item.publishedAt)}
        </p>
      </div>
      <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight">{item.title}</h3>

      <div className="mt-auto pt-6">
        <Link to={`/fitness/${item.slug}`} className="btn-ghost">
          {ctaLabel(item)}
        </Link>
      </div>
    </Card>
  );
}
