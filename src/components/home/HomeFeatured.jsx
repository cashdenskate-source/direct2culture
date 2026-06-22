import { Link } from 'react-router-dom';
import { singleOfTheWeek, dropOfTheWeek, homeCTAs } from '../../data/homepageFeatureData.js';
import { featuredStory } from '../../data/storyData.js';
import { creators } from '../../data/creatorData.js';
import CreatorCard from '../creator/CreatorCard.jsx';
import LivePulse from '../market/LivePulse.jsx';
import ChangeBadge from '../market/ChangeBadge.jsx';
import { formatNum } from '../../lib/market.js';
import { trackCTA } from '../../lib/tracking.js';

export default function HomeFeatured() {
  const meetCreators = creators.slice(0, 6);

  return (
    <>
      {/* Single + Drop of the Week, side by side */}
      <section className="border-b border-ink/10 bg-bone">
        <div className="container-edge py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Single of the Week */}
            <Link
              to={singleOfTheWeek.href}
              onClick={() => trackCTA('home_single_of_week_click', { ticker: singleOfTheWeek.songTicker })}
              className="group border border-ink bg-ink text-bone p-8 lg:p-10 hover:opacity-95 transition-opacity"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">Single of the Week</p>
              <h2 className="mt-3 font-sans text-4xl md:text-5xl font-black tracking-tightest">
                {singleOfTheWeek.title}
              </h2>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/70">
                ${singleOfTheWeek.songTicker} · by {singleOfTheWeek.artistName}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 max-w-md">
                <StatRow label="Streams" value={<LivePulse value={singleOfTheWeek.streams} rate={500} intervalMs={2200} format={formatNum} />} />
                <StatRow label="7-Day" value={<ChangeBadge value={singleOfTheWeek.growth7d} />} />
                <StatRow label="DJ Spins" value={singleOfTheWeek.djSpins} />
                <StatRow label="Culture Score" value={singleOfTheWeek.cultureScore} />
              </div>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] group-hover:underline">
                {singleOfTheWeek.ctaLabel}
              </p>
            </Link>

            {/* Drop of the Week */}
            <Link
              to={dropOfTheWeek.href}
              onClick={() => trackCTA('home_drop_of_week_click', { brand: dropOfTheWeek.brand })}
              className="group border border-ink p-8 lg:p-10 hover:bg-ink hover:text-bone transition-colors"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">Drop of the Week</p>
              <h2 className="mt-3 font-sans text-4xl md:text-5xl font-black tracking-tightest">
                {dropOfTheWeek.drop}
              </h2>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] opacity-70">
                {dropOfTheWeek.brand} · {dropOfTheWeek.category} · {dropOfTheWeek.status}
              </p>
              <div className="mt-6">
                <StatRow label="Culture Score" value={dropOfTheWeek.cultureScore} />
              </div>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] group-hover:underline">
                {dropOfTheWeek.ctaLabel}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Story */}
      <section className="border-b border-ink/10 bg-bone">
        <div className="container-edge py-16 lg:py-20">
          <Link
            to={featuredStory.ctaLink}
            onClick={() => trackCTA('home_featured_story_click', { slug: featuredStory.slug })}
            className="group block"
          >
            <p className="eyebrow">Featured Story</p>
            <h2 className="mt-3 font-sans font-black tracking-tightest text-5xl md:text-7xl lg:text-8xl leading-[0.95] group-hover:underline">
              {featuredStory.title}.
            </h2>
            <p className="mt-6 max-w-2xl text-ink/75 text-xl md:text-2xl leading-snug">
              {featuredStory.subtitle}
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-ink">
              {featuredStory.ctaLabel} →
            </p>
          </Link>
        </div>
      </section>

      {/* Meet The Creators */}
      <section className="border-b border-ink/10 bg-bone">
        <div className="container-edge py-16 lg:py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 border-b border-ink pb-4">
            <div>
              <p className="eyebrow">Meet The Creators</p>
              <h2 className="display-lg mt-3">The next wave.</h2>
              <p className="mt-3 max-w-2xl text-ink/75 text-lg">
                The artists, founders, DJs, and designers building from the source. Read their stories.
              </p>
            </div>
            <Link to="/creators" className="btn-primary">View All Creators →</Link>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetCreators.map((c) => <CreatorCard key={c.id} creator={c} />)}
          </div>
        </div>
      </section>

      {/* RichSkater + BarelySain CTAs */}
      <section className="border-b border-ink/10 bg-bone">
        <div className="container-edge py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StoryCTA cta={homeCTAs.richskater} bg="bg-ink text-bone" />
            <StoryCTA cta={homeCTAs.barelysain} bg="bg-bone text-ink border border-ink" />
          </div>
        </div>
      </section>

      {/* Tell Your Story CTA */}
      <section className="bg-ink text-bone">
        <div className="container-edge py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow text-bone/50">Tell Your Story</p>
              <h2 className="display-lg mt-4">{homeCTAs.tellYourStory.label}.</h2>
              <p className="mt-6 max-w-2xl text-bone/70 text-xl leading-snug">
                {homeCTAs.tellYourStory.subline} If you're building something culture-shifting, send it through. We run what fits.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                to={homeCTAs.tellYourStory.href}
                onClick={() => trackCTA('home_tell_your_story_click')}
                className="bg-bone text-ink px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] hover:opacity-90"
              >
                Tell Your Story →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StoryCTA({ cta, bg }) {
  return (
    <Link
      to={cta.href}
      onClick={() => trackCTA(`home_story_cta_click`, { href: cta.href })}
      className={`group p-8 lg:p-12 ${bg} hover:opacity-95 transition-opacity`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">Story</p>
      <h3 className="mt-3 font-sans text-3xl md:text-4xl font-black tracking-tightest">
        {cta.label}.
      </h3>
      <p className="mt-3 opacity-75 text-lg">{cta.subline}</p>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] group-hover:underline">
        Read The Story →
      </p>
    </Link>
  );
}

function StatRow({ label, value }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">{label}</p>
      <p className="mt-1 font-sans text-2xl font-black tabular-nums">{value}</p>
    </div>
  );
}
