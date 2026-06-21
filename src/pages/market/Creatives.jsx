import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import MarketTabs from '../../components/market/MarketTabs.jsx';
import CreativeCard from '../../components/market/CreativeCard.jsx';
import { subscribeCreatives, CATEGORIES } from '../../lib/creatives.js';

export default function Creatives() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') || '';
  const [creatives, setCreatives] = useState([]);

  useEffect(() => {
    const unsub = subscribeCreatives(cat || null, setCreatives);
    return () => unsub();
  }, [cat]);

  const ranked = useMemo(() => [...creatives].sort((a, b) => (b.cultureScore || 0) - (a.cultureScore || 0)), [creatives]);
  const topGrowing = useMemo(() => [...creatives].sort((a, b) => (b.growthScore || 0) - (a.growthScore || 0)).slice(0, 5), [creatives]);

  return (
    <>
      <SEO title="Creative Market | Culture Stock Exchange" description="Models, directors, video editors, photographers — charted like assets. Track culture creators by influence and growth." />
      <MarketTabs />
      <div className="container-edge py-8 lg:py-12">
        <PageHeader
          eyebrow="Direct2Culture / Creatives"
          title="Creative Market."
          kicker="Models, directors, editors, photographers — the people building the visuals of culture, ranked by culture score and growth."
        />

        <div className="mt-8 flex flex-wrap gap-2">
          <CatBtn active={!cat} onClick={() => setParams({})}>All</CatBtn>
          {CATEGORIES.map((c) => (
            <CatBtn key={c} active={cat === c} onClick={() => setParams({ cat: c })}>
              {c}s
            </CatBtn>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
          <section className="lg:col-span-2">
            <div className="flex items-end justify-between border-b border-ink pb-3 mb-2">
              <h2 className="font-sans text-2xl font-black tracking-tight">{cat ? `Top ${cat}s` : 'All creatives'}</h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{ranked.length} listed</p>
            </div>
            {ranked.length === 0 ? (
              <p className="py-6 text-ink/60">No creatives listed yet.</p>
            ) : (
              ranked.map((c, i) => <CreativeCard key={c.id} creative={c} rank={i + 1} />)
            )}
          </section>

          <aside>
            <div className="flex items-end justify-between border-b border-ink pb-3 mb-2">
              <h3 className="font-sans text-lg font-black tracking-tight">Top Gainers</h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">growth</p>
            </div>
            {topGrowing.length === 0 ? (
              <p className="py-6 text-ink/60 text-sm">No data yet.</p>
            ) : (
              topGrowing.map((c, i) => <CreativeCard key={c.id} creative={c} rank={i + 1} />)
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

function CatBtn({ active, children, onClick }) {
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
