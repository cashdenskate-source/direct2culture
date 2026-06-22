import { trackCTA } from '../../lib/tracking.js';

const PLATFORMS = [
  { key: 'spotifyURL', label: 'Listen on Spotify' },
  { key: 'appleMusicURL', label: 'Listen on Apple Music' },
  { key: 'soundcloudURL', label: 'SoundCloud' },
  { key: 'audiomackURL', label: 'Audiomack' },
  { key: 'youtubeURL', label: 'Watch on YouTube' },
  { key: 'tiktokURL', label: 'TikTok' },
  { key: 'instagram', label: 'Follow on Instagram' },
  { key: 'website', label: 'Website' },
];

function spotifyEmbed(url) {
  if (!url) return null;
  // open.spotify.com/track/ID or /artist/ID or /album/ID  →  embed.spotify.com/...
  try {
    const u = new URL(url);
    if (!u.hostname.includes('spotify.com')) return null;
    return `https://open.spotify.com/embed${u.pathname}?utm_source=generator`;
  } catch { return null; }
}

function youtubeEmbed(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    return null;
  } catch { return null; }
}

export default function CreatorMediaLinks({ creator }) {
  const links = PLATFORMS.filter((p) => creator[p.key]);
  if (!links.length) return null;

  const sEmbed = spotifyEmbed(creator.spotifyURL);
  const yEmbed = youtubeEmbed(creator.youtubeURL);

  return (
    <section className="border-y border-ink/10 bg-ink/[0.02]">
      <div className="container-edge py-10 lg:py-12">
        <p className="eyebrow">Media</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map((p) => (
            <a
              key={p.key}
              href={creator[p.key]}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA(`creator_media_${p.key}`, { slug: creator.slug })}
              className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
            >
              {p.label} →
            </a>
          ))}
        </div>

        {(sEmbed || yEmbed) && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sEmbed && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Spotify</p>
                <iframe
                  src={sEmbed}
                  className="mt-2 w-full border border-ink/10"
                  style={{ height: 152 }}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`${creator.name} on Spotify`}
                />
              </div>
            )}
            {yEmbed && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">YouTube</p>
                <div className="mt-2 aspect-video border border-ink/10 bg-ink/5">
                  <iframe
                    src={yEmbed}
                    className="w-full h-full"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={`${creator.name} on YouTube`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
