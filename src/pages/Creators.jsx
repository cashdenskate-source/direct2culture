import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import CreatorCard from '../components/creator/CreatorCard.jsx';
import { creators, CREATOR_CATEGORIES } from '../data/creatorData.js';

export default function Creators() {
  const [cat, setCat] = useState('');

  const filtered = useMemo(
    () => (cat ? creators.filter((c) => c.category === cat) : creators),
    [cat],
  );

  return (
    <>
      <SEO
        title="Meet The Creators | Direct2Culture"
        description="Artists, producers, DJs, designers, founders, directors, skaters, creative directors — the people building culture before the algorithm catches it."
      />
      <div className="container-edge py-12 lg:py-16">
        <PageHeader
          eyebrow="Direct2Culture / Creators"
          title="Meet the creators."
          kicker="The people building the next wave — in their own words. Read the stories before everyone else notices."
        />

        <div className="mt-8 flex flex-wrap gap-2">
          <Chip active={!cat} onClick={() => setCat('')}>All · {creators.length}</Chip>
          {CREATOR_CATEGORIES.map((c) => {
            const count = creators.filter((x) => x.category === c).length;
            if (!count) return null;
            return (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
                {c} · {count}
              </Chip>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((c) => (
            <CreatorCard key={c.id} creator={c} />
          ))}
        </div>

        <div className="mt-16 border border-ink/10 p-8 bg-ink/[0.02]">
          <p className="eyebrow">Tell Your Story</p>
          <h3 className="mt-2 font-sans text-2xl font-black tracking-tight">Want to be next?</h3>
          <p className="mt-3 text-ink/80 max-w-2xl">
            If you're building something culture-shifting — submit your story. We feature what fits the brief.
          </p>
          <Link to="/tell-your-story" className="mt-5 inline-block btn-primary">Tell Your Story →</Link>
        </div>
      </div>
    </>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
        active ? 'border-ink bg-ink text-bone' : 'border-ink/30 text-ink hover:border-ink'
      }`}
    >
      {children}
    </button>
  );
}
