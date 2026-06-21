import { useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import CultureSignalCard from '../components/CultureSignalCard.jsx';
import SEO from '../components/SEO.jsx';
import { cultureSignals, categories } from '../data/content.js';

export default function CultureSignals() {
  const [filter, setFilter] = useState('All');
  const filtered = useMemo(
    () => (filter === 'All' ? cultureSignals : cultureSignals.filter((s) => s.category === filter)),
    [filter]
  );

  return (
    <>
      <SEO
        title="Culture Signals | Direct2Culture"
        description="A live feed of trends, brands, sounds, fashion, skate, and internet movements shaping culture right now."
      />
      <PageHeader
        eyebrow="01 / Culture Signals"
        title="The signals underneath the noise."
        kicker="A live feed of trends, brands, sounds, fashion, skate, and internet movements — sourced direct from the people building them."
        meta={`${cultureSignals.length} active signals`}
      />

      <section className="border-b border-ink/10 bg-bone">
        <div className="container-edge py-6 flex flex-wrap gap-2">
          {['All', ...categories].map((c) => (
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
            <p className="font-mono text-sm uppercase tracking-widest text-ash">No signals in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s, i) => (
                <CultureSignalCard key={s.id} signal={s} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
