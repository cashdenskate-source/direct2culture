import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { episodeBySlug } from '../data/podcastData.js';
import { trackPodcastListen, userFromAuth } from '../lib/audience.js';

function spotifyEmbedURL(url) {
  if (!url || url === '#') return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes('spotify.com')) return null;
    return `https://open.spotify.com/embed${u.pathname}?utm_source=generator`;
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

export default function PodcastEpisode() {
  const { slug } = useParams();
  const episode = episodeBySlug(slug);
  const { user, profile } = useAuth();

  if (!episode) return <Navigate to="/podcast" replace />;

  const sEmbed = spotifyEmbedURL(episode.spotifyEpisodeURL);
  const hasLinks =
    [episode.spotifyEpisodeURL, episode.appleURL, episode.youtubeURL].some(
      (u) => u && u !== '#'
    );

  function onListenClick(platform) {
    const audUser = userFromAuth(user, profile);
    if (!audUser) return;
    trackPodcastListen({
      user: audUser,
      episodeId: episode.id,
      episodeName: episode.title,
      platform,
    }).catch(() => {});
  }

  return (
    <>
      <Helmet>
        <title>{episode.title} — D2C Podcast — Direct2Culture</title>
        <meta name="description" content={episode.description} />
      </Helmet>

      <section className="container-edge py-16 lg:py-24">
        <p className="eyebrow">
          {episode.accent} · S{String(episode.season).padStart(2, '0')} · EP {String(episode.number).padStart(2, '0')}
        </p>
        <h1 className="display-lg mt-4">{episode.title}</h1>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
          With {episode.guest} · {episode.duration} · {formatDate(episode.publishedAt)}
        </p>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink/80">{episode.description}</p>

        {sEmbed && (
          <div className="mt-10">
            <p className="eyebrow">Listen on Spotify</p>
            <iframe
              src={sEmbed}
              className="mt-3 w-full border border-ink/10"
              style={{ height: 232 }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`${episode.title} on Spotify`}
            />
          </div>
        )}

        <div className="mt-10">
          <p className="eyebrow">Or listen on</p>
          {hasLinks ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {episode.spotifyEpisodeURL && episode.spotifyEpisodeURL !== '#' && (
                <a
                  href={episode.spotifyEpisodeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onListenClick('spotify')}
                  className="border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
                >
                  Spotify →
                </a>
              )}
              {episode.appleURL && episode.appleURL !== '#' && (
                <a
                  href={episode.appleURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onListenClick('apple')}
                  className="border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
                >
                  Apple Podcasts →
                </a>
              )}
              {episode.youtubeURL && episode.youtubeURL !== '#' && (
                <a
                  href={episode.youtubeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onListenClick('youtube')}
                  className="border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
                >
                  YouTube →
                </a>
              )}
            </div>
          ) : (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
              Listen links coming soon.
            </p>
          )}
        </div>

        {episode.guestSlug && (
          <div className="mt-12 border-t border-ink/10 pt-8">
            <p className="eyebrow">Guest</p>
            <Link
              to={`/creator/${episode.guestSlug}`}
              className="mt-3 inline-block font-sans text-xl font-bold tracking-tight hover:underline"
            >
              {episode.guest} →
            </Link>
          </div>
        )}

        <div className="mt-12 border-t border-ink/10 pt-8">
          <Link
            to="/podcast"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink"
          >
            ← Back to all episodes
          </Link>
        </div>
      </section>
    </>
  );
}
