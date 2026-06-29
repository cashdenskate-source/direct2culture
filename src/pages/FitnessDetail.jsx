import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useParams } from 'react-router-dom';
import { fitnessBySlug, TYPE_LABELS } from '../data/fitnessData.js';
import RateThisContent from '../components/RateThisContent.jsx';

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
}

function metaLine(item) {
  if (item.type === 'drop' || item.type === 'campaign') {
    return [item.brand, item.city, formatDate(item.publishedAt)].filter(Boolean).join(' · ');
  }
  if (item.type === 'profile') {
    return [item.athlete, item.city, formatDate(item.publishedAt)].filter(Boolean).join(' · ');
  }
  return [item.city, formatDate(item.publishedAt)].filter(Boolean).join(' · ');
}

function externalLabel(item) {
  if (item.type === 'drop') return `Shop ${item.brand || 'the drop'} →`;
  if (item.type === 'campaign') return `View campaign →`;
  return 'Open link →';
}

export default function FitnessDetail() {
  const { slug } = useParams();
  const item = fitnessBySlug(slug);

  if (!item) return <Navigate to="/fitness" replace />;

  const hasExternal = item.externalURL && item.externalURL !== '#';
  const body = item.body || item.description;

  return (
    <>
      <Helmet>
        <title>{item.title} — D2C Fitness — Direct2Culture</title>
        <meta name="description" content={item.description} />
      </Helmet>

      <section className="container-edge py-16 lg:py-24">
        <p className="eyebrow">{item.accent} · {TYPE_LABELS[item.type].toUpperCase()}</p>
        <h1 className="display-lg mt-4">{item.title}</h1>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
          {metaLine(item)}
        </p>

        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink/80">{body}</p>

        {hasExternal && (
          <div className="mt-10">
            <a
              href={item.externalURL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
            >
              {externalLabel(item)}
            </a>
          </div>
        )}

        {item.type === 'profile' && item.athleteSlug && (
          <div className="mt-12 border-t border-ink/10 pt-8">
            <p className="eyebrow">Profile</p>
            <Link
              to={`/creator/${item.athleteSlug}`}
              className="mt-3 inline-block font-sans text-xl font-bold tracking-tight hover:underline"
            >
              {item.athlete} →
            </Link>
          </div>
        )}

        <RateThisContent
          contentId={item.id}
          contentType="fitness"
          contentName={item.title}
        />

        <div className="mt-12 border-t border-ink/10 pt-8">
          <Link
            to="/fitness"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink"
          >
            ← Back to Fitness
          </Link>
        </div>
      </section>
    </>
  );
}
