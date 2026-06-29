import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import SEO from '../components/SEO.jsx';
import FitnessCard from '../components/FitnessCard.jsx';
import { fitness, FITNESS_TYPES, TYPE_LABELS } from '../data/fitnessData.js';

export default function Fitness() {
  const [type, setType] = useState('');

  const filtered = useMemo(
    () => (type ? fitness.filter((f) => f.type === type) : fitness),
    [type],
  );

  return (
    <>
      <SEO
        title="Fitness | Direct2Culture"
        description="Training as culture — gear drops, scene reports, athlete profiles, and brand campaigns from the people building the next wave of fitness."
      />
      <PageHeader
        eyebrow="06 / Fitness"
        title="Training as culture."
        kicker="Gear drops, scene reports, athlete profiles, and brand campaigns — from the run clubs, gyms, and trainers building culture before the algorithm catches it."
        meta={`${fitness.length} entries`}
      />

      <section className="bg-bone">
        <div className="container-edge py-16 lg:py-20">
          <div className="flex flex-wrap gap-2">
            <Chip active={!type} onClick={() => setType('')}>All · {fitness.length}</Chip>
            {FITNESS_TYPES.map((t) => {
              const count = fitness.filter((x) => x.type === t).length;
              if (!count) return null;
              return (
                <Chip key={t} active={type === t} onClick={() => setType(t)}>
                  {TYPE_LABELS[t]} · {count}
                </Chip>
              );
            })}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <FitnessCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
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
