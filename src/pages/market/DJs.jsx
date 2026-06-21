import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import MarketTabs from '../../components/market/MarketTabs.jsx';
import DJCard from '../../components/market/DJCard.jsx';
import { subscribeDJs } from '../../lib/djs.js';
import { subscribeRecentSpins } from '../../lib/spins.js';

export default function DJs() {
  const [djs, setDjs] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const u1 = subscribeDJs(setDjs);
    const u2 = subscribeRecentSpins(setRecent, 10);
    return () => { u1(); u2(); };
  }, []);

  const ranked = useMemo(() => [...djs].sort((a, b) => (b.influenceScore || 0) - (a.influenceScore || 0)), [djs]);

  return (
    <>
      <SEO title="DJ Market | Culture Stock Exchange" description="DJs charted like assets. Spins logged in real time. Influence scored." />
      <MarketTabs />
      <div className="container-edge py-8 lg:py-12">
        <PageHeader
          eyebrow="Direct2Culture / DJ Market"
          title="The DJ Stock Exchange."
          kicker="DJs are the gatekeepers of culture. Track their spins, venues, and influence. Underground first."
        />

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link to="/market/dj-usb" className="border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-bone transition-colors">
            What is the D2C DJ USB →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
          <section className="lg:col-span-2">
            <div className="flex items-end justify-between border-b border-ink pb-3 mb-2">
              <h2 className="font-sans text-2xl font-black tracking-tight">Top DJs by influence</h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{ranked.length} listed</p>
            </div>
            {ranked.length === 0 ? (
              <p className="py-6 text-ink/60">No DJs listed yet.</p>
            ) : (
              ranked.map((d, i) => <DJCard key={d.id} dj={d} rank={i + 1} />)
            )}
          </section>

          <aside>
            <div className="flex items-end justify-between border-b border-ink pb-3 mb-3">
              <h3 className="font-sans text-lg font-black tracking-tight">Recent Spins</h3>
            </div>
            {recent.length === 0 ? (
              <p className="py-6 text-ink/60 text-sm">No spins logged yet.</p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {recent.map((s) => (
                  <li key={s.id} className="py-3 text-sm">
                    <p className="font-sans font-bold tracking-tight truncate">
                      ${s.songTicker || '—'} <span className="text-ash font-normal">· {s.songTitle}</span>
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash truncate">
                      @{s.djHandle} · {s.venue || s.city || ''}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
