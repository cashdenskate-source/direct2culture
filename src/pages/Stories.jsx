import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import { stories } from '../data/storyData.js';
import { featuredStory } from '../data/storyData.js';

export default function Stories() {
  return (
    <>
      <SEO
        title="Stories | Direct2Culture"
        description="Long-form stories on the brands, artists, and creators building culture. Read the worldbuilding behind the work."
      />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow="Direct2Culture / Stories"
          title="Stories."
          kicker="The worldbuilding behind the work. Long-form features on the brands, drops, and movements moving culture forward."
        />

        {/* Featured story */}
        <Link
          to={featuredStory.ctaLink}
          className="mt-12 block border border-ink bg-ink text-bone p-8 lg:p-12 hover:opacity-90 transition-opacity"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">Featured Story</p>
          <h2 className="mt-3 font-sans text-4xl md:text-6xl font-black tracking-tightest">{featuredStory.title}</h2>
          <p className="mt-4 text-bone/75 text-lg md:text-xl max-w-2xl">{featuredStory.subtitle}</p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em]">{featuredStory.ctaLabel} →</p>
        </Link>

        {/* Story landings */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stories.map((s) => (
            <Link
              key={s.id}
              to={`/stories/${s.slug}`}
              className="group border border-ink/10 bg-bone p-8 hover:border-ink transition-colors"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{s.category} · ${s.ticker}</p>
              <h3 className="mt-3 font-sans text-3xl font-black tracking-tightest">{s.title}</h3>
              <p className="mt-3 text-ink/75 leading-relaxed">{s.excerpt}</p>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ink group-hover:underline">
                Read The Story →
              </p>
            </Link>
          ))}
        </div>

        {/* Tell Your Story CTA */}
        <div className="mt-16 border border-ink/10 p-8 bg-ink/[0.02]">
          <p className="eyebrow">Tell Your Story</p>
          <h3 className="mt-2 font-sans text-2xl font-black tracking-tight">Have a story we should run?</h3>
          <p className="mt-3 text-ink/80 max-w-2xl">
            Submit your work, your brand, your movement. We run what fits the culture.
          </p>
          <Link to="/tell-your-story" className="mt-5 inline-block btn-primary">Tell Your Story →</Link>
        </div>
      </div>
    </>
  );
}
