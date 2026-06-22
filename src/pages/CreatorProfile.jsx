import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import { creatorBySlug } from '../data/creatorData.js';
import { trackCTA } from '../lib/tracking.js';
import { sendWebhook } from '../lib/webhooks.js';

export default function CreatorProfile() {
  const { slug } = useParams();
  const creator = creatorBySlug(slug);

  useEffect(() => {
    if (!creator) return;
    trackCTA('creator_profile_view', { slug: creator.slug });
    sendWebhook('creator_profile_view', { slug: creator.slug, name: creator.name }).catch(() => {});
  }, [creator]);

  if (!creator) return <Navigate to="/creators" replace />;

  return (
    <>
      <SEO
        title={`Meet ${creator.name} | Direct2Culture`}
        description={`Read the story of ${creator.name} — ${creator.category} based in ${creator.city}. ${creator.tagline}`}
        type="article"
      />

      {/* Hero */}
      <div className="border-b border-ink/10">
        <div className="container-edge py-16 lg:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            Creator / {creator.category} · {creator.city}
          </p>
          <h1 className="mt-3 font-sans font-black tracking-tightest text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
            Meet {creator.name}.
          </h1>
          <p className="mt-6 max-w-2xl text-ink/75 text-xl md:text-2xl leading-snug">
            {creator.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => trackCTA('follow_creator', { slug: creator.slug })}
              className="border border-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
            >
              Follow Creator →
            </button>
            <Link
              to="/tell-your-story"
              onClick={() => trackCTA('submit_similar_creator')}
              className="border border-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
            >
              Submit Similar Creator →
            </Link>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); trackCTA('share_story', { slug: creator.slug }); }}
              className="border border-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors"
            >
              Share Story →
            </button>
          </div>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap gap-2">
            {creator.instagram && (
              <a href={creator.instagram} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
                Instagram →
              </a>
            )}
            {creator.website && (
              <a href={creator.website} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">
                Website →
              </a>
            )}
            {creator.cultureScore != null && (
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] border border-ink px-2 py-1">
                Culture Score · {creator.cultureScore}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Story body */}
      <article className="container-edge py-16 lg:py-24 max-w-3xl space-y-12">
        <StorySection title="Origin" body={creator.origin} />
        <StorySection title="The Work" body={creator.work} />
        <StorySection title="The World They Are Building" body={creator.worldbuilding} />

        {/* Quote */}
        <blockquote className="border-l-4 border-ink pl-6 py-2">
          <p className="font-sans text-3xl md:text-4xl font-black tracking-tight leading-tight">
            "{creator.quote}"
          </p>
        </blockquote>

        <StorySection title="Why It Matters" body={creator.whyItMatters} />
        <StorySection title="What's Next" body={creator.whatsNext} />

        {/* Video placeholder */}
        <div className="border border-ink/10 p-8 bg-ink/[0.02]">
          <p className="eyebrow">Video</p>
          <p className="mt-3 text-ink/80 leading-relaxed">
            "I'm telling my story on Direct2Culture."
          </p>
          <div className="mt-4 aspect-video bg-ink/5 border border-ink/10 flex items-center justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">video placeholder</p>
          </div>
        </div>
      </article>

      {/* Tell Your Story CTA */}
      <section className="border-t border-ink/10 bg-ink text-bone">
        <div className="container-edge py-16 lg:py-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-bone/50">Tell Your Story</p>
            <h2 className="mt-2 font-sans text-3xl md:text-5xl font-black tracking-tightest">Want yours next?</h2>
          </div>
          <Link to="/tell-your-story" className="bg-bone text-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] hover:opacity-90">
            Tell Your Story →
          </Link>
        </div>
      </section>

      <div className="container-edge py-8">
        <Link to="/creators" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">← All creators</Link>
      </div>
    </>
  );
}

function StorySection({ title, body }) {
  return (
    <section>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{title}</p>
      <p className="mt-3 text-lg md:text-xl text-ink/85 leading-relaxed">{body}</p>
    </section>
  );
}
