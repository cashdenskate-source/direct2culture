import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import { foodPicks, foodOfTheDay } from '../data/foodData.js';

export default function Food() {
  return (
    <>
      <SEO
        title="Food of the Day | Direct2Culture"
        description="What creators are eating, where they're eating, and the culture around food."
      />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow="Direct2Culture / Food"
          title="Food of the Day."
          kicker="Creators tell us what they're eating, where, and why. Fuel before the build."
        />

        {/* Today's pick */}
        <div className="mt-12 border border-ink bg-ink text-bone p-8 lg:p-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">Today</p>
          <h2 className="mt-3 font-sans text-4xl md:text-6xl font-black tracking-tightest">{foodOfTheDay.food}</h2>
          <p className="mt-3 text-bone/75 text-xl">
            {foodOfTheDay.creator} · {foodOfTheDay.restaurant} · {foodOfTheDay.city}
          </p>
          <p className="mt-5 max-w-2xl text-bone/80 text-lg leading-relaxed">{foodOfTheDay.story}</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] border border-bone/40 px-2 py-1">
              Rating · {foodOfTheDay.rating}
            </span>
            {foodOfTheDay.creatorSlug && (
              <Link to={`/creator/${foodOfTheDay.creatorSlug}`} className="font-mono text-[10px] uppercase tracking-[0.25em] hover:underline">
                See Creator Pick →
              </Link>
            )}
          </div>
        </div>

        {/* Past picks */}
        <h3 className="mt-16 font-sans text-2xl font-black tracking-tight border-b border-ink pb-3">Recent picks</h3>
        <ul className="divide-y divide-ink/10">
          {foodPicks.slice(1).map((p) => (
            <li key={p.id} className="py-5 grid grid-cols-12 gap-4 items-center">
              <div className="col-span-12 sm:col-span-1">
                <div className="h-14 w-14 bg-ink/5 border border-ink/10 flex items-center justify-center font-mono text-[9px] uppercase tracking-[0.2em] text-ash">
                  {(p.food || '?').slice(0, 2)}
                </div>
              </div>
              <p className="col-span-12 sm:col-span-4 font-sans font-bold tracking-tight">{p.food}</p>
              <p className="col-span-12 sm:col-span-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                {p.creator} · {p.restaurant} · {p.city}
              </p>
              <p className="col-span-9 sm:col-span-2 text-ink/75 text-sm">{p.story}</p>
              <p className="col-span-3 sm:col-span-1 sm:text-right font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                {p.rating}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-16 border border-ink/10 p-8 bg-ink/[0.02]">
          <p className="eyebrow">Submit Your Pick</p>
          <h3 className="mt-2 font-sans text-2xl font-black tracking-tight">Want yours featured?</h3>
          <p className="mt-3 text-ink/80 max-w-2xl">Send us what you're eating + where. We feature the picks that tell a story.</p>
          <Link to="/tell-your-story?ref=food" className="mt-5 inline-block btn-primary">Submit Food Pick →</Link>
        </div>
      </div>
    </>
  );
}
