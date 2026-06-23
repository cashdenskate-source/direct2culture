import PageHeader from '../components/PageHeader.jsx';
import PodcastCard from '../components/PodcastCard.jsx';
import SEO from '../components/SEO.jsx';
import { podcastEpisodes } from '../data/podcastData.js';

export default function Podcast() {
  return (
    <>
      <SEO
        title="Podcast | Direct2Culture"
        description="Long-form audio interviews with the brands, artists, and creators shaping culture before the algorithm."
      />
      <PageHeader
        eyebrow="04 / Podcast"
        title="The D2C Podcast."
        kicker="Long-form audio with the brands, artists, and creators shaping what comes next."
        meta={`${podcastEpisodes.length} episodes`}
      />

      <section className="border-b border-ink/10 bg-bone">
        <div className="container-edge py-6 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Subscribe</span>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
          >
            Spotify →
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
          >
            Apple Podcasts →
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
          >
            YouTube →
          </a>
        </div>
      </section>

      <section className="bg-bone">
        <div className="container-edge py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {podcastEpisodes.map((ep) => (
              <PodcastCard key={ep.id} episode={ep} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
