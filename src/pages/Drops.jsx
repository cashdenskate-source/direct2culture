import { useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import DropCard from '../components/DropCard.jsx';
import SEO from '../components/SEO.jsx';
import { drops as seedDrops } from '../data/content.js';
import { effectiveDropStatus } from '../hooks/useCountdown.js';
import usePublishedContent from '../hooks/usePublishedContent.js';

const filters = ['All', 'Upcoming', 'Live', 'Sold Out'];

export default function Drops() {
  const [filter, setFilter] = useState('All');
  const { items } = usePublishedContent('drops', seedDrops);
  const drops = useMemo(
    () =>
      items.map((d) => {
        const base = { ...d, status: (d.dropStatus || d.status || 'upcoming').toLowerCase() };
        return { ...base, status: effectiveDropStatus(base) };
      }),
    [items]
  );
  const filtered = useMemo(() => {
    if (filter === 'All') return drops;
    return drops.filter((d) => d.status === filter.toLowerCase());
  }, [filter, drops]);

  return (
    <>
      <SEO
        title="Drops | Direct2Culture"
        description="Curated drop calendar for fashion, music, merch, digital products, and culture-first events."
      />
      <PageHeader
        eyebrow="03 / Drops"
        title="The drop calendar."
        kicker="Fashion, music, merch, digital, and events — curated by the editors, direct from the source."
        meta={`${drops.length} drops on deck`}
      />

      <section className="sticky top-[60px] z-30 border-b border-ink/10 bg-bone/95 backdrop-blur">
        <div className="container-edge py-4 flex flex-wrap gap-2 md:py-6">
          {filters.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] border transition-all ${
                filter === c
                  ? 'bg-ink text-bone border-ink'
                  : 'border-ink/20 text-ink hover:border-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-bone">
        <div className="container-edge py-16 lg:py-20">
          {filtered.length === 0 ? (
            <p className="font-mono text-sm uppercase tracking-widest text-ash">Nothing in this category right now.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => (
                <DropCard key={d.id} drop={d} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
