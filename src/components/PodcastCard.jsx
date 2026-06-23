import { Link } from 'react-router-dom';
import Card, { ImagePlaceholder } from './Card.jsx';

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
}

export default function PodcastCard({ episode }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{episode.accent}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{episode.duration}</span>
      </div>

      <div className="mt-5">
        <ImagePlaceholder accent="Podcast" label={episode.title} ratio="frame" />
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
          EP {String(episode.number).padStart(2, '0')}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
          {formatDate(episode.publishedAt)}
        </p>
      </div>
      <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight">{episode.title}</h3>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">w/ {episode.guest}</p>

      <div className="mt-auto pt-6">
        <Link to={`/podcast/${episode.slug}`} className="btn-ghost">
          Play Episode →
        </Link>
      </div>
    </Card>
  );
}
