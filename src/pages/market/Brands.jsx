import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import SEO from '../../components/SEO.jsx';
import MarketTabs from '../../components/market/MarketTabs.jsx';
import MarketIndex from '../../components/market/MarketIndex.jsx';
import TickerTape from '../../components/market/TickerTape.jsx';
import BrandStockCard from '../../components/market/BrandStockCard.jsx';
import { subscribeBrands } from '../../lib/brands.js';

export default function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const unsub = subscribeBrands(setBrands);
    return () => unsub();
  }, []);

  // Map brands to a song-like shape so the existing TickerTape works
  const tickerItems = useMemo(() => brands.map((b) => ({
    id: b.id,
    ticker: b.ticker,
    totalStreams: (b.followersIG || 0) + (b.followersTT || 0),
    change7d: b.growthPct,
  })), [brands]);

  const ranked = useMemo(() => [...brands].sort((a, b) =>
    ((b.followersIG || 0) + (b.followersTT || 0)) - ((a.followersIG || 0) + (a.followersTT || 0))
  ), [brands]);

  const topGainers = useMemo(() => [...brands]
    .sort((a, b) => (b.growthPct || 0) - (a.growthPct || 0))
    .slice(0, 5), [brands]);

  const featured = useMemo(() => brands.filter((b) => b.featured), [brands]);

  return (
    <>
      <SEO title="Brand Market | Culture Stock Exchange" description="Clothing brands charted like stocks. Followers, growth, drops, and movement." />
      <TickerTape songs={tickerItems} />
      <MarketTabs />
      <div className="container-edge py-8 lg:py-12">
        <PageHeader
          eyebrow="Direct2Culture / Brands"
          title="Brand Stock Exchange."
          kicker="Clothing brands, charted like stocks. Followers. Drops. Growth. The wave before it hits."
        />

        <div className="mt-10">
          <MarketIndex
            title="D2C Brand Index"
            subtitle="aggregate followers across all listed brands"
            collectionName="brandHistory"
            valueField="followers"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
          <Section className="lg:col-span-2" title="Top Brands" subtitle={`${ranked.length} listed`}>
            {ranked.length === 0 ? <Empty /> : ranked.map((b, i) => <BrandStockCard key={b.id} brand={b} rank={i + 1} />)}
          </Section>

          <div className="space-y-10">
            <Section title="Top Gainers" subtitle="By growth %">
              {topGainers.length === 0 ? <Empty /> : topGainers.map((b, i) => <BrandStockCard key={b.id} brand={b} rank={i + 1} />)}
            </Section>
          </div>
        </div>

        {featured.length > 0 && (
          <Section className="mt-16" title="Direct2Culture Picks" subtitle="Featured by editorial">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
              {featured.map((b, i) => <BrandStockCard key={b.id} brand={b} rank={i + 1} />)}
            </div>
          </Section>
        )}
      </div>
    </>
  );
}

function Section({ title, subtitle, children, className = '' }) {
  return (
    <div className={className}>
      <div className="flex items-end justify-between border-b border-ink pb-3 mb-2">
        <h2 className="font-sans text-2xl font-black tracking-tight">{title}</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{subtitle}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Empty() {
  return <p className="text-ink/60 py-6">No brands listed yet.</p>;
}
