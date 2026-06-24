import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { filmBySlug } from '../data/filmsData.js';
import { trackFilmWatch, userFromAuth } from '../lib/audience.js';
import RateThisContent from '../components/RateThisContent.jsx';

function vimeoEmbedURL(url) {
  if (!url || url === '#') return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes('vimeo.com')) return null;
    const id = u.pathname.split('/').filter(Boolean)[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  } catch {
    return null;
  }
}

function youtubeEmbedURL(url) {
  if (!url || url === '#') return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    return null;
  } catch {
    return null;
  }
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
}

export default function FilmDetail() {
  const { slug } = useParams();
  const film = filmBySlug(slug);
  const { user, profile } = useAuth();

  if (!film) return <Navigate to="/films" replace />;

  const vEmbed = vimeoEmbedURL(film.vimeoURL);
  const yEmbed = youtubeEmbedURL(film.youtubeURL);
  const embed = vEmbed || yEmbed;
  const hasLinks =
    [film.vimeoURL, film.youtubeURL].some((u) => u && u !== '#');

  function onWatchClick(platform) {
    const audUser = userFromAuth(user, profile);
    if (!audUser) return;
    trackFilmWatch({
      user: audUser,
      filmId: film.id,
      filmName: film.title,
      platform,
    }).catch(() => {});
  }

  return (
    <>
      <Helmet>
        <title>{film.title} — D2C Films — Direct2Culture</title>
        <meta name="description" content={film.description} />
      </Helmet>

      <section className="container-edge py-16 lg:py-24">
        <p className="eyebrow">{film.accent} · {film.format.toUpperCase()}</p>
        <h1 className="display-lg mt-4">{film.title}</h1>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
          dir. {film.director} · {film.runtime} · {formatDate(film.publishedAt)}
        </p>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink/80">{film.description}</p>

        {embed ? (
          <div className="mt-10 aspect-video w-full max-w-4xl border border-ink/10 bg-ink/5">
            <iframe
              src={embed}
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              loading="lazy"
              title={film.title}
            />
          </div>
        ) : (
          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            Video embed coming soon.
          </p>
        )}

        {hasLinks && (
          <div className="mt-10">
            <p className="eyebrow">Watch on</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {film.vimeoURL && film.vimeoURL !== '#' && (
                <a
                  href={film.vimeoURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onWatchClick('vimeo')}
                  className="border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
                >
                  Vimeo →
                </a>
              )}
              {film.youtubeURL && film.youtubeURL !== '#' && (
                <a
                  href={film.youtubeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onWatchClick('youtube')}
                  className="border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
                >
                  YouTube →
                </a>
              )}
            </div>
          </div>
        )}

        {film.directorSlug && (
          <div className="mt-12 border-t border-ink/10 pt-8">
            <p className="eyebrow">Director</p>
            <Link
              to={`/creator/${film.directorSlug}`}
              className="mt-3 inline-block font-sans text-xl font-bold tracking-tight hover:underline"
            >
              {film.director} →
            </Link>
          </div>
        )}

        <RateThisContent
          contentId={film.id}
          contentType="film"
          contentName={film.title}
        />

        <div className="mt-12 border-t border-ink/10 pt-8">
          <Link
            to="/films"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink"
          >
            ← Back to all films
          </Link>
        </div>
      </section>
    </>
  );
}
