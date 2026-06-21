import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import MarketTabs from '../../components/market/MarketTabs.jsx';
import WatchButton from '../../components/market/WatchButton.jsx';
import LiveNumber from '../../components/market/LiveNumber.jsx';
import ChangeBadge from '../../components/market/ChangeBadge.jsx';
import { getCreativeByTicker } from '../../lib/creatives.js';

export default function CreativeDetail() {
  const { ticker } = useParams();
  const [c, setC] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const r = await getCreativeByTicker(ticker);
      if (!cancelled) { setC(r); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [ticker]);

  if (loading) return <div className="container-edge py-24"><p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">Loading…</p></div>;
  if (!c) return (
    <div className="container-edge py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">Creative not found</p>
      <Link to="/market/creatives" className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">← Back</Link>
    </div>
  );

  return (
    <>
      <SEO title={`$${c.ticker} · ${c.name} | Creative Market`} description={`${c.name} — ${c.category}, ${c.city || ''}`} />
      <MarketTabs />
      <div className="container-edge py-8 lg:py-12">
        <PageHeader
          eyebrow={`Creative / $${c.ticker}`}
          title={`${c.name}${c.verified ? ' ✓' : ''}.`}
          kicker={
            <>
              {c.category}{c.city ? ` · based in ${c.city}` : ''}
            </>
          }
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <WatchButton kind="creative" id={c.id} ticker={c.ticker} title={c.name} subtitle={c.category} imageURL={c.photoURL} href={`/market/creative/${c.ticker}`} />
          {c.instagramURL && <a href={c.instagramURL} target="_blank" rel="noopener noreferrer" className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-ink hover:text-bone">Instagram →</a>}
          {c.portfolioURL && <a href={c.portfolioURL} target="_blank" rel="noopener noreferrer" className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-ink hover:text-bone">Portfolio →</a>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
          <Stat label="Followers" value={<LiveNumber value={c.followers || 0} />} />
          <Stat label="Projects" value={<LiveNumber value={c.projects || 0} />} />
          <Stat label="Total Views" value={<LiveNumber value={c.totalViews || 0} />} />
          <Stat label="Growth" badge={<ChangeBadge value={c.growthScore} />} />
        </div>

        {c.bio && (
          <div className="mt-10 border border-ink/10 p-6">
            <p className="eyebrow">About</p>
            <p className="mt-3 text-ink/85 leading-relaxed max-w-3xl">{c.bio}</p>
          </div>
        )}

        <div className="mt-8"><Link to="/market/creatives" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">← Back to Creatives</Link></div>
      </div>
    </>
  );
}

function Stat({ label, value, badge }) {
  return (
    <div className="border border-ink/10 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{label}</p>
      <p className="mt-2 font-sans text-3xl font-black tracking-tight tabular-nums">{value || badge}</p>
    </div>
  );
}
