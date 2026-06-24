import { Link } from 'react-router-dom';
import Card, { ImagePlaceholder } from './Card.jsx';

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
}

export default function FilmCard({ film }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{film.accent}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{film.runtime}</span>
      </div>

      <div className="mt-5">
        <ImagePlaceholder accent={film.format} label={film.title} ratio="frame" />
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{film.format}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
          {formatDate(film.publishedAt)}
        </p>
      </div>
      <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight">{film.title}</h3>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">dir. {film.director}</p>

      <div className="mt-auto pt-6">
        <Link to={`/films/${film.slug}`} className="btn-ghost">
          Watch →
        </Link>
      </div>
    </Card>
  );
}
